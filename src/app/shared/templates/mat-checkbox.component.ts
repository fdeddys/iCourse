import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular/main';

@Component({
    selector: 'app-checkbox-cell',
    template: `
        <mat-checkbox [ngModel]="checked" [color]="'primary'" (ngModelChange)="onChange($event)">{{ stat }}</mat-checkbox>
    `,
    // styles: [
    //     `
    //         ::ng-deep
    //         .mat-checkbox-layout {
    //             /* horizontally align the checkbox */
    //             width: 100%;
    //             display: inline-block !important;
    //             text-align: center;
    //             margin-top: -4px; /* to offset the cells internal padding - could be done in cells CSS instead*/

    //             /* vertically align the checkbox when not using the ag-material theme - should be the same as the
    //             rowHeight - cell padding
    //                (you can of course alter the cell padding via CSS instead if you'd prefer)
    //             line-height: 42px;
    //              */
    //         }
    //     `
    // ]
})
export class MatCheckboxComponent implements ICellRendererAngularComp {
    private params: any;

    checked: boolean;
    stat: string;
    // this.checked = false;

    agInit(params: any): void {
        this.params = params;
        this.checked = this.params.value === 'ACTIVE';
        // this.stat = (this.checked ? 'ACTIVE' : 'INACTIVE');
        this.stat = 'ACTIVE';
    }

    // demonstrates how you can do "inline" editing of a cell
    onChange(checked: boolean) {
        this.checked = checked;
        this.params.node.setDataValue(this.params.colDef, this.checked ? 'ACTIVE' : 'INACTIVE');
    }

    refresh(params: any): boolean {
        return false;
    }
}
