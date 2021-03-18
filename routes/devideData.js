const router = require('express').Router();
const { Hour } = require('../models/hour');

router.post('/', async (req, res) => {
  let { deviceId, from, to } = req.body;
  let data = await Hour.find({
    deviceId,
    createdAt: {
      $gte: from,
      $lte: to,
    },
  });
  res.json(data);
});

module.exports = router;
