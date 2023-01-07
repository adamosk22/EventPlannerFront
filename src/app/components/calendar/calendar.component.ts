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
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { Observable, Subject } from 'rxjs';
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
  ViewPeriod
} from 'calendar-utils';
import { RRule, Weekday } from 'rrule';
import moment from 'moment-timezone';
import { Activity } from 'src/app/activity';
import { CalendarService } from 'src/app/calendar.service';
import { formatDate } from '@angular/common';

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
  serverId?: number;
}

interface MyCalendarEvent extends CalendarEvent{
  recurring?: boolean; 
  serverId?: number;
  isEvent?: boolean;
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

  activity: Activity = new Activity();

  modalData: {
    action: string;
    event: MyCalendarEvent;
  } | undefined;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: MyCalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: MyCalendarEvent }): void => {
        this.activities = this.activities.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  activities: MyCalendarEvent[] = [];

  recurringEvents: RecurringEvent[] = [];

  calendarEvents: MyCalendarEvent[] = [];

  viewPeriod: ViewPeriod | undefined;

  activeDayIsOpen: boolean = true;

  startDate: Date = new Date();

  endDate: Date = new Date();

  startDateTime: Date = new Date();

  endDateTime: Date = new Date();

  dayAfterEnd: Date = new Date();

  activityList: Activity[] = [];

  viewActivities: MyCalendarEvent[] = [];

  constructor(private modal: NgbModal, private cdr: ChangeDetectorRef, private calendarService: CalendarService) {}

  dayClicked({ date, events }: { date: Date; events: MyCalendarEvent[] }): void {
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

  handleEvent(action: string, event: MyCalendarEvent): void {
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
        color: colors['blue'],
        draggable: false,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      },
    ];
    this.viewActivities = this.activities.filter((event) => (event.start >= (this.viewPeriod?.start || this.startDate)) )
  }

  deleteEvent(eventToDelete: MyCalendarEvent) {
    this.calendarService.deleteActivity(eventToDelete.serverId)
    .subscribe(data => {
      console.log(data);
    })
    if(eventToDelete.recurring){
      this.recurringEvents = this.recurringEvents.filter((event) => event.serverId !== eventToDelete.serverId);
    }
    this.activities = this.activities.filter((event) => event.serverId !== eventToDelete.serverId);
    this.viewActivities = this.activities.filter((event) => event.serverId !== eventToDelete.serverId);
    this.cdr.detectChanges();
    this.refresh.next();
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
          this.endDate = moment(viewRender.period.end).endOf('day').toDate();
          this.dayAfterEnd.setDate(this.endDate.getDate() + 1)
          
          const rule: RRule = new RRule({
            ...event.rrule,
            dtstart: this.startDate,
            until: this.endDate,
          });
          const { title, color, serverId } = event;

          rule.all().forEach((date) => {
            const duplicatedEvents = this.activities.filter(e => e.start == date);
            if(duplicatedEvents.length<1){
              this.activities.push({
                title,
                color,
                start: moment(date).toDate(),
                end: moment(date).toDate(),
                recurring: true,
                serverId
              });
            }
          });
          this.activities.forEach((activity) => {
            if(activity.serverId == serverId){
              activity.start?.setHours(event.start?.getHours())
              activity.start.setMinutes(event.start.getMinutes())
              activity.end?.setHours(event.end?.getHours() || 0);
              activity.end?.setMinutes(event.end?.getMinutes() || 0);
            }})
      });
      this.viewActivities = this.activities.filter((event) => event.start >= this.startDate && event.end && event.end <= this.endDate)
      if(this.viewActivities.length==0){
        if(this.activities.length == 0)
          this.addEvent();
        this.viewActivities = this.activities;
      }
      this.cdr.detectChanges();
    }
  }

  saveEvent(eventToSave: MyCalendarEvent) {
    if(eventToSave.end && eventToSave.start < eventToSave.end){
      this.activity.userEmail = sessionStorage.getItem("email");
      this.activity.name = eventToSave.title;
      this.activity.recurring = eventToSave.recurring;
      this.activity.isEvent = eventToSave.isEvent;
      this.activity.startDateTime = formatDate(eventToSave.start,"yyyy-MM-dd HH:mm","en-US");
      this.activity.endDateTime = formatDate(eventToSave.end?eventToSave.end:eventToSave.start,"yyyy-MM-dd HH:mm","en-US");
      this.activity.id = eventToSave.serverId;
      if(!this.activity.id){
        this.calendarService.addActivity(this.activity)
        .subscribe(data => {
          console.log(data);
        })
      }
      else{
        this.calendarService.modifyActivity(this.activity)
        .subscribe(data => {
          console.log(data);
        })
      }
    } 
      window.location.reload();
  }

  isDataAvailable:boolean = false;

  ngOnInit(){
    const result: Observable<Activity[]> = this.calendarService.getActivities(sessionStorage.getItem("email"));
    result.subscribe(
      val => {
        console.log(val);
        val.forEach(
          (a) => {
            const title = a.name || "default";
            const recurring = a.recurring;
            const start = new Date(this.format(a.startDateTime || '0000-00-00T00:00'));
            const end = new Date(this.format(a.endDateTime || '0000-00-00 00:00'));
            const color = colors['red'];
            const colorEvent = colors['yellow']
            const serverId = a.id;
            if(!a.recurring){
              if(a.isEvent){
                this.activities.push({
                  title, recurring, start, end, serverId, color: colorEvent
                })
              }else{
                this.activities.push({
                  title, recurring, start, end, serverId
                });
              }
            }
            else if(a.recurring){
              this.recurringEvents.push({
                title,
                color,
                rrule: {
                  freq: RRule.WEEKLY,
                  byweekday: [this.getWeekDay(start)],
                },
                start,
                end,
                serverId
              })
            }
          }
      )
      this.isDataAvailable = true;
      this.refresh.next();
      this.cdr.detectChanges();
      this.refresh.next();
      }
    )
  }

  format(dateTimeStr: String): Date{
    const [dateStr, timeStr] = dateTimeStr.split('T')
    const [year, month, day] = dateStr.split('-')
    const [hour, minute] = timeStr.split(':')
    return new Date(+year, +month - 1, +day, +hour, +minute)
  }

  getWeekDay(date: Date): Weekday{
    let day = date.getDay()
    switch(day){
      case 1:
        return RRule.SU
      case 2:
        return RRule.MO
      case 3:
        return RRule.TU
      case 4:
        return RRule.WE
      case 5:
        return RRule.TH
      case 6:
        return RRule.FR
      case 7:
        return RRule.SA
      default:
        return RRule.MO 
    }
  }



  

  
}