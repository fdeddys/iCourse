import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BillerModule } from './biller/biller.module';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { BillerCompanyModule } from './biller-company/biller-company.module';

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        BillerModule,
        MemberModule,
        ProductModule,
        BillerCompanyModule,
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EntityModule {}
