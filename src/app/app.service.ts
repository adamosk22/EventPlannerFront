import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import jwt_decode from 'jwt-decode';

 
@Injectable({providedIn:'root'})
export class AppService {
 
  baseURL: string = "http://localhost:8081/";

  constructor(private http: HttpClient) {
  }
 
  getUsers(): Observable<User[]> {
    console.log('getUsers '+this.baseURL + 'user')
    return this.http.get<User[]>(this.baseURL + 'people')
  }
 
  addPerson(user:User): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(user);
    console.log(body)
    return this.http.post(this.baseURL + 'users', body, {'headers':headers})
  }

  authenticate(email: string, password: string) {
    return this.http
      .post<any>("http://localhost:8081/users/login", { email, password })
      .pipe(
        map(userData => {
          sessionStorage.setItem("email", email);
          let tokenStr = "Bearer " + userData.token;
          sessionStorage.setItem("token", tokenStr);
          const tokenInfo = this.getDecodedAccessToken(userData.token);
          const role = tokenInfo.role;
          sessionStorage.setItem("role", role)
          return userData;
        })
      );
  }

  isUserLoggedIn() {
    let user = sessionStorage.getItem("email");
    console.log(!(user === null));
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
 
}