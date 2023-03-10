const router = require("express").Router();
const LandmarkService = require("../service/landmarkService");
const fs = require('fs');
const path = require('path');

const dir = process.cwd();




module.exports = (db, config) => {
    const passport = require("passport");
    const landmarkService = new LandmarkService(db);
    const NodeCache = require("node-cache");
    const coverCache = new NodeCache();



    router.get('/public', async function (req, res) {
        try {
            const _cameras = await landmarkService.findAllPublicLandmarks();

            res.status(200).json(_cameras);
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error);

        }
    });

    router.get('/tasks', async function (req, res) {
        try {
            const tasks = await nmsService.getTask();
            res.status(200).json(tasks);
        }
        catch (error) {
            res.status(400).send(error);

        }
    });


    router.get('/', passport.authenticate('jwt', {
        session: false
    }), async function (req, res) {
        try {
            const _cameras = await landmarkService.findAllLandmarks();
            res.status(200).json(_cameras);
        }
        catch (error) {
            res.status(400).send(error);

        }
    });


    router.get('/group', passport.authenticate('jwt', {
        session: false
    }), async function (req, res) {
        try {
            const _landmark = await landmarkService.findLandmarkGroupBySeq();
            res.status(200).json(_landmark);
        }
        catch (error) {
            console.log(error)
            res.status(400).send(error);

        }
    });

    router.get('/:id', passport.authenticate('jwt', {
        session: false
    }), async function (req, res) {
        try {
            if (!req.params.id) {
                res.status(400).send({
                    msg: 'Please pass id'
                })
            } else {

                const _camera = await landmarkService.findById(req.params.id);
                res.status(200).json(_camera);
            }
        }
        catch (error) {
            // await this.db.sequelize.rollback();
            res.status(400).send(error);

        }
    });


    /**
     * 建立 or 更新 地標
     * 
     */
    router.post('/', passport.authenticate('jwt', {
        session: false
    }), async function (req, res) {
        try {

            if (!req.body.id || !req.body.name || !req.body.lat ||
                !req.body.lng || !req.body.link || req.body.maintain == null || req.body.public == null) {
                res.status(400).send({
                    msg: '"Please pass id  name, lat, lng, link, maintain public"'
                })
            }
            if (req.body.id == -1) {

                const result = await landmarkService.createLandmark(req.body.name, req.body.lat, req.body.lng,
                    req.body.link, req.body.maintain, req.body.public)
            } else {
                const result = await landmarkService.updateLandmark(req.body.id, req.body.name, req.body.lat, req.body.lng,
                    req.body.link, req.body.maintain, req.body.public)
            }

            res.status(200).json({
                success: true,
                message: "ok"
            });

        }
        catch (error) {
            console.log(error)
            res.status(400).send(error);
        }
    });

    router.post('/deleteSelect', passport.authenticate('jwt', {
        session: false
    }), async function (req, res) {
        try {
            if (!req.body.cameraIds) {
                res.status(400).send({
                    message: 'Please pass cameraIds'
                })
            } else {

                await landmarkService.deleteLandmarks(req.body.cameraIds)


                res.status(200).json({
                    success: true,
                    message: "ok"
                });
            }
        }
        catch (error) {
            // await this.db.sequelize.rollback();
            console.log(error)
            res.status(400).send(error);

        }
    });



    return router;
}

