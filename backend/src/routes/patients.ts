import { Router } from "express";
import { patientController } from '../controllers/patientController';
import { authenticate, requirePaciente } from '../middlewares/authMiddleware';

const router = Router();

// Públicas — leitura não exige token
router.get("/",         patientController.getAllPatients.bind(patientController));
router.get("/:codigo",  patientController.getPatientById.bind(patientController));
router.post("/",        patientController.createPatient.bind(patientController)); // cadastro público

// Privadas — paciente só edita/deleta a si mesmo
router.put("/:codigo",    authenticate, requirePaciente, patientController.updatePatient.bind(patientController));
router.delete("/:codigo", authenticate, requirePaciente, patientController.deletePatient.bind(patientController));

export default router;