import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService  } from 'ngx-webstorage';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { CdkTableModule } from '@angular/cdk/table';
import { CustomMaterialModule } from './material.module';
import { AppRoutingModule } from './app.routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MainComponent } from './layouts/main/main.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './shared/login/login.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';

import { HttpClientModule } from '@angular/common/http';
import { EntityModule } from './entities/entity.module';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        SidebarComponent,
        LoginComponent,
        NavbarComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        AppRoutingModule,
        // AgGridModule.withComponents([]),
        HttpClientModule,
        EntityModule
    ],
    providers: [
        // {
        //     provide: HTTP_INTERCEPTORS,
        //     useClass: AuthInterceptor,
        //     multi: true,
        //     deps: [
        //         LocalStorageService,
        //         SessionStorageService
        //     ]
        // }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
