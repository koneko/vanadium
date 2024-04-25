CREATE TABLE User (
    ID      INT  PRIMARY KEY AUTOINCREMENT,
    Name    TEXT NOT NULL UNIQUE,
    Token   TEXT NOT NULL,
    IsAdmin BOOL NOT NULL,
    Hash    TEXT NOT NULL,
    Anime   TEXT NOT NULL,
    History TEXT NOT NULL
);

CREATE TABLE Cache (
    ID         INTEGER PRIMARY KEY AUTOINCREMENT,
    AnimeID    TEXT    NOT NULL,
    Title      TEXT    NOT NULL,
    Image      TEXT    NOT NULL,
    EpisodeUrl TEXT    NOT NULL,
    Episode    TEXT    NOT NULL
);

CREATE TABLE CacheLastUpdated (
    ID   INT PRIMARY KEY UNIQUE AUTOINCREMENT,
    Time INT NOT NULL
);

CREATE TABLE Anime (
    AnimeID     TEXT    NOT NULL PRIMARY KEY,
    Title       TEXT    NOT NULL,
    Aliases     TEXT    NOT NULL,
    Image       TEXT    NOT NULL,
    Description TEXT    NOT NULL,
    Episodes    INTEGER NOT NULL,
    Date        TEXT    NOT NULL,
    Genres      TEXT    NOT NULL,
    LastUpdated INT     NOT NULL
);

