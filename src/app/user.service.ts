import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Service } from '../settings/Laravel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient, private storage: Storage) { }

  async getUserInfo () 
  {
    let auth: any = await this.storage.get('auth');
    let headers: HttpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    })
    return this.http.get(`${Service.apiUrl}/user`, { headers }).toPromise()
  }
}
