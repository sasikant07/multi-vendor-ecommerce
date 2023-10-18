const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT;

app.use("/api", authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));