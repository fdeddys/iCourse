import { BaseEntity } from './../../shared/model/base-entity';

export class Attendance implements BaseEntity {
    constructor(
        public id?: number,
        public room?: any,
        public teacher?: any,
        public roomId?: any,
        public teacherId?: any,
        public attendanceDate?: string,
        public attendanceTime?: string,
        public strAttendanceDate?: string,
        public strAttendanceTime?: string,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}

export class AttendanceDtl implements BaseEntity {
    constructor(
        public id?: number,
        public attendance?: any,
        public studentDt?: any,
        public timeAttend?: string,
        public timeHome?: string,
        public errCode?: string,
        public errDesc?: string,
        public attendanceHdId?: any,
        public studentId?: any,
    ) {
    }
}
