import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  api = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient
  ) {}

  register(data: any) {

    return this.http.post(
      this.api,
      data
    );

  }

  getUsers() {

    return this.http.get<any[]>(
      this.api
    );

  }

  updateUser(
    id: number,
    data: any
  ) {

    return this.http.patch(
      `${this.api}/${id}`,
      data
    );

  }

}