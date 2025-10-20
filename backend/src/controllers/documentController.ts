import { Request, Response } from 'express';
import * as documentService from '../services/documentService';

export async function createDocument(req: Request, res: Response) {
  try {
    const documentData = req.body;
    const newDocument = await documentService.createDocument(documentData);
    res.status(201).json(newDocument);
  } catch (error: any) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getDocumentById(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const document = await documentService.getDocumentById(Number(codigo));
    
    if (!document) {
      return res.status(404).json({ error: 'Documento não encontrado' });
    }
    
    res.json(document);
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getDocumentsByPatient(req: Request, res: Response) {
  try {
    const { codigo_paciente } = req.params;
    const documents = await documentService.getDocumentsByPatient(Number(codigo_paciente));
    res.json(documents);
  } catch (error: any) {
    console.error('Error fetching patient documents:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getDocumentsByClinic(req: Request, res: Response) {
  try {
    const { codigo_clinica } = req.params;
    const documents = await documentService.getDocumentsByClinic(Number(codigo_clinica));
    res.json(documents);
  } catch (error: any) {
    console.error('Error fetching clinic documents:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getDocumentsByPatientAndClinic(req: Request, res: Response) {
  try {
    const { codigo_paciente, codigo_clinica } = req.params;
    const documents = await documentService.getDocumentsByPatientAndClinic(
      Number(codigo_paciente),
      Number(codigo_clinica)
    );
    res.json(documents);
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const result = await documentService.deleteDocument(Number(codigo));
    res.json(result);
  } catch (error: any) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateDocument(req: Request, res: Response) {
  try {
    const { codigo } = req.params;
    const updates = req.body;
    const updatedDocument = await documentService.updateDocument(Number(codigo), updates);
    res.json(updatedDocument);
  } catch (error: any) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: error.message });
  }
}
