/**
 * Node for item
 */
export class ItemNode {
    constructor(
        public children?: ItemNode[],
        public item?: string
    ) {
    }
}
