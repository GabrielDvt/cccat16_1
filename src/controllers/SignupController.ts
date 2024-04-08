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
		console.log(data);
		const result = await signup(data);

		if (typeof result === "number") return res.status(422).send(result + "");

		return res.json(result);
	}
}
