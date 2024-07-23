import { Request, Response } from "express";
import { errors } from "../types";
import { cheerioLaReinaScrapper } from "../services/webScrappers/cheerio/laReina/laReina";
export const scrapSupermercadosController = async (
	req: Request,
	res: Response
) => {
	// Se recibe el nombre del supermercado junto con el producto a buscar, se devuelve el titulo, el precio y el link al producto en el supermercado
	const supermercadoBuscado: string = req.body.nombreSupermercado;
	const productoBuscado: string = req.body.productoBuscado;
	// console.log(supermercadoBuscado, productoBuscado);
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
			return res.status(200).json({
				nombreSupermercado: "HIPERMERCADO LIBERTAD",
				productoBuscado: productoBuscado,
			});
			break;
		case "COTO":
			return res.status(200).json({
				nombreSupermercado: "COTO",
				productoBuscado: productoBuscado,
			});
			break;
		case "LA GALLEGA":
			return res.status(200).json({
				nombreSupermercado: "LA GALLEGA",
				productoBuscado: productoBuscado,
			});
			break;
		case "LA REINA":
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
			return res.status(200).json({
				nombreSupermercado: "JUMBO",
				productoBuscado: productoBuscado,
			});
			break;
		case "ARCOIRIS":
			return res.status(200).json({
				nombreSupermercado: "ARCOIRIS",
				productoBuscado: productoBuscado,
			});
			break;
		case "CARREFOUR":
			return res.status(200).json({
				nombreSupermercado: "CARREFOUR",
				productoBuscado: productoBuscado,
			});
			break;
		case "DAR":
			return res.status(200).json({
				nombreSupermercado: "DAR",
				productoBuscado: productoBuscado,
			});
			break;
		default:
			break;
	}
};
