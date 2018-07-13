import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatSnackBar } from '@angular/material';
import * as lod from 'lodash';

import { AccessMatrixService } from './access-matrix.service';
import { RoleService, Role, RoleMenuView } from '../role/';
import { MenuService } from '../menu';

import { ItemNode } from './item-node.model';
import { MenuNode } from './menu-node.model';
import { ItemFlatNode } from './item-flat-node.model';
import { MenuFlatNode } from './menu-flat-node.model';
import { Observable, of as observableOf } from 'rxjs';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TOTAL_RECORD_PER_PAGE, SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

/**
 * @title Tree with checkboxes
 */
@Component({
    selector: 'app-access-matrix',
    templateUrl: './access-matrix.component.html',
    styleUrls: ['./access-matrix.component.css'],
})
export class AccessMatrixComponent implements OnInit {
    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    // unremark
    // flatNodeMap = new Map<ItemFlatNode, ItemNode>();
    //
    flatNodeMap = new Map<MenuFlatNode, MenuNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    // unremark
    // nestedNodeMap = new Map<ItemNode, ItemFlatNode>();
    //
    nestedNodeMap = new Map<MenuNode, MenuFlatNode>();

    /** A selected parent node to be inserted */
    selectedParent: MenuFlatNode | null = null;

    /** The new item's name */
    newItemName = '';

    treeControl: FlatTreeControl<MenuFlatNode>;

    // unremark
    // treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
    //
    treeFlattener: MatTreeFlattener<MenuNode, MenuFlatNode>;

    // unremark
    // dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;
    //
    dataSource: MatTreeFlatDataSource<MenuNode, MenuFlatNode>;

    /** The selection for checklist */
    // unremark
    // checklistSelection = new SelectionModel<ItemFlatNode>(true /* multiple */);
    //
    checklistSelection = new SelectionModel<MenuFlatNode>(true /* multiple */);

    roles: Role[];
    curPage = 1;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    clonedData = [];

    filter = {
        roleId: null
    };

    constructor(
        private accessMatrixService: AccessMatrixService,
        private roleService: RoleService,
        private menuService: MenuService,
        public snackBar: MatSnackBar,
    ) {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
            this.isExpandable, this.getChildren);
        // unremark
        // this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
        //
        this.treeControl = new FlatTreeControl<MenuFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        accessMatrixService.dataChange.subscribe(data => {
            this.dataSource.data = data;
            const cdata = lod.clone(data);
            this.clonedData = this.treeFlattener.flattenNodes(cdata);
            this.treeControl.expandAll();
        });
    }

    ngOnInit() {
        this.roleService.query({
            page: this.curPage,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<Role[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

        // this.treeControl.expandAll();
    }

    // unremark
    // getLevel = (node: ItemFlatNode) => node.level;
    //
    getLevel = (node: MenuFlatNode) => node.level;

    // unremark
    // isExpandable = (node: ItemFlatNode) => node.expandable;
    //
    isExpandable = (node: MenuFlatNode) => node.expandable;

    // getChildren = (node: ItemNode): ItemNode[] => node.children;

    // unremark
    // getChildren = (node: ItemNode): Observable<ItemNode[]> => observableOf(node.children);
    //
    getChildren = (node: MenuNode): Observable<MenuNode[]> => observableOf(node.children);

    // unremark
    // hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;
    //
    hasChild = (_: number, _nodeData: MenuFlatNode) => _nodeData.expandable;

    // hasNoContent = (_: number, _nodeData: ItemFlatNode) => _nodeData.item === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    // unremark
    // transformer = (node: ItemNode, level: number) => {
    //
    transformer = (node: MenuNode, level: number) => {
        // unremark
        // const existingNode = this.nestedNodeMap.get(node);
        // const flatNode = existingNode && existingNode.item === node.name
        //     ? existingNode
        //     : new ItemFlatNode();
        // flatNode.item = node.name;
        //
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.name === node.name
            ? existingNode
            : new MenuFlatNode();
        flatNode.id = node.id;
        flatNode.name = node.name;
        flatNode.description = node.description;
        flatNode.level = level;
        flatNode.expandable = !!node.children && node.children.length > 0;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    /** Whether all the descendants of the node are selected */
    // unremark
    // descendantsAllSelected(node: ItemFlatNode): boolean {
    //
    descendantsAllSelected(node: MenuFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    // unremark
    // descendantsPartiallySelected(node: ItemFlatNode): boolean {
    //
    descendantsPartiallySelected(node: MenuFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    // unremark
    // itemSelectionToggle(node: ItemFlatNode): void {
    //
    itemSelectionToggle(node: MenuFlatNode): void {
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);
    }

    /** Select the category so we can insert the new item. */
    // addNewItem(node: ItemFlatNode) {
    //     const parentNode = this.flatNodeMap.get(node);
    //     this.accessMatrixService.insertItem(parentNode, '');
    //     this.treeControl.expand(node);
    // }

    /** Save the node to database */
    // saveNode(node: ItemFlatNode, itemValue: string) {
    //     const nestedNode = this.flatNodeMap.get(node);
    //     this.accessMatrixService.updateItem(nestedNode, itemValue);
    // }

    searchByRole() {
        if (this.filter.roleId !== null) {
            console.log('role id !== null');
            this.menuService.findByRole(this.filter.roleId)
            .subscribe(
                (res: HttpResponse<RoleMenuView[]>) => {
                    this.onSuccessByRole(res.body, res.headers);
                    // this.menuRegistered = res.body.content;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );
        }
    }

    saveMenuAccess() {
        // get all selected nodes
        console.log(this.checklistSelection.selected);
        const saveArr = [];
        this.checklistSelection.selected.forEach(el => {
            saveArr.push(el.id);
        });
        console.log(saveArr);
        this.accessMatrixService.save({
            roleId: this.filter.roleId,
            menuIds: saveArr
        })
        .subscribe((res: HttpResponse<any>) => {
            console.log('save success..');
            if (res.body.errMsg === '' || res.body.errMsg === null) {
                // this.openSnackBar('Save success', 'Done');
                // console.log('refresh data ');
                this.openSnackBar(res.body.errMsg, 'Ok');
            } else {
                // this.openSnackBar(res.body.errMsg, 'Ok');
                this.openSnackBar('Save success', 'Done');
                console.log('refresh data ');
            }
        },
        (res: HttpErrorResponse) => {
            this.snackBar.open('Error !' + res.error.message , 'Close', {
                duration: 10000,
            });
            console.log('error msh ', res.error.message);
        });
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: this.duration,
        });
    }

    private onSuccess(data, headers) {
        if ( data.content.length <= 0 ) {
            return ;
        }
        this.roles = data.content;
        console.log('this.roles : ', this.roles);
    }

    private onSuccessByRole(data, headers) {
        this.clonedData.forEach(element => {
            if (element.expandable === false) {
                this.checklistSelection.deselect(element);
            }
        });

        if ( data.length <= 0 ) {
            return ;
        }
        console.log('data by role : ', data);

        const selArr = [];
        data.forEach(element => {
            const temp = lod.find(this.clonedData, function(o) { return o.id === element.menuId; });
            if (temp !== undefined) {
                selArr.push(temp);
            }
        });
        console.log(selArr);
        selArr.forEach(element => {
            if (element.expandable === false) {
                this.checklistSelection.select(element);
            }
        });
    }

    private onError(error) {
        console.log('error..');
    }
}
