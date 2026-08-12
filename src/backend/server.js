import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";

const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));


app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));
app.use(cookieParser());

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
    console.log("Server running");
});
}).catch((error) => {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
})

