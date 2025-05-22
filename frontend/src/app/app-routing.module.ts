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
import { SavedJobsComponent } from './saved-jobs/saved-jobs.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { CompanyAdvertComponent } from './company-advert/company-advert.component';
import { UserListComponent } from './user-list/user-list.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { UserApplicationListComponent } from './user-application-list/user-application-list.component';

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
  { path: 'profile/person', component: PersonProfileComponent },
  { path: 'profile/company', component: CompanyProfileComponent },
  { path: 'profile/admin', component: AdminProfileComponent },
  { path: 'saved-jobs', component: SavedJobsComponent },
  { path: 'company/:id', component: CompanyAdvertComponent },
  { path: 'userlist', component: UserListComponent },
  { path: 'user-applications', component: UserApplicationListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
