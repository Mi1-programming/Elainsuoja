/** @format */

const {
	GetAnimalById,
	GetAnimalsByCategory,
	GetAnimals,
} = require("#src/db/animals.cjs");
const express = require("express");
const router = express.Router();

router.get("/api/category/animals/:category", async (req, res) => {
	try {
		const category = req.params.category;
		const result = await GetAnimalsByCategory(category);

		res.json(result);
	} catch (error) {
		console.error("Eläinten haku epäonnistui:", error.message);

		res.status(500).json({
			error: "Eläinten haku epäonnistui.",
		});
	}
});

router.get("/api/animals", async (req, res) => {
	try {
		const result = await GetAnimals();

		res.json(result);
	} catch (error) {
		console.error("Eläinten haku epäonnistui:", error.message);

		res.status(500).json({
			error: "Eläinten tietojen haku epäonnistui.",
		});
	}
});

router.get("/api/animals/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const result = await GetAnimalById(id);

		res.json(result);
	} catch (error) {
		console.error("Eläimen haku epäonnistui:", error.message);

		res.status(500).json({
			error: "Eläimen tietojen haku epäonnistui.",
		});
	}
});

router.post("/api/animals/:id/adopt", async (req, res) => {
	const animalId = Number(req.params.id);

	if (!Number.isInteger(animalId) || animalId < 1) {
		return res.status(400).json({
			error: "Virheellinen eläimen tunniste.",
		});
	}

	const application = {
		animal_id: animalId,
		applicant_name: req.body?.applicant_name,
		email: req.body?.email,
		phone: req.body?.phone,
		message: req.body?.message || "",
	};

	const adoptionServerUrl = (
		process.env.ADOPTION_SERVER_URL || "http://localhost:3001"
	).replace(/\/+$/, "");

	try {
		const response = await fetch(`${adoptionServerUrl}/adoptions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(application),
		});

		const result = await response.json().catch(() => ({
			error: "Adoptiopalvelin palautti virheellisen vastauksen.",
		}));

		return res.status(response.status).json(result);
	} catch (error) {
		console.error("Yhteys adoptiopalvelimeen epäonnistui:", error.message);

		return res.status(502).json({
			error: "Adoptiopalvelimeen ei saatu yhteyttä.",
		});
	}
});

module.exports = router;
