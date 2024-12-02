import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { patpacklistBody} from 'src/models/patpackagelist/body'
import { Observable } from 'rxjs';
import { UserService } from 'src/services/users_list/userlist.service';

@Injectable({
  providedIn: 'root'
})
export class PacktestService {

  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  constructor(private http: HttpClient,
    private userService : UserService) { 
      this.userService.data$.subscribe(data => {
        this.url = data;
      });
    }

  listpack(startdate: string, enddate: string, packstr:string): Observable<patpacklistBody>{
    return this.http.post<patpacklistBody>(`${this.url}/packtest/listpackadmin.php`, {startdate: '', enddate: '', packstr: packstr});
  }
}
