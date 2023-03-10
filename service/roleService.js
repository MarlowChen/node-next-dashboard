class RoleService {

    constructor(db) {
        this._db = db;
    }

    async findById(id) {
        try {
            const role = await this._db.Role.findByPk(Number(id));
            return role;

        } catch (error) {
            throw (error)
        }
    }

    async findAllRoles() {
        try {
            const roles = await this._db.Role.findAll();
            return roles;

        } catch (error) {
            throw (error)
        }
    }

    async updateRole(id, rolename, roledescription) {
        try {
            if (!rolename || (id !== "new" && isNaN(id))) {
                throw ("Please pass rolename or id error")
            }
            if (id === "new") {
                const role = await this._db.Role
                    .create({
                        role_name: rolename,
                        role_description: roledescription
                    })

                return role.id;
            }

            const role = await this._db.Role
                .update({
                    role_name: rolename,
                    role_description: roledescription
                },
                    { where: { id: id } })
            return id;

        } catch (error) {
            throw (error)
        }

    }


    async createRole(rolename, roledescription) {
        try {
            if (!rolename) {
                throw ("Please pass rolename")
            } else {
                const role = await this._db.Role
                    .create({
                        role_name: rolename,
                        role_description: roledescription
                    })
                return role;
            }
        } catch (error) {
            throw (error)
        }

    }

    //不能是管理員群組，而且底下不能有人才能刪除
    async deleteRole(roleIds) {
        try {
            if (!roleIds) {
                throw ("Please pass roleIds")
            } else {

                await this._db.Role.destroy({
                    where: {
                        id: roleIds
                    }
                })

            }
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }



}

module.exports = RoleService;