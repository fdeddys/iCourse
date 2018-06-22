import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../shared/login/login.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

    opened = true;
    menuTitle: string;

    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    onChangeMenu(name: string) {
        this.menuTitle = name;
        // console.log('title : ',this.menuTitle);
    }

    logout() {
        this.loginService.logout();
        this.router.navigate(['']);
    }

}
