import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDayViewBeforeRenderEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { 
  EventColor,
  getEventsInPeriod,
  ViewPeriod
} from 'calendar-utils';
import { RRule } from 'rrule';
import moment from 'moment-timezone';
import e from 'cors';
import { runInThisContext } from 'vm';
import { eventNames, title } from 'process';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

interface RecurringEvent {
  title: string;
  color: any;
  rrule?: {
    freq: any;
    bymonth?: number;
    bymonthday?: number;
    byweekday?: any;
  };
  start: Date;
  end?: Date;
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styles: [`
  h3 {
    margin: 0 0 10px;
  }

  pre {
    background-color: #f5f5f5;
    padding: 15px;
  }`
  ]
})
export class CalendarComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  toCopy: Boolean = true;

  modalData: {
    action: string;
    event: CalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.activities = this.activities.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  activities: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['blue'] },
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true
    }
  ];

  recurringEvents: RecurringEvent[] = [
    {
      title: 'Recurs weekly on mondays',
      color: colors['red'],
      rrule: {
        freq: RRule.WEEKLY,
        byweekday: [RRule.MO],
      },
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2)
    },
  ];

  calendarEvents: CalendarEvent[] = [];

  viewPeriod: ViewPeriod | undefined;

  activeDayIsOpen: boolean = true;

  startDate: Date = new Date();

  endDate: Date = new Date();

  constructor(private modal: NgbModal, private cdr: ChangeDetectorRef) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.activities = this.activities.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
      this.modalData = { event, action };
      this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.activities = [
      ...this.activities,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.activities = this.activities.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  updateCalendarEvents(
    viewRender:
      | CalendarMonthViewBeforeRenderEvent
      | CalendarWeekViewBeforeRenderEvent
      | CalendarDayViewBeforeRenderEvent
  ): void {
    if (
      !this.viewPeriod ||
      !moment(this.viewPeriod.start).isSame(viewRender.period.start) ||
      !moment(this.viewPeriod.end).isSame(viewRender.period.end)
    ) {
      this.viewPeriod = viewRender.period;
      this.activities = this.activities.filter(e => e.color!=colors['red'])


      this.recurringEvents.forEach((event) => {
          this.startDate = moment(viewRender.period.start).startOf('day').toDate();
          this.startDate.setHours(event.start.getHours())
          this.endDate = moment(viewRender.period.end).endOf('day').toDate();
          this.endDate.setHours(event.end?.getHours() || 0)
          
          const rule: RRule = new RRule({
            ...event.rrule,
            dtstart: this.startDate,
            until: this.endDate,
          });
          const { title, color } = event;

          rule.all().forEach((date) => {
            const duplicatedEvents = this.activities.filter(e => e.start == date);
            if(duplicatedEvents.length<1){
              this.activities.push({
                title,
                color,
                start: moment(date).toDate(),
                end: moment(date).toDate()
              });
            }
          });
      });
      this.cdr.detectChanges();
      

    }
  }
}