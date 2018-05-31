import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-biller',
    templateUrl: './biller.component.html',
    styleUrls: ['./biller.component.css']
})
export class BillerComponent implements OnInit {

    displayedColumns = ['memberName', 'memberType', 'dateStart', 'dateThru', 'status'];
    dataSource = [];

    constructor() { }

    ngOnInit() {
    }

}

export interface BillerElement {
    memberId: Number;
    memberName: string;
    memberTypeId: Number;
    memberType: string;
    dateStart: string;
    dateThru: string;
    status: Number;
}
