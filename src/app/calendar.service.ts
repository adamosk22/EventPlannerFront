import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from './activity';
import { Event } from './event';

@Injectable({providedIn:'root'})
export class CalendarService {
    baseURL: string = "http://localhost:8081/";

    constructor(private http: HttpClient) {
    }

    addActivity(activity:Activity): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(activity);
        console.log(body)
        return this.http.post(this.baseURL + 'activities', body, {'headers':headers})
    }

    getActivities(userEmail?: String | null): Observable<Activity[]>{
        const headers = { 'content-type': 'application/json'}  
        return this.http.get<Activity[]>(this.baseURL + 'activities/' + userEmail)
    }

    deleteActivity(serverId?: number | null): Observable<any>{
        return this.http.delete(this.baseURL + 'activities/' + serverId)
    }

    modifyActivity(activity:Activity): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(activity);
        console.log(body)
        return this.http.patch(this.baseURL + 'activities', body, {'headers':headers})
    }

    addEvent(event:Event): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(event);
        console.log(body)
        return this.http.post(this.baseURL + 'events', body, {'headers':headers})
    }

    getEvents(userEmail?: String | null): Observable<Event[]>{
        const headers = { 'content-type': 'application/json'}  
        return this.http.get<Event[]>(this.baseURL + 'events/' + userEmail)
    }

    modifyEvent(event:Event): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(event);
        console.log(body)
        return this.http.patch(this.baseURL + 'events', body, {'headers':headers})
    }

    deleteEvent(serverId?: number | null): Observable<any>{
        return this.http.delete(this.baseURL + 'events/' + serverId)
    }
}