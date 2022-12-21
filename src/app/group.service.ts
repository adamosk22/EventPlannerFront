import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "./category";
import { Group } from "./group";
import { User } from "./user";
import { Event } from "./event";

@Injectable({providedIn:'root'})
export class GroupService {
    baseURL: string = "http://localhost:8081/";

    constructor(private http: HttpClient) {
    }

    getCategories(): Observable<Category[]>{
        return this.http.get<Category[]>(this.baseURL + 'categories')
    }

    addCategoryToEvent(category:Category): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(category);
        console.log(body)
        return this.http.patch(this.baseURL + 'categories/event', body, {'headers':headers})
    }

    addCategoryToGroup(category:Category): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(category);
        console.log(body)
        return this.http.patch(this.baseURL + 'categories/group', body, {'headers':headers})
    }

    addGroup(group:Group): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(group);
        console.log(body)
        return this.http.post(this.baseURL + 'groups', body, {'headers':headers})
    }

    getGroups(userEmail?: string | null): Observable<Group[]>{  
        return this.http.get<Group[]>(this.baseURL + 'groups/' + userEmail)
    }

    joinGroup(group:Group): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(group);
        console.log(body)
        return this.http.patch(this.baseURL + 'groups/join', body, {'headers':headers})
    }

    getGroupMembers(groupName?: string | null): Observable<User[]>{
        return this.http.get<User[]>(this.baseURL + 'users/group/' + groupName)
    }

    getGroupEvents(code?: String | null): Observable<Event[]>{
        return this.http.get<Event[]>(this.baseURL + 'events/group/' + code)
    }

    getGroupCategories(groupName?: string | null): Observable<Category[]>{
        return this.http.get<Event[]>(this.baseURL + 'categories/group/' + groupName)
    }


}

