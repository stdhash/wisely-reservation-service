const express = require('express');
const moment = require('moment');
const validator = require('validator');
const router = express.Router();
const db = require('../db');
const RESERVATION_GAP = 15;

router.post('/', function(req, res, next) {
	const availabilities = db.getAvailabilities();

	try {
		validateData(req.body);

		const requestedDate = moment(req.body.DateTime);
		const conflictingAvailabilities = availabilities.where(obj => {
			return Math.abs(moment(obj.DateTime).diff(requestedDate, 'm')) < RESERVATION_GAP &&
				obj.RestaurantId === req.body.RestaurantId;
		});

		if (!!conflictingAvailabilities.length) {
			throw new Error(`Reservation availability needs to be ${RESERVATION_GAP} minutes apart`);
		}

		for (let i = 0; i < req.body.ReservationCount; i++) {
			let newAvailability = {
				AvailabilityId: db.generateId(),
				RestaurantId: req.body.RestaurantId,
				DateTime: req.body.DateTime,
				PartySize: req.body.PartySize
			};

			availabilities.insert(newAvailability);
		}
		res.send('Availability created successfully');
	} catch (err) {
		err.status = 400;
		next(err);
	}
});

const validateData = (data) => {
	if (validator.isEmpty(data.RestaurantId)) {
		throw new Error('RestaurantId is required');
	}

	if (validator.isEmpty(data.DateTime)) {
		throw new Error('DateTime is required');
	}

	if (!validator.isInt('' + data.ReservationCount)) {
		throw new Error('ReservationCount must be number');
	}

	if (!validator.isInt('' + data.PartySize)) {
		throw new Error('PartySize must be number');
	}
};

module.exports = router;
