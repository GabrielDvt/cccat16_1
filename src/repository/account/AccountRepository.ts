import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";
import { connect } from "../../infra/db/postgresConnector";

interface CreateAccountData {
	id: string;
	name: string;
	email: string;
	cpf: string;
	carPlate: string;
	isPassenger: boolean;
	isDriver: boolean;
}

export class AccountRepository {
	connection: any;

	constructor() {
		const connection = connect();
		this.connection = connection;
	}

	async getByEmail(email: string) {
		const [acc] = await this.connection.query(
			"select * from cccat15.account where email = $1",
			[email]
		);

		return acc;
	}

	async create(data: CreateAccountData) {
		return await this.connection.query(
			"insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
			[
				data.id,
				data.name,
				data.email,
				data.cpf,
				data.carPlate,
				!!data.isPassenger,
				!!data.isDriver,
			]
		);
	}
}
