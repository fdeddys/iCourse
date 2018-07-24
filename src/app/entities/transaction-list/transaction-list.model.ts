import { BaseEntity } from './../../shared/model/base-entity';

export class TransList implements BaseEntity {
    constructor(
        public id?: number,
        public requestor?: any,
        public responder?: any,
        public transType?: any,
        public billerProduct?: any,
        public buyPrice?: number,
        public fee?: number,
        public profitRtsm?: number,
        public sellPrice?: number,
        public sellPriceFromTable?: number,
        public promotionId?: number,
        public amount?: number,
        public transmissionDateTime?: string,
        public stan?: number,
        public rrn?: string,
        public rrnRequestor?: string,
        public rcInternal?: string,
        public rcRequestor?: string,
        public rcResponder?: string,
        public tsRcvRequestor?: string,
        public tsSndRequestor?: string,
        public tsRcvResponder?: string,
        public tsSndResponder?: string,
        public msg_rcv_requestor?: string,
        public msg_snd_requestor?: string,
        public msg_snd_responder?: string,
        public msg_rcv_responder?: string,
        public no?: any,
        public errMsg?: any,
    ) {
    }
}
