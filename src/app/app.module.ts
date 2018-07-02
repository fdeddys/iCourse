import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService  } from 'ngx-webstorage';

import { MainService } from './layouts/main/main.service';
import { LoginService } from './shared/login/login.service';
import { AccountService } from './shared/auth/account.service';
import { AuthServerProvider } from './shared/auth/auth-jwt.service';
import { Principal } from './shared/auth/principal.service';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { CdkTableModule } from '@angular/cdk/table';
import { CustomMaterialModule } from './material.module';
import { AppRoutingModule } from './app.routing.module';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MainComponent } from './layouts/main/main.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './shared/login/login.component';
import { MatCheckboxComponent } from './shared/templates/mat-checkbox.component';
import { MatActionButtonComponent } from './shared/templates/mat-action-button.component';

import { HttpClientModule } from '@angular/common/http';
import { EntityModule } from './entities/entity.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        SidebarComponent,
        LoginComponent,
        MatCheckboxComponent,
        MatActionButtonComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        AppRoutingModule,
        // AgGridModule.withComponents([]),
        HttpClientModule,
        EntityModule,
        ReactiveFormsModule
    ],
    providers: [
        MainService,
        LoginService,
        AccountService,
        AuthServerProvider,
        Principal,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
