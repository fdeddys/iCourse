import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './shared/login/login.component';
import { Error404Component } from './shared/404/404.component';
import { MemberComponent } from './entities/member/member.component';
import { BillerComponent } from './entities/biller/biller.component';
import { ProductComponent } from './entities/product/product.component';
import { BillerCompanyComponent } from './entities/biller-company/biller-company.component';
import { BillerTypeComponent } from './entities/biller-type';
import { MemberTypeComponent } from './entities/member-type';
import { GlobalSettingComponent } from './entities/global-setting';
import { UserComponent, UserUpdatePasswordComponent } from './entities/user';
import { RoleComponent } from './entities/role/role.component';
import { MenuComponent } from './entities/menu';
import { AuditTrailComponent } from './entities/audit-trail';
import { AccessMatrixComponent } from './entities/access-matrix';
import { ResponseCode, ResponseCodeComponent } from './entities/response-code';
import { TransTypeComponent } from './entities/transaction-type';
import { TransListComponent } from './entities/transaction-list';
import { DepositHistoryComponent } from './entities/deposit-history';
import { DepositComponent } from './entities/deposit';


const routes: Routes = [
    { path : '', component : LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: '404', component: Error404Component },
    {
        path: 'main',
        component: MainComponent,
        children: [
            {path: '404', component: Error404Component},
            {path: 'member', component: MemberComponent},
            {path: 'biller', component: BillerComponent},
            {path: 'non-biller', component: BillerComponent},
            {path: 'product', component: ProductComponent},
            {path: 'biller-company', component: BillerCompanyComponent},
            {path: 'biller-type', component: BillerTypeComponent},
            {path: 'member-type', component: MemberTypeComponent},
            {path: 'global-setting', component: GlobalSettingComponent},
            {path: 'user', component: UserComponent},
            {path: 'role', component: RoleComponent},
            {path: 'menu', component: MenuComponent },
            {path: 'change-pass', component: UserUpdatePasswordComponent},
            {path: 'audit-trail', component: AuditTrailComponent},
            {path: 'access-matrix', component: AccessMatrixComponent},
            {path: 'trans-type', component: TransTypeComponent},
            {path: 'response-code', component: ResponseCodeComponent},
            {path: 'response-code-internal', component: ResponseCodeComponent},
            {path: 'transaction', component: TransListComponent},
            {path: 'transaction-adjust', component: TransListComponent},
            {path: 'deposit-history', component: DepositHistoryComponent},
            {path: 'manual-deposit', component: DepositComponent},
            {path: 'manual-refund', component: DepositComponent},
        ]
    },
    { path: '**', redirectTo: '/main/404', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {useHash: true})
        // RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
