import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-biller',
	templateUrl: './biller.component.html',
	styleUrls: ['./biller.component.css']
})
export class BillerComponent implements OnInit {

	displayedColumns = ['memberName', 'memberType', 'dateStart', 'dateThru', 'status'];
	dataSource = ELEMENT_DATA;

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

const ELEMENT_DATA: BillerElement[] = [
	{memberId: 1, memberName: 'Member 1', memberTypeId: 1, memberType: 'Type 1', dateStart: '2018-05-01', dateThru: '2018-05-30', status: 0},
	{memberId: 1, memberName: 'Member 1', memberTypeId: 1, memberType: 'Type 1', dateStart: '2018-05-01', dateThru: '2018-05-30', status: 1}
];
