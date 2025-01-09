import { User } from "./types/data";

export class BoardRules {
    private readonly TIMEOUT_MS = 60 * 1000; // 1 minute in milliseconds

    validateUserMove(user: User): boolean {
        const currentTime = new Date().getTime();
        const timeoutTime = new Date(user.TimeoutDate).getTime();

        return currentTime >= timeoutTime;
    }

    getNewUserTimeoutStart(): Date {
        return new Date(Date.now() - this.TIMEOUT_MS);
    }

    getUserTimeoutEnd(): Date {
        return new Date(Date.now() + this.TIMEOUT_MS);
    }
}

