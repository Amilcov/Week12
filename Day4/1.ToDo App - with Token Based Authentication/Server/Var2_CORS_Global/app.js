const express = require("express");
const morgan = require("morgan");
const cors = require("cors");



const { environment } = require('./config');

const indexRouter = require('./routes/index');
const tasksRouter = require('./routes/tasks');
const usersRouter = require('./routes/users');
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({origin: 'http://localhost:4000'}));



app.use('/', indexRouter);
app.use('/tasks', tasksRouter);
app.use('/users', usersRouter);

// app.get("/", (req, res) => {
//   res.send("Welcome to the express-sequelize-starter!");
// });

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.status = 404;
  next(err);
});

// Custom error handlers.


// Generic error handler.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const isProduction = environment === "production";
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    stack: isProduction ? null : err.stack,
    errors: isProduction ? null : err.errors
  });
});

module.exports = app;
