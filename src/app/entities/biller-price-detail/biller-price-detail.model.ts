import { BaseEntity } from './../../shared/model/base-entity';

export class BillerPriceDetail implements BaseEntity {
    constructor(
        public id?: number,
        public salesPrice?: number,
        public profit?: number,
        public profitDistributorPks?: number,
        public profitMemberPks?: number,
        public dateStart?: string,
        public dateThru?: string,
        public billerHeaderId?: number,
        public billerProductId?: number
    ) {
    }
}
