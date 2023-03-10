const router = require("express").Router();

const nodemailer = require('nodemailer');
const AuthService = require("../service/authService");
const jwt = require('jsonwebtoken');
const RoleService = require("../service/roleService");
const MailService = require("../service/emailService");



module.exports = (db, config) => {

  const CLIENT_URL = config.CLIENT_URL || "http://localhost:3001/";
  const passport = require("passport");
  require('../config/passport')(passport, db, config);
  const User = db.User;
  const Role = db.Role;
  const FederatedCredentials = db.FederatedCredentials;
  const IndependentCredentials = db.IndependentCredentials;
  const authService = new AuthService(db);
  const roleServie = new RoleService(db);
  const mailServie = new MailService(db);
  const permissionService = new (require("../service/permissionService"))(db);
  let _t;

  async function initTransation(db) {
    if (!_t) {
      _t = await db.sequelize.transaction({ autocommit: false });
    }
  }

  router.get("/validate", passport.authenticate('jwt', {
    session: false
  }), async (req, res) => {
    try {
      const toekn = req.headers.authorization.replace("JWT ", "");
      var decoded = jwt.decode(toekn);
      const premissionList = await permissionService.findFullByRoleId(decoded.role_id);
      res.status(200).json(premissionList);
    }
    catch (error) {
      console.log(error)
      res.status(400).send(error);

    }


  });

  router.get('/', async function (req, res) {
    try {
      initTransation(db);


      const _roles = await roleServie.findAllRoles();
      const _users = await authService.findAllUser();
      res.status(200).json({
        roles: _roles,
        users: _users
      });

    }
    catch (error) {
      console.log(error)
      await _t.rollback();
      res.status(400).send(error);
    }

  });




  router.post('/updateUser', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      if (!req.body.id || !req.body.username || !req.body.email || !req.body.roleId) {
        res.status(400).send({
          message: 'Please pass id username, password and email.'
        })
      } else {

        const role = await roleServie.findById(req.body.roleId)
        if (!role) {
          res.status(400).send({
            message: 'Role not exist'
          })
          return;
        }
        if (req.body.id !== -1) {
          const updateAuth = await authService.updateFullUser(req.body.id, req.body.username, req.body.password, req.body.roleId, req.body.email);
        } else {
          const newAuth = await authService.createFullUser(req.body.username, req.body.password, req.body.roleId, req.body.email);
        }


        res.status(200).json({
          success: true,
          message: "ok"
        });
      }
    }
    catch (error) {
      console.log(error)
      res.status(400).send(error);

    }

  });



  //一般註冊為一般使用者
  router.post('/signup', function (req, res) {
    if (!req.body.email || !req.body.password || !req.body.fullname) {
      res.status(400).send({
        msg: 'Please pass username, password and name.'
      })
    } else {
      Role.findOne({
        where: {
          role_name: 'custom'
        }
      }).then((role) => {

        User
          .create({
            password: req.body.password,
            username: req.body.username,
            role_id: role.id
          })
          .then((user) => res.status(201).send(user))
          .catch((error) => {
            res.status(400).send(error);
          });
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  });

  router.post('/signin', function (req, res) {
    IndependentCredentials
      .findOne({
        where: {
          username: req.body.username
        }
      })
      .then((user) => {
        if (!user) {
          return res.status(401).send({
            message: '帳號不存在',
          });
        }
        user.comparePassword(req.body.password, async (err, isMatch) => {
          if (isMatch && !err) {
            const realUser = await User.findOne({ where: { id: user.user_id } });
            var token = jwt.sign(JSON.parse(JSON.stringify(realUser)), process.env.PROJECT_SECRET, {
              expiresIn: 86400 * 30
            });
            jwt.verify(token, process.env.PROJECT_SECRET, function (err, data) {
              console.log(err, data);
            })
            res.cookie('token', 'JWT ' + token, { maxAge: 900000, httpOnly: false }).redirect("/monitormanage")


          } else {
            res.status(401).send({
              success: false,
              message: '密碼錯誤'
            });
          }
        })
      })
      .catch((error) => res.status(400).send(error));
  });


  router.post('/deleteUsers', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      if (!req.body.userIds) {
        res.status(400).send({
          message: 'Please pass roleIds'
        })
      } else {

        await mailServie.deleteEmailByUser(req.body.userIds)
        await authService.deleteIndependentCredentialsUser(req.body.userIds)

        res.status(200).json({
          success: true,
          message: "ok"
        });
      }
    }
    catch (error) {
      console.log(error)
      res.status(400).send(error);

    }
  });

  return router;
}