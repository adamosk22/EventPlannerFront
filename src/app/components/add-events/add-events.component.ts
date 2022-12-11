import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarService } from 'src/app/calendar.service';
import { Event } from 'src/app/event';

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.css']
})
export class AddEventsComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  formGroup: FormGroup;

  constructor(private calendarService: CalendarService, public fb: FormBuilder) { 
    this.formGroup = this.fb.group({
      name: new FormControl(''),
      startDateTime: new FormControl(''),
      endDateTime: new FormControl(''),
      description: new FormControl(''),
      location: new FormControl('')
    })
  }

  ngOnInit(): void {
  }

  event = new Event();

  submitted = false;

  title = 'Add new event'

  onSubmit() { this.submitted = true; }

  addEvent() {
    this.event = new Event(this.formGroup.value);
    this.event.userEmail = sessionStorage.getItem("email")
    this.calendarService.addEvent(this.event)
      .subscribe(data => {
        console.log(data);
      })
  }

}
