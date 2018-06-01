import { BaseEntity } from './../../shared/model/base-entity';

export class Product implements BaseEntity {
    constructor(
        public id?: number,
        public billerTypeId?: number,
        public billerCompanyId?: number,
        public name?: string,
        public denom?: string,
        public sellPrice?: number,
        public status?: number,
        public searchBy?: number,
        public searchByMemberId?: number,
    ) {
    }
}
