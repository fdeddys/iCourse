import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Output() menuNm = new EventEmitter<string>();
  links: object[] = [
    // {
    //   name: 'Settings', link: 'settings', icon: 'settings',
    //   subLinks: [
    //     {name: 'Role', link: 'role'},
    //     {name: 'User', link: 'user'},
    //     {name: 'Menu', link: 'menu'},
    //     {name: 'Global Setting', link: 'global-setting'},
    //     {name: 'Change Password', link: 'change-pass'},
    //   ]
    // },
    // {
    //   name: 'Member', link: 'member', icon: 'person',
    //   subLinks: [
    //     {name: 'Member Type', link: 'member-type'},
    //     {name: 'Member Reg', link: 'member'},
    //   ]
    // },
    // {
    //   name: 'Biller', link: 'biller', icon: 'supervisor_account',
    //   subLinks: [
    //     {name: 'Biller Type', link: 'biller-type'},
    //     {name: 'Biller Company', link: 'biller-company'},
    //     {name: 'Biller Product', link: 'product'},
    //   ]
    // },
    // {
    //   name: 'Registration', link: 'biller', icon: 'library_books',
    //   subLinks: [
    //     {name: 'Biller Registration', link: 'biller'},
    //     {name: 'Non Biller Registration', link: 'non-biller'},
    //   ]
    // },

    {
      name: 'Settings', link: 'settings', icon: 'settings',
      subLinks: [
        {
          name: 'User', link: '',
          subLinks: [
            {name: 'Role', link: 'role'},
            {name: 'User', link: 'user'},
          ]
        },
        {
          name: 'Member', link: 'member', icon: 'person',
          subLinks: [
            {name: 'Member Type', link: 'member-type'},
            {name: 'Member Maintenance', link: 'member'},
          ]
        },
        {
          name: 'Biller', link: 'biller', icon: 'supervisor_account',
          subLinks: [
            {name: 'Bill Type', link: 'biller-type'},
            {name: 'Bill Operator', link: 'biller-company'},
            {name: 'Bill Product', link: 'product'},
          ]
        },
        // {name: 'Menu Settings', link: 'menu'},
        {name: 'Global Settings', link: 'global-setting'},
        {name: 'Audit Trail', link: 'audit-trail'},
      ]
    },
    {
      name: 'Biller Maintenance', link: 'biller', icon: 'library_books',
      subLinks: [
        {name: 'Biller', link: 'biller'},
        {name: 'Biller Subscriber', link: 'non-biller'},
      ]
    },

  ];

  constructor() { }

  setMenuName(name: string) {
    // console.log('Name : ', name);
    this.menuNm.emit(name);
  }

}
