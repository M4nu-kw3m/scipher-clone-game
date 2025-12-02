import React, { useState, useEffect } from 'react'
import Lobby from './components/Lobby'
import GameBoard from './components/GameBoard'
import { useSocket } from './hooks/useSocket'

export default function App() {
  const socket = useSocket()
  const [inGame, setInGame] = useState(false)
  const [gameData, setGameData] = useState(null)

  useEffect(() => {
    if (!socket) return

    socket.on('gameStateUpdate', (state) => {
      setGameData(prev => ({ ...prev, ...state }))
    })

    return () => {
      socket.off('gameStateUpdate')
    }
  }, [socket])

  const handleJoin = (roomCode, name, isHost) => {
    setGameData({ roomCode, myName: name, isHost })
    setInGame(true)
  }

  if (!socket) return <div className="app-shell">Connecting...</div>

  return (
    <div className="app-shell">
      {inGame ? (
        <GameBoard socket={socket} gameData={gameData} />
      ) : (
        <Lobby socket={socket} onJoin={handleJoin} />
      )}
    </div>
  )
}
