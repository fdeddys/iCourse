import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import {
    MemberComponent,
} from './';

@NgModule({
    imports: [],
    declarations: [
        MemberComponent,
    ],
    entryComponents: [
        MemberComponent,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MemberModule {}
