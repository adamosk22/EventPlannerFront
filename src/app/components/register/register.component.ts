import { Component, OnInit } from '@angular/core';
import {User} from 'C:/Users/aadam/Documents/Praca inżynierska/EventPlannerFrontend/src/app/user';
import { AppService } from 'C:/Users/aadam/Documents/Praca inżynierska/EventPlannerFrontend/src/app/app.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Roles: any = ['ORGANIZER', 'CLIENT'];
  constructor(private appService:AppService) { }
  ngOnInit() {
  }
  
  user = new User();

  addPerson() {
    this.appService.addPerson(this.user)
      .subscribe(data => {
        console.log(data);
      })
  }
}
