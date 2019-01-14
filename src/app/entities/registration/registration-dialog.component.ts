import { Component, OnInit, Inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Registration } from './registration.model';
import { RegistrationService } from './registration.service';
import { StudentService } from '../student/student.service';
import { ClassesService } from '../classes/classes.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { SharedService } from '../../shared/services/shared.service';
import { Student } from '../student';
import { Classes } from '../classes';

@Component({
    selector: 'app-registration-dialog',
    templateUrl: './registration-dialog.component.html',
    styleUrls: ['./registration-dialog.component.css']
})

export class RegistrationDialogComponent implements OnInit {

    registration: Registration;
    officer: string;
    address1: string;
    checked = false;
    outletGroupForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    typeOfCourseList = [];
    typeOfCourse: string;
    statusClasses = [];
    classesSelected: string;
    dateSCtrl: FormControl;
    newRec: boolean;
    constructor(
        private formBuilder: FormBuilder,
        public registrationService: RegistrationService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<RegistrationDialogComponent>,
        private sharedService: SharedService,
        private studentService: StudentService,
        private classesService: ClassesService,
        @Inject(MAT_DIALOG_DATA) public data: any
        ) {
            this.dateSCtrl = new FormControl();
        }

    get form() { return this.outletGroupForm.controls; }

    ngOnInit() {
        this.outletGroupForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            courseTime: ['', [CommonValidatorDirective.required]],
            courseDate: ['', [CommonValidatorDirective.required]],
            officer: ['', [CommonValidatorDirective.required]],
            school: ['', [CommonValidatorDirective.required]],
            address1: ['', [CommonValidatorDirective.required]],
            dateStart: ['', CommonValidatorDirective.required],
        });
        this.registration = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.newRec = false;
            this.registration = this.data.Registration;
            this.dateSCtrl.setValue(this.registration.regDate );
            // this.officer = this.registration.officer;
        } else {
            this.newRec = true;
            this.registration.student = new Student();
            this.dateSCtrl.setValue(new Date );
        }

        this.sharedService.getCourseType()
            .subscribe(
                (res) => {
                    this.typeOfCourseList = res.body;
                    if ( this.data.action !== 'Edit' ) {
                        this.registration.typeOfCourse = this.typeOfCourseList[0];
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );

        this.classesService.filter({
                page: 1,
                count: 1000,
                filter: new Classes(),
            })
            .subscribe(
                (res: HttpResponse<Classes[]>) => {
                    this.statusClasses = res.body;
                    this.onSuccessClasses(res.body, res.headers);
                    if ( this.data.action === 'Edit' ) {
                        // cari
                    } else {

                    }
                }
            );
    }

    private onSuccessClasses(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            return ;
        }
        this.statusClasses = data.content;
        this.classesSelected = this.statusClasses[0].id;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        const classesList: string [] = [];
        classesList.push(this.classesSelected);

        this.registration.studentDto = new Student;
        this.registration.studentDto.name = this.registration.student.name;
        this.registration.studentDto.address1 = this.registration.student.address1;
        this.registration.studentDto.address2 = this.registration.student.address2;
        this.registration.studentDto.phone = this.registration.student.phone;
        this.registration.studentDto.school = this.registration.student.school;
        this.registration.studentDto.classesIds = classesList;

        this.registration.strRegDate = this.dateSCtrl.value;
        if (this.registration.id === undefined) {
            console.log('send to service ', this.registration);
            // this.registration.strRegDate = this.biller.dateStart,
            // this.dateSCtrl.setValue(this.registration.regDate );
            this.registrationService.create(this.registration)
                .subscribe((res: HttpResponse<Registration>) => {
                    if (res.body.errCode === '' || res.body.errCode === null ) {
                        this.dialogRef.close('refresh');
                    } else {
                        this.openSnackBar(res.body.errDesc, 'Ok');
                    }
                    this.registration.registrationNum = res.body.registrationNum;
                    this.registration.id = res.body.id;
                    this.registration.student.id = res.body.student.id;
                    // registrationDto.getStudent().getId()
                    this.newRec = false;
                },
                (res: HttpErrorResponse) => {
                    this.snackBar.open('Error !' + res.error.message , 'Close', {
                        duration: 10000,
                    });
                    console.log('error msh ', res.error.message);
                }
            );

        } else {
            console.log('send to service ', this.registration);

            this.registrationService.update(this.registration.id, this.registration)
                .subscribe((res: HttpResponse<Registration>) => {
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
        if (this.outletGroupForm.invalid) {
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

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.registration.strRegDate = this.dateFormatter(event);
    }

    dateFormatter(params): string {
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

}
