const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/dashboard/categoryRoutes");
const productRoutes = require("./routes/dashboard/productRoutes");
const { dbConnect } = require("./utils/db");
dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log(`Server running on port ${port}`));
