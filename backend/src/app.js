require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes")
const orgReadRoutes = require("./routes/orgs.read.route")   
const orgWriteRoutes = require("./routes/orgs.route")      
const errorHandler = require("./middleware/errorHandler");
const projectReadRoutes = require("./routes/project.list.route")
const projectWriteRoutes = require("./routes/projects.routes")

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes)
app.use("/orgs", orgReadRoutes)
app.use("/orgs", orgWriteRoutes)
app.use("/orgs", projectReadRoutes)
app.use("/orgs", projectWriteRoutes)

app.use(errorHandler);

module.exports = app;