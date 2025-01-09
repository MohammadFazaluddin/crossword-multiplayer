import express from "express";
import cors from "cors";
import * as socket from "socket.io";
import * as http from "http";
import { UpdateBlockParams, User } from "./types/data";
import { UserState } from "./user";
import { BoardState } from "./boardState";

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

// using middleware to centralize the logic
io.use((socket, next) => {
    try {
        userState.addUser({ Id: socket.id, IsOnTimeout: false } as User);
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

        socket.on("updateCell", (params) => handleUpdateCell(params, socket.id));

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
    if (boardState.setCellValue(col, row, val, user)) {
        const board = boardState.getGrid();
        io.emit("gameState", board);
    } else {
        socket.emit("userTimeOut", user?.TimeoutDate);
    }
}

server.listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
});

