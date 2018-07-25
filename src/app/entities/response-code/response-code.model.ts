import { BaseEntity } from './../../shared/model/base-entity';
import { Member } from '../member';

export class ResponseCode implements BaseEntity {
    constructor(
        public id?: number,
        public responseCode?: string,
        public description?: string,
        public billerHeaderId?: number,
        public nourut?: any,
        public errMsg?: any,
        public responseCodeInternalId?: number,
    ) {
    }
}
