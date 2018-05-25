import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	links: string[];
	constructor() { }

	ngOnInit() {
		this.links = ['menu 1', 'menu 2', 'menu 3'];
	}

}
