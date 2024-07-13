import express, { json } from "express";
import mysql from 'mysql';
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
app.post("/postbook", (req, res) => {
  const q = "INSERT INTO books (`title`, `desc`, `cover`) VALUES (?)";
  const values = [
    "title from backend",
    " desc from backend",
    " cover from backend",
  ];
  db.query(q, [values], (err, data) => {
    if (err) {
      return console.error(err);
    }
    return res.json("Book is posted");
  });
});
app.listen(8000, () => {
  console.log("Connected to DB");
});
