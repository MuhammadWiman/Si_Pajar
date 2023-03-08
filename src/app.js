const consumer = require("../src/consumer");
const logger = require("../src/utils/logger");
const express = require("express");
const routes = require("./routes");
const { cors } = require("../config");
const { requestResponse } = require("./utils");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.use((req, res) => {
  const response = requestResponse.not_found;
  res.status(response.code).json(response);
});

app.use(cors);
consumer.consume().then((_) => logger.info("MQTT connected!"));
module.exports = app;
