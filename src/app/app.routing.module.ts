import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './shared/login/login.component';
import { MemberComponent } from './entities/member/member.component';
import { BillerComponent } from './entities/biller/biller.component';
import { ProductComponent } from './entities/product/product.component';

const routes: Routes = [
    { path : '', component : LoginComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'main', 
        component: MainComponent,
        children: [
            {path: 'member', component: MemberComponent},
            {path: 'biller', component: BillerComponent},
            {path: 'product', component: ProductComponent}
        ]
    },
    // {path: 'member', component: MemberComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }