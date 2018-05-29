import { Component } from '@angular/core';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent {
	
	opened: boolean = true;
	menuTitle: string;

	constructor() { }

	onChangeMenu(name: string) {
		this.menuTitle = name;
		// console.log('title : ',this.menuTitle);
	}

}
