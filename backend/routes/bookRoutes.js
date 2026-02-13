const express = require("express");
const router = express.Router();
const bookService = require("../services/bookService");

router.get("/books", (_, res) => {
  const books = bookService.getBooks();
  res.json(books);
});

router.post("/book/review/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const formData = req.body;

  const normalize = (val) => (val ? (Array.isArray(val) ? val : [val]) : []);
  formData.tags = normalize(formData.tags);
  formData.genres = normalize(formData.genres);

  bookService.saveReview(bookId, formData, (err) => {
    if (err) {
        console.error("Error updating review:", err);
        return res.status(404).send("Book not found.");
    }

    res.redirect("/index.html");
  });
});

module.exports = router;
