class EmailService {

    constructor(db) {
        this._db = db;
        this.initTransation(db)
    }

    async initTransation(db) {
        this._t = await db.sequelize.transaction({ autocommit: false });

    }
    async createEmail(_userId, _email, t) {
        try {
            if (!_userId || !_email) {
                throw ("Please pass email")
            } else {
                const userMail = await this._db.Email
                    .create({
                        user_id: _userId,
                        address: _email,
                    }, { transaction: t })

                await t.commit();
                return userMail;
            }
        } catch (error) {
            console.log(error)
            //await this._t.rollback();
            throw (error)
        }
    }

    //刪除使用者相關的資料
    async deleteEmailByUser(useIds) {
        try {
            if (!useIds) {
                throw ("Please pass useIds")
            } else {

                await this._db.Email.destroy({
                    where: {
                        user_id: useIds
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

module.exports = EmailService;