const cookieSession = require("cookie-session");
const express = require('express')
const cors = require("cors");

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process')
const port = parseInt(process.env.PORT, 10) || 3001
const CryptoJS = require('crypto-js')
const sqlite3 = require('sqlite3');
const pg = require('pg');

require('dotenv').config({ path: path.join(__dirname, '.env') })

const dir = process.cwd();

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

// const defautlConfig = {
//     "username": "root",
//     "password": "root",
//     "database": "root",
//     "host": "postgres",
//     "dialect": "postgres"
// }

// const defautlConfig = {
//     "username": "postgres",
//     "password": "1234",
//     "database": "database_development",
//     "host": "localhost",
//     "dialect": "postgres",
//     dialectModule: pg,
// }

const defautlConfig = {
    "username": "admin",
    "password": "1234",
    "database": "database_development",
    "dialect": "sqlite",
    dialectModule: sqlite3
}
const database = require("./models/database")(defautlConfig, path.resolve(dir, 'models'));

const passport = require("passport");
const SeedService = require("./service/seedService");


const server = express()

const initDb = async () => {
    await database.sequelize.sync();
}

server.use(
    cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

server.use(passport.initialize());
server.use(passport.session());

server.use(cors());
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ extended: true }))

// For static files such as icons/images/etc
server.use(express.static(path.join(dir, 'out')));

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



const sendFile = (file) => (req, res) => res.sendFile(path.resolve(dir, 'out', file));
const pathMap = new Set([
    '/monitormanage', '/login', '/publicmap',
    '/manage/landmarks/', '/manage/mapsetting', '/manage/roles/',
    '/manage/storage/', '/manage/users/',
    // All available static paths
]);




const viewTemps = ["landmarks", "storage", "roles"];
const viewTempsPath = viewTemps
    .map(p => path.resolve(dir, 'out/manage', p))

server.set('views', viewTempsPath);
server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');

// Other paths, check whether to show page or 404(not found) page
server.get('*', async (req, res) => {
    try {
        const p = req.path;
        const _p = p.slice(-1) === "/" ? p.slice(1).replace(/.$/, ".") : `${p.slice(1)}.`;
        if (pathMap.has(p)) {
            res.sendFile(path.resolve(dir, 'out', `${_p}html`))
        }
        else res.sendFile(path.resolve(dir, 'out', '404.html'));

    } catch (err) {
        console.log(err)
    }
});


server.listen(port, async () => {
    await initDb();
    const seedService = new SeedService(database);
    await seedService.initSeed();
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



