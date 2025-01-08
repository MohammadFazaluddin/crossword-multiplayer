"use client"

import { socket } from "@/lib/socket";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";

export default function Home() {

  const [usersCount, setUsersCount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [gameBoard, setBoard] = useState<Array<Array<string | null>>>([])

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      socket.on("gameState", game => {
        setBoard(game);
      })
    }

    function onDisconnect() {
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on('usersCount', (usersCount) => {
      setUsersCount(usersCount);
    })

    socket.on('message', (data) => {
      setMessage(data);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    }

  }, [])

  function captureChar(e: ChangeEvent<HTMLInputElement>) {
    console.log(e);
  }

  return (
    <div className="w-screen">
      <div>{message}</div>
      <div className="flex mx-auto p-3 w-fit mb-6">
        <h2>Players online: </h2>
        <div className="ml-2 font-bold">{usersCount}</div>
      </div>
      <div className="flex flex-col w-fit mx-auto border-8 border-green-500">
        {gameBoard &&
          gameBoard.map((row: Array<string | null>, idx: number) => (
            <div key={idx} className="flex flex-row w-full">
              {
                row.map((col, idx2) => (
                  <input
                    key={idx2}
                    className={`border-4 border-green-500 w-12 h-12 text-center focus:bg-blue-100
                      ${col == null ? 'bg-green-500 text-white' : ''}`}
                    defaultValue={col ?? ''}
                    onChange={captureChar}
                    disabled={col == null}
                    maxLength={1}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    </div >
  );
}
