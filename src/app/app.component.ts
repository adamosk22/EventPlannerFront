import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EventPlannerFrontend';

  constructor(private appService:AppService) { }

  logOut() {
    this.appService.logOut();
  }
}
