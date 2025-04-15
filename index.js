const express = require("express");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const cors = require("cors");
const passport = require("passport");
const compression = require("compression");

//* CONSTANTS
const { DB, PORT } = require("./config/index");

//* APP INTIALIZATION
const app = express();
const fileupload = require("express-fileupload");
const path = require("path");
//* MIDDLEWARES
const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  compression({
    level: 6,
    threshold: 0,
  })
);
app.use(fileupload());
app.use(passport.initialize());
require("./middlewares/passport")(passport);

//* Router Middleware
app.use(require("./router/route"));

// Making Build Folder as Public
app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("*", (request, response) => {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

const startApp = async () => {
  try {
    //* DB CONNECTION
    connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    success({ message: `Connected to DB \n${DB}`, badge: true });

    //* Started listening to DB
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    //! Error in connecting DB
    error({
      message: `Unable to connect with DB \n${err}`,
      badge: true,
    });
    startApp();
  }
};
startApp();
