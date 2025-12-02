import React, { useState, useEffect } from 'react'

export default function GameBoard({ socket, gameData }) {
  const [guess, setGuess] = useState('')

  // Destructure with defaults to prevent crashes
  const {
    gameState = {},
    players = [],
    code = '',
    myName = '',
    isHost = false
  } = gameData || {}

  const {
    words = [],
    timer = 0,
    scores = { team1: 0, team2: 0 },
    currentTurn = '1',
    isPlaying = false,
    contributions = []
  } = gameState

  const myPlayer = players.find(p => p.name === myName)
  const myTeam = myPlayer?.team || '1'
  const isMyTurn = currentTurn === myTeam

  const handleStart = () => {
    socket.emit('startGame', { roomCode: code })
  }

  const handleGuessSubmit = (e) => {
    e.preventDefault()
    if (!guess.trim()) return

    socket.emit('submitGuess', {
      roomCode: code,
      word: guess.toUpperCase(),
      team: myTeam
    })
    setGuess('')
  }

  return (
    <div className="container">
      <header className="topbar">
        <div className="logo">SCIPHER.GG</div>
        <div className="topcenter">
          <div className="teambox">
            {isPlaying ? (
              <>TEAM {currentTurn}'s TURN <div className="score">{currentTurn === '1' ? scores.team1 : scores.team2}</div></>
            ) : (
              <div className="score">WAITING TO START</div>
            )}
          </div>
          <div className="timer">{timer}</div>
        </div>
        <div className="profile">{myName} ({isHost ? 'HOST' : 'PLAYER'})</div>
      </header>

      <main className="game-main">
        <aside className="sidebar-left">
          <h3>Team 1 ({scores.team1})</h3>
          {players.filter(p => p.team === '1').map(p => (
            <div key={p.id} className="player-item">{p.name} {p.name === myName && '(YOU)'}</div>
          ))}

          <h3 style={{ marginTop: '20px' }}>Team 2 ({scores.team2})</h3>
          {players.filter(p => p.team === '2').map(p => (
            <div key={p.id} className="player-item">{p.name} {p.name === myName && '(YOU)'}</div>
          ))}
        </aside>

        <section className="board-area">
          {!isPlaying && isHost && (
            <div className="start-overlay" style={{ textAlign: 'center', margin: '20px' }}>
              <h2>Room Code: {code}</h2>
              <button className="primary" onClick={handleStart}>START GAME</button>
            </div>
          )}

          {!isPlaying && !isHost && (
            <div className="start-overlay" style={{ textAlign: 'center', margin: '20px' }}>
              <h2>Room Code: {code}</h2>
              <p>Waiting for host to start...</p>
            </div>
          )}

          {isPlaying && (
            <>
              <div className="words-grid">
                {words.map((w, i) => (
                  <div key={i} className={'word-card ' + (w.guessed ? 'guessed' : '')}>
                    <div className="word">{w.word}</div>
                    <div className="pts">{w.pts} points</div>
                  </div>
                ))}
              </div>

              {isMyTurn && (
                <form onSubmit={handleGuessSubmit} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                  <input
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    placeholder="TYPE GUESS..."
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      padding: '10px',
                      color: 'white',
                      flex: 1
                    }}
                    autoFocus
                  />
                  <button type="submit" className="primary">GUESS</button>
                </form>
              )}
            </>
          )}

          <div className="contributions">
            <div className="contrib-title">Recent Activity</div>
            <div className="contrib-list">
              {contributions.slice().reverse().map((c, i) => (
                <div key={i} className="chips">
                  <span className={`chip active`}>{c.word} (Team {c.team})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="sidebar-right">
          <div className="right-controls">
            <button className="icon">☰</button>
            <button className="icon">≡</button>
            <button className="icon">T</button>
            <button className="icon">👥</button>
          </div>
        </aside>
      </main>
    </div>
  )
}
