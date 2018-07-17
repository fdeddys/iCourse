import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MemberBankService } from '../member-bank/member-bank.service';
import { Member } from './member.model';
import { MemberBank } from '../member-bank/member-bank.model';
import { GlobalSettingService, GlobalSetting } from '../global-setting';

@Component({
    selector: 'app-member-bank-dialog',
    templateUrl: './member-bank-dialog.component.html',
    styleUrls: ['./member-bank-dialog.component.css']
})

export class MemberBankDialogComponent implements OnInit {

    member: Member;
    memberBank: MemberBank;
    private globalSettings: GlobalSetting[];
    // private bankSelected;

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<MemberBankDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private memberBankService: MemberBankService,
        private globalSettingService: GlobalSettingService,
    ) { }


    ngOnInit() {
        this.member = this.data.member;
        this.memberBank = new MemberBank();
        const global = new GlobalSetting();
        global.id = 0;
        this.memberBank.globalSetting = global;
        if ( this.data.action === 'Edit' ) {
            // search
            this.memberBank = this.data.memberBank;
            console.log('member bank ', this.memberBank);
            // this.globalSettingService.find(this.memberBank.globalSetting.id)
            //     .subscribe(
            //         (res) => { this.bankSelected = res.body.id, console.log('selected bank ', this.bankSelected); }
            //     );
            // console.log('bank selected =>', this.memberBank.globalSetting);
        }
        this.loadBank();
    }

    loadBank(): void {
        this.globalSettingService.findByGlobalType('BANK')
            .subscribe(
                (res: HttpResponse<GlobalSetting[]>) => {
                    console.log(res);
                    this.globalSettings = res.body;
                },
                (res: HttpErrorResponse) => console.log(res),
                () => { console.log('finally'); }
        );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {
        this.memberBank.member = this.member;

        if (this.memberBank.id === undefined) {
            this.memberBank.id = 0;
            console.log('send to service ', this.memberBank);
            this.memberBankService.create(this.memberBank).subscribe((res: HttpResponse<Member>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.memberBank);
            this.memberBankService.update(this.memberBank.id, this.memberBank).subscribe((res: HttpResponse<Member>) => {
                this.dialogRef.close('refresh');
            });
        }
    }


}



