import express from "express";
import cors from "cors";
import * as socket from "socket.io";
import * as http from "http";
import { User, Board } from "./types/data";
import { UserState } from "./user";

const PORT: number = 8000

const app: express.Application = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
})

const server: http.Server = http.createServer(app);

const io: socket.Server = new socket.Server(server, {
    cors: {
        origin: "*"
    }
});

const userState = new UserState();

const board: Board = {
    grid: [],
    setGrid: function(arr: Array<string | null>) {
        this.grid = arr;
    }
}

io.on("connection", (socket) => {
    userState.addUser({ Id: socket.id, IsOnTimeout: false } as User);

    io.emit('userList', userState.getAllUsers());

    socket.on("userList", (callback) => {
        callback(userState.getAllUsers());
    })

    socket.on("disconnect", () => {
        userState.removeUser(socket.id);
    })
})


server.listen(PORT, () => {
    console.log(`Server listening to port: ${PORT}`);
});

