import { BaseEntity } from './../../shared/model/base-entity';

export class Menu implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
    ) {
    }
}
