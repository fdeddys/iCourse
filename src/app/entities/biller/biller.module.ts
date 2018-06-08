import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    BillerService,
    BillerComponent,
    BillerDialogComponent
} from './';

import { BillerDetailComponent } from '../biller-detail/biller-detail.component';
import { MatCheckboxComponent } from '../../shared/templates/mat-checkbox.component';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([MatCheckboxComponent, MatActionButtonComponent]),
        CustomMaterialModule
    ],
    declarations: [
        BillerComponent,
        BillerDialogComponent
    ],
    entryComponents: [
        BillerComponent,
        BillerDialogComponent
    ],
    providers: [
        BillerService,
        LocalStorageService,
        SessionStorageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerModule {}
