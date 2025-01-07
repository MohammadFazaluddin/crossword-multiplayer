
export class BoardState {
    grid: Array<string | null>;

    constructor() {
        this.grid = new Array();
    }

    setGridValue(idx: number, val: string): void {
        this.grid[idx] = val;
    }

    getGrid(): Array<string | null> {
        return this.grid;
    }

}

