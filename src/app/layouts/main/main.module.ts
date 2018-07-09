/* import modules so that AppModule can access them */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';
import { AppRoutingModule } from '../../app.routing.module';

import { SidebarModule } from '../sidebar/sidebar.module';

import {
    MainService,
    MainComponent
} from './';

@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [ /* add modules here so Angular knows to use them */
        BrowserModule,
        SidebarModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule,
        AppRoutingModule
    ],
    providers: [
        MainService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MainModule { }
