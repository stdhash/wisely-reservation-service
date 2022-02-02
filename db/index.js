const loki = require("lokijs");

let db;
let reservations;
let availabilities;

exports.initDb = () => {
	if (!!db) {
		return;
	}
	db = new loki('wisely.db');
	availabilities = db.addCollection('availabilities');
	reservations = db.addCollection('reservations');
};

exports.getAvailabilities = () => {
	if (!!db && !!availabilities) {
		return availabilities;
	}

	throw new Error('Database not initiated');
};

exports.getReservations = () => {
	if (!!db && !!reservations) {
		return reservations;
	}

	throw new Error('Database not initiated');
};

exports.generateId = () => (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
