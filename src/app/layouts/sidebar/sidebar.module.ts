/* import modules so that AppModule can access them */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SidebarComponent } from './sidebar.component';

@NgModule({
    declarations: [
        SidebarComponent
    ],
    imports: [ /* add modules here so Angular knows to use them */
        BrowserModule,
    ],
    exports: [
        SidebarComponent
    ],
    providers: []
})
export class SidebarModule { }
