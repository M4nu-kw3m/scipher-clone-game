import React, { useState } from 'react'

export default function Lobby({ socket, onJoin }) {
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [error, setError] = useState('')

  const handleCreate = () => {
    if (!name) return setError('Enter name first')
    socket.emit('createRoom', { playerName: name }, (res) => {
      if (res.success) {
        onJoin(res.roomCode, name, true) // isHost = true
      }
    })
  }

  const handleJoin = () => {
    if (!name || !roomCode) return setError('Enter name and code')
    socket.emit('joinRoom', { roomCode, playerName: name }, (res) => {
      if (res.success) {
        onJoin(roomCode, name, false) // isHost = false
      } else {
        setError(res.error)
      }
    })
  }

  return (
    <div className="container">
      <header className="topbar">
        <div className="logo">SCIPHER.GG</div>
      </header>
      <main className="lobby">
        <div className="lobby-center">
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Play Scipher</h2>

            <div style={{ margin: '1rem 0' }}>
              <input
                placeholder="ENTER YOUR NAME"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  padding: '10px',
                  color: 'white',
                  width: '100%',
                  marginBottom: '1rem'
                }}
              />
            </div>

            <button className="primary" onClick={handleCreate} style={{ width: '100%', marginBottom: '1rem' }}>
              CREATE NEW ROOM
            </button>

            <div className="divider" style={{ margin: '1rem 0', color: '#666' }}>OR JOIN EXISTING</div>

            <div className="join-row" style={{ display: 'flex', gap: '10px' }}>
              <input
                placeholder="ROOM CODE"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase())}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  padding: '10px',
                  color: 'white',
                  flex: 1
                }}
              />
              <button onClick={handleJoin} style={{
                background: '#333',
                border: 'none',
                color: 'white',
                padding: '0 20px',
                cursor: 'pointer'
              }}>JOIN</button>
            </div>

            {error && <div style={{ color: '#ff4444', marginTop: '1rem' }}>{error}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}
