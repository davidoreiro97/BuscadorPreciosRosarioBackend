import cheerio from "cheerio";
import { getCacheVar } from "../../../cache/variablesEnCache";
export const cheerioArcoirisScrapper = async (productoNombre: string) => {
	const session_name_asp = await getCacheVar("ARCOIRIS_ASP_SESSION_NAME");
	const session_value_asp = await getCacheVar("ARCOIRIS_ASP_SESSION_VALUE");
	console.log(
		`COOKIE DE ASP SESION PARA LA CONSULTA AL SUPERMERCADO ARCOIRIS: ${session_name_asp}=${session_value_asp}`
	);
	const urlFetch = `https://arcoirisencasa.com.ar/Productos.asp?cpoBuscar=${productoNombre}`;
	const productos: {
		titulo: string;
		precio: number;
		urlImagen: string;
		linkAProducto: string;
	}[] = [];
	try {
		const optionsFetch = {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"Accept-Language": "en-US,en;q=0.9",
				"Accept-Encoding": "gzip, deflate, br",
				Connection: "keep-alive",
				Cookie: `${session_name_asp}=${session_value_asp};cantP=50`,
				Dnt: "1",
				Host: "www.lagallega.com.ar",
				"Sec-Fetch-Dest": "document",
				"Sec-Fetch-Mode": "navigate",
				"Sec-Fetch-Site": "none",
				"Sec-Fetch-User": "?1",
				"Upgrade-Insecure-Requests": "1",
				Referer: "https://www.lagallega.com.ar/",
			},
		};
		let response = await fetch(urlFetch, optionsFetch);
		if (!response.ok) {
			throw new Error();
		}
		let resHTML = await response.text();
		const $ = cheerio.load(resHTML);
		$(".cuadProd").each((index, element) => {
			const titulo = $(element)
				.find(".desc.ColorSec1")
				.text()
				.replace(/\s+/g, " ")
				.trim();
			const precio = parseInt(
				$(element).find(".izq").text().trim().slice(1, -3).replace(".", "")
			);
			const linkAProducto = "https://arcoirisencasa.com.ar/Login.asp";
			const urlImagen =
				"https://arcoirisencasa.com.ar/" +
				$(element).find(".FotoProd img").attr("src");
			productos.push({ titulo, precio, urlImagen, linkAProducto });
		});
		//Si devolvemos productos vacio no hubo resultados.
		if (productos.length > 0) {
			productos.sort((a, b) => a.precio - b.precio);
		}
		return productos.slice(0, 20);
	} catch (e) {
		throw e;
	}
};
