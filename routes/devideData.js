const router = require('express').Router();
const { Hour } = require('../models/hour');

router.post('/hour', async (req, res) => {
  let { deviceId, from, to } = req.body;
  let data = await Hour.distinct('instanceData', {
    deviceId,
    createdAt: {
      $gte: from,
      $lte: to,
    },
  });
  res.json(data);
});

router.post('/minute', async (req, res) => {
  let { deviceId, from, to } = req.body;
  from = parseInt(from);
  to = parseInt(to);
  // let data = await Hour.find(
  //   {
  //     deviceId,
  //     createdAt: {
  //       $gte: from,
  //       $lte: to,
  //     },
  //   },
  //   'data.instanceData'
  // );

  // let data = await Hour.aggregate([
  //   {
  //     $match: {
  //       deviceId: deviceId,
  //       createdAt: {
  //         $gte: from,
  //         $lte: to,
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       'data.instanceData': 1,
  //       _id: 0,
  //     },
  //   },
  //   {
  //     $limit: 15,
  //   },
  // ]);

  let data = await Hour.distinct('data.instanceData', {
    deviceId,
    createdAt: {
      $gte: from,
      $lte: to,
    },
  });

  data = data.slice(Math.max(data.length - 60, 1));

  res.json(data);
});

router.post('/second', async (req, res) => {
  let { deviceId, from, to } = req.body;
  let data = await Hour.distinct('data.data', {
    deviceId,
    createdAt: {
      $gte: from,
      $lte: to,
    },
  });

  data = data.slice(Math.max(data.length - 60, 1));

  res.json(data);
});

module.exports = router;
