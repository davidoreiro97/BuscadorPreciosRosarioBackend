//Lleva un historial de las request, en un futuro se debe hacer "rotacion de archivos" para que el log no crezca indefinidamente.
import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

// Ruta del archivo de log, revisarla luego
const logFilePath = path.join(__dirname, "../../logs/request/", "requests.log");

// Middleware para registrar solicitudes en un archivo
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// Formato del mensaje de log, mejorar en algún momento con muchos más detalles.
	const fecha = new Date().toLocaleDateString();
	const hora = new Date().toLocaleTimeString();
	const logMessage = `Solicitud desde : ${req.headers.origin}, Metodo : ${req.method} Al recurso : ${req.url} - ${fecha} ${hora}\n`;
	// Escribir el mensaje de log en el archivo
	fs.appendFile(logFilePath, logMessage, (err) => {
		if (err) {
			console.error("Error al escribir en el archivo de log", err);
		}
	});

	next();
};

export default loggerMiddleware;
