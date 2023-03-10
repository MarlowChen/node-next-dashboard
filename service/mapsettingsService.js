const { v4: uuidv4 } = require('uuid');

/**
 * 初始化Service 建立基礎資料
 */
class MapSettingsService {

    constructor(db) {
        this._db = db;
    }

    async findById(id) {
        try {
            const mapSettings = await this._db.MapSettings.findByPk(Number(id));
            return mapSettings;

        } catch (error) {
            throw (error)
        }
    }

    async updateMapSettings(_id, _public_map_zoom, _public_map_lat, _public_map_lng,
        _private_map_zoom, _private_map_lat, _private_map_lng, _weather_pos,
        _map_name, _camera_name_view, _sys_time_view) {
        try {

            if (!_id || !_public_map_zoom || !_public_map_lat || !_public_map_lng ||
                !_private_map_zoom || !_private_map_lat || !_private_map_lng) {
                throw ("Please pass public_map_zoom, public_map_lat, public_map_lng, private_map_zoom private_map_lat private_map_lng")

            }
            const result = await this._db.sequelize.transaction(async (t) => {
                const mapSettings = await this._db.MapSettings
                    .update({
                        public_map_zoom: _public_map_zoom,
                        public_map_lat: _public_map_lat,
                        public_map_lng: _public_map_lng,
                        private_map_zoom: _private_map_zoom,
                        private_map_lat: _private_map_lat,
                        private_map_lng: _private_map_lng,
                        weather_pos: _weather_pos,
                        map_name: _map_name,
                        camera_name_view: _camera_name_view,
                        sys_time_view: _sys_time_view,
                    }, {
                        where: { id: _id },
                        transaction: t
                    })

                return mapSettings;
            })

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

}

module.exports = MapSettingsService;