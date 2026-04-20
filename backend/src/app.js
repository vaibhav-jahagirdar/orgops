require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const orgReadRoutes = require("./routes/orgs.read.route");
const orgWriteRoutes = require("./routes/orgs.route");
const errorHandler = require("./middleware/errorHandler");
const projectReadRoutes = require("./routes/project.list.route");
const projectWriteRoutes = require("./routes/projects.routes");
const taskWriteRoutes = require("./routes/tasks.route");
const dashboardReadRoute = require("./routes/dashboard.read.route");
const membersReadRoute = require("./routes/members.read.route");
const membersWriteRoute = require("./routes/membership.route");
const projectDetailRoute = require("./routes/project.read.route");
const taskStatusRoute = require("./routes/task.status.route");
const taskAssignRoute = require("./routes/tasks.assign.route");
const updateRoleRoute = require("./routes/updateuserrole.route");
const transferOwnershipRoute = require("./routes/transferownership.route");
const commentCreateRoute = require("./routes/task.comment.create.route");
const listCommentsRoute = require("./routes/comments.list.route");
const authRefreshRoute = require("./routes/auth.refresh.route");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/auth", authRefreshRoute);

app.use("/orgs", membersWriteRoute);
app.use("/orgs", orgReadRoutes);
app.use("/orgs", orgWriteRoutes);
app.use("/orgs", projectReadRoutes);
app.use("/orgs", projectWriteRoutes);
app.use("/orgs", taskWriteRoutes);
app.use("/orgs", dashboardReadRoute);
app.use("/orgs", membersReadRoute);
app.use("/orgs", projectDetailRoute);
app.use("/orgs", taskStatusRoute);
app.use("/orgs", taskAssignRoute);
app.use("/orgs", updateRoleRoute);
app.use("/orgs", transferOwnershipRoute);
app.use("/orgs", commentCreateRoute);
app.use("/orgs", listCommentsRoute);

app.use(errorHandler);

module.exports = app;