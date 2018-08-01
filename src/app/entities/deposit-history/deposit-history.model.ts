import { BaseEntity } from './../../shared/model/base-entity';

export class DepositHistory implements BaseEntity {
    constructor(
        public id?: number,
        public memberTypeId?: number,
        public amount?: number,
        public debit?: number,
        public credit?: number,
        public balance?: number,
        public transTypeId?: number,
        public description?: string,
        public no?: any,
        public errMsg?: any,
        public transTypeDesc?: any,
    ) {
    }
}
