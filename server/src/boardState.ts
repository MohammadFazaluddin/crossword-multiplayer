import { Board } from "./board";
import { BoardRules } from "./boardRules";
import { User } from "./types/data";

export class BoardState {
    private board: Board = new Board();
    private boardRules: BoardRules = new BoardRules();

    constructor() {
        this.board.makeGrid([
            ['', '', '', '', null, '', '', '', '', ''],
            ['', '', '', '', null, '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', null, '', '', '', ''],
            [null, null, '', '', '', null, null, '', '', ''],
            ['', '', '', null, null, '', '', '', null, null],
            ['', '', '', '', null, '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', null, '', '', '', ''],
            ['', '', '', '', '', null, '', '', '', ''],
        ])
    }


    setCellValue(col: number, row: number, val: string, user: User): boolean {
        if (!user) return false;

        if (!this.boardRules.validateUserMove(user)) return false;

        this.board.setGridCellValue(col, row, val);
        return true;
    }

    getGrid(): Array<Array<string | null>> {
        return this.board.getGrid();
    }
}

