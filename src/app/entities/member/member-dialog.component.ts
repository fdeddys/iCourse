import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Member } from './member.model';
import { MemberService } from './member.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-member-dialog',
    templateUrl: './member-dialog.component.html',
    styleUrls: ['./member-dialog.component.css']
})

export class MemberDialogComponent implements OnInit {

    member: Member;
    name: string;

    statuses = [
        {value: 'true', viewValue: 'Active'},
        {value: 'false', viewValue: 'Inactive'}
    ];

    constructor(
        public memberService: MemberService,
        public dialogRef: MatDialogRef<MemberDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.member = {};
        if ( this.data.action === 'EDIT' ) {
            // search
            this.member = this.data.member;
            this.name = this.member.name;
        }

    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {
        console.log('isi member = ', this.member);
        // this.member.name = this.name;

        if (this.member.id === undefined) {
            console.log('send to service ', this.member);
            this.memberService.create(this.member).subscribe((res: HttpResponse<Member>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.member);
            this.memberService.update(this.member.id, this.member).subscribe((res: HttpResponse<Member>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

}
