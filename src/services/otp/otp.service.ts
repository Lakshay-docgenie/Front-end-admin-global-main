import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { otpbody } from 'src/models/otp/body';
import { RegistrBody } from 'src/models/register/body';
import { UserService } from 'src/services/users_list/userlist.service';
import { Data } from 'src/models/register/data';
import { BehaviorSubject } from 'rxjs';
import { vaultdata } from 'src/models/localstorage/vault';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  private STORAGE_USER_KEY = 'my_user_data';
  url : string;
  private userData = new BehaviorSubject<any>(null);
  userdata$ = this.userData.asObservable();
  
  setUserData(data: any) {
    this.userData.next(data);
    // Save data to localStorage
    localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(data));
  }

  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  sharedMsgDialog : vaultdata;

  constructor(private http: HttpClient,private userService : UserService) { 
    const savedUserData = localStorage.getItem(this.STORAGE_USER_KEY);
    if (savedUserData) {
      this.userData.next(JSON.parse(savedUserData));
    }
    this.userService.data$.subscribe(data => {
      this.url = data;
    });
  }

  generateopt(phoneno:string): Observable<otpbody>{
    return this.http.post<otpbody>(`${this.url}/otp/generateotp.php`, {phoneno:phoneno,apptype:this.apptype,token:this.token});
  }

  Register(username: string, password: string,role: string,firstname: string,lastname: string): Observable<RegistrBody>{
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    return this.http.post<RegistrBody>(`${this.url}/otp/otpregisteruser.php`, {username: username, password: password,userrole:role,userfname : firstname,userlname: lastname,apptype:this.apptype,token:jsonItem.token});
  }

  Login(username: string, password: string): Observable<RegistrBody>
  {
   return this.http.post<RegistrBody>(`${this.url}otp/otplogin.php`, {username: username, password: password,apptype:this.apptype,token:this.token});
  }

  setDialog(data: vaultdata) {
    this.sharedMsgDialog = data;
  }

  getDialog() {
    return this.sharedMsgDialog;
  }
}
