import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { Router } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { AddEventsComponent } from './components/add-events/add-events.component';
import { GroupsComponent } from './components/groups/groups.component';
import { GroupsViewComponent } from './components/groups-view/groups-view.component';

const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'login' },
{ path: 'login', component: LogInComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'calendar', component: CalendarComponent },
{ path: 'events', component: EventsComponent },
{ path: 'addevent', component: AddEventsComponent },
{ path: 'addgroups', component: GroupsComponent},
{ path: 'groups', component: GroupsViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor(private router: Router){ }

  ngOnInit() { }

  redirect(){
    this.router.navigate(['/role']);
  }
}
