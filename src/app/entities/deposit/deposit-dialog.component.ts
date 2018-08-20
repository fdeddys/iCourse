import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Deposit } from './deposit.model';
import { DepositService } from './deposit.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { SNACKBAR_DURATION_IN_MILLISECOND, NO_DATA_GRID_MESSAGE, GRID_THEME } from '../../shared/constant/base-constant';
import { CommonValidatorDirective } from '../../validators/common.validator';

@Component({
    selector: 'app-deposit-dialog',
    templateUrl: './deposit-dialog.component.html',
    styleUrls: ['./deposit-dialog.component.css']
})

export class DepositDialogComponent implements OnInit {
    deposit: Deposit;
    depositSave: Deposit;
    deposits: Deposit[];

    billerList = [];
    transTypeList = [];
    depositForm: FormGroup;
    submitted = false;
    modeTitle: any;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    dateCtrl: FormControl;
    transTypeDisabled = false;
    manualDepo = false;
    amountVal = 0;

    constructor(
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        private transTypeService: DepositService,
        private depositService: DepositService,
        public dialogRef: MatDialogRef<DepositDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.dateCtrl = new FormControl();
    }

    ngOnInit() {
        // this.depositForm = this.formBuilder.group({
        //     name: ['', [CommonValidatorDirective.required]],
        // });

        this.depositForm = this.formBuilder.group({
            biller: ['', CommonValidatorDirective.required],
            amount: ['', CommonValidatorDirective.required],
            transType: ['', CommonValidatorDirective.required],
            transDate: ['', CommonValidatorDirective.required],
            description: ['', CommonValidatorDirective.required]
        });

        this.deposit = {};
        this.modeTitle = this.data.modeTitle;

        this.deposit = this.data.rowData;
        if (this.data.mode !== 'create') {
            // search
            this.dateCtrl.setValue(this.data.rowData.transDate);
        }
        this.billerList = this.data.billerData;
        this.transTypeList = this.data.transTypeData;
        if (this.transTypeList.length === 1 && (this.transTypeList[0].code === '8' || this.transTypeList[0].code === '7')) {
            this.transTypeDisabled = true;
            this.deposit.transTypeCode = this.transTypeList[0].code;
        }
        if (this.transTypeList[0].code === '8') {
            this.manualDepo = true;
        }
    }

    get form() { return this.depositForm.controls; }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }

    valCheck(el): void {
        console.log('valCheck..');
        if (this.deposit[el] < 0) {
            this.deposit[el] = 0;
        }
    }

    addEvent(event: MatDatepickerInputEvent<Date>) {
        this.deposit.transDate = this.dateFormatter(event);
    }

    dateFormatter(params): string {
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    currencyFormat(event) {
        // When user select text in the document, also abort.
        // When the arrow keys are pressed, abort.
        if (_.find([38, 40, 37, 39], function(o) { return o === event.keyCode; })) {
            return;
        }

        // event.target.value = event.target.value.replace(/[\D\s\._\-]+/g, '');
        let temp = event.target.value.replace(/[\D\s\._\-]+/g, '');
        temp = temp ? parseInt( temp, 10 ) : 0;

        this.amountVal = temp;
        event.target.value = (( temp === 0 ) ? '' : temp.toLocaleString( 'id-ID' ));
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.depositForm.invalid) {
            return;
        }
    }

    onSubmit() {
        // alert(searchByMemberId);
        if (this.dateCtrl.value === null) {
            return;
        }
        this.depositSave = {
            memberTypeId: this.deposit.memberTypeId,
            // amount: this.deposit.amount,
            amount: this.amountVal,
            transTypeCode: this.deposit.transTypeCode,
            description: this.deposit.description,
            transDate: this.dateFormatter(this.dateCtrl),
        };
        console.log('this.depositSave : ', this.depositSave);
        // if (this.depositSave.id === undefined || this.depositSave.id === null) {
            this.depositService.create(this.depositSave).subscribe((res: HttpResponse<Deposit>) => {
                if (res.body.errMsg === null || res.body.errMsg === '') {
                    this.dialogRef.close('refresh');
                } else {
                    this.snackBar.open('Error ! ' + res.body.errMsg , 'Close', {
                        duration: this.duration,
                    });
                }
            });
        // }
    }

}
