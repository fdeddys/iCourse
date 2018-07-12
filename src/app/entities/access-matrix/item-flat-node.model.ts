/** Flat to-do item node with expandable and level information */
export class ItemFlatNode {
    constructor(
        public item?: string,
        public level?: number,
        public expandable?: boolean
    ) {
    }
}
