import { BaseEntity } from './../../shared/model/base-entity';

export class Deposit implements BaseEntity {
    constructor(
        public id?: number,
        public memberTypeId?: number,
        public amount?: number,
        public transTypeCode?: string,
        public description?: string,
        public transDate?: string,
        public no?: any,
        public errMsg?: any,
    ) {
    }
}
