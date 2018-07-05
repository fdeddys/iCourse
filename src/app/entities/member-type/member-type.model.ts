import { BaseEntity } from './../../shared/model/base-entity';

export class MemberType implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: boolean,
        public nourut?: any,
        public errMsg?: any,
    ) {
    }
}
