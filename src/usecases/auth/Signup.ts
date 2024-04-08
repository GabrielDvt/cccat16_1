import { validate } from "../../helpers/validators/validateCpf";
import { validateEmail } from "../../helpers/validators/validateEmail";
import { validateName } from "../../helpers/validators/validateName";
import { connect } from "../../infra/db/postgresConnector";

export interface SignupData {
	name: string;
	email: string;
	cpf: string;
	isDriver: boolean;
	isPassenger: boolean;
	carPlate: string;
}

export async function signup(data: SignupData) {
	const { name, email, cpf, carPlate, isPassenger, isDriver } = data;

	let result;

	try {
		const connection = connect();

		const id = crypto.randomUUID();

		const [acc] = await connection.query(
			"select * from cccat15.account where email = $1",
			[email]
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

		if (isDriver) {
			if (carPlate.match(/[A-Z]{3}[0-9]{4}/)) {
				await connection.query(
					"insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
					[id, name, email, cpf, carPlate, !!isPassenger, !!isDriver]
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
				[id, name, email, cpf, carPlate, !!isPassenger, !!isDriver]
			);

			const obj = {
				accountId: id,
			};
			result = obj;
		}

		return result;
	} finally {
		await connection.$pool.end();
	}
}
