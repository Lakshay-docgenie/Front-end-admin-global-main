import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/* Above was there defaultly in app.module */

/* These are built-in angular materials, angular-cdk , native angular modules, which we call when required */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';

/*User Defined Component Imports*/
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalLogoutComponent } from 'src/modules/modal-logout/modal-logout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MsgdialogComponent } from './msgdialog/msgdialog.component';
import { TermsandcondComponent } from './termsandcond/termsandcond.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SafePipe } from './safe.pipe';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoginComponent } from 'src/modules/login/login.component';
//Including progess Bar
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AdminListAppointmentsComponent } from './admin-list-appointments/admin-list-appointments.component';
import { AdminListDoctor } from '../modules/admin-list-doctor/admin-list-doctor.component';
import { AdminPrescListComponent } from './admin-presc-list/admin-presc-list.component';
import { AdminListLabtestComponent } from './admin-list-labtest/admin-list-labtest.component';
import { AdminListPackagesComponent } from './admin-list-packages/admin-list-packages.component';
import { AdminLedgerComponent } from './admin-ledger/admin-ledger.component';
import { MisReportsComponent } from './mis-reports/mis-reports.component';
import { AdminListPatientComponent } from './admin-list-patient/admin-list-patient.component';
import { AdminListLoginComponent } from './admin-list-login/admin-list-login.component';
import { PromocodeComponent } from './promocode/promocode.component';
import { AdminChangeAppointmentComponent } from './admin-change-appointment/admin-change-appointment.component';
import { AddDoctorComponent } from 'src/modules/add-doctor/add-doctor.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DeviceDetComponent } from './device-det/device-det.component';
import { LabtestOrderComponent } from './labtest-order/labtest-order.component';
import { UpdatePatientDetailsComponent } from './update-patient-details/update-patient-details.component'

@NgModule({
  declarations: [
    AppComponent,
    ModalLogoutComponent,
    MsgdialogComponent,
    TermsandcondComponent,
    PrivacyComponent,
    SafePipe,
    LoginComponent,
    AdminListAppointmentsComponent,
    AdminListDoctor,
    AdminPrescListComponent,
    AdminListLabtestComponent,
    AdminListPackagesComponent,
    AdminLedgerComponent,
    MisReportsComponent,
    AdminListPatientComponent,
    AdminListLoginComponent,
    PromocodeComponent,
    AdminChangeAppointmentComponent,
    AddDoctorComponent,
    DeviceDetComponent,
    LabtestOrderComponent,
    UpdatePatientDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgbModule,
    MatDialogModule,
    CarouselModule,
    MatExpansionModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    MatRadioModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatGridListModule,
    MatTableModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    SelectDropDownModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
