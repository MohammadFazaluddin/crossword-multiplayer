
export class BoardState {
    grid: Array<Array<string | null>>;

    constructor() {
        this.grid = new Array();
    }

    makeGrid(data: Array<Array<string | null>>) {
        this.grid = data;
    }

    setGridValue(col: number, row: number, val: string): void {
        // only allow if the box can contain other value than null
        if (this.grid[col][row] !== null)
            this.grid[col][row] = val;
    }

    getGrid(): Array<Array<string | null>> {
        return this.grid;
    }

}

