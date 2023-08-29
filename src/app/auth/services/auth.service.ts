import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private user?: User;

  constructor( private http: HttpClient ) {}

  get currentUser(): User | undefined {
    if (!this.user)
      return undefined;

    return structuredClone(this.user);
  }

  public login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        tap( user => localStorage.setItem('token', user.id.toString()) ),
      )
  }

  public checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token'))
      return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),        //valido que el objeto user tiene datos
        catchError( () => of(false) )
      );
  }

  public logout(): void {
    this.user = undefined;
    localStorage.clear();
  }
}
