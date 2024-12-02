import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Body, sessBody} from 'src/models/Resetpasswd/body'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = localStorage.getItem('ServerUrl');
  constructor(private http: HttpClient) { }

  sessionCheck(tokenID : string):Observable<sessBody>{
    return this.http.post<sessBody>(`${this.url}authenticate/sessionCheck.php`, {tokenID : tokenID });
  }
}
