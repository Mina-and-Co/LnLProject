const fs = require("fs");
const path = require("path");
const db = require("../database/db");

const dbReady = db.ready;

//Get all books
async function getAllBooks() {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     ORDER BY b.title;`;

        const rows = await db.allAsync(sql);
        const processedRows = rows.map((row) => ({
            id: row.id,
            link: `/books/${row.id}`,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService.getAllBooks:", err.message);
        throw err;
    }
}

async function SortByTime() {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     ORDER BY b.updated_at DESC;`;

        const rows = await db.allAsync(sql);
        const processedRows = rows.map((row) => ({
            id: row.id,
            link: `/books/${row.id}`,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService.getAllBooks:", err.message);
        throw err;
    }
}

async function sortByViolenceHighToLow() {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     WHERE b.num_reviews > 0
                     ORDER BY (b.violence_sum * 1.0) / b.num_reviews DESC;`;

        const rows = await db.allAsync(sql);
        const processedRows = rows.map((row) => ({
            id: row.id,
            link: `/books/${row.id}`,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService:", err.message);
        throw err;
    }
}

async function sortByViolenceLowToHigh() {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     WHERE b.num_reviews > 0
                     ORDER BY (b.violence_sum * 1.0) / b.num_reviews ASC;`;

        const rows = await db.allAsync(sql);
        const processedRows = rows.map((row) => ({
            id: row.id,
            link: `/books/${row.id}`,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService:", err.message);
        throw err;
    }
}

async function sortByCryLowToHigh() {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     WHERE b.num_reviews > 0
                     ORDER BY (b.cry_sum * 1.0) / b.num_reviews ASC;`;

        const rows = await db.allAsync(sql);
        const processedRows = rows.map((row) => ({
            id: row.id,
            link: `/books/${row.id}`,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService:", err.message);
        throw err;
    }
}

async function sortByCryHighToLow() {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     WHERE b.num_reviews > 0
                     ORDER BY (b.cry_sum * 1.0) / b.num_reviews DESC;`;

        const rows = await db.allAsync(sql);
        const processedRows = rows.map((row) => ({
            id: row.id,
            link: `/books/${row.id}`,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService:", err.message);
        throw err;
    }
}

async function searchBooksByTitle(searchTitle) {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     WHERE b.title LIKE '%' || $searchTerm || '%'
                     ORDER BY b.title;`;
        const rows = await db.allAsync(sql, { $searchTerm: searchTitle });
        const processedRows = rows.map((row) => ({
            id: row.id,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService.searchBooks", err.message);
        throw err;
    }
}

async function searchBooksByGenre(searchGenre) {
    try {

        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     JOIN book_genres bg_outer ON b.id = bg_outer.book_id
                     WHERE bg_outer.genre = $searchTerm
                     ORDER BY bg_outer.count DESC;`;

        const rows = await db.allAsync(sql, { $searchTerm: searchGenre });
        const processedRows = rows.map((row) => ({
            id: row.id,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService.searchBooks", err);
        throw err;
    }
}

async function searchBooksByTag(searchTag) {
    try {

        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ) FROM book_genres bg WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                    ) FROM book_tags bt WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     JOIN book_tags bt_outer ON b.id = bt_outer.book_id
                     WHERE bt_outer.tag = $searchTerm
                     ORDER BY bt_outer.count DESC;`;

        const rows = await db.allAsync(sql, { $searchTerm: searchTag });
        const processedRows = rows.map((row) => ({
            id: row.id,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        }));

        return processedRows;
    } catch (err) {
        console.error("Error in bookService.searchBooks", err);
        throw err;
    }
}

async function searchForId(id) {
    try {
        const sql = `SELECT
                    b.id,
                    b.title,
                    b.author,
                    b.num_reviews,
                    b.rating_sum,
                    b.violence_sum,
                    b.cry_sum,
                    b.created_at,
                    b.updated_at,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bg.genre, 'count', bg.count)
                    ORDER BY bg.count DESC)
                    FROM book_genres bg
                    WHERE bg.book_id = b.id) AS genres_json,
                    (SELECT JSON_GROUP_ARRAY(
                        JSON_OBJECT('name', bt.tag, 'count', bt.count)
                     ORDER BY bt.count DESC)
                     FROM book_tags bt
                     WHERE bt.book_id = b.id) AS tags_json
                     FROM books b
                     WHERE b.id = $id`;
        const rows = await db.allAsync(sql, { $id: id });
        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];
        const bookData = {
            id: row.id,
            title: row.title,
            author: row.author,
            numReviews: row.num_reviews,
            ratingSum: row.rating_sum,
            violenceSum: row.violence_sum,
            crySum: row.cry_sum,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            genres: row.genres_json ? JSON.parse(row.genres_json) : [],
            tags: row.tags_json ? JSON.parse(row.tags_json) : []
        };

        return bookData;
    } catch (err) {
        console.error("Error in bookService.searchBooks", err.message);
        throw err;
    }
}

async function saveReview(id, formData) {
    if (!id) {
        throw new Error("Book ID is required to save a review.");
    }

    if (!formData) {
        throw new Error("Invalid form data provided.");
    }

    const rating = parseInt(formData.finalRating);
    const violence = parseInt(formData.violence);

    if (isNaN(rating)) {
        throw new Error("Rating is missing or invalid.");
    }

    if (isNaN(violence)) {
        throw new Error("Violence rating is missing or invalid.");
    }

    if (!formData.cry) {
        throw new Error("Cry rating is missing.");
    }

    const cryValue = formData.cry === "yes" ? 1 : 0;

    try {
        await db.runAsync("BEGIN TRANSACTION");

        await db.runAsync(`
                    UPDATE books SET
                        num_reviews = num_reviews + 1,
                        rating_sum = rating_sum + $rating,
                        violence_sum = violence_sum + $violence,
                        cry_sum = cry_sum + $cry,
                        updated_at = datetime('now')
                    WHERE id = $id`,
            {
                $rating: rating,
                $violence: violence,
                $cry: cryValue,
                $id: id
            });

        for (const genre of formData.genres || []) {
            await db.runAsync(`
                        INSERT INTO book_genres (book_id, genre, count)
                            VALUES ($id, $genre, 1)
                            ON CONFLICT(book_id, genre) DO UPDATE SET count = count + 1`,
                {
                    $id: id,
                    $genre: genre,
                });
        }

        for (const tag of formData.tags || []) {
            await db.runAsync(`
                        INSERT INTO book_tags (book_id, tag, count)
                            VALUES ($id, $tag, 1)
                            ON CONFLICT(book_id, tag) DO UPDATE SET count = count + 1`,
                {
                    $id: id,
                    $tag: tag,
                });
        }

        await db.runAsync("COMMIT");
    } catch (err) {
        await db.runAsync("ROLLBACK");
        console.error("Error in bookService.saveReview", err.message);
        throw err;
    }
}

async function addBook(body) {
    if (!body) {
        throw new Error("Title and author are required to add a book.");
    }
    const author = body.author;
    const title = body.title;

    if (!author || !title) {
        throw new Error("Title and author are required to add a book.");
    }

    try {
        await db.runAsync("BEGIN TRANSACTION");

        //insert the book
        const sql = `
            INSERT INTO books (title, author, created_at, updated_at)
            VALUES ($title, $author, datetime('now'), datetime('now'));
        `;

        //bind the values to prevent injection
        await db.runAsync(sql, {
            $title: title,
            $author: author,
        });

        await db.runAsync("COMMIT");
    } catch (err) {
        await db.runAsync("ROLLBACK");
        console.error("Error in bookService.addBook", err.message);
        throw err;
    }
}

async function deleteBook(id) {
    if (!id) {
        throw new Error("An ID was not specified.");
    }

    try {
        await db.runAsync("BEGIN TRANSACTION");

        const sql = `
        DELETE FROM books
        WHERE id = $id;
        `;
        await db.runAsync(sql, {
            $id: id,
        });

        await db.runAsync("COMMIT");
    } catch (err) {
        await db.runAsync("ROLLBACK");
        console.error("Error in bookService.deleteBook", err.message);
        throw new Error("Failed to delete. Try again.");
    }
}

async function editBook(id, formData) {
    if (!id) {
        throw new Error("Book ID is required to save a review.");
    }

    if (!formData.title || !formData.author) {
        throw new Error("Title and author are required to save a review.");
    }

    try {
        await db.runAsync("BEGIN TRANSACTION");

        await db.runAsync(`
            UPDATE books SET title = $title, author = $author WHERE id = $id`,
            {
                $title: formData.title,
                $author: formData.author,
                $id: id
            });

        await db.runAsync(`
                DELETE FROM book_genres WHERE book_id = $id`,
            { $id: id }
        );
        if (formData.genres) {
            for (const genre of formData.genres) {
                await db.runAsync(`
                        INSERT INTO book_genres (book_id, genre, count)
                            VALUES ($id, $genre, 1)
                            ON CONFLICT(book_id, genre) DO UPDATE SET count = count + 1`,
                    {
                        $id: id,
                        $genre: genre,
                    });
            }
        }

        await db.runAsync(`
                DELETE FROM book_tags WHERE book_id = $id`,
            { $id: id }
        );
        if (formData.tags) {
            for (const tag of formData.tags) {
                await db.runAsync(`
                        INSERT INTO book_tags (book_id, tag, count)
                            VALUES ($id, $tag, 1)
                            ON CONFLICT(book_id, tag) DO UPDATE SET count = count + 1`,
                    {
                        $id: id,
                        $tag: tag,
                    });
            }
        }

        await db.runAsync("COMMIT");
    } catch (err) {
        await db.runAsync("ROLLBACK");
        console.error("Error in bookService.editBook", err.message);
        throw err;
    }
}

module.exports = {
    getAllBooks,
    searchBooksByTitle,
    saveReview,
    searchForId,
    searchBooksByGenre,
    searchBooksByTag,
    addBook,
    deleteBook,
    editBook,
    sortByViolenceHighToLow,
    sortByViolenceLowToHigh,
    sortByCryHighToLow,
    sortByCryLowToHigh,
    SortByTime
};
