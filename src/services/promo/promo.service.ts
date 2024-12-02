import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { promoBody } from 'src/models/promo/body';
import { UserService } from 'src/services/users_list/userlist.service';

@Injectable({
  providedIn: 'root'
})
export class Promoservice {
  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  constructor(private http: HttpClient,
              private userService : UserService) { 
                this.userService.data$.subscribe(data => {
                  this.url = data;
                });
              }

  listpromo(): Observable<promoBody>{
    return this.http.post<promoBody>(`${this.url}/promo/Listpromo.php`, {});
  }

  Createpromo(  promostdate:string,promoenddate:string, promocount:number, promodescription:string,promodiscount:number,promocode:string,promodoccat:string,promodoctor:number,promodrname:string,promotype:string): Observable<promoBody>{
    return this.http.post<promoBody>(`${this.url}/promo/Createpromo.php`, {stdate: promostdate, enddate: promoenddate,count:promocount,description:promodescription,discount:promodiscount,promocode:promocode,promodoccat:promodoccat,promodoctor:promodoctor,promodrname:promodrname,promotype:promotype});
  }

  Updatepromo(promoid:number, promostdate:string,promoenddate:string, promocount:number, promodescription:string,promodiscount:number): Observable<promoBody>{
    return this.http.post<promoBody>(`${this.url}/promo/Updatepromo.php`, {promoid:promoid, stdate: promostdate,enddate:promoenddate,count:promocount,description:promodescription,discount:promodiscount});
  }

  Deletepromo(promoid:number): Observable<promoBody>{
    return this.http.post<promoBody>(`${this.url}/promo/Deletepromo.php`, {promoid: promoid});
  }

}
