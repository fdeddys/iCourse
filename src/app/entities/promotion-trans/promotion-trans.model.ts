import { BaseEntity } from './../../shared/model/base-entity';

export class PromotionTrans implements BaseEntity {
    constructor(
        public id?: number,
        public transTypeId?: number,
        public promotionId?: number,
        public rrn?: string,
        public transDate?: string,
        public debit?: number,
        public credit?: number,
        public balance?: number,
        public no?: any,
        public errMsg?: any,
    ) {
    }
}
