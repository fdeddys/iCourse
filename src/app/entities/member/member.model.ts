import { BaseEntity } from './../../shared/model/base-entity';

export class Member implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public protocolType?: any,
        public active?: any,
        public nourut?: any,
        public errMsg?: any,
    ) {
    }
}
