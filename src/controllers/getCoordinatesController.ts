import { Request, Response } from "express";
import { errors } from "../types";
export const getCoordinatesController = async (req: Request, res: Response) => {
	//Se recibe el nombre de una calle junto con su altura, se hace un fetch a
	//una api de geocodificación y de esta respuesta devolvemos las coordenadas y el nombre de la dirección
	const direccionIngresada: string = req.body.direccionIngresada;
	if (!(typeof direccionIngresada === "string")) {
		return res.status(400).json({
			errorType: errors.type.invalid_data,
			message: errors.message.invalid_data,
		});
	}
	const api_key = process.env.API_KEY_GEOCODE;
	const queryParams = direccionIngresada.trim().split(" ").join("+");
	const urlGeocodeAPI = `https://geocode.search.hereapi.com/v1/geocode?q=${queryParams}+Rosario+,Santa+Fe+Argentina&apiKey=${api_key}`;
	let direccion: string;

	try {
		const response = await fetch(urlGeocodeAPI);
		if (!response.ok) {
			//Lanzo el error.
			throw new Error("Error en la solicitud a la API de geocodificación");
		}

		const datosUbicacionJson = await response.json();
		const { lat: latitud, lng: longitud } =
			datosUbicacionJson.items[0].position;

		if (datosUbicacionJson.items[0].address.houseNumber == undefined) {
			return res.status(404).json({
				errorType: errors.type.address_not_found,
				error: errors.message.address_not_found,
			});
		}

		direccion = datosUbicacionJson.items[0].address.label;
		res.status(200);
		res.json({ latitud, longitud, direccion });
	} catch (e: any) {
		//Atrapo el error y si este contiene el texto devuelvo un 502.
		console.error("Error haciendo la solicitud a GeoCode", e);
		if (e.message.includes("solicitud a la API de geocodificación")) {
			return res.status(502).json({
				errorType: errors.type.api_error,
				message: errors.message.api_error,
			});
		}
		return res.status(500).json({
			errorType: errors.type.unknown_error,
			message: errors.message.unknown_error,
		});
	}
};
