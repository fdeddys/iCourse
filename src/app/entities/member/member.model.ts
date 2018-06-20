import { BaseEntity } from './../../shared/model/base-entity';

export class Member implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public protocolType?: any,
        public active?: boolean,
        public nourut?: any,
    ) {
    }
}
