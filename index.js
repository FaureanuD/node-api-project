const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Date mock (simulateaza baza de date)
let products = [
  { id: 0, name: "Laptop", price: 1000 },
  { id: 1, name: "Telefon", price: 800 },
  { id: 2, name: "Tabletă", price: 600 },
  { id: 3, name: "Monitor", price: 400 },
  { id: 4, name: "Căști", price: 100 }
];

let users = [
  { id: 0, name: "Ana" },
  { id: 1, name: "Mihai" },
  { id: 2, name: "Ioana" },
  { id: 3, name: "Andrei" }
];

// Nivel 10: Middleware pentru roluri
function checkRole(role) {
  return (req, res, next) => {
    const userRole = req.headers["role"];
    if (userRole === role) {
      next();
    } else {
      res.status(403).json({ message: "Acces interzis (403)" });
    }
  };
}

// ROUTE-URI

// Nivel 5: GET /products/list
app.get("/products/list", (req, res) => {
  res.json(products);
});

// Nivel 6: GET /products/details/:id
app.get("/products/details/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Produsul cautat nu exista" });
  }
  res.json(product);
});

// Nivel 7: POST /products/add
app.post("/products/add", (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Nume și preț sunt necesare" });
  }
  const newProduct = { id: products.length, name, price };
  products.push(newProduct);
  res.json({ message: "Produs adăugat", product: newProduct });
});

// Nivel 8: GET /products/search
app.get("/products/search", (req, res) => {
  const { name, minPrice, maxPrice } = req.query;
  let results = products;

  if (name) {
    results = results.filter(p =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (minPrice) {
    results = results.filter(p => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    results = results.filter(p => p.price <= parseInt(maxPrice));
  }

  res.json(results);
});

// Users (simplu)
app.get("/users/list", (req, res) => {
  res.json(users);
});

// Nivel 9: Admin/Public
app.get("/list", (req, res) => {
  res.json({ message: "Lista publică" });
});

app.get("/admin/reports", checkRole("Admin"), (req, res) => {
  res.json({ message: "Raport secret pentru Admin" });
});

// PORNIRE SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
