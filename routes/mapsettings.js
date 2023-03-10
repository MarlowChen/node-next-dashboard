const router = require("express").Router();

const MapSettingsService = require("../service/mapsettingsService");


module.exports = (db, config) => {

    const mapSettingsService = new MapSettingsService(db);


    router.get('/system', async function (req, res) {
        try {
            const systemSetting = await mapSettingsService.findById(1);
            res.status(200).json(systemSetting);
        }
        catch (error) {
            // await this.db.sequelize.rollback();
            console.log(error)
            res.status(400).send(error);

        }
    });

    router.put('/:id', async function (req, res) {
        try {

            if (!req.params.id || !req.body.public_map_zoom || !req.body.public_map_lat || !req.body.public_map_lng ||
                !req.body.private_map_zoom || !req.body.private_map_lat || !req.body.private_map_lng) {
                res.status(400).send({
                    message: 'Please pass public_map_zoom, public_map_lat, public_map_lng, private_map_zoom private_map_lat private_map_lng'
                })
            }
            await mapSettingsService.updateMapSettings(req.params.id, req.body.public_map_zoom,
                req.body.public_map_lat, req.body.public_map_lng, req.body.private_map_zoom,
                req.body.private_map_lat, req.body.private_map_lng,
                req.body.weather_pos, req.body.map_name,
                req.body.camera_name_view, req.body.sys_time_view,)


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

    return router;
}
