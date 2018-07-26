/* import modules so that AppModule can access them */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';
import { AppRoutingModule } from '../../app.routing.module';
import {
    SideBarService,
    SidebarComponent,
    TreeViewComponent
} from './';

@NgModule({
    declarations: [
        SidebarComponent,
        TreeViewComponent
    ],
    imports: [ /* add modules here so Angular knows to use them */
        BrowserModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule,
        AppRoutingModule
    ],
    exports: [
        SidebarComponent,
        TreeViewComponent
    ],
    providers: [
        SideBarService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarModule { }
