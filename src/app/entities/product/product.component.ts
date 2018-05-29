import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

	// displayedColumns = ['name', 'denom', 'sales_price', 'status'];
	// dataSource = ELEMENT_DATA;

	gridOptions = {
		columnDefs: [
	        // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
	        { headerName: 'Name', field: 'name', width: 250, pinned: 'left', editable: false },
	        { headerName: 'Denom', field: 'denom', width: 250, editable: false },
	        { headerName: 'Sales Price', field: 'sales_price', width: 250 },
	        { headerName: 'Status', field: 'status', width: 250 },
	        { headerName: 'Search By', field: 'search_by', width: 250 },
	        { headerName: 'Search By Biller', field: 'search_by_biller_id', width: 250 }
	    ],
	    rowData: ELEMENT_DATA,
	    enableSorting: true,
	    enableFilter: true,
    	// rowSelection: "multiple"
    	pagination: true,
    	paginationPageSize: 10
	};

	constructor() { }

	ngOnInit() {
	}

}

export interface ProductElement {
	id: Number;
	id_biller_type: Number;
	id_biller_company: Number;
	name: string;
	denom: string;
	sales_price: Number;
	status: Number;
	search_by: Number;
	search_by_biller_id: Number;
}

const ELEMENT_DATA: ProductElement[] = [
	{ id: 1, id_biller_type: 1, id_biller_company: 1, name: 'Product 1', denom: '5000', sales_price: 5500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 2, id_biller_type: 2, id_biller_company: 5, name: 'Product 2', denom: '10000', sales_price: 12000, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 3, id_biller_type: 2, id_biller_company: 6, name: 'Product 3', denom: '50000', sales_price: 52500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 1, id_biller_type: 1, id_biller_company: 1, name: 'Product 1', denom: '5000', sales_price: 5500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 2, id_biller_type: 2, id_biller_company: 5, name: 'Product 2', denom: '10000', sales_price: 12000, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 3, id_biller_type: 2, id_biller_company: 6, name: 'Product 3', denom: '50000', sales_price: 52500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 1, id_biller_type: 1, id_biller_company: 1, name: 'Product 1', denom: '5000', sales_price: 5500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 2, id_biller_type: 2, id_biller_company: 5, name: 'Product 2', denom: '10000', sales_price: 12000, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 3, id_biller_type: 2, id_biller_company: 6, name: 'Product 3', denom: '50000', sales_price: 52500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 1, id_biller_type: 1, id_biller_company: 1, name: 'Product 1', denom: '5000', sales_price: 5500, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 2, id_biller_type: 2, id_biller_company: 5, name: 'Product 2', denom: '10000', sales_price: 12000, status: 1, search_by: 1, search_by_biller_id: 1 },
	{ id: 3, id_biller_type: 2, id_biller_company: 6, name: 'Product 3', denom: '50000', sales_price: 52500, status: 1, search_by: 1, search_by_biller_id: 1 },
	// { id: null, id_biller_type: null, id_biller_company: null, name: null, denom: null, sales_price: null, status: null, search_by: null, search_by_biller_id: null }
]
