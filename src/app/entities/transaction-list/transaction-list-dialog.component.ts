import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TransList } from './transaction-list.model';
import { TransListService } from './transaction-list.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-transaction-list-dialog',
    templateUrl: './transaction-list-dialog.component.html',
    styleUrls: ['./transaction-list-dialog.component.css']
})

export class TransListDialogComponent implements OnInit {
    transList: TransList;
    transListForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    constructor(
        translate: TranslateService,
        public snackBar: MatSnackBar,
        public transTypeService: TransListService,
        public dialogRef: MatDialogRef<TransListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.use('en');
    }

    ngOnInit() {
        // this.transListForm = this.formBuilder.group({
        //     name: ['', [CommonValidatorDirective.required]],
        // });

        this.transList = {};
        if (this.data.mode !== 'create') {
            // search
            this.transList = this.data.rowData;
        }
    }
}
