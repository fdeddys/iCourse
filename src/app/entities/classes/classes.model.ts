import { BaseEntity } from './../../shared/model/base-entity';

export class Classes implements BaseEntity {
    constructor(
        public id?: number,
        public classCode?: string,
        public name?: string,
        public monthlyFee?: number,
        public status?: any,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}
