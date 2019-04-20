# Chess_Game_B3

[![Build Status](https://travis-ci.com/samyvera/chess_game_b3.svg?token=KepWfxdRLautAeksBzaf&branch=master)](https://travis-ci.com/samyvera/chess_game_b3)
[![Dependency Status](https://david-dm.org/samyvera/chess_game_b3.svg)](https://david-dm.org/samyvera/chess_game_b3)

An online chess game built on NodeJs with [Express](https://expressjs.com/) and socket.io.  No unnecessary libraries.

Live demo not available yet.

## Getting Started

Install the latest [Node.js](http://nodejs.org)

```console
git clone https://github.com/samyvera/chess_game_b3.git

cd chess_game_b3

npm install

npm start
```

Open your web browser to `localhost:3000`

## Game Features

- Quick join and play (no sign-ups)
- Queue up (when 2+ players)
- Spectate
- ~~Rooms~~
- Player settings
  - ~~Add name~~
- ~~Sound effects~~

## To do

- Turns
- Kick looser if someone is waiting to play
- Pieces can't move through other pieces (exept knights)
- Store dead pieces (to promote pawns)
- "En passant"
- "Castle"
- "Checkmate"