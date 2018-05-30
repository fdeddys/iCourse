import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CustomMaterialModule } from './../../material.module';

import {
    BillerComponent,
} from './';

@NgModule({
    imports: [
        CustomMaterialModule
    ],
    declarations: [
        BillerComponent,
    ],
    entryComponents: [
        BillerComponent,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerModule {}
