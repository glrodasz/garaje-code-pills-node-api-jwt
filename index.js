const express = require("express");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const app = express();

app.post("/token", (req, res) => {
  // Get user form DB
  const { id: sub, name } = { id: "glrodasz", name: "Guillermo" };

  const token = jwt.sign(
    {
      sub,
      name,
      exp: Date.now() + 60 * 1000,
    },
    secret
  );
  res.send({ token });
});

app.get("/public", (req, res) => {
  res.send("I'm public");
});

app.get("/private", (req, res) => {
  try {
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, secret);

    if (Date.now() > payload.exp) {
      return res.status(401).send({ error: "token expired" });
    }

    res.send("I'm private");
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

app.listen(3000);
