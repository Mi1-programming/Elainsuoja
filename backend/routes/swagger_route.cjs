/** @format */

const fs = require("fs");
const path = require("path");
const { dirname } = require("node:path");
const yaml = require("js-yaml");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
router = express.Router();

const rootDir = dirname(process.argv[1]);

const swaggerDocument = yaml.load(
	fs.readFileSync(path.join(rootDir, "./swagger.yaml"), "utf8"),
);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
