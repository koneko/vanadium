#!/bin/bash
XTMPDIR=false
TIME=$(date +%s)

if [ -d "dist" ]; then
  echo "Dist found, making backup."
  cp dist/server/anime.db /tmp/$TIME.anime.db.bak
  XTMPDIR=true
fi

git pull

echo "Installing dependencies..."

npm install

echo "Building..."

npm run build

echo "Build done."

if [ "$XTMPDIR" = true ]; then
  echo "Restoring backup"
  cp /tmp/$TIME.anime.db.bak dist/server/anime.db
fi

echo "Vanadium should be usable, glhf."