import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BillerModule } from './biller/biller.module';
import { MemberModule } from './member/member.module';
import { ProductModule } from './product/product.module';
import { BillerCompanyModule } from './biller-company/biller-company.module';
import { BillerTypeModule } from './biller-type/biller-type.module';
import { MemberTypeModule } from './member-type/member-type.module';
import { GlobalSettingModule } from './global-setting/global-setting.module';
import { BillerDetailModule } from './biller-detail/biller-detail.module';
import { BillerPriceDetailModule } from './biller-price-detail/biller-price-detail.module';
import { MemberBankModule } from './member-bank/member-bank.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';


@NgModule({
    imports: [
        BillerModule,
        MemberModule,
        ProductModule,
        BillerCompanyModule,
        BillerTypeModule,
        MemberTypeModule,
        GlobalSettingModule,
        MemberBankModule,
        BillerDetailModule,
        BillerPriceDetailModule,
        UserModule,
        RoleModule
    ],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],

})
export class EntityModule {}
