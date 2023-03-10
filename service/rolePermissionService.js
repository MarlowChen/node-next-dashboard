const { Op } = require("sequelize");

class RolePermissionService {

    constructor(db) {
        this._db = db;
    }

    async findByRoleId(roleId) {
        try {
            const existList = await this._db.RolePermission.findAll({ where: { role_id: Number(roleId) } });
            return existList;
        } catch (error) {
            throw (error)
        }
    }

    async updateRolePermissions(roleId, permissionList) {
        try {
            console.log("roleId")
            console.log(roleId)
            const existList = await this._db.RolePermission.findAll({ where: { role_id: Number(roleId) } });
            if (existList.length > 0) {
                await this._db.RolePermission.destroy({
                    where: {
                        role_id: Number(roleId)
                    }
                })
            }
            // const removeList = existList.filter(item => !permissionList.includes(String(item.perm_id)) )
            const list = permissionList.map(item => {
                return { role_id: Number(roleId), perm_id: Number(item) }
            })
            await this._db.RolePermission.bulkCreate(list);
            return true;

        } catch (error) {
            console.log(error)
            throw (error)
        }
    }


}

module.exports = RolePermissionService;