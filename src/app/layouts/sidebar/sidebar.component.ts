import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';

import { SharedService } from '../../shared/services/shared.service';
import { UserMenu } from './usermenu.model';
import { SideBarService } from './sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

    @Output() menuNm = new EventEmitter<string>();
    links: object[] = [];

    constructor(
        private sharedService: SharedService,
        private sidebarService: SideBarService
    ) { }

    ngOnInit(): void {
        // console.log('init..');
        this.sidebarService.queryMenu()
        .subscribe(
                (res: HttpResponse<UserMenu[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { }
        );
    }

    // setMenuName(name: string) {
    //     // console.log('Name : ', name);
    //     this.menuNm.emit(name);
    // }

    setUserMenu(arr) {
        // console.log('setUserMenu..');
        this.links = this.createTree(arr);
        // console.log(this.links);
    }

    createTree(arr) {
        // console.log('create tree..');
        const nodes = {};
        return arr.filter(function(obj) {
            const id = obj['id'], parentId = obj['parentId'];

            nodes[id] = _.defaults(obj, nodes[id], { subLinks: [] });
            // tslint:disable-next-line:no-unused-expression
            parentId && (nodes[parentId] = (nodes[parentId] || { subLinks: [] }))['subLinks'].push(obj);

            return !parentId;
        });
    }

    private onSuccess(data, headers) {
        // console.log('success get user menu..', data);
        this.setUserMenu(data);
    }

    private onError(error) {
        console.log('error..');
    }

}
