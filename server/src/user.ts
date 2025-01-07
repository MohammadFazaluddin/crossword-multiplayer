import { User } from "./types/data";

export class UserState {
    readonly TIMEOUTDUR: number = 60; // in seconds
    usersList: Array<User>;

    constructor() {
        this.usersList = new Array<User>();
    }

    getUserById(id: string): User | undefined {
        return this.usersList.find(user => user.Id === id);
    }

    getAllUsers(): Array<User> {
        return this.usersList;
    }

    removeUser(id: string): void {
        this.usersList = this.usersList.filter(user => {
            user.Id !== id;
        });
    }

    addUser(user: User): void {
        this.usersList.push(user);
    }

    setUserTimeout(id: string): void {
        this.usersList.forEach(user => {
            if (user.Id === id) {
                user.IsOnTimeout = true;
                user.Timeout = new Date;
            }
        })
    }

    isUserTimeoutComplete(id: string): boolean {
        const user = this.getUserById(id);
        if (!user) return false;

        const currDate = new Date();
        const timeDiff: number = user.Timeout.getSeconds() - currDate.getSeconds();
        return timeDiff >= this.TIMEOUTDUR;
    }
};
