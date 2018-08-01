import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DepositHistory } from './deposit-history.model';
import { DepositHistoryService } from './deposit-history.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND, NO_DATA_GRID_MESSAGE, GRID_THEME } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-deposit-history-dialog',
    templateUrl: './deposit-history-dialog.component.html',
    styleUrls: ['./deposit-history-dialog.component.css']
})

export class DepositHistoryDialogComponent implements OnInit {
    TOTAL_RECORD_GRID_DETIL = 4;
    depositHistory: DepositHistory;
    depositHistories: DepositHistory[];
    depositHistoryForm: FormGroup;
    submitted = false;
    modeTitle: any;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    constructor(
        translate: TranslateService,
        public snackBar: MatSnackBar,
        public transTypeService: DepositHistoryService,
        private depositHistoryService: DepositHistoryService,
        public dialogRef: MatDialogRef<DepositHistoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.use('en');
    }

    ngOnInit() {
        // this.depositHistoryForm = this.formBuilder.group({
        //     name: ['', [CommonValidatorDirective.required]],
        // });

        this.depositHistory = {};
        if (this.data.mode !== 'create') {
            // search
            this.depositHistory = this.data.rowData;
        }
    }

}
