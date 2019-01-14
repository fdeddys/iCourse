import { BaseEntity } from './../../shared/model/base-entity';

export class Room implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public status?: any,
        public errCode?: string,
        public errDesc?: string,
    ) {
    }
}
