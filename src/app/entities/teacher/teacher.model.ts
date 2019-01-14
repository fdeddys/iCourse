import { BaseEntity } from './../../shared/model/base-entity';

export class Teacher implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public address1?: string,
        public address2?: string,
        public phone?: string,
        public baseSalary?: number,
        public allowance?: number,
        public teacherCode?: string,
        public status?: any,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}
