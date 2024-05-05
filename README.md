# vanadium

Vanadium is a "simple" web app written in Astro used for managing and viewing anime.  
Currently it is a work in progress, but (with some manual work) is production ready... to an extent.  
The app is designed to be self-hosted, and is not intended to be used by more than 100ish users.  
The app is designed to run and be worked on in a Linux environment, and may not work as intended on Windows or MacOS.
It uses a SQLite database, which is stored within the dist/server folder, and is not intended to be used with a database server. Make sure you don't lose the database file, as it contains all of the data for the app.

## Features

- View anime
- Add anime to user's list
- Remove anime from user's list
- View user's list
- Filter and sort user's list
- Sign up (WIP)
- Search for anime
- View anime details
- Automatically fetch anime data from [gogoanime](https://gogoanime3.co/)
- Override fetched mistakes (WIP)

## Installation and Usage

1. Clone the repository
2. Run `npm install` or `yarn`
3. Run `node setup.js` to create the database, which you will need to move into the `dist/server` folder upon building.
4. Run `npm run build` or `yarn build`
5. Run via pm2 (recommended) or `node dist/server/entry.mjs`
6. Server is ready for usage, navigate to `http://localhost:4321` to view the app.

## Updating

Updating is simple, I wrote `pull.sh` which should automate backing up the database, pulling the latest changes, and rebuilding the app. (you have to restart manually)

## Contributing

Contributions are welcome, but please make sure that you test your code before submitting a pull request.  
If you have any questions, feel free to ask in the discussions tab or via Github issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Astro](https://astro.build/)
- [SQLite](https://www.sqlite.org/index.html)
- [gogoanime](https://gogoanime3.co/)
- [pm2](https://pm2.keymetrics.io/)
- [cheerio](https://www.npmjs.com/package/cheerio)
- [fuzzy-search](https://www.npmjs.com/package/fuzzy-search)
