import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-dialog',
  standalone: false,
  templateUrl: './comment-dialog.component.html',
  styleUrl: './comment-dialog.component.css'
})
export class CommentDialogComponent {
  userRole: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public comments: string[], private dialogRef: MatDialogRef<CommentDialogComponent>) {
    this.userRole = localStorage.getItem('role') || '';
  }

  deleteComment(comment: string): void {
    this.dialogRef.close({ deletedComment: comment });
  }
}
