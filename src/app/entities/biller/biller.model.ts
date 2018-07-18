import { BaseEntity } from './../../shared/model/base-entity';

export class Biller implements BaseEntity {
    constructor(
        public id?: number,
        public description?: string,
        public dateStart?: string,
        public dateThru?: string,
        public dateStartLocDt?: string,
        public dateThruLocDt?: string,
        public memberTypeId?: number,
        public memberId?: number,
        public manualCode?: boolean,
        public memberCode?: string,
        public no?: number,
        public errMsg?: any,
    ) {
    }
}
