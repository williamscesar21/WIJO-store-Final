const express = require('express');
const router = express.Router();
const { VerStatisticsSellers } = require('../controllers/StatisticsSeller');

router.get('/:userId', VerStatisticsSellers);

module.exports = router