import { Component, OnInit } from '@angular/core';
import {User} from 'C:/Users/aadam/Documents/Praca inżynierska/EventPlannerFrontend/src/app/user';
import { AppService } from 'C:/Users/aadam/Documents/Praca inżynierska/EventPlannerFrontend/src/app/app.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(private appService:AppService, private router:Router) { }

  ngOnInit(): void {
  }

  user = new User();

  login(email: string, password: string) {
    this.appService.authenticate(email, password)
      .subscribe(data => {
        console.log(data);
      })
      if(this.appService.isUserLoggedIn()){
        this.router.navigate(['calendar']);  
      }    
  }

}
