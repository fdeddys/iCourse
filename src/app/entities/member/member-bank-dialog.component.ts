import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MemberBankService } from '../member-bank/member-bank.service';
import { Member } from './member.model';
import { MemberBank } from '../member-bank/member-bank.model';
import { GlobalSettingService, GlobalSetting } from '../global-setting';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { CommonValidatorDirective } from '../../validators/common.validator';

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
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    memberBankForm: FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<MemberBankDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private memberBankService: MemberBankService,
        private globalSettingService: GlobalSettingService,
    ) { }


    ngOnInit() {
        this.memberBankForm = this.formBuilder.group({
            accountNumber: ['', CommonValidatorDirective.required]
        });

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

    get form() { return this.memberBankForm.controls; }

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

    validate(): void {
        console.log('isi  this.memberBank',  this.memberBank);
        this.submitted = true;
        if (this.memberBank.globalSetting.id === 0) {
            this.openSnackBar('Bank is Required', 'ok');
            return;
        }

        if (this.memberBank.accountNumber === undefined) {
            this.openSnackBar('Account Number is Required', 'ok');
            return;
        }
        // stop here if form is invalid
        if (this.memberBankForm.invalid) {
            return;
        }
    }

    onSubmit() {
        this.memberBank.member = this.member;

        if (this.memberBank.id === undefined || this.memberBank.id === 0) {
            this.memberBank.id = 0;
            console.log('send to service ', this.memberBank);
            this.memberBankService.create(this.memberBank).subscribe((res: HttpResponse<Member>) => {
                if (res.body.errMsg === '' || res.body.errMsg === null ) {
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errMsg, 'Ok');
                }
            });
        } else {
            console.log('send to service ', this.memberBank);
            this.memberBankService.update(this.memberBank.id, this.memberBank).subscribe((res: HttpResponse<Member>) => {
                if (res.body.errMsg === '' || res.body.errMsg === null ) {
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errMsg, 'Ok');
                }
            });
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }


}



