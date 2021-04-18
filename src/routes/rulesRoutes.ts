import express from "express";
import { RulesController } from "../controllers/RulesController";
import { ToUpperCaseCards } from "../middlewares/ToUpperCaseCards";
import { validateCardValue } from "../middlewares/validateCardValue";
import { validateDuplicateCards } from "../middlewares/validateDuplicateCards";
import { validateNumberOfCards } from "../middlewares/validateNumberOfCards"
import { validateSuits } from "../middlewares/validateSuits";

const router = express.Router();
const rulesController = new RulesController();

router.post("/", ToUpperCaseCards, validateNumberOfCards, validateSuits, validateCardValue, validateDuplicateCards, rulesController.handle);

export { router }