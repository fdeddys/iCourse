import { BaseEntity } from './../../shared/model/base-entity';
import { Student } from '../student';

export class Registration implements BaseEntity {
    constructor(
        public id?: number,
        public regDate?: string,
        public officer?: string,
        public courseDate?: string,
        public courseTime?: string,
        public typeOfCourse?: string,
        public student?: Student,
        public registrationNum?: string,
        public paid?: boolean,
        public strRegDate?: string,
        public studentDto?: Student,
        public studentId?: string,
        // public classesIds?: any[],
        public errCode?: string,
        public errDesc?: string,
    ) {
        // this.student = new Student();
    }
}
