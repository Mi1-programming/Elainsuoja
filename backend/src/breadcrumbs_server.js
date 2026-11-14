/** @format */

async function BuildBreadcrumbs(req, formatters) {
	const routeParts = req.route.path.split("/").filter(Boolean);
	const urlParts = req.path.split("/").filter(Boolean);

	var paths = routeParts.map(function (value, index) {
		return { route: value, url: urlParts[index] };
	});

	const parts = [];
	for await (const path of paths) {
		const part = {
			name: path.url,
			path: path.url,
		};
		const formatter = formatters[path.route];

		if (formatter != undefined) {
			await formatter(part, req);
		}

		parts.push(part);
	}
	const jsonParts = JSON.stringify(parts);
	return jsonParts;
}

function MakeBreadcrumbMiddleware(config) {
	return (req, res, next) => {
		BuildBreadcrumbs(req, config.formatters).then((result) => {
			req.breadcrumbs = result;
			next();
		});
	};
}

module.exports = {
	MakeBreadcrumbMiddleware,
};
