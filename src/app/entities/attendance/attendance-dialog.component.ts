import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDatepickerInputEvent } from '@angular/material';
import { Attendance, AttendanceDtl } from './attendance.model';
import { AttendanceService } from './attendance.service';
import { TeacherService } from '../teacher/teacher.service';
import { RoomService } from '../room/room.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { SharedService } from '../../shared/services/shared.service';
import { Teacher } from '../teacher';
import { Room } from '../presention';
import { NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant-firebase';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { StudentService } from '../student';

@Component({
    selector: 'app-attendance-dialog',
    templateUrl: './attendance-dialog.component.html',
    styleUrls: ['./attendance-dialog.component.css']
})

export class AttendanceDialogComponent implements OnInit {

    private gridApi;
    private gridColumnApi;

    attendance: Attendance;
    dataDtl: AttendanceDtl;
    name: string;
    checked = false;
    outletGroupForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    statusList = [];
    teachers = [];
    students = [];
    studentSelected: string;
    rooms = [];
    attendanceTime: string;
    teacherSelected: string;
    roomSelected: string;
    dateCtrl: FormControl;
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    gridOptions = {
        columnDefs: [
            { headerName: 'Student',   field: 'Student', width: 500, editable: false },
            { headerName: 'Time', field: 'attendanceTime', width: 200, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.rooms,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        cacheOverflowSize : 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        maxBlocksInCache : 2,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        private formBuilder: FormBuilder,
        public attendanceService: AttendanceService,
        public roomService: RoomService,
        public teacherService: TeacherService,
        public studentService: StudentService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<AttendanceDialogComponent>,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.dateCtrl = new FormControl();
         }

    get form() { return this.outletGroupForm.controls; }

    ngOnInit() {
        this.outletGroupForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            attendanceDate: ['', [CommonValidatorDirective.required]],
            attendanceTime: ['', [CommonValidatorDirective.required]],
        });
        this.attendance = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.attendance = this.data.Attendance;
            this.dateCtrl.setValue(this.attendance.attendanceDate );
        } else {
            this.dateCtrl.setValue(new Date() );
        }

        this.sharedService.getStatus()
            .subscribe(
                (res) => {
                    this.statusList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );

        this.teacherService.filter({
            page: 1,
            count: 1000,
            filter: new Teacher(),
        })
        .subscribe(
            (res: HttpResponse<Teacher[]>) => {
                // this.teachers = res.body;
                this.onSuccessTeacher(res.body, res.headers);
            }
        );

        this.roomService.filter({
            page: 1,
            count: 1000,
            filter: new Room(),
        })
        .subscribe(
            (res: HttpResponse<Room[]>) => {
                // this.rooms = res.body;
                this.onSuccessRoom(res.body, res.headers);
            }
        );

        this.studentService.filter({
            page: 1,
            count: 1000,
            filter: new Room(),
        })
        .subscribe(
            (res: HttpResponse<Room[]>) => {
                // this.rooms = res.body;
                this.onSuccessStudent(res.body, res.headers);
            }
        );

    }

    private onSuccessTeacher(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            return ;
        }
        this.teachers = data.content;
        this.teacherSelected = this.teachers[0].id;
    }

    private onSuccessRoom(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            return ;
        }
        this.rooms = data.content;
        this.roomSelected = this.rooms[0].id;
    }

    private onSuccessStudent(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            return ;
        }
        this.students = data.content;
        this.studentSelected = this.students[0].id;
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        this.attendance.attendanceDate = this.dateFormatter(event);
    }

    dateFormatter(params): string {
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {

        this.attendance.strAttendanceDate = this.dateCtrl.value;
        this.attendance.strAttendanceTime = this.attendance.attendanceTime;
        // this.attendance.attendanceTime =  null;
        this.attendance.roomId = this.roomSelected;
        this.attendance.teacherId = this.teacherSelected;
        if (this.attendance.id === undefined) {
            console.log('send to service ', this.attendance);
            this.attendanceService.create(this.attendance)
                .subscribe((res: HttpResponse<Attendance>) => {
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
            console.log('send to service ', this.attendance);
            this.attendanceService.update(this.attendance.id, this.attendance)
                .subscribe((res: HttpResponse<Attendance>) => {
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
        if (this.outletGroupForm.invalid) {
            return;
        }
    }

    addDetil(e): void {
        e.preventDefault();
        // console.log('aa', this.attendance);
        this.dataDtl = new AttendanceDtl;
        this.dataDtl.timeAttend = this.attendanceTime;
        this.dataDtl.timeHome = '';
        this.dataDtl.attendanceHdId = this.attendance.id;
        this.dataDtl.studentId = this.studentSelected;
        this.attendanceService
            .addDetil(this.dataDtl)
            .subscribe(((res: HttpResponse<AttendanceDtl>) => {
                if (res.body.errCode === '' || res.body.errCode === null ) {
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errDesc, 'Ok');
                }
            })
        );

        alert('tes detil');
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

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll(this.curPage);
        // this.filterBtn('');
    }

}
