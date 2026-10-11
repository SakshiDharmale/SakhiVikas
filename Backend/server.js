
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./Router/Router.js";
import db from "./db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", router);

// Start server
app.listen(PORT, (error) => {
    if (error) {
        console.error("Error occurred, server can't start:", error);
        return;
    }

    console.log(
        `Server is successfully running on port ${PORT}`
    );
});

