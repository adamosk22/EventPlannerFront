import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/activity';
import { CalendarService } from 'src/app/calendar.service';
import { Event } from 'src/app/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  role = sessionStorage.getItem("role");

  editAvailable = false;

  formGroup: FormGroup;

  constructor(private calendarService: CalendarService, public fb: FormBuilder) {
    this.formGroup = this.fb.group({
      startDateTime: new FormControl(''),
      endDateTime: new FormControl('')
    })
  }

  ngOnInit(): void {
    const result: Observable<Event[]> = this.calendarService.getEvents(sessionStorage.getItem("email"));
    result.subscribe(
      val => {
        console.log(val);
        this.events = val;
      }
    )
  }

  addToCalendar(event: Event){
    let activity: Activity = new Activity();
    activity.startDateTime =  event.startDateTime?.replace("T"," ");
    activity.endDateTime = event.endDateTime?.replace("T", " ");
    activity.name = event.name;
    activity.recurring = false;
    activity.isEvent = true;
    activity.userEmail = sessionStorage.getItem("email");
    this.calendarService.addActivity(activity)
      .subscribe(data => {
        console.log(data);
      })
  }

  modifyEvent(event: Event){
    let modifiedEvent = new Event(this.formGroup.value);
    if(modifiedEvent.startDateTime)
      event.startDateTime = modifiedEvent.startDateTime.replace("T"," ");
    if(modifiedEvent.endDateTime)
      event.endDateTime = modifiedEvent.endDateTime.replace("T"," ");
    this.calendarService.modifyEvent(event)
      .subscribe(data => {
        console.log(data);
      })
  }

  deleteEvent(event: Event){
    this.calendarService.deleteEvent(event.id)
    .subscribe(data => {
      console.log(data);
    })
  }

  unlockTools(event: Event): boolean{
    return (this.role == 'ADMIN' || (this.role=='ORGANIZER' && event.userEmail == sessionStorage.getItem("email")))
  }

}
