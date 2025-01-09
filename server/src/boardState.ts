import { Board } from "./board";
import { BoardRules } from "./boardRules";
import { User } from "./types/data";

export class BoardState {

    board: Board = new Board();
    boardRules: BoardRules = new BoardRules();
    readonly TIMEOUT = 1000; // timeout in miliseconds

    constructor() {
        // make 10x10 grid
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
        ]);
    }

    setCellValue(col: number, row: number, val: string, user: User | undefined): boolean {

        if (!user) return false

        if (!this.boardRules.validateUserMove(user)) return false;

        user.TimeoutDate = new Date();
        this.board.setGridCellValue(col, row, val);
        return true;

    }

    getGrid(): Array<Array<string | null>> {
        return this.board.getGrid();
    }

}

