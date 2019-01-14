import { BaseEntity } from './../../shared/model/base-entity';

export class OutletGroup implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public nourut?: number,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}
