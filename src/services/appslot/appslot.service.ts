import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { resource_response1} from 'src/models/resources/body';
import { UserService } from 'src/services/users_list/userlist.service';

@Injectable({
  providedIn: 'root'
})
export class AppSlotService {

  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";

  constructor(private http: HttpClient,
              private userService : UserService) { 
                this.userService.data$.subscribe(data => {
                  this.url = data;
                });
              }

  GetApptAllSlots(appdate:string,docdetid:number,calltype:string,userrole : string): Observable<resource_response1>{
    return this.http.post<resource_response1>(`${this.url}slots/allAppSlots.php`, {appdate,docdetid,calltype:calltype,userrole:userrole,apptype:this.apptype,token:this.token});
  }
}
