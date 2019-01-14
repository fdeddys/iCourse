import { BaseEntity } from './../../shared/model/base-entity';
import { Outlet } from '../outlet';

export class User implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public email?: string,
        public password?: string,
        public status?: number,
        public nourut?: number,
        public oldPass?: string,
        public errMsg?: string,
        public firstName?: string,
        public lastName?: string,
        public outlet?: Outlet,
        public outletId?: string,
        // public rememberToken?: string,
    ) {
    }
}
