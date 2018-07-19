import { BaseEntity } from './../../shared/model/base-entity';

export class TransType implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public no?: any,
        public errMsg?: any,
    ) {
    }
}
