import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Student } from './student.model';
import { StudentService } from './student.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { SharedService } from '../../shared/services/shared.service';
import { ClassesService, Classes } from '../classes';

@Component({
    selector: 'app-student-dialog',
    templateUrl: './student-dialog.component.html',
    styleUrls: ['./student-dialog.component.css']
})

export class StudentDialogComponent implements OnInit {

    student: Student;
    name: string;
    checked = false;
    classesForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    statusList = [];
    classesList = [];

    constructor(
        private formBuilder: FormBuilder,
        public studentService: StudentService,
        public classesService: ClassesService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<StudentDialogComponent>,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.classesForm.controls; }

    ngOnInit() {
        this.classesForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            billPayTypeId : ['', [CommonValidatorDirective.required]]
        });
        this.student = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.student = this.data.Student;
            this.name = this.student.name;
            this.student.classesIds = this.data.Student.classes.id;
        }

        this.sharedService.getStatus()
            .subscribe(
                (res) => {
                    this.statusList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );

        this.findAllClass();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {

        if (this.student.id === undefined) {
            console.log('send to service ', this.student);

            this.studentService.create(this.student)
                .subscribe((res: HttpResponse<Student>) => {
                    if (res.body.errCode === '' || res.body.errCode === null ) {
                        this.dialogRef.close('refresh');
                    } else {
                        this.openSnackBar(res.body.errDesc, 'Ok');
                    }
                },
                (res: HttpErrorResponse) => {
                    this.snackBar.open('Error !' + res.error.message , 'Close', {
                        duration: 10000,
                    });
                    console.log('error msh ', res.error.message);
                }
            );

        } else {
            console.log('send to service ', this.student);

            this.studentService.update(this.student.id, this.student)
                .subscribe((res: HttpResponse<Student>) => {
                    if (res.body.errCode === '' || res.body.errCode === null ) {
                        this.dialogRef.close('refresh');
                    } else {
                        this.openSnackBar(res.body.errDesc, 'Ok');
                    }
                },
                (res: HttpErrorResponse) => {
                    this.snackBar.open('Error !' + res.error.message , 'Close', {
                        duration: 10000,
                    });
                    console.log('error msh ', res.error.message);
                }
            );

        }
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.classesForm.invalid) {
            return;
        }
    }

    onChange(events): void {
        console.log('event ', event);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }

    private onError(error) {
        console.log('error..', error);
    }

    findAllClass() {
        const filterClasses: Classes = {
            name :  ''
        };
        this.classesService.filter({
            page: 1,
            count: 1000,
            filter: filterClasses,
        })
        .subscribe(
                (res: HttpResponse<Classes[]>) => this.onSuccessClass(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    private onSuccessClass(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            return ;
        }
        this.classesList = data.content;
    }

}
