import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';

@Component({
    selector: 'app-action-delete-cell',
    template: `
        <mat-icon style="margin-top: 3px; font-size: 20px" data-action-type="delete">delete</mat-icon>
    `,
})
// <mat-icon style="margin-top: 12px; font-size: 20px" data-action-type="edit">edit</mat-icon>

export class MatActionDeleteButtonComponent implements ICellRendererAngularComp {
    private params: any;

    agInit(params: any): void {
        this.params = params;
        // console.log('action button = ', this.params);
        // console.log('isi param action button ', this.params.value);
    }

    refresh(params: any): boolean {
        return false;
    }
}
