import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { listlabtest } from 'src/models/labtest_listlabtest/body';
import { Observable } from 'rxjs';
import { BodyCat } from 'src/models/labtest_listcat/body';
import { UserService } from 'src/services/users_list/userlist.service';

@Injectable({
  providedIn: 'root'
})
export class LabtestService {

  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  constructor(private http: HttpClient,private userService : UserService) { 
                this.userService.data$.subscribe(data => {
                  this.url = data;
                });
              }

  listlablist(srchstr: string): Observable<listlabtest>{   
    return this.http.post<listlabtest>(`${this.url}/labtest/listlabtest.php`, {srchstr: srchstr,apptype:this.apptype,token:this.token});
  }

  labtest_catlist(srchstr: string): Observable<BodyCat>{
    return this.http.post<BodyCat>(`${this.url}/labtest/selAlllabtestbycat.php`, {srchstr: srchstr});
  }
}
