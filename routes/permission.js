const router = require("express").Router();


module.exports = (db, config) => {

  const passport = require("passport");
  require('../config/passport')(passport, db, config);

  const permissionService = new (require("../service/permissionService"))(db);

  /**
   * 建立群組
   * 
   */
  // router.post('/', passport.authenticate('jwt', {
  //   session: false
  // }), function (req, res) {
  router.post('/', async function (req, res) {
    try {
      if (!req.body.name || !req.body.code) {
        res.status(400).send({
          msg: 'Please pass name'
        })
      } else {
        const result = await permissionService.createPermission(req.body.name, req.body.code, req.body.desc, null, null);
        res.status(200).json({
          success: true,
          message: "ok"
        });
      }
    }
    catch (error) {
      res.status(400).send(error);
    }
  });

  /**
   * 更新排序 by Id
   */
  router.post('/update/index', async function (req, res) {
    try {
      if (!Array.isArray(req.body.list) || req.body.list.length <= 0) {
        res.status(400).send({
          msg: 'Please pass list'
        })
      }
      const result = await permissionService.findFullGroupById(req.params.id);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(400).send(error);
    }
  });



  router.post('/list', async function (req, res) {
    try {
      if (!req.body.list || req.body.list.length <= 0) {
        res.status(400).send({
          msg: 'Please pass list'
        })
      } else {

        const result = await permissionService.updateIndexByList(req.body.list)
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

  /**
   * 取得群組權限
   */
  router.get('/group', async function (req, res) {
    try {
      const result = await permissionService.findAllGroup();
      res.status(200).json(result);
    }
    catch (error) {
      res.status(400).send(error);
    }
  });

  /**
   * 取得群組 by Id
   */
  router.get('/group/:id', async function (req, res) {
    try {
      if (!req.params.id) {
        res.status(400).send({
          msg: 'Please pass id'
        })
      }
      const result = await permissionService.findFullGroupById(req.params.id);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(400).send(error);
    }
  });

  /**
   * 取得群組 by permCode
   */
  router.get('/permCode/:permCode', async function (req, res) {
    try {
      if (!req.params.permCode) {
        res.status(400).send({
          msg: 'Please pass permCode'
        })
      }
      const result = await permissionService.findParentGroupByPermCode(req.params.permCode);
      res.status(200).json(result);
    }
    catch (error) {
      console.log(error)
      res.status(400).send(error);
    }
  });


  /**
   * 取得完整群組 by Id
   */
  router.get('/fullGroup/:id', async function (req, res) {
    try {
      if (!req.params.id) {
        res.status(400).send({
          msg: 'Please pass id'
        })
      }
      const result = await permissionService.findFullGroupById(req.params.id);
      res.status(200).json(result);
    }
    catch (error) {
      res.status(400).send(error);
    }
  });

  return router;
}