const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', function(req, res, next) {
	const reservations = db.getReservations();
	const result = reservations.chain().simplesort('RestaurantId').data();
	res.send(result);
});

module.exports = router;
