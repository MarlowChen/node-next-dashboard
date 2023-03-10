const cookieSession = require("cookie-session");
const express = require('express')
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const port = parseInt(process.env.PORT, 10) || 3001
const dev = process.env.NODE_ENV !== 'production'
const next = require('next');
const nextConfig = require('./next.config');
const app = next({ dev, dir: __dirname, conf: nextConfig });
const handle = app.getRequestHandler()
const sqlite3 = require('sqlite3');

// const defautlConfig = {
//   "username": "postgres",
//   "password": "1234",
//   "database": "database_development",
//   "host": "localhost",
//   "dialect": "postgres"
// }

const defautlConfig = {
  "username": "admin",
  "password": "1234",
  "database": "database_development",
  "dialect": "sqlite",
  dialectModule: sqlite3
}
const database = require("./models/database")(defautlConfig, path.resolve(process.cwd(), 'models'));

const passport = require("passport");
const SeedService = require("./service/seedService");
const cookieParser = require("cookie-parser");




app.prepare().then(async () => {
  const server = express()
  await database.sequelize.sync();
  server.use(cookieParser());
  server.use(
    cookieSession({ name: "token", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
  );

  server.use(passport.initialize());
  server.use(passport.session());

  server.use(cors());
  server.use(express.json({ limit: "10mb" }));
  server.use(express.urlencoded({ extended: true }))

  const authRoute = require("./routes/auth")(database, {})
  const roleRoute = require("./routes/role")(database, {})
  const permissionRoute = require("./routes/permission")(database, {})
  const landmarkRoute = require("./routes/landmark")(database, {})
  const mapSettingsRoute = require("./routes/mapsettings")(database, {})


  server.use("/api/auth", authRoute);
  server.use("/api/role", roleRoute);
  server.use("/api/permission", permissionRoute);
  server.use("/api/landmark", landmarkRoute);
  server.use("/api/mapsettings", mapSettingsRoute);

  server.all('*', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    return handle(req, res)
  })


  server.listen(port, async () => {
    // runStreamServer();
    const seedService = new SeedService(database);
    seedService.initSeed();
    const worker = new Worker("./mapServer.js", { workerData: null });
    worker.on('message', (msg) => {
      console.log("start work")
    })
    worker.on('error', console.error);
    worker.on('exit', (code) => {
      if (code != 0)
        console.error(new Error(`Worker stopped with exit code ${code}`))
    });

    console.log(`> Ready on http://localhost:${port}`)
  })


})
