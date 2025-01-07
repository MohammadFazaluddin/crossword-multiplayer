export type User = {
    Id: string;
    IsOnTimeout: boolean;
    Timeout: Date | null;
}

export type Board = {
    grid: Array<string | null>;
    setGrid: Function
}


