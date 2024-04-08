import express from "express";
import { SignupController } from "./controllers/SignupController";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	return await new SignupController().signup(req, res);
});

app.listen(3000);
