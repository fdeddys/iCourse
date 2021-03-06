import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2Webstorage, LocalStorageService, SessionStorageService  } from 'ngx-webstorage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// import { MainService } from './layouts/main/main.service';
import { SharedService } from './shared/services/shared.service';
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
// import { MainComponent } from './layouts/main/main.component';
// import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { LoginComponent } from './shared/login/login.component';
import { Error404Component } from './shared/404/404.component';
import { MatCheckboxComponent } from './shared/templates/mat-checkbox.component';
import { MatActionButtonComponent } from './shared/templates/mat-action-button.component';
import { MatActionDeleteButtonComponent } from './shared/templates/mat-action-delete-button.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { EntityModule } from './entities/entity.module';
import { LayoutModule } from './layouts/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonValidatorDirective } from './validators/common.validator';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        // MainComponent,
        // SidebarComponent,
        LoginComponent,
        Error404Component,
        MatCheckboxComponent,
        MatActionButtonComponent,
        MatActionDeleteButtonComponent,
        CommonValidatorDirective
    ],
    entryComponents: [
        MatActionDeleteButtonComponent,
        MatActionButtonComponent,
    ],
    imports: [
        BrowserModule,
        NgbModule.forRoot(),
        FormsModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        AppRoutingModule,
        // AgGridModule.withComponents([]),
        HttpClientModule,
        EntityModule,
        LayoutModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        // MainService,
        SharedService,
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
