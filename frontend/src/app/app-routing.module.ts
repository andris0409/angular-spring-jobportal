import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { DynamicProfileComponentComponent } from './dynamic-profile/dynamic-profile-component.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'joblist', component: JobListComponent },
  { path: 'job-details/:id', component: JobDetailComponent },
  { path: 'create-job', component: CreateJobComponent },
  { path: 'profile', component: DynamicProfileComponentComponent },
  { path: 'application-list/:id', component: ApplicationListComponent },
  { path: 'edit-job/:jobId', component: CreateJobComponent },
  { path: 'profile/person', component: PersonProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
