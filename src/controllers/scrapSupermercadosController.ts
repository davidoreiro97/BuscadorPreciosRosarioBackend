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
	//Objeto con todos los scrappers

	const scrapers: {
		[key: string]: (nombreProducto: string) => Promise<any[]>;
	} = {
		"HIPERMERCADO LIBERTAD": hiperLibertadScrapper,
		//Es posible que nos baneen del coto.
		COTO: cotoScrapper,
		"LA GALLEGA": cheerioLaGallegaScrapper,
		"LA REINA": cheerioLaReinaScrapper,
		JUMBO: jumboScrapper,
		ARCOIRIS: cheerioArcoirisScrapper,
		CARREFOUR: carrefourScrapper,
		DAR: cheerioDarScrapper,
	};
	//Se elije el scrapper basandose en el supermercadoBuscado el cual es la key del objeto anterior.
	if (!scrapers[supermercadoBuscado]) {
		//Si el nombre del supermercado no existe se devuelve invalid_data.
		return res.status(400).json({
			errorType: errors.type.invalid_data,
			message: errors.message.invalid_data,
		});
	}
	const scraper = scrapers[supermercadoBuscado];
	console.log(
		` <════════════════════> Haciendo web scrapping de ${supermercadoBuscado} <════════════════════> `
	);
	try {
		//Le pasamos el producto buscado al scrapper seleccionado.
		productos = await scraper(productoBuscado);
		return res.status(200).json({ productos });
	} catch (error: any) {
		console.error("------------> ERROR EN EL SCRAPPER <-------------");
		console.log(error);
		if (error.message === "IP_BLOCKED") {
			return res.status(500).json({
				errorType: "IP_BLOCKED",
				message: "IP BLOQUEADA POR EL SUPERMERCADO.",
			});
		} else {
			return res.status(500).json({
				errorType: errors.type.fetch_error,
			});
		}
	}
};
