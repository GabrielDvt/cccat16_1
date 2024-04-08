import { validateCarPlate } from "../../helpers/validators/validateCarPlate";
import { validate } from "../../helpers/validators/validateCpf";
import { validateEmail } from "../../helpers/validators/validateEmail";
import { validateName } from "../../helpers/validators/validateName";
import { AccountRepository } from "../../repository/account/AccountRepository";

export interface SignupData {
	name: string;
	email: string;
	cpf: string;
	isDriver: boolean;
	isPassenger: boolean;
	carPlate: string;
}

const INVALID_CPF_ERROR = -1;
const INVALID_EMAIL_ERROR = -2;
const INVALID_NAME_ERROR = -3;
const INVALID_ACCOUNT_ERROR = -4;
const INVALID_CAR_PLATE = -5;

export async function signup(data: SignupData) {
	const { name, email, cpf, carPlate, isPassenger, isDriver } = data;

	const repository = new AccountRepository();

	let result;

	try {
		const id = crypto.randomUUID();

		const acc = await repository.getByEmail(email);

		if (acc) {
			return INVALID_ACCOUNT_ERROR;
		}

		if (!validateName(name)) {
			return INVALID_NAME_ERROR;
		}

		if (!validateEmail(email)) {
			return INVALID_EMAIL_ERROR;
		}

		if (!validate(cpf)) {
			return INVALID_CPF_ERROR;
		}

		if (isDriver && !validateCarPlate(carPlate)) {
			return INVALID_CAR_PLATE;
		}

		await repository.create({
			id,
			name,
			email,
			cpf,
			carPlate,
			isPassenger,
			isDriver,
		});

		const obj = {
			accountId: id,
		};

		result = obj;

		return result;
	} finally {
		// await connection.$pool.end();
	}
}
