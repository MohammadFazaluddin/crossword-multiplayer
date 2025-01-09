"use client"

import useSocket from "@/src/hooks/socket";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function Home() {

  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000';
  const [usersCount, setUsersCount] = useState<number>(0);
  const [gameBoard, setBoard] = useState<Array<Array<string | null>>>([])
  const socket = useSocket(SERVER_URL);

  useEffect(() => {

    const handleGameState = (game: string[][]) => setBoard(game);
    const handleUsersCount = (count: number) => setUsersCount(count);
    const handleTimeout = (data: string) => {
      const time = new Date(data);
      const currdate = new Date();
      const remainingSeconds = ((time.getTime() - currdate.getTime()) / 1000).toFixed(1);
      toast.error(`You can update a cell after: ${remainingSeconds}s`);
    }


    if (socket) {
      socket.on('gameState', handleGameState);
      socket.on('usersCount', handleUsersCount);
      socket.on('userTimeOut', handleTimeout);

      return () => {
        socket.off('usersCount', handleUsersCount);
        socket.off('gameState', handleGameState);
        socket.off('userTimeOut', handleTimeout);
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
    <div className="w-screen h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <Toaster />
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
