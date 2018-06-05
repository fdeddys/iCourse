import { BaseEntity } from './../../shared/model/base-entity';
import { Member } from '../member';
import { GlobalSetting } from '../global-setting';
// import { Member } from '../member';

export class MemberBank implements BaseEntity {
    constructor(
        public id?: number,
        public accountNumber?: string,
        public globalSetting?: GlobalSetting,
        public member?: Member,
    ) {
        // member = new Member();
    }
}
