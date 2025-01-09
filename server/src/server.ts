import express from "express";
import cors from "cors";
import * as socket from "socket.io";
import * as http from "http";
import { UpdateBlockParams } from "./types/data";
import { UserState } from "./userState";
import { BoardState } from "./boardState";
import { BoardRules } from "./boardRules";

const PORT: number = 8000
const CLIENT_URL = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app: express.Application = express();

app.use(cors());
const server: http.Server = http.createServer(app);

const io: socket.Server = new socket.Server(server, {
    cors: {
        origin: [CLIENT_URL]
    }
});

const userState = new UserState();

const boardState = new BoardState();

const rules = new BoardRules();

// using middleware to centralize the logic
io.use((socket, next) => {

    try {

        userState.addUser(socket.id);
        next();
    } catch (err) {
        console.error(`Middleware error: ${err}`);
        next(new Error("Failed to setup user info"));
    }
})

io.on("connection", socket => {
    try {
        // user
        io.emit("usersCount", userState.getAllUsersCount());

        // board
        socket.emit("gameState", boardState.getGrid());

        socket.on("updateCell", (params) => handleUpdateCell(params, socket.id, socket));

        // disconnect
        socket.on("disconnect", () => {
            userState.removeUser(socket.id);
            io.emit("usersCount", userState.getAllUsersCount());
        })
    }
    catch (err) {
        console.error(`connection error: ${err}`);
    }
})

function handleUpdateCell({ col, row, val }: UpdateBlockParams, id: string, socket: socket.Socket) {

    const user = userState.getUserById(id);

    if (!user) return;

    if (boardState.setCellValue(col, row, val, user)) {

        const board = boardState.getGrid();
        userState.setUserTimeout(user!.Id, rules.getUserTimeoutEnd());
        io.emit("gameState", board);

    } else {

        socket.emit("userTimeOut", user?.TimeoutDate);

    }
}

server.listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
});
