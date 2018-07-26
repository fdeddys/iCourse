import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';

import { SharedService } from '../../shared/services/shared.service';
import { UserMenu } from './usermenu.model';
import { SideBarService } from './sidebar.service';

@Component({
    selector: 'app-sidebar',
    // open remark below to rollback to previous version
    // templateUrl: './sidebar.component.html',
    //
    // remark below to rollback to previous version
    template: '<div style="padding-top: 8px;"><app-tree-view [links]="links"></app-tree-view></div>',
    //
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
        // remark below to previous version
        this.levelAndSort(arr, 1);
        //
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

    levelAndSort(data, startingLevel) {
        // indexes
        const indexed = {};        // the original values
        const nodeIndex = {};      // tree nodes
        let i;
        for (i = 0; i < data.length; i++) {
            const id = data[i].id;
            const xnode = {
                id: id,
                level: startingLevel,
                children: [],
                sorted: false
            };
            indexed[id] = data[i];
            nodeIndex[id] = xnode;
        }

        // populate tree
        for (i = 0; i < data.length; i++) {
            const node = nodeIndex[data[i].id];
            let pNode = node;
            let j;
            let nextId = indexed[pNode.id].parentId;
            for (j = 0; nextId in nodeIndex; j++) {
                pNode = nodeIndex[nextId];
                if (j === 0) {
                    pNode.children.push(node.id);
                }
                node.level++;
                nextId = indexed[pNode.id].parentId;
            }
        }

        // extract nodes and sort-by-level
        const nodes = [];
        // tslint:disable-next-line:forin
        for (const key in nodeIndex) {
            nodes.push(nodeIndex[key]);
        }
        nodes.sort(function(a, b) {
            return a.level - b.level;
        });

        // refine the sort: group-by-siblings
        const retval = [];
        for (i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const parentId = indexed[node.id].parentId;
            if (parentId in indexed) {
                const pNode = nodeIndex[parentId];
                let j;
                for (j = 0; j < pNode.children.length; j++) {
                    const child = nodeIndex[pNode.children[j]];
                    if (!child.sorted) {
                        indexed[child.id].level = child.level;
                        retval.push(indexed[child.id]);
                        child.sorted = true;
                    }
                }
            } else if (!node.sorted) {
                indexed[node.id].level = node.level;
                retval.push(indexed[node.id]);
                node.sorted = true;
            }
        }
        return retval;
    }

    private onSuccess(data, headers) {
        // console.log('success get user menu..', data);
        this.setUserMenu(data);
    }

    private onError(error) {
        console.log('error..');
    }

}
