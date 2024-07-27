import { Request, Response } from "express";
import { errors } from "../types";
import { cheerioLaReinaScrapper } from "../services/webScrappers/cheerio/laReina/laReina";
import { cheerioLaGallegaScrapper } from "../services/webScrappers/cheerio/laGallega/laGallega";
import { cheerioDarScrapper } from "../services/webScrappers/cheerio/dar/dar";
import { carrefourScrapper } from "../services/webScrappers/pupeetter/carrefour/carrefour";
import { cheerioArcoirisScrapper } from "../services/webScrappers/cheerio/arcoiris/arcoiris";
import { cotoScrapper } from "../services/webScrappers/pupeetter/coto/coto";
import { jumboScrapper } from "../services/webScrappers/pupeetter/jumbo/jumbo";
import { hiperLibertadScrapper } from "../services/webScrappers/pupeetter/hiperLibertad/hiperLibertad";
export const scrapSupermercadosController = async (
	req: Request,
	res: Response
) => {
	// Se recibe el nombre del supermercado junto con el producto a buscar, se devuelve el titulo, el precio, el link al producto en el supermercado y el link a la imagen en el cdn.
	const supermercadoBuscado: string = req.body.nombreSupermercado;
	const productoBuscado: string = req.body.productoBuscado;
	let productos: {
		titulo: string;
		precio: number;
		linkAProducto: string;
	}[] = [];
	if (
		!(
			typeof supermercadoBuscado === "string" &&
			typeof productoBuscado === "string" &&
			(supermercadoBuscado.trim().length !== 0 ||
				productoBuscado.trim().length !== 0)
		)
	) {
		return res.status(400).json({
			errorType: errors.type.invalid_data,
			message: errors.message.invalid_data,
		});
	}

	switch (supermercadoBuscado) {
		case "HIPERMERCADO LIBERTAD":
			console.log(
				"════════════════════> Haciendo web scrapping de HIPERMERCADO LIBERTAD..."
			);
			try {
				productos = await hiperLibertadScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		case "COTO":
			console.log("════════════════════> Haciendo web scrapping de Coto...");
			try {
				productos = await cotoScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		case "LA GALLEGA":
			console.log(
				"════════════════════> Haciendo web scrapping de La Gallega..."
			);
			try {
				productos = await cheerioLaGallegaScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
		case "LA REINA":
			console.log(
				"════════════════════> Haciendo web scrapping de La Reina..."
			);
			try {
				productos = await cheerioLaReinaScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		case "JUMBO":
			console.log("════════════════════> Haciendo web scrapping de Jumbo...");
			try {
				productos = await jumboScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		case "ARCOIRIS":
			console.log(
				"════════════════════> Haciendo web scrapping de Arcoiris..."
			);
			try {
				productos = await cheerioArcoirisScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		case "CARREFOUR":
			console.log(
				"════════════════════> Haciendo web scrapping de Carrefour..."
			);
			try {
				productos = await carrefourScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		case "DAR":
			console.log("════════════════════> Haciendo web scrapping del DAR...");
			try {
				productos = await cheerioDarScrapper(productoBuscado);
				return res.status(200).json({ productos });
			} catch (error) {
				return res.status(500).json({
					errorType: errors.type.fetch_error,
				});
			}
			break;
		default:
			return res.status(400).json({
				errorType: errors.type.invalid_data,
				message: errors.message.invalid_data,
			});
			break;
	}
};
