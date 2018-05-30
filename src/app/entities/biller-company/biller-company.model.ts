import { BaseEntity } from './../../shared/model/base-entity';

export class BillerCompany implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
    ) {
    }
}
