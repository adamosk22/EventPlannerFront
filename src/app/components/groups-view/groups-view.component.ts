import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CalendarService } from 'src/app/calendar.service';
import { Group } from 'src/app/group';
import { GroupService } from 'src/app/group.service';
import { User } from 'src/app/user';
import { Event } from 'src/app/event';
import { Activity } from 'src/app/activity';
import { Category } from 'src/app/category';

@Component({
  selector: 'app-groups-view',
  templateUrl: './groups-view.component.html',
  styleUrls: ['./groups-view.component.css']
})
export class GroupsViewComponent implements OnInit {

  constructor(private groupService: GroupService, private calendarService: CalendarService, public fb: FormBuilder) { 
    this.formGroup = this.fb.group({
      startDateTime: new FormControl(''),
      endDateTime: new FormControl('')
    })
  }

  groups: Group[] = [];
  users: User[] = [];
  categories: Category[] = [];
  groupNames: string[] = [];
  isDataAvailable = false;
  selectedGroup: Group = new Group();
  creator: User = new User();
  groupControl = new FormControl<Group | null>(null, Validators.required);
  events: Event[] = [];
  role = sessionStorage.getItem("role");
  editAvailable = false;
  formGroup: FormGroup;
  groupChosen: boolean = false;

  ngOnInit(): void {
    const result: Observable<Group[]> = this.groupService.getGroups(sessionStorage.getItem("email"));
    result.subscribe(
      val => {
        console.log(val);
        this.groups = val;
        this.isDataAvailable = true;
      }
    )
    
  }

  getInfo(): void{
    this.getGroupMembers();
    this.getGroupEvents();
    this.getGroupCategories();
    this.groupChosen = true;
  }

  getGroupMembers(): void{
    const result: Observable<User[]> = this.groupService.getGroupMembers(this.selectedGroup.name);
    result.subscribe(
      val => {
        console.log(val);
        this.users = val;
        this.users.forEach((u) => {
          if(u.email == this.selectedGroup.userEmail){
            this.creator = u;
          }
        })
      }
    )
  }

  getGroupCategories(): void{
    const result: Observable<Category[]> = this.groupService.getGroupCategories(this.selectedGroup.name);
    result.subscribe(
      val => {
        console.log(val);
        this.categories = val;
      }
    )
  }

  getGroupEvents(): void{
    const result: Observable<Event[]> = this.groupService.getGroupEvents(this.selectedGroup.code);
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
