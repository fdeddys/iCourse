import { BaseEntity } from './../../shared/model/base-entity';

export class AuditTrail implements BaseEntity {
    constructor(
        public id?: number,
        public insertDate?: string,
        public userInput?: string,
        public authorizationDate?: string,
        public userSupervisor?: string,
        public data?: string,
        public description?: string,
        public activity?: string,
        public status?: string,
        public refNo?: string,
        public beforeValue?: string,
        public afterValue?: string,
        public nourut?: any,
    ) {
    }
}
