import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarService } from 'src/app/calendar.service';
import { Event } from 'src/app/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  isDataAvailable: boolean = false;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    const result: Observable<Event[]> = this.calendarService.getEvents(sessionStorage.getItem("email"));
    result.subscribe(
      val => {
        console.log(val);
        this.events = val;
        this.isDataAvailable = true;
      }
    )
  }

  format(dateTimeStr: String): Date{
    const [dateStr, timeStr] = dateTimeStr.split('T')
    const [year, month, day] = dateStr.split('-')
    const [hour, minute] = timeStr.split(':')
    return new Date(+year, +month - 1, +day, +hour, +minute)
  }

}
