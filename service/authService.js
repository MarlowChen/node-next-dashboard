class AuthService {

    constructor(db) {
        this._db = db;
        this.initTransation(db)
    }

    async initTransation(db) {
        this._t = await db.sequelize.transaction({ autocommit: false });

    }

    async findAllUser() {
        try {
            const allUsers = await this._db.User.findAll({
                include: [{
                    model: this._db.IndependentCredentials,
                    required: true
                }, {
                    model: this._db.Email,
                    required: true
                }]
            })
            return allUsers;

        } catch (error) {
            console.log(error)
            await this._t.rollback();
            throw (error)
        }
    }

    async findSimpleByUserIds(useIds) {
        try {
            const users = await this._db.User.findAll({
                where: {
                    id: useIds
                }
            })
            return users;

        } catch (error) {
            console.log(error)
            await this._t.rollback();
            throw (error)
        }
    }

    /**
     * 查詢基本使用者by 角色id
     * 
     * @param {*} roleIds 
     * @returns 
     */
    async findSimpleUserByRoles(roleIds) {
        try {
            const roleUsers = await this._db.User.findAll({
                where: {
                    role_id: roleIds
                },
            })
            return roleUsers;

        } catch (error) {
            throw (error)
        }
    }

    //建立使用者 檢查角色必須
    async createFullUser(_username, _password, _roleId, _email) {
        try {
            if (!_username || !_password || !_roleId || !_email) {
                throw ("Please pass username, password email")
            } else {

                const checkUser = await this._db.User
                    .findOne({
                        where: {
                            name: _username
                        }
                    })

                if (checkUser) {
                    throw ("帳號名稱不可重複")
                }

                const result = await this._db.sequelize.transaction(async (t) => {
                    const user = await this._db.User
                        .create({
                            name: _username,
                            role_id: _roleId
                        }, { transaction: t })

                    const independentCredential = await this._db.IndependentCredentials
                        .create({
                            user_id: user.id,
                            username: _username,
                            password: _password
                        }, { transaction: t })

                    const userMail = await this._db.Email
                        .create({
                            user_id: user.id,
                            address: _email,
                        }, { transaction: t })

                    return independentCredential;
                })
            }
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }

    /**更新使用者 */
    async updateFullUser(_id, _username, _password, _roleId, _email) {
        try {
            if (!_username || !_roleId || !_email) {
                throw ("Please pass username, password email")
            } else {

                const existUser = await this._db.User.findOne({where : { name : _username}}); 
                if(existUser && existUser.id !== _id ){
                    throw ("帳號已存在")
                }

                const result = await this._db.sequelize.transaction(async (t) => {
                    const user = await this._db.User
                        .update({
                            name: _username,
                            role_id: _roleId
                        }, {
                            where: { id: _id },
                            transaction: t
                        })
                    let userUpadte;
                    if (_password) {
                        userUpadte = {
                            username: _username,
                            password: _password
                        }
                    } else {
                        userUpadte = {
                            username: _username
                        }
                    }

                    const independentCredential = await this._db.IndependentCredentials
                        .update(userUpadte, {
                            where: { user_id: _id },
                            transaction: t
                        })

                    const userMail = await this._db.Email
                        .update({
                            address: _email,
                        }, {
                            where: { user_id: _id },
                            transaction: t
                        })

                    return independentCredential;
                })
            }
        } catch (error) {
            console.log(error)
            throw (error)
        }
    }



    async createIndependentUser(_username, _password, _rolename) {
        try {
            if (!_username || !_password || !_rolename) {
                throw ("Please pass username, password")
            } else {
                const role = await this._db.Role.findOne({
                    where: {
                        role_name: _rolename
                    }
                });


                console.log(role.id);
                const user = await this._db.User
                    .create({
                        name: _username,
                        role_id: role.id
                    })
                const independentCredential = await this._db.IndependentCredentials
                    .create({
                        user_id: user.id,
                        username: _username,
                        password: _password,
                    })

                return independentCredential;
            }
        } catch (error) {
            throw (error)
        }
    }

    async createGoogleUser(givenName, issuer, profileId) {
        if (!givenName || !issuer || !profileId) {
            throw ("Please pass givenName, password and profileId")
        } else {

            const customRole = await this._db.Role.findOne({
                where: {
                    role_name: "Custom"
                }
            });
            console.log(givenName)
            const user = await this._db.User
                .create({
                    role_id: customRole.id,
                    name: givenName,
                })

            const federatedCredentials = await this._db.FederatedCredentials
                .create({
                    role_id: user.id,
                    provider: issuer,
                    subject: profileId,
                })
        }
    }

    //刪除使用者
    async deleteIndependentCredentialsUser(useIds) {
        try {
            if (!useIds) {
                throw ("Please pass useIds")
            } else {

                await this._db.IndependentCredentials.destroy({
                    where: {
                        user_id: useIds
                    }
                })
                await this._db.User.destroy({
                    where: {
                        id: useIds
                    }
                })
            }
        } catch (error) {
            console.log(error)
            await this._t.rollback();
            throw (error)
        }
    }

}

module.exports = AuthService;