export class MenuNode {
    constructor(
        public children?: MenuNode[],
        public id?: number,
        public name?: string,
        public description?: string,
        public parentId?: number,
        public status?: number,
    ) {
    }
}
