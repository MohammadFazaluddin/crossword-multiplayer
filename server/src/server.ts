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
        origin: "*"
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

io.on("connection", (socket) => {
    userState.addUser({ Id: socket.id, IsOnTimeout: false } as User);

    io.emit("usersCount", userState.getAllUsersCount());

    socket.emit("gameState", boardState.getGrid());

    socket.on("changeBlock", (row, col, val) => {
        boardState.setGridValue(row, col, val);
        socket.broadcast.emit("gameState", boardState.getGrid());
    })

    socket.on("disconnect", () => {
        userState.removeUser(socket.id);
        io.emit("usersCount", userState.getAllUsersCount());
    })
})


server.listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
});

