import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MemberType } from '../member-type';

import { BillerDetailComponent } from '../biller-detail/biller-detail.component';

@Component({
    selector: 'app-biller-dialog',
    templateUrl: './biller-dialog.component.html',
    styleUrls: ['./biller-dialog.component.css']
})
export class BillerDialogComponent implements OnInit {

    membTypeCtrl: FormControl;
    filteredMembType: Observable<any[]>;

    biller: Biller;
    billerSave: Biller;
    memberTypeList = [];

    modeTitle = '';

    minDate = new Date(2000, 0, 1);
    maxDate = new Date(2020, 0, 1);

    columnDefs = [
        {headerName: 'Make', field: 'make' },
        {headerName: 'Model', field: 'model' },
        {headerName: 'Price', field: 'price'}
    ];

    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];

    constructor(
        private dialog: MatDialog,
        public billerService: BillerService,
        public dialogRef: MatDialogRef<BillerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.membTypeCtrl = new FormControl();
        this.filteredMembType = this.membTypeCtrl.valueChanges
        .pipe(
            startWith<string | MemberType>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMembType(name) : this.memberTypeList.slice())
        );
    }

    filterMembType(name: string) {
        return this.memberTypeList.filter(memberType =>
        memberType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnMem(memberType?: MemberType): string | undefined {
        return memberType ? memberType.name : undefined;
    }

    ngOnInit() {
        this.biller = {};
        this.modeTitle = this.data.modeTitle;
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            this.membTypeCtrl.setValue(this.data.rowData.memberType);
        }
        this.biller = this.data.rowData;
        this.memberTypeList = this.data.memberTypeData;
    }

    private onError(error) {
        console.log('error..', error);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    openProdDialog(): void {
        console.log('open dialog');
        const dialogRef = this.dialog.open(BillerDetailComponent, {
            width: '1000px',
            // data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    save(): void {
        this.billerSave = {
            id: this.biller.id,
            description: this.biller.description,
            dateStart: this.biller.dateStart,
            dateThru: this.biller.dateThru,
            memberTypeId: this.membTypeCtrl.value.id,
        };
        console.log(this.billerSave);
        if (this.biller.id === undefined || this.biller.id === null) {
            console.log('send to service ', this.biller);
            this.billerService.create(this.biller).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.biller);
            this.billerService.update(this.biller.id, this.biller).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        }
    }
}
