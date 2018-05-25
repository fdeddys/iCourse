import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './shared/login/login.component';

const routes: Routes = [
    { path: 'main', component: MainComponent },
    { path: 'login', component: LoginComponent },
    { path : '', component : LoginComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }