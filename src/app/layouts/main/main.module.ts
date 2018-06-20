/* import modules so that AppModule can access them */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SidebarModule } from '../sidebar/sidebar.module';
import { MainComponent } from './main.component';

@NgModule({
 declarations: [
 MainComponent
 ],
imports: [ /* add modules here so Angular knows to use them */
  BrowserModule,
  SidebarModule
 ],
 providers: []
})

export class MainModule { }
