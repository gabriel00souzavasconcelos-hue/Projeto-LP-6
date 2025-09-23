import { Router } from "express";
import { patientController } from '../controllers/patientController';

const router = Router();

router.get("/", patientController.getAllPatients.bind(patientController));
router.get("/:codigo", patientController.getPatientById.bind(patientController));
router.post("/", patientController.createPatient.bind(patientController));
router.put("/:codigo", patientController.updatePatient.bind(patientController));
router.delete("/:codigo", patientController.deletePatient.bind(patientController));

export default router;
