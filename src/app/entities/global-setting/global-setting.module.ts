import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    GlobalSettingService,
    GlobalSettingComponent,
    GlobalSettingDialogComponent,
    GlobalSettingConfirmComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        GlobalSettingComponent,
        GlobalSettingDialogComponent,
        GlobalSettingConfirmComponent
    ],
    entryComponents: [
        GlobalSettingComponent,
        GlobalSettingDialogComponent,
        GlobalSettingConfirmComponent
    ],
    providers: [
        GlobalSettingService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GlobalSettingModule {}
