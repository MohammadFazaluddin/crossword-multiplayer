import express from "express";
import cors from "cors";
import * as socket from "socket.io";
import * as http from "http";
import { User } from "./types/data";
import { UserState } from "./user";
import { BoardState } from "./board";

const PORT: number = 8000

const app: express.Application = express();

app.use(cors());
const server: http.Server = http.createServer(app);

const io: socket.Server = new socket.Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

const userState = new UserState();

const boardState = new BoardState();

boardState.makeGrid([
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

io.on("connection", socket => {

    userState.addUser({ Id: socket.id, IsOnTimeout: false } as User);

    io.emit("usersCount", userState.getAllUsersCount());

    socket.emit("gameState", boardState.getGrid());

    socket.on("updateBlock", ({ col, row, val }) => {
        boardState.setGridValue(col, row, val);
        const board = boardState.getGrid();
        socket.broadcast.emit("gameState", board);
    })

    socket.on("disconnect", () => {
        console.log(userState.getAllUsers());
        console.log(socket.id);
        userState.removeUser(socket.id);
        console.log(userState.getAllUsers());
        io.emit("usersCount", userState.getAllUsersCount());
    })
})


server.listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
});

