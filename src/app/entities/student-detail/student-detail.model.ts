import { BaseEntity } from './../../shared/model/base-entity';
import { Classes } from '../classes';

export class StudentDetail implements BaseEntity {
    constructor(
        public id?: number,
        public student?: any,
        public classes?: Classes,
        public errCode?: string,
        public errDesc?: string,
        public studentId?: string,
        public classesIds?: string[],
        public isRegistration?: any,
    ) {
        this.classes = new Classes;
    }
}
