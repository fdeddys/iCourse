import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Output() menuNm = new EventEmitter<string>();
  links: object[] = [
    {Name: 'Member', Link: 'member'},
    {Name: 'Biller', Link: 'biller'},
    {Name: 'Product', Link: 'product'},
    {Name: 'Biller Company', Link: 'biller-company'},
    {Name: 'Biller Type', Link: 'biller-type'},
    {Name: 'Member Type', Link: 'member-type'},
    {Name: 'Global Setting', Link: 'global-setting'},
  ];

  constructor() { }

  setMenuName(name: string) {
    // console.log('Name : ',name);
    this.menuNm.emit(name);
  }

}
