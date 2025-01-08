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

    getAllUsersCount(): number {
        return this.usersList.length;
    }

    userExists(id: string): boolean {
        return this.usersList.some(user => user.Id === id);
    }

    removeUser(id: string): void {
        const user = this.getUserById(id);
        if (!user) return;

        const idx = this.usersList.indexOf(user);

        this.usersList.splice(idx, 1)
    }

    addUser(user: User): void {
        // check if user exists 
        if (this.userExists(user.Id)) return

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
        const timeDiff: number = user.Timeout!.getSeconds() - currDate.getSeconds();
        return timeDiff >= this.TIMEOUTDUR;
    }
};
