const fs = require("fs");
const path = require("path");
const db = require("../db"); // Ensure this path points to your db.js

const DATA_FILE = path.join(__dirname, "libraryData.json");

async function seedDatabase() {
    try {
        // 1. Wait for the database and schema to be fully ready
        console.log("Waiting for database initialization...");
        await db.ready;

        console.log("Reading libraryData.json...");
        const rawData = fs.readFileSync(DATA_FILE, "utf-8");
        const books = JSON.parse(rawData);

        console.log(`Found ${books.length} books. Starting seed process...`);

        for (const book of books) {
            // 2. Insert the main book record
            // We use ?? 0 to handle books that don't have these keys (0 review books)
            const bookResult = await db.runAsync(
                `INSERT INTO books (title, author, num_reviews, rating_sum, violence_sum, cry_sum)
         VALUES ($title, $author, $count, $r, $v, $c)`,
                {
                    $title: book.title,
                    $author: book.author,
                    $count: book.num_reviews ?? 0,
                    $r: book.rating_sum ?? 0,
                    $v: book.violence_sum ?? 0,
                    $c: book.cry_sum ?? 0,
                },
            );

            const bookId = bookResult.lastID;

            // 3. Handle Genres (Required)
            if (!book.genres || book.genres.length === 0) {
                throw new Error(`Data Error: Book "${book.title}" must have at least one genre.`);
            }

            for (const genreName of book.genres) {
                // Validation check: Does this genre exist in the master table?
                const genreExists = await db.getAsync(`SELECT name FROM genres WHERE name = ?`, [genreName]);

                if (!genreExists) {
                    throw new Error(
                        `Schema Error: Genre "${genreName}" (assigned to "${book.title}") is not in the predefined genres table.`,
                    );
                }

                // Insert into link table.
                // We use ON CONFLICT to increment count if the link somehow exists,
                // though for a fresh seed, it will just insert with default count 1.
                await db.runAsync(
                    `INSERT INTO book_genres (book_id, genre, count)
           VALUES (?, ?, 1)
           ON CONFLICT(book_id, genre) DO UPDATE SET count = count + 1`,
                    [bookId, genreName],
                );
            }

            // 4. Handle Tags (Optional)
            if (book.tags && book.tags.length > 0) {
                for (const tagName of book.tags) {
                    // Validation check: Does this tag exist in the master table?
                    const tagExists = await db.getAsync(`SELECT name FROM tags WHERE name = ?`, [tagName]);

                    if (!tagExists) {
                        // You can choose to throw an error or log a warning here.
                        // Following your rule: "If it's not in the table, it's an error"
                        throw new Error(
                            `Schema Error: Tag "${tagName}" (assigned to "${book.title}") is not in the predefined tags table.`,
                        );
                    }

                    // Insert into link table
                    await db.runAsync(
                        `INSERT INTO book_tags (book_id, tag, count)
             VALUES (?, ?, 1)
             ON CONFLICT(book_id, tag) DO UPDATE SET count = count + 1`,
                        [bookId, tagName],
                    );
                }
            }

            console.log(`✔ Imported: ${book.title} (${book.num_reviews} reviews)`);
        }

        console.log("\nDatabase seeded successfully!");
    } catch (error) {
        console.error("\n❌ Seeding stopped due to error:");
        console.error(error.message);
    } finally {
        // Ensure the connection closes even if there's an error
        db.close((err) => {
            if (err) console.error("Error closing DB:", err.message);
            else console.log("Database connection closed.");
            process.exit();
        });
    }
}

seedDatabase();
