const express = require('express')
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const { default: fetch } = require('node-fetch');

const dir = process.cwd();

const port = 3002

const server = express()

const NodeCache = require("node-cache");
const mapCache = new NodeCache();

server.get('*', async (req, res) => {

    const p = req.path;
    try {
        const fullPath = path.join(dir, req.path);
        console.log("fullPath")
        console.log(fullPath)
        const lastSplit = fullPath.split("\\")
        const cacheName = lastSplit[lastSplit.length - 2] + lastSplit[lastSplit.length - 1];
        const folderPath = fullPath.replace(`\\${lastSplit[lastSplit.length - 1]}`, "")
        const mapPath = `https://tile.openstreetmap.org${req.path.replace("/tile", "")}`
        console.log("folderPath")
        console.log(folderPath)
        const dataExist = fs.existsSync(fullPath);
        if (!dataExist) {
            const fres = await fetch(mapPath);

            if (!fs.existsSync(folderPath)) {
                await fs.mkdirSync(folderPath, { recursive: true });
            }
            const w = fs.createWriteStream(fullPath);
            fres.body.pipe(w)

            w.on('finish', async function () {
                const data = await fs.promises.readFile(fullPath);
                mapCache.set(cacheName, data)
                res.contentType('image/png');
                res.send(data)
            });

        }
        if (dataExist && !mapCache.get(cacheName)) {
            const data = await fs.promises.readFile(fullPath);
            mapCache.set(cacheName, data)
            res.contentType('image/png');
            res.send(data)
            return;
        }

        if (dataExist && mapCache.get(cacheName)) {
            res.contentType('image/png');
            res.send(mapCache.get(cacheName))
        }

    } catch (e) {
        console.log(e)
    }
});


server.use(cors());
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ extended: true }))

server.listen(port, () => {


    console.log(`> Ready on http://localhost:${port}`)
})


