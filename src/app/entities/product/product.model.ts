import { BaseEntity } from './../../shared/model/base-entity';

export class Product implements BaseEntity {
    constructor(
        public id?: number,
        public id_biller_type?: number,
        public id_biller_company?: number,
        public name?: string,
        public denom?: string,
        public sales_price?: number,
        public status?: number,
        public search_by?: number,
        public search_by_biller_id?: number,
    ) {
    }
}
