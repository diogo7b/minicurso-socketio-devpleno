var express = require('express');
var router = express.Router();
const db = require('./database');
const _ =require('lodash');

const matchesController = require('../controllers/matchesController')

/* GET home page. */
router.get('/', matchesController.index);

router.get('/match/:id', matchesController.uniqueIndex);

module.exports = router;
