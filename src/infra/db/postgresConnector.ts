import pgPromise from "pg-promise";

export function connect() {
	const connection = pgPromise()(
		"postgres://postgres:123321@localhost:5432/app"
	);
	return connection;
}
