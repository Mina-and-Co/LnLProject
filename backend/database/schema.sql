-- Book Database Schema
--Books table
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    num_reviews INTEGER NOT NULL DEFAULT 0,
    rating_sum INTEGER NOT NULL DEFAULT 0,
    violence_sum INTEGER NOT NULL DEFAULT 0,
    cry_sum INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

--Genre table (predefined)
CREATE TABLE IF NOT EXISTS genres (name TEXT PRIMARY KEY);

--Tags table (predefined)
CREATE TABLE IF NOT EXISTS tags (name TEXT PRIMARY KEY);

CREATE TABLE IF NOT EXISTS book_genres (
    book_id INTEGER NOT NULL,
    genre TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (book_id, genre),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (genre) REFERENCES genres(name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS book_tags (
    book_id INTEGER NOT NULL,
    tag TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (book_id, tag),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (tag) REFERENCES tags(name) ON DELETE CASCADE
);

--Indexes for performance (come back to this)
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);

CREATE INDEX IF NOT EXISTS idx_books_genres_count ON book_genres(book_id, count DESC);

CREATE INDEX IF NOT EXISTS idx_books_tags_count ON book_tags(book_id, count DESC);

--Genres Data - 15 genres
INSERT
    OR IGNORE INTO genres (name)
VALUES
    ('Adventure'),
    ('Classic'),
    ('Dystopian'),
    ('Fantasy'),
    ('Folktale/Myth'),
    ('Graphic Novel'),
    ('Historical Fiction'),
    ('Sci-Fi'),
    ('Memoir/Biography'),
    ('Nonfiction'),
    ('Poetry'),
    ('Realistic Fiction'),
    ('Romance'),
    ('Sports'),
    ('Horror/Scary'),
    ("Mystery");

--Tags Data
INSERT
    OR IGNORE INTO tags (name)
VALUES
    ('strong female protagonist'),
    ('LGBTQIA characters'),
    ('character driven plot'),
    ('diverse cast of characters'),
    ('racially diverse'),
    ('neurodivergent characters'),
    ('disability representation'),
    ('found family'),
    ('dragon characters'),
    ('animal characters'),
    ('unique and/or creative plot'),
    ('healthy male role'),
    ('healthy female role'),
    ('time travel'),
    ('war'),
    ('grief/loss'),
    ('trauma'),
    ('dark/gritty'),
    ('light/wholesome'),
    ('humor'),
    ('thought provoking'),
    ('artificial intelligence'),
    ('social justice');
