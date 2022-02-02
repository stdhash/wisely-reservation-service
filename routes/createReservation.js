const express = require('express');
const validator = require('validator');
const router = express.Router();
const db = require('../db');

router.post('/', function(req, res, next) {
	const availabilities = db.getAvailabilities();
	const reservations = db.getReservations();

	try {
		validateData(req.body);

		const availabiity = availabilities.findOne({AvailabilityId: req.body.AvailabilityId});
		const reservation = reservations.findOne({AvailabilityId: req.body.AvailabilityId});

		if (!availabiity || availabiity.RestaurantId !== req.body.RestaurantId) {
			throw new Error('Availability option not found');
		}

		if (availabiity.PartySize < req.body.PartySize) {
			throw new Error('Party size is too big for reservation')
		}

		if (!!reservation) {
			throw new Error('Availability option already booked');
		}

		let newReservation = {
			BookingId: db.generateId(),
			AvailabilityId: req.body.AvailabilityId,
			RestaurantId: req.body.RestaurantId,
			Name: req.body.Name,
			Email: req.body.Email,
			PartySize: req.body.PartySize,
			Time: req.body.Time
		};

		reservations.insert(newReservation);
		res.send('Reservation created successfully');
	} catch (err) {
		err.status = 400;
		next(err);
	}
});

const validateData = (data) => {
	if (validator.isEmpty(data.RestaurantId)) {
		throw new Error('RestaurantId is required');
	}

	if (validator.isEmpty(data.AvailabilityId)) {
		throw new Error('AvailabilityId is required');
	}

	if (validator.isEmpty(data.Name)) {
		throw new Error('Name cannot be empty');
	}

	if (!validator.isInt('' + data.PartySize)) {
		throw new Error('PartySize must be number');
	}

	if (!validator.isEmail(data.Email)) {
		throw new Error('Invalid Email');
	}

	if (validator.isEmpty(data.Time)) {
		throw new Error('DateTime is required');
	}
};

module.exports = router;
