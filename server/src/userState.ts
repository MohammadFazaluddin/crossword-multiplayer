import { BoardRules } from "./boardRules";
import { User } from "./types/data";

export class UserState {
    private usersList: Map<string, User> = new Map();
    private boardRules: BoardRules = new BoardRules();

    getUserById(id: string): User | undefined {
        return this.usersList.get(id);
    }

    getAllUsers(): User[] {
        return Array.from(this.usersList.values());
    }

    getAllUsersCount(): number {
        return this.usersList.size;
    }

    userExists(id: string): boolean {
        return this.usersList.has(id);
    }

    removeUser(id: string): void {
        this.usersList.delete(id);
    }

    addUser(id: string): void {
        if (this.userExists(id)) return;

        const newUser: User = {
            Id: id,
            TimeoutDate: this.boardRules.getNewUserTimeoutStart(),
        };

        this.usersList.set(id, newUser);
    }

    setUserTimeout(id: string, date: Date): void {
        const user = this.getUserById(id);
        if (user) {
            user.TimeoutDate = date;
        }
    }
}

