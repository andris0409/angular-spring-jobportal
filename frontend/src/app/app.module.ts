import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { MatOption } from '@angular/material/core';
import { ApplicationService } from './job-detail/ApplicationService';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from './header/header.component';
import { CreateJobComponent } from './create-job/create-job.component';
import { JobItemComponent } from './job-item/job-item.component';
import { DynamicProfileComponentComponent } from './dynamic-profile/dynamic-profile-component.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    JobListComponent,
    JobDetailComponent,
    HeaderComponent,
    CreateJobComponent,
    JobItemComponent,
    DynamicProfileComponentComponent,
    ApplicationListComponent,
    ConfirmDialogComponent,
    PersonProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOption,
    MatSelectModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center'
    }),
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
