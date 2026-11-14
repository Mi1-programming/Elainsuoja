/** @format */

const pgPromise = require("pg-promise")({
	error(error, event) {
		console.error(error);

		if (event?.query) {
			let errorContext = `Error with query: "${event.query}"`;

			if (event.params) {
				errorContext += `, using parameters (${event.params})`;
			}

			console.warn(errorContext);
		}
	},
});

const connection = pgPromise({});

module.exports = {
	connection,
	pgPromise,
};
