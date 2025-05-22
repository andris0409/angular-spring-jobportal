import { Component } from '@angular/core';
import { PersonProfile } from '../person-profile-card/PersonProfile';
import { CompanyProfile } from '../company-profile-card/ComapnyProfile';
import { UserService } from './userService';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from '../company-profile/companyService';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  showCompanies: boolean = false;

  personProfiles: PersonProfile[] = [];
  companyProfiles: CompanyProfile[] = [];

  constructor(private service: UserService,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.loadProfiles();
  }


  loadProfiles(): void {
    this.service.getPersonUsers().subscribe({
      next: (data) => {
        this.personProfiles = data;
      },
      error: (err) => {
        console.error('Error fetching person profiles:', err);
      }
    });
    this.service.getCompanyUsers().subscribe({
      next: (data) => {
        this.companyProfiles = data;
      },
      error: (err) => {
        console.error('Error fetching company profiles:', err);
      }
    });
  }

  handleDelete(id: string): void {
    this.service.deleteUser(id).subscribe({
      next: () => {
        this.loadProfiles();
      },
      error: (err) => {
        console.error('Failed to delete person:', err);
      }
    });
  }

  openComments(id: string): void {
    const companyToView = this.companyProfiles.find(c => c.id === id);
    if (!companyToView) {
      console.warn('Company not found');
      return;
    }

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: companyToView.comments
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.deletedComment) {
        this.service.deleteComment(id, result.deletedComment).subscribe({
          next: () => {
            this.loadProfiles();
          },
          error: (err) => {
            console.error('Failed to delete comment:', err);
          }
        });
      }
    });
  }


  goBack(): void {
    window.history.back();
  }

}
