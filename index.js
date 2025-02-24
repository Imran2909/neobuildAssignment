const express = require("express");
const app = express();
const connection = require("./database/db");
const { userRouter } = require("./routes/userRoute");
const { resumeRouter } = require("./routes/resumeRoute");
const authMiddleware = require("./middleware/authMiddleware")

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home route");
});

// user route
app.use("/user", userRouter);
// authentication middleware
app.use(authMiddleware)
// resume route
app.use("/resume", resumeRouter);

app.listen(8080, async () => {
  try {
    // connecting to database
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log("Server couldn't connect");
  }
  console.log("Server is running at 8080 port");
});


