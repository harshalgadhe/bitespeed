import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";

import {connectDB} from "./src/utils/db.js";
import contactRouter from "./src/router/contact.js";

const app = express();

//Middlewares
app.use(bodyParser.json());

//DB
connectDB();

//Routes
app.use('', contactRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})