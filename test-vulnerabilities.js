const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// 1. SECRET EXPOSURE
const API_KEY = "sk_live_TEST_SECRET_123456789";

// 2. SQL INJECTION
app.get("/users", async (req, res) => {
  const result = await db.query(
    `SELECT * FROM users WHERE name = '${req.query.name}'`
  );
  res.json(result.rows);
});

// 3. XSS
app.get("/profile", (req, res) => {
  const bio = req.query.bio;
  res.send(`<h1>${bio}</h1>`);
});

// 4. PATH TRAVERSAL
app.get("/download", (req, res) => {
  const file = "/uploads/" + req.query.filename;
  res.sendFile(file);
});

// 5. SSRF
app.get("/fetch", async (req, res) => {
  const response = await axios.get(req.query.url);
  res.json(response.data);
});

// 6. JWT SECURITY
app.get("/admin", (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.decode(token);

  if (decoded.role === "admin") {
    res.json({ admin: true });
  }
});

// 7. CRYPTOGRAPHIC FAILURE
app.post("/hash", (req, res) => {
  const hash = crypto.createHash("md5")
    .update(req.body.password)
    .digest("hex");

  res.json({ hash });
});

// 8. AUTH BYPASS
app.post("/login", (req, res) => {
  const user = getUserByUsername(req.body.username);

  if (user) {
    const token = createSessionToken(user.id);
    res.json({ token });
  }
});

// 9. BROKEN AUTHORIZATION
app.put("/users/:id", async (req, res) => {
  await db.query(
    "UPDATE users SET email = $1 WHERE id = $2",
    [req.body.email, req.params.id]
  );

  res.json({ updated: true });
});

// 10. INSECURE CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.listen(3000);
// Security test update
// Security test 
