import { BaseEntity } from './../../shared/model/base-entity';

export class User implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public password?: string,
        public status?: number,
        public rememberToken?: string,
    ) {
    }
}
