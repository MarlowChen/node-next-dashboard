const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
/**
 * 初始化Service 建立基礎資料
 */
class SeedService {

    constructor(db) {
        this._db = db;
        this.defaultMenu = [
            {
                perm_name: 'Sys Permission',
                perm_code: "P0",
                perm_description: "Sys default permission"
            },
            {
                perm_name: '地標 管理版',
                perm_code: "LANDMARK",
                perm_description: "Sys default LANDMARK"
            },
            {
                perm_name: '系統設定',
                perm_code: "SYSTEM_SETTING",
                perm_description: "Sys default SYSTEM_SETTING"
            }
        ]
    }

    async initSeed() {
        await this.initMenuPermission();
        await this.initAdmin();
        await this.initMapSetting();
    }




    async initMenuPermission() {
        try {
            const setting = await this._db.Permission.findAll({
                logging: false,
                where: {
                    perm_code: this.defaultMenu.map(item => item.perm_code)
                }
            });
            const existArray = setting.map(item => item.perm_code)
            const saveData = this.defaultMenu.filter(item => existArray.indexOf(item.perm_code) < 0).map(item => {
                if (item.perm_code !== "P0") {
                    item.parent_id = 1;
                    item.group_id = 1;
                }
                return item;
            })

            if (saveData) {
                console.log("init MenuPermission")
                const result = await this._db.sequelize.transaction(async (t) => {
                    await this._db.Permission
                        .bulkCreate(saveData, { transaction: t })
                })
            }


        } catch (error) {
            throw (error)
        }

    }

    /**
     * 
     * @returns 初始化設定檔案
     */
    async initAdmin() {
        try {
            console.log("init Admin")
            let role = await this._db.Role.findByPk(1);
            if (!role) {
                role = await this._db.sequelize.transaction(async (t) => {
                    const newRow = await this._db.Role
                        .create({
                            role_name: "管理員",
                            role_description: "預設管理員角色"
                        }, { transaction: t })


                    return newRow;
                })


            }
            const existList = await this._db.RolePermission.findAll({
                logging: false,
                where: { role_id: 1 },
                include: [{
                    model: this._db.Permission
                }]
            });
            if (existList.length < this.defaultMenu.length) {
                const permissionList = await this._db.Permission.findAll({
                    logging: false,
                    where: {
                        [Op.or]: [
                            { id: 1 },
                            { group_id: '1' },
                        ]
                    }
                });
                await this._db.sequelize.transaction(async (t) => {
                    const list = permissionList.map(item => {
                        return { role_id: 1, perm_id: Number(item.id) }
                    })
                    await this._db.RolePermission.bulkCreate(list);
                })
            }

            const user = await this._db.User.findByPk(1);
            if (!user) {

                const result = await this._db.sequelize.transaction(async (t) => {
                    console.log("role.id")
                    console.log(role.id)
                    const user = await this._db.User
                        .create({
                            name: "Admin",
                            role_id: role.id
                        }, { transaction: t })
                    const independentCredential = await this._db.IndependentCredentials
                        .create({
                            user_id: user.id,
                            username: "Admin",
                            password: "1234"
                        }, { transaction: t })

                    const userMail = await this._db.Email
                        .create({
                            user_id: user.id,
                            address: "Admin@default.com",
                        }, { transaction: t })
                    return independentCredential;
                })
            }

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

    /**
     * 
     * @returns 初始化地圖設定檔案
     */
    async initMapSetting() {
        try {
            const setting = await this._db.MapSettings.findByPk(1);
            if (!setting) {
                console.log("init MapSettings")
                const result = await this._db.sequelize.transaction(async (t) => {
                    await this._db.MapSettings
                        .create({
                            public_map_zoom: 8,
                            public_map_lat: "23.533758206822935",
                            public_map_lng: "120.85510253906251",
                            private_map_zoom: 8,
                            private_map_lat: "23.533758206822935",
                            private_map_lng: "120.85510253906251",
                            camera_name_view: false,
                            sys_time_view: false
                        }, { transaction: t })
                })
            }


        } catch (error) {
            throw (error)
        }
    }



}

module.exports = SeedService;