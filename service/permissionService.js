const { Op } = require("sequelize");

class PermissionService {

    constructor(db) {
        this._db = db;
    }

    async findFullByRoleId(roleId) {
        try {
            const existList = await this._db.RolePermission.findAll({
                where: { role_id: Number(roleId) },
                include: [{
                    model: this._db.Permission
                }]
            });
            return existList;
        } catch (error) {
            throw (error)
        }
    }

    async findAllGroup() {
        try {
            const groups = await this._db.Permission.findAll({ where: { parent_id: null } });
            return groups;

        } catch (error) {
            throw (error)
        }
    }



    async findParentGroupByPermCode(permCode) {
        try {
            const group = await this._db.Permission.findAll({
                where: { perm_code: permCode }
            });

            return group;

        } catch (error) {
            throw (error)
        }
    }

    async findFullGroupById(id) {
        try {

            const group = await this._db.Permission.findAll({
                where: {

                    [Op.or]: [
                        { id: id },
                        { group_id: id },
                    ]
                }
            });

            return group;

        } catch (error) {
            throw (error)
        }
    }



    /**
     * 樹權限結構
     * [{
     *  name: NAEM,
     *  desc: DESC,
     *  childen: [
     *     loop.....
     *  ]
     * }]
     * 
     * @param {*} treePerms 
     */
    async createPermissions(treePerms) {
        try {
            if (!treePerms) {
                throw ("Please pass treePerms")
            }
            //樹狀第一層群組id 所以不會有parentId
            console.log("Go")
            console.log(treePerms[0].childNodes)
            console.log(treePerms[0].id)
            await this.buildPermissons(treePerms[0].childNodes, treePerms[0].id, treePerms[0].id)

            return true;

        } catch (error) {
            throw (error)
        }
    }

    async buildPermissons(treNodes, parentId, groupId) {
        try {
            if (!treNodes || treNodes.length == 0) {
                return;
            }
            for (let i = 0; i < treNodes.length; i++) {
                const permName = treNodes[i].name
                const permCode = treNodes[i].code
                const permDescription = treNodes[i].desc
                const data = await this.createPermission(permName, permCode, permDescription, parentId, groupId);
                if (treNodes[i].childNodes) {
                    this.buildPermissons(treNodes[i].childNodes, data.id, groupId)
                }
            }

        } catch (error) {
            throw (error)
        }

    }

    /**
     * 如果沒有parentId跟groupId表示為群組Node
     * 
     * @param {*} permName 
     * @param {*} permCode 
     * @param {*} permDescription 
     * @param {*} parentId 
     * @param {*} groupId 
     * @returns 
     */
    async createPermission(permName, permCode, permDescription, parentId, groupId) {
        try {
            if (!permName || !permCode) {
                throw ("Please pass permName")
            } else {
                const permission = await this._db.Permission
                    .create({
                        perm_name: permName,
                        perm_code: permCode,
                        perm_description: permDescription,
                        parent_id: parentId,
                        group_id: groupId
                    })
                return permission;
            }
        } catch (error) {
            throw (error)
        }

    }


    async updateIndexByList(list) {
        try {
            const result = await this._db.sequelize.transaction(async (t) => {
                // const MONITOR_IMAGE = await this._db.Permission.findAll({
                //     where: { perm_code: "MONITOR_IMAGE" }
                // });
                // const TIME_LAPSE = await this._db.Permission.findAll({
                //     where: { perm_code: "TIME_LAPSE" }
                // });
                for await (const data of list) {
                    const query = data.parent_camera_id ? {
                        perm_code: {
                            [Op.like]: `%-${data.parent_camera_id}`
                        }
                    } : {
                        perm_code: ["MONITOR_IMAGE", "TIME_LAPSE"]
                    }


                    let parents = await this._db.Permission.findAll({
                        where: query,
                        transaction: t
                    })
                    console.log(parents)
                    for (const parent of parents) {
                        await this._db.Permission
                            .update({
                                index: data.index,
                                parent_id: parent.id,
                            }, {
                                where: {
                                    perm_code: {
                                        [Op.like]: `%${parent.perm_code.split("-")[0]}-${data.camera_id}`
                                    },
                                },
                                transaction: t
                            })
                    }


                }

            })
        } catch (error) {
            throw (error)
        }
    }

}

module.exports = PermissionService;