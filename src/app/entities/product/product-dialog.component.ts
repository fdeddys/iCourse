import { Component, OnInit, Inject } from '@angular/core';
import { Product } from './product.model'; 

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-product-dialog',
	templateUrl: './product-dialog.component.html',
	styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {

	product: Product;
	billerTypeList = [];

	constructor(
		public dialogRef: MatDialogRef<ProductDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {
		this.product = {};
		this.billerTypeList = BILLER_TYPE;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

// id: Number;
// id_biller_type: Number;
// id_biller_company: Number;
// name: string;
// denom: string;
// sales_price: Number;
// status: Number;
// search_by: Number;
// search_by_biller_id: Number;

export interface BillerType {
	id: Number;
	name: string;
}

const BILLER_TYPE: BillerType[] = [
	{id:1, name:'Tipe 1'},
	{id:2, name:'Tipe 2'}
]