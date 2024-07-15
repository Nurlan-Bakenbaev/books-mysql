import express, { json } from "express";
import mysql from "mysql";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "557799kg",
  database: "mydb",
});
db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Connected to the database");
});
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/postBook", (req, res) => {
  const { title, desc, cover, price } = req.body;
  const q =
    "INSERT INTO books (`title`, `desc`, `cover`,`price`) VALUES (?,?,?,?)";
  const values = [title, desc, cover, price];
  db.query(q, values, (err, data) => {
    if (err) {
      return console.error(err);
    }
    return res.json("Book is posted");
  });
});
//DELETE
app.delete("/deletebook/:id", (req, res) => {
  const { id } = req.params;
  const q = "DELETE FROM books WHERE id=?";
  db.query(q, [id], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the book" });
    }
    return res.json("Book is deleted");
  });
});
app.listen(8000, () => {
  console.log("Connected to DB");
});
