import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-tree-view',
    templateUrl: './tree-view.html',
    styleUrls: ['./tree-view.css']
})

export class TreeViewComponent {
    @Input() links: any;

    getMargin(link) {
        if (link.parentId === 0) {
            return '0px';
        } else {
            if (link.level !== undefined) {
                const left = ((link.level - 1) * 21) + 21;
                return left + 'px';
            }
            return '42px';
        }
    }
}
