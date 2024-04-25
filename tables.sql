CREATE TABLE User (
    ID      INT  PRIMARY KEY,
    Name    TEXT NOT NULL UNIQUE,
    Token   TEXT NOT NULL,
    IsAdmin BOOL NOT NULL,
    Hash    TEXT NOT NULL,
    Anime   TEXT NOT NULL,
    History TEXT NOT NULL
);

CREATE TABLE Cache (
    ID         INTEGER PRIMARY KEY,
    AnimeID    TEXT    NOT NULL,
    Title      TEXT    NOT NULL,
    Image      TEXT    NOT NULL,
    EpisodeUrl TEXT    NOT NULL,
    Episode    TEXT    NOT NULL
);

CREATE TABLE CacheLastUpdated (
    ID   INT PRIMARY KEY UNIQUE,
    Time INT NOT NULL
);

CREATE TABLE User (
    ID      INT  PRIMARY KEY,
    Name    TEXT NOT NULL UNIQUE,
    Token   TEXT NOT NULL,
    IsAdmin BOOL NOT NULL,
    Hash    TEXT NOT NULL,
    Anime   TEXT NOT NULL,
    History TEXT NOT NULL
);
