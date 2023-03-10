const { v4: uuidv4 } = require('uuid');
const { once } = require('events');
const { Op } = require("sequelize");

class LandmarkService {

    constructor(db) {
        this._db = db;
    }

    async findById(id) {
        try {
            const landmark = await this._db.Landmark.findByPk(Number(id));
            return landmark;

        } catch (error) {
            throw (error)
        }
    }


    async findAllLandmarks() {
        try {
            const landmarks = await this._db.Landmark.findAll();
            return landmarks;

        } catch (error) {
            throw (error)
        }
    }
    async findLandmarksByIds(ids) {
        try {
            const landmarks = await this._db.Landmark.findAll({ where: { id: ids } });
            return landmarks;

        } catch (error) {
            throw (error)
        }
    }

    async findAllPublicLandmarks() {
        try {
            const landmarks = await this._db.Landmark.findAll({
                where: {
                    public: true
                }
            });
            return landmarks;

        } catch (error) {
            throw (error)
        }
    }


    async createLandmark(_name, _lat, _lng, _link, _maintain, _public) {
        try {


            if (!_name || !_lat ||
                !_lng || !_link || _maintain == null || _public == null) {
                throw ("Please pass name, lat, lng, link, maintain public")
            }

            const checkLandmark = await this._db.Landmark
                .findOne({
                    where: {
                        name: _name
                    }
                })

            if (checkLandmark) {
                throw ("地標名稱不可重複")
            }

            const result = await this._db.sequelize.transaction(async (t) => {
                const lastLandmarks = await this._db.Landmark.findAll({
                    limit: 1,
                    order: [['createdAt', 'DESC']]
                })
                const LANDMARK = await this._db.Permission.findOne({ where: { perm_code: "LANDMARK" } })
                const landmarkId = lastLandmarks.length > 0 ? Number(lastLandmarks[0].id) + 1 : 1;
                const landmarkPerm1 = await this._db.Permission
                    .create({
                        perm_name: `${_name}-LANDMARK-${landmarkId}`,
                        perm_description: "圖標自動新增",
                        perm_code: "LANDMARK-" + landmarkId,
                        parent_id: LANDMARK.id,
                        group_id: "1"
                    }, { transaction: t })

                let saveData = {
                    name: _name,
                    perm_ids: [landmarkPerm1.id],
                    lat: _lat,
                    lng: _lng,
                    link: _link,
                    maintain: _maintain,
                    public: _public

                };
                const landmark = await this._db.Landmark
                    .create(saveData, { transaction: t })

                const allRoles = await this._db.Role.findAll();
                //新增角色權限
                const saveRolePermission = [];
                if (allRoles.length > 0) {
                    for (let i = 0; i < allRoles.length; i++) {
                        console.log(allRoles[i])
                        saveRolePermission.push({
                            role_id: allRoles[i].id,
                            perm_id: landmarkPerm1.id
                        })
                    }
                    const landmarkRolePermission = await this._db.RolePermission
                        .bulkCreate(saveRolePermission, { transaction: t });

                }
                return landmark;
            })

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

    async updateLandmark(_id, _name, _lat, _lng, _link, _maintain, _public) {
        try {

            if (!_id || _name || _lat ||
                !_lng || !_link || _maintain == null || _public == null) {
                throw ("Please pass id name, lat, lng, link, maintain public")

            } else {

                const checkLandmark = await this._db.Landmark
                    .findOne({
                        where: {
                            name: _name
                        }
                    })

                if (checkLandmark && checkLandmark.id !== _id) {
                    throw ("地標名稱不可重複")
                }

                const result = await this._db.sequelize.transaction(async (t) => {
                    let saveData = {
                        name: _name,
                        lat: _lat,
                        lng: _lng,
                        link: _link,
                        maintain: _maintain,
                        public: _public

                    };
                    const landmark = await this._db.Landmark
                        .update(saveData, { where: { id: _id }, transaction: t, individualHooks: true })



                    return landmark;
                })
            }
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

    async deleteLandmarks(landmarkIds) {
        try {
            if (!landmarkIds) {
                throw ("Please pass landmarkIds")
            } else {

                const existLandmarks = await this._db.Landmark.findAll({
                    where: {
                        id: landmarkIds
                    }
                })
                let permIds = [];
                for (let i = 0; i < existLandmarks.length; i++) {
                    permIds = permIds.concat(existLandmarks[i].perm_ids)
                }

                const landmarkPermissionIds = permIds.filter((item,
                    index) => permIds.indexOf(item) === index)


                const result = await this._db.sequelize.transaction(async (t) => {
                    //移除有該攝影機角色的權限
                    await this._db.RolePermission.destroy({
                        where: {
                            perm_id: landmarkPermissionIds
                        },
                        transaction: t
                    })

                    //刪除權限
                    await this._db.Permission.destroy({
                        where: {
                            id: landmarkPermissionIds
                        },
                        transaction: t
                    })
                    //刪除攝影機
                    await this._db.Landmark.destroy({
                        where: {
                            id: landmarkIds
                        },
                        transaction: t
                    })

                    return true;
                })
            }
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }


    async findLandmarkGroupBySeq() {
        try {
            const landmarks = await this._db.Landmark.findAll();
            let landmarkObject = {}
            for (let i = 0; i < landmarks.length; i++) {
                const data = landmarks[i]
                landmarkObject[data.id] = data
            }
            const permissions = await this._db.Permission.findAll({ where: { perm_code: { [Op.like]: "%LANDMARK%" } } })
            const result = [];
            for await (const permission of permissions) {
                let data = JSON.parse(JSON.stringify(permission))
                const landmarkId = Number(permission.perm_code.split("-")[1])
                const landmark = landmarkObject[landmarkId];
                if (landmark) {
                    data.landmark = landmarkObject[landmarkId];
                    result.push(data);
                }
            }
            console.log(result)
            return result;

        } catch (error) {
            throw (error)
        }
    }

}

module.exports = LandmarkService;