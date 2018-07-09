import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MainModule } from './main/main.module';
// import { SidebarModule } from './sidebar/sidebar.module';

@NgModule({
    imports: [
        MainModule,
        // SidebarModule,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],

})
export class LayoutModule {}
