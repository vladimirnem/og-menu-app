require("dotenv").config();
const express = require("express");
const db = require("pg");

const applicationRouters = require("./src/routers/table.js");
const clientRouters = require("./src/routers/client.js");
const itemsRouter = require("./src/routers/items.js");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(applicationRouters);
app.use(clientRouters);
app.use(itemsRouter);
app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
