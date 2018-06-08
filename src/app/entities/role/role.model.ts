import { BaseEntity } from './../../shared/model/base-entity';

export class Role implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
    ) {
    }
}
