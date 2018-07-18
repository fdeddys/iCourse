import { BaseEntity } from './../../shared/model/base-entity';

export class GlobalSetting implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: boolean,
        public globalType?: any,
        public nourut?: any,
        public errMsg?: any,
    ) {
    }
}
