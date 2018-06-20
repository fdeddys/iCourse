import { BaseEntity } from './../../shared/model/base-entity';

export class Role implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public nourut?: number,
    ) {
    }
}

export class RoleMenuView {
    constructor(
        public menuId?: number,
        public status?: string,
        public menuDescription?: string,
        public nourut?: number,
    ) {
    }
}
