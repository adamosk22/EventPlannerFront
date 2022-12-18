import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Activity } from "./activity";
import { Category } from "./category";
import { Group } from "./group";

@Injectable({providedIn:'root'})
export class GroupService {
    baseURL: string = "http://localhost:8081/";

    constructor(private http: HttpClient) {
    }

    getActivities(): Observable<Category[]>{
        const headers = { 'content-type': 'application/json'}  
        return this.http.get<Category[]>(this.baseURL + 'categories')
    }

    addCategoryToEvent(category:Category): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(category);
        console.log(body)
        return this.http.patch(this.baseURL + 'categories', body, {'headers':headers})
    }

    addGroup(group:Group): Observable<any>{
        const headers = { 'content-type': 'application/json'}  
        const body=JSON.stringify(group);
        console.log(body)
        return this.http.post(this.baseURL + 'groups', body, {'headers':headers})
    }
}

