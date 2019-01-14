import { BaseEntity } from './../../shared/model/base-entity';

export class Student implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public address1?: string,
        public address2?: string,
        public phone?: string,
        public school?: string,
        public studentCode?: string,
        public classesIds?: string[],
        public classes?: any,
        public status?: any,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}
