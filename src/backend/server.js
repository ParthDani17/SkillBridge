import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

connectDB();

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
});

// import "dotenv/config";
// import express from "express";
// import connectDB from "./config/db.js";
// import User from "./models/User.js";

// const app = express();

// app.use(express.json());

// connectDB();

// app.post("/api/users", async (req, res) => {
//     try {
//         const user = await User.create(req.body);

//         res.status(201).json(user);
//     } catch (error) {
//         res.status(400).json({
//             message: error.message
//         });
//     }
// });

// app.listen(process.env.PORT || 5000, () => {
//     console.log("Server running");
// });