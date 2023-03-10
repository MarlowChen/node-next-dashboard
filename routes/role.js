const router = require("express").Router();


module.exports = (db, config) => {

  const passport = require("passport");
  require('../config/passport')(passport, db, config);

  const roleService = new (require("../service/roleService"))(db);
  const authService = new (require("../service/authService"))(db);
  const rolePermissionService = new (require("../service/rolePermissionService"))(db);

  router.post('/', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      if (!req.body.rolename || !req.body.roledescription) {
        res.status(400).send({
          msg: 'Please pass rolename, roledescription.'
        })
      } else {
        const result = await roleService.createRole(req.body.rolename, req.body.roledescription);
        res.status(200).json(result);
      }
    }
    catch (error) {
      res.status(400).send(error);
    }
  });

  router.get('/', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      const _roles = await roleService.findAllRoles();
      res.status(200).json(_roles);
    }
    catch (error) {
      // await this.db.sequelize.rollback();
      res.status(400).send(error);

    }
  });

  router.get('/:id', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      if (!req.params.id) {
        res.status(400).send({
          msg: 'Please pass id'
        })
      } else {

        const _role = await roleService.findById(req.params.id);

        const _premissions = await rolePermissionService.findByRoleId(req.params.id);

        res.status(200).json({
          role: _role,
          permissions: _premissions
        });
      }
    }
    catch (error) {
      // await this.db.sequelize.rollback();
      res.status(400).send(error);

    }
  });

  router.post('/saveWithPermission', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      if (!req.body.id || !req.body.role_name || !req.body.permissions) {
        res.status(400).send({
          msg: 'Please pass id, rolename, roledescription. permissions'
        })
      } else {

        const result = await roleService.updateRole(req.body.id, req.body.role_name, req.body.role_description);

        await rolePermissionService.updateRolePermissions(result, req.body.permissions);
        res.status(200).json({
          success: true,
          message: "ok"
        });
      }
    }
    catch (error) {
      // await this.db.sequelize.rollback();
      res.status(400).send(error);

    }
  });

  router.post('/deleteSelect', passport.authenticate('jwt', {
    session: false
  }), async function (req, res) {
    try {
      if (!req.body.roleIds) {
        res.status(400).send({
          message: 'Please pass roleIds'
        })
      } else {

        const roleUsers = await authService.findSimpleUserByRoles(req.body.roleIds)
        if (roleUsers.length > 0) {
          res.status(400).send({
            message: '角色群組還有使用者'
          })
        }

        await roleService.deleteRole(req.body.roleIds);
        res.status(200).json({
          success: true,
          message: "ok"
        });
      }
    }
    catch (error) {
      // await this.db.sequelize.rollback();
      console.log(error)
      res.status(400).send(error);

    }
  });


  return router;
}