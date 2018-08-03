import { BaseEntity } from './../../shared/model/base-entity';

export class Deposit implements BaseEntity {
    constructor(
        public id?: number,
        public memberTypeId?: number,
        public amount?: number,
        public transTypeId?: number,
        public description?: string,
        public transDate?: string,
        public no?: any,
        public errMsg?: any,
        public code?: any,
    ) {
    }
}
