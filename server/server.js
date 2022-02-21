require("dotenv").config();
const express = require("express");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const app = express();
app.use(express.json());

// for now !
const users = [];

// insert user if not exist in users
function upsert(array, item) {
  const i = array.findIndex((_item) => _item.email === item.email);
  if (i > -1) array[i] = item;
  else array.push(item);
}

// post request to add a user
app.post("/api/google-login", async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  res.status(201);
  res.json({ name, email, picture });
});

app.listen(process.env.PORT || 6000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 6000}`);
});
