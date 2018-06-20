import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';

@Component({
    selector: 'app-action-cell',
    template: `
        <mat-icon style="margin-top: 12px; font-size: 20px" data-action-type="edit">edit</mat-icon>
    `,
})
export class MatActionButtonComponent implements ICellRendererAngularComp {
    private params: any;

    agInit(params: any): void {
        this.params = params;
        console.log('action button');
        console.log(this.params.value);
    }

    refresh(params: any): boolean {
        return false;
    }
}
