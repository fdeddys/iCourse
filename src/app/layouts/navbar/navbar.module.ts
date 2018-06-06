/* import modules so that AppModule can access them */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NavbarComponent } from './navbar.component';

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [ /* add modules here so Angular knows to use them */
        BrowserModule
    ],
    exports: [
        NavbarComponent
    ],
    providers: []
})
export class NavbarModule { }
