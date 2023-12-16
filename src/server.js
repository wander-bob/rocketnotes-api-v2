require('express-async-errors');
require('dotenv/config');
const express = require("express");
const cors = require("cors");
const routes = require('./routes');
const AppError = require('./utils/AppError');
const migrationsRun = require('./database/sqlite/migrations');
const  multerConfig = require("./configs/upload");

const server = express();
const port = process.env.SERVER_PORT;

server.use(express.json());
server.use(cors());
server.use("/files", express.static(multerConfig.UPLOAD_FOLDER));
server.use(routes);
migrationsRun();

server.use((error, request, response, next) =>{
  console.log(error, response);
  if(error instanceof AppError){
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  };
  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});
server.listen(port, ()=>{
  console.log(`Listening on port ${port}`);
});