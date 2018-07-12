import { BaseEntity } from './../../shared/model/base-entity';

export class BillerDetail implements BaseEntity {
    constructor(
        public id?: number,
        public externalCode?: string,
        public buyPrice?: number,
        public fee?: number,
        public profit?: number,
        public sellPrice?: number,
        public billerHeaderId?: number,
        public billerProductId?: number,
        public billPayType?: string,
        public status?: string
    ) {
    }
}
