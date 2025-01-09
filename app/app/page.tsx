"use client"

import useSocket from "@/src/hooks/socket";
import { useEffect, useState } from "react";

export default function Home() {

  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
  const [usersCount, setUsersCount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [gameBoard, setBoard] = useState<Array<Array<string | null>>>([])
  const socket = useSocket(SERVER_URL);


  useEffect(() => {

    const handleGameState = (game: string[][]) => setBoard(game);
    const handleUsersCount = (count: number) => setUsersCount(count);
    const handleMessage = (message: string) => setMessage(message);

    if (socket) {
      socket.on('gameState', handleGameState);
      socket.on('usersCount', handleUsersCount);
      socket.on('message', handleMessage);

      return () => {
        socket.off('message', handleMessage);
        socket.off('usersCount', handleUsersCount);
        socket.off('gameState', handleGameState);
      }

    }
  }, [socket])

  function updateCell(value: string, row: number, col: number) {
    if (socket) {
      socket.emit('updateCell', {
        "col": col,
        "row": row,
        "val": value
      })
    }
  }

  return (
    <div className="w-screen">
      <div>{message}</div>
      <div className="flex mx-auto p-3 w-fit mb-6">
        <h2>Players online: </h2>
        <div className="ml-2 font-bold">{usersCount}</div>
      </div>
      <div className="flex flex-col w-fit mx-auto border-8 border-green-500">
        {
          gameBoard.map((row: Array<string | null>, idx: number) => (
            <div key={idx} className="flex flex-row w-full">
              {
                row.map((col, idx2) => (
                  <input
                    key={idx2}
                    className={`border-4 border-green-500 w-12 h-12 text-center focus:bg-blue-100
                      ${col == null ? 'bg-green-500 text-white' : ''}`}
                    value={col ?? ''}
                    onChange={e => updateCell(e.target.value, idx, idx2)}
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
