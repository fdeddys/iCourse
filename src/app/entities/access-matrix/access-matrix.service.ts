import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';
import * as _ from 'lodash';

import { BehaviorSubject } from 'rxjs';
import { ItemNode } from './item-node.model';
import { MenuNode } from './menu-node.model';
import { AccessMatrixMenu } from './access-matrix.model';

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
    Groceries: {
        'Almond Meal flour': null,
        'Organic eggs': null,
        'Protein Powder': null,
        Fruits: {
            Apple: null,
            Berries: ['Blueberry', 'Raspberry'],
            Orange: null
        }
    },
    Reminders: [
        'Cook dinner',
        'Read the Material Design spec',
        'Upgrade Application to Angular'
    ]
};

const linksArr = [
    {id: 1, parentId: null, name: 'Settings'},
    {id: 2, parentId: 1, name: 'User'},
    {id: 3, parentId: 2, name: 'Role'},
    {id: 4, parentId: 2, name: 'User'},
    {id: 5, parentId: 1, name: 'Member'},
    {id: 6, parentId: 5, name: 'Member Type'},
    {id: 7, parentId: 5, name: 'Member Maintenance'},
    {id: 8, parentId: 1, name: 'Biller'},
    {id: 9, parentId: 8, name: 'Bill Type'},
    {id: 10, parentId: 8, name: 'Bill Operator'},
    {id: 11, parentId: 8, name: 'Bill Product'},
    {id: 12, parentId: 1, name: 'Global Settings'},
    {id: 13, parentId: 1, name: 'Audit Trail'},
    {id: 14, parentId: null, name: 'Biller Maintenance'},
    {id: 15, parentId: 14, name: 'Biller'},
    {id: 16, parentId: 14, name: 'Biller Subscriber'}
];

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class AccessMatrixService {
    private resourceUrl =  SERVER_PATH + 'menu';
    // unremark
    // dataChange = new BehaviorSubject<ItemNode[]>([]);
    dataChange = new BehaviorSubject<MenuNode[]>([]);

    // unremark
    // get data(): ItemNode[] { return this.dataChange.value; }
    get data(): MenuNode[] { return this.dataChange.value; }

    constructor(
        private http: HttpClient
    ) {
        this.initialize();
    }

    initialize() {
        // Build the tree nodes from Json object. The result is a list of `ItemNode` with nested
        // file node as children.
        // unremark
        // const data = this.buildFileTree(TREE_DATA, 0);
        // const data = this.createTree(linksArr);
        // console.log('data tree : ', data);

        // // Notify the change.
        // this.dataChange.next(data);

        this.query({})
        .subscribe(
                (res: HttpResponse<AccessMatrixMenu[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    query(req?: any): Observable<HttpResponse<AccessMatrixMenu[]>> {
        const options = createRequestOption(req);
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;
        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });
        if (pageNumber !== null ) {
            newresourceUrl = this.resourceUrl + `/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<AccessMatrixMenu[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                    tap(accessMatrixMenu => console.log('raw ', accessMatrixMenu ) )
                        // console.log('observable ', accessMatrixMenu)
                    );
        } else {
            return this.http.get<AccessMatrixMenu[]>(`${this.resourceUrl}/list-all-active-menu`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                tap(accessMatrixMenu => console.log('raw ', accessMatrixMenu ) )
                    // console.log('observable ', accessMatrixMenu)
                );
        }

    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `ItemNode`.
     */
    buildFileTree(obj: object, level: number): ItemNode[] {
        return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
            const value = obj[key];
            const node = new ItemNode();
            node.item = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.item = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    }

    createTree(arr): MenuNode[] {
        const nodes = {};
        return arr.filter(function(obj) {
            const id = obj['id'], parentId = obj['parentId'];

            nodes[id] = _.defaults(obj, nodes[id], { children: [] });
            // tslint:disable-next-line:no-unused-expression
            parentId && (nodes[parentId] = (nodes[parentId] || { children: [] }))['children'].push(obj);

            return !parentId;
        });
    }

    private onSuccess(data, headers) {
        const menudata = this.createTree(data);
        console.log('data tree : ', menudata);

        // Notify the change.
        this.dataChange.next(menudata);
    }

    private onError(error) {
        console.log('error..');
    }

    /** Add an item to list */
    // insertItem(parent: ItemNode, name: string) {
    //     if (parent.children) {
    //         parent.children.push({item: name} as ItemNode);
    //         this.dataChange.next(this.data);
    //     }
    // }

    // updateItem(node: ItemNode, name: string) {
    //     node.item = name;
    //     this.dataChange.next(this.data);
    // }
}
