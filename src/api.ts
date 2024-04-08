import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validators/validateCpf";
import { validateName } from "./validators/validateName";
import { validateEmail } from "./validators/validateEmail";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	let result;
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		const name = req.body.name;
		const email = req.body.email;
		const cpf = req.body.cpf;

		const [acc] = await connection.query(
			"select * from cccat15.account where email = $1",
			[req.body.email]
		);

		if (acc) {
			result = -4;
		}

		if (!validateName(name)) {
			return -3;
		}

		if (!validateEmail(email)) {
			return -2;
		}

		if (!validate(cpf)) {
			return -1;
		}

		if (req.body.isDriver) {
			if (req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
				await connection.query(
					"insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
					[
						id,
						req.body.name,
						req.body.email,
						req.body.cpf,
						req.body.carPlate,
						!!req.body.isPassenger,
						!!req.body.isDriver,
					]
				);

				const obj = {
					accountId: id,
				};
				result = obj;
			} else {
				// invalid car plate
				result = -5;
			}
		} else {
			await connection.query(
				"insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
				[
					id,
					req.body.name,
					req.body.email,
					req.body.cpf,
					req.body.carPlate,
					!!req.body.isPassenger,
					!!req.body.isDriver,
				]
			);

			const obj = {
				accountId: id,
			};
			result = obj;
		}

		if (typeof result === "number") {
			res.status(422).send(result + "");
		} else {
			res.json(result);
		}
	} finally {
		await connection.$pool.end();
	}
});

app.listen(3000);
