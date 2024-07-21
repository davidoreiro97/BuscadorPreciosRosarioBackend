import { Request, Response } from "express";
export const getCoordinatesController = (req: Request, res: Response) => {
	res.json({
		message:
			"Se enviaran las coordenadas como respuesta a un post en este endpoint.",
	});
};

export const testController = (req: Request, res: Response) => {
	res.json({
		message: "testeando router",
	});
};
