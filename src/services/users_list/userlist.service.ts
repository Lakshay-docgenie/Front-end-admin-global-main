import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { city } from 'src/models/citywisecount/body';
import { Pack } from 'src/models/healthcare/body';
import { Probldia } from 'src/models/probldia/body';
import { body_lab } from 'src/models/labtest/body';
import { body_citywise } from 'src/models/labcity/body';
import { body_city } from 'src/models/citycount/body';
import { body_doc } from 'src/models/doccount/body';
import { body_spcl } from 'src/models/spclcount/body';
import { body_pat } from 'src/models/PatCityCount/body';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private STORAGE_URL_KEY = 'my_url_data';

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  url : string;
  constructor(private http: HttpClient) { 
    const savedURLData = localStorage.getItem(this.STORAGE_URL_KEY);
    if (savedURLData) {
      this.dataSubject.next(JSON.parse(savedURLData));
    }

    this.data$.subscribe(data => {
      this.url = data;
    });
  }

  setData(data: any) {
    this.dataSubject.next(data);
    // Save data to localStorage
    localStorage.setItem(this.STORAGE_URL_KEY, JSON.stringify(data));
  }

  citywiseCount() : Observable<city>{
    return this.http.post<city>(`${this.url}MIS/mis.php`, {});
  }
  
  Healthcaredet() : Observable<Pack>{
    return this.http.post<Pack>(`${this.url}MIS/pack.php`, {});
  }  
  Probldiadet() : Observable<Probldia>{
    return this.http.post<Probldia>(`${this.url}MIS/probldia.php`, {});
  }
    cityCount() : Observable<body_city>{
    return this.http.post<body_city>(`${this.url}MIS/count.php`, {});
  }
  labtest() : Observable<body_lab>{
    return this.http.post<body_lab>(`${this.url}MIS/test.php`, {});
  }
  labcity() : Observable<body_citywise>{
    return this.http.post<body_citywise>(`${this.url}MIS/booking.php`, {});
  }
  doccount(startdate: string, enddate: string) : Observable<body_doc>{
    return this.http.post<body_doc>(`${this.url}MIS/nofcldoctorwise.php`, {startdate: startdate, enddate: enddate});
  }

  spclcount(startdate: string, enddate: string) : Observable<body_spcl>{
    return this.http.post<body_spcl>(`${this.url}MIS/specialitywise.php`, {startdate: startdate, enddate: enddate});
  }

  PatCityCount(startdate: string, enddate: string) : Observable<body_pat>{
    return this.http.post<body_pat>(`${this.url}MIS/patientcitywise.php`, {startdate: startdate, enddate: enddate});
  }

}
