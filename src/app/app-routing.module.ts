import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListAppointmentsComponent } from './admin-list-appointments/admin-list-appointments.component';
import { LoginComponent } from '../modules/login/login.component';
import { AdminListDoctor } from '../modules/admin-list-doctor/admin-list-doctor.component';
import { AdminPrescListComponent } from './admin-presc-list/admin-presc-list.component';
import { AdminListLabtestComponent } from './admin-list-labtest/admin-list-labtest.component';
import { AdminListPackagesComponent } from './admin-list-packages/admin-list-packages.component';
import { AdminLedgerComponent } from './admin-ledger/admin-ledger.component';
import { MisReportsComponent } from './mis-reports/mis-reports.component';
import { AdminListPatientComponent } from './admin-list-patient/admin-list-patient.component';
import { AdminListLoginComponent } from './admin-list-login/admin-list-login.component';
import { PromocodeComponent } from './promocode/promocode.component'
import { AdminChangeAppointmentComponent } from './admin-change-appointment/admin-change-appointment.component';
import { AddDoctorComponent } from '../modules/add-doctor/add-doctor.component';
import { UpdatePatientDetailsComponent} from './update-patient-details/update-patient-details.component'

const routes: Routes = [
  { path : 'login', component : LoginComponent },
  { path : 'admin_list_appointments', component : AdminListAppointmentsComponent },
  { path : 'list_doctor', component : AdminListDoctor },
  { path : 'admin_list_presc', component : AdminPrescListComponent},
  { path : 'admin-list-labtest',component : AdminListLabtestComponent},
  { path : 'admin-ledger', component : AdminLedgerComponent},
  { path : 'admin-list-packages',component:AdminListPackagesComponent},
  { path : 'mis-reports', component : MisReportsComponent},
  { path : 'admin_list_patient', component : AdminListPatientComponent },
  { path : 'patient-logs', component : AdminListLoginComponent},
  { path : 'promo',component :PromocodeComponent},
  { path : 'admin_list_slot/:docid/:drFName/:drLName', component : AdminChangeAppointmentComponent },
  { path : 'admin_list_slot/:docid/:drFName/:drMName/:drLName', component : AdminChangeAppointmentComponent },
  { path : 'add-new-patient', component: UpdatePatientDetailsComponent },
  { path : 'doctor_doc_details', component: AddDoctorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration : 'enabled',
    onSameUrlNavigation : 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
