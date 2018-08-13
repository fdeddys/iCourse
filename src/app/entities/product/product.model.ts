import { BaseEntity } from './../../shared/model/base-entity';

export class Product implements BaseEntity {
    constructor(
        public id?: number,
        public billerTypeId?: number,
        public billerCompanyId?: number,
        public name?: string,
        public denom?: string,
        public productCode?: string,
        public status?: number,
        public searchBy?: string,
        public searchByBillerId?: number,
        public no?: number,
        public errMsg?: string
    ) {
    }
}
