/** @format */

const fs = require("node:fs");
const path = require("node:path");
const { loadEnvFile } = require("node:process");

// Ladataan tämän palvelimen oma .env-tiedosto vain kerran,
// jos tiedosto on olemassa. Docker voi antaa asetukset suoraan.
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) loadEnvFile(envPath);

const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = Number(process.env.PORT || 3001);

const pool = new Pool();

app.use(express.json({ limit: "20kb" }));

// Terveystarkistus.
app.get("/health", (req, res) => {
	res.json({
		status: "ok",
		service: "adoption-server",
	});
});

// Server A välittää adoptiohakemukset tähän reittiin.
app.post("/adoptions", async (req, res) => {
	const animalId = Number(req.body?.animal_id);

	const applicantName =
		typeof req.body?.applicant_name === "string"
			? req.body.applicant_name.trim()
			: "";

	const email =
		typeof req.body?.email === "string" ? req.body.email.trim() : "";

	const phone =
		typeof req.body?.phone === "string" ? req.body.phone.trim() : "";

	const message =
		typeof req.body?.message === "string" ? req.body.message.trim() : "";

	// Tarkistetaan eläimen tunniste ja pakolliset tiedot.
	if (!Number.isInteger(animalId) || animalId < 1) {
		return res.status(400).json({
			error: "Virheellinen eläimen tunniste.",
		});
	}

	if (!applicantName || !email || !phone) {
		return res.status(400).json({
			error: "Nimi, sähköposti ja puhelinnumero ovat pakollisia.",
		});
	}

	if (
		applicantName.length > 150 ||
		email.length > 254 ||
		phone.length > 30 ||
		message.length > 3000
	) {
		return res.status(400).json({
			error: "Jokin hakemuksen kentistä on liian pitkä.",
		});
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return res.status(400).json({
			error: "Sähköpostiosoite ei ole kelvollinen.",
		});
	}

	let client;

	try {
		client = await pool.connect();

		await client.query("BEGIN");

		// Lukitaan eläimen rivi tarkistuksen ajaksi,
		// jotta samanaikaiset pyynnöt eivät varaa sitä kahdesti.
		const animalResult = await client.query(
			`SELECT id, name, status
             FROM animal
             WHERE id = $1
             FOR UPDATE`,
			[animalId],
		);

		if (animalResult.rowCount === 0) {
			await client.query("ROLLBACK");

			return res.status(404).json({
				error: "Eläintä ei löytynyt.",
			});
		}

		const animal = animalResult.rows[0];

		if (animal.status !== "available") {
			await client.query("ROLLBACK");

			return res.status(409).json({
				error: "Tämä eläin ei ole enää vapaana adoptoitavaksi.",
			});
		}

		// Tallennetaan hakemus.
		const adoptionResult = await client.query(
			`INSERT INTO adoptions
                (animal_id, applicant_name, email, phone, message)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, created_at`,
			[animalId, applicantName, email, phone, message],
		);

		// Päivitetään eläimen tila varatuksi.
		await client.query(
			`UPDATE animal
             SET status = 'reserved'
             WHERE id = $1`,
			[animalId],
		);

		// Hakemus ja tilamuutos vahvistetaan yhdessä.
		await client.query("COMMIT");

		return res.status(201).json({
			success: true,
			message: "Adoptiohakemus tallennettiin onnistuneesti.",
			adoptionId: adoptionResult.rows[0].id,
			animalId: animal.id,
			animalName: animal.name,
			status: "reserved",
			createdAt: adoptionResult.rows[0].created_at,
		});
	} catch (error) {
		if (client) {
			try {
				await client.query("ROLLBACK");
			} catch (rollbackError) {
				console.error("Tietokantatapahtuman peruminen epäonnistui.");
			}
		}

		console.error("Adoptiopyynnön käsittely epäonnistui:", error);

		return res.status(500).json({
			error: "Hakemuksen tallennus epäonnistui palvelinvirheen vuoksi.",
		});
	} finally {
		if (client) {
			client.release();
		}
	}
});

async function startServer() {
	try {
		app.listen(port, () => {
			console.log(
				`Adoptiopalvelin käynnissä osoitteessa http://localhost:${port}`,
			);
		});
	} catch (error) {
		console.error("Adoptiopalvelimen käynnistys epäonnistui:", error.message);

		await pool.end();
		process.exit(1);
	}
}

startServer();
