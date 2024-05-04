#!/bin/bash
XTMPDIR=false

if [ -d "dist" ]; then
  echo "Dist found, making backup."
  cp dist/server/anime.db /tmp/anime.db.bak
  X=true
fi

git pull

echo "Installing dependencies..."

npm install

echo "Building..."

npm run build

echo "Build done."

if [ "$XTMPDIR" = true ]; then
  echo "Restoring backup"
  cp /tmp/anime.db.bak dist/server/anime.db
fi

echo "Vanadium should be usable, glhf."