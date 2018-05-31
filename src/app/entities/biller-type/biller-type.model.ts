import { BaseEntity } from './../../shared/model/base-entity';

export class BillerType implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public ispostpaid?: any,
    ) {
    }
}
