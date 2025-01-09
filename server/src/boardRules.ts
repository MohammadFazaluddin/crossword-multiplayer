import { User } from "./types/data";

export class BoardRules {
    readonly TIMEOUT = 10000 * 60; // timeout of 1 minute in miliseconds

    validateUserMove(user: User): boolean {

        const timeDiff: number = user.TimeoutDate.getTime() - new Date().getTime();

        if (timeDiff > this.TIMEOUT) {
            return true;
        }

        return false;
    }
}


