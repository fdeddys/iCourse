import { BaseEntity } from './../../shared/model/base-entity';
import { OutletGroup } from '../outlet-group';

export class Outlet implements BaseEntity {
    constructor(
        public id?: number,
        public groupOutlet?: OutletGroup,
        public name?: string,
        public address1?: string,
        public address2?: string,
        public registrationFee?: number,
        public groupOutletId?: any,
        public errCode?: any,
        public errDesc?: any,
        public nourut?: any,
    ) {
    }
}
