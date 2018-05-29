import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import { CdkTableModule } from '@angular/cdk/table';
import { CustomMaterialModule } from './material.module';
import { AppRoutingModule } from './app.routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FlexLayoutModule } from "@angular/flex-layout";


import { AppComponent } from './app.component';
import { MainComponent } from './layouts/main/main.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './shared/login/login.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { MemberComponent } from './entities/member/member.component';
import { BillerComponent } from './entities/biller/biller.component';
import { ProductComponent } from './entities/product/product.component';

@NgModule({
	declarations: [
		AppComponent,
		MainComponent,
		SidebarComponent,
		LoginComponent,
		NavbarComponent,
		MemberComponent,
		BillerComponent,
		ProductComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
    	BrowserAnimationsModule,
    	CustomMaterialModule,
    	AppRoutingModule,
    	AgGridModule.withComponents([])
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
