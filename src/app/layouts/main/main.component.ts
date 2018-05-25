import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

	opened: boolean;
	constructor() { }

	ngOnInit() {
		this.opened = true;
	}

}
