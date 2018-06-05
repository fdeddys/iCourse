import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Output() menuNm = new EventEmitter<string>();
  links: object[] = [
    {
      name: 'Member', link: 'member',
      subLinks: [
        {name: 'Member', link: 'member'},
        {name: 'Member Type', link: 'member-type'}
      ]
    },
    {
      name: 'Biller', link: 'biller',
      subLinks: [
        {name: 'Product', link: 'product'},
        {name: 'Biller Company', link: 'biller-company'},
        {name: 'Biller Type', link: 'biller-type'},
      ]
    },
    {
      Name: 'Setting', Link: 'settings',
      subLinks: [
        {name: 'Global Setting', link: 'global-setting'},
      ]
    },
  ];

  constructor() { }

  setMenuName(name: string) {
    // console.log('Name : ',name);
    this.menuNm.emit(name);
  }

}
