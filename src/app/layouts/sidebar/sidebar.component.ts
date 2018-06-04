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
        {name: 'Member Type', link: 'memberType'}
      ]
    },
    {
      name: 'Biller', link: 'biller',
      subLinks: [
        {name: 'Product', link: 'product'},
        {name: 'Biller', link: 'biller'},
        {name: 'Biller Company', link: 'biller-company'},
        {name: 'Biller Type', link: 'biller-type'},
      ]
    },
    {name: 'Global Setting', link: 'global-setting'},
  ];

  constructor() { }

  setMenuName(name: string) {
    // console.log('Name : ',name);
    this.menuNm.emit(name);
  }

}
