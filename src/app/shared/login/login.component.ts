import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	password: string;
    rememberMe: boolean;
    username: string;

    hide: boolean;

	constructor(private router: Router) { }

	ngOnInit() {
		this.hide = true;
	}

	login() {
		console.log('login');
		if(this.username == 'admin' && this.password == 'admin'){
			console.log('masuk admin..');
			this.router.navigate(["main"]);
		}else {
			alert("Invalid credentials");
		}
	}

}
