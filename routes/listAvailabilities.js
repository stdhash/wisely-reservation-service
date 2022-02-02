const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', function(req, res, next) {
	const availabilities = db.getAvailabilities();
	const result = availabilities.chain().simplesort('DateTime').data();
	res.send(result);
});

module.exports = router;
