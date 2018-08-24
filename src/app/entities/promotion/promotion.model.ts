import { BaseEntity } from './../../shared/model/base-entity';

export class Promotion implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public type?: number,
        public value?: number,
        public budget?: number,
        public balance?: number,
        public maxPromoAmount?: number,
        public minTransAmount?: number,
        public applyTo?: number,
        public applyToTypeId?: number,
        public applyToCompanyId?: number,
        public applyToProductId?: number,
        public applyToMemberTypeId?: number,
        public onBehalfMemberId?: number,
        public active?: string,
        public dateStart?: string,
        public dateThrough?: string,
        public no?: number,
        public errMsg?: string
    ) {
    }
}
