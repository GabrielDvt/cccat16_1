import { Request, Response } from "express";
import { SignupData, signup } from "../usecases/auth/Signup";

export class SignupController {
	async signup(req: Request, res: Response) {
		const data: SignupData = {
			name: req.body.name,
			cpf: req.body.cpf,
			email: req.body.email,
			isDriver: req.body.isDriver ?? false,
			isPassenger: req.body.isPassenger ?? false,
			carPlate: req.body.carPlate,
		};

		const result = await signup(data);

		if (typeof result === "number") {
			res.status(422).send(result + "");
		} else {
			res.json(result);
		}
	}
}
