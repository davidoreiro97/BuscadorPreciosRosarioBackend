import { getBrowser } from "../browserInstance";
import { getResultsSearch } from "./funcionesJsCliente/getResultsSearch";
import { orderSearch } from "./funcionesJsCliente/orderSearch";
import { postSearch } from "./funcionesJsCliente/postSearch";
export async function cotoScrapper(nombreProducto: string) {
	let resultadoBusqueda = [];
	const url_pagina_supermercado = `https://www.cotodigital3.com.ar/sitios/cdigi/`;
	const browser = await getBrowser();
	const pagina = await browser.newPage();
	pagina.setDefaultNavigationTimeout(10000); //Tiempo de espera máximo para la navegación.
	await pagina.setRequestInterception(true);
	pagina.on("request", (request) => {
		if (
			request.resourceType() === "stylesheet" ||
			//request.resourceType() === "image" ||
			request.resourceType() === "font" ||
			request.resourceType() === "media" ||
			//request.resourceType() === "script" ||
			//request.resourceType() === "fetch" ||
			request.resourceType() === "xhr" ||
			request.resourceType() === "texttrack" ||
			request.resourceType() === "eventsource" ||
			request.resourceType() === "websocket" ||
			request.resourceType() === "manifest"
		) {
			request.abort(); // Cancela la carga de la imagen ,archivo css y fuentes.
		} else {
			request.continue(); // Continuar con la solicitud de otros recursos
		}
	});
	await pagina.setViewport({ width: 1600, height: 900 });
	try {
		await pagina.goto(url_pagina_supermercado);
		await pagina.reload({ waitUntil: "domcontentloaded" });
		await pagina.waitForSelector("#searchForm");
		await pagina.evaluate(postSearch, nombreProducto);
	} catch (err: any) {
		if (err.name === "TimeoutError") {
			console.log(
				"Se excedio el tiempo de espera límite al conectar con la página."
			);
		}
		await pagina.close();
		throw err;
	}

	try {
		try {
			await pagina.waitForSelector("#products", {
				timeout: 15000,
			});
			await pagina.waitForSelector("#sortBySelect");
			await pagina.evaluate(orderSearch);
			return (resultadoBusqueda = []);
		} catch (e: any) {
			try {
				await pagina.waitForSelector(".notice");
				throw new Error("IP_BLOCKED");
			} catch (e: any) {
				if (e.message === "IP_BLOCKED") {
					//Lanzo IP_BLOQUED al bloque catch que contiene a este.
					throw e;
				}
				if (e.name === "TimeoutError") {
					console.log(
						"Se excedio el tiempo de espera límite al realizar la busqueda en la página."
					);
					throw e;
				} else {
					await pagina.waitForSelector(
						".atg_store_noMatchingItem atg_store_generalMessage",
						{
							timeout: 15000,
						}
					);
					// console.log("Sin resultados");
					resultadoBusqueda = [];
				}
			}
		}

		try {
			await pagina.waitForSelector(".atg_store_newPrice", {
				timeout: 30000,
			});
			await pagina.waitForSelector(".atg_store_productImage", {
				timeout: 30000,
			});
			resultadoBusqueda = await pagina.evaluate(getResultsSearch);
		} catch (error: any) {
			if (error.name === "TimeoutError") {
				console.log(
					"Se excedio el tiempo de espera límite al realizar la busqueda en la página. COTO"
				);
				resultadoBusqueda = [];
			}
			console.log("Error al obtener los resultados de búsqueda COTO :", error);
			resultadoBusqueda = [];
		}
		return (resultadoBusqueda = []);
	} catch (error: any) {
		if (error.message === "IP_BLOCKED") {
			throw Error("IP_BLOCKED");
		}
		if (error.name === "TimeoutError") {
			console.log(
				"Se excedio el tiempo de espera límite al realizar la busqueda en la página COTO."
			);
			throw error;
		}
		console.log("No existen resultados para esta busqueda COTO");
		return (resultadoBusqueda = []);
	} finally {
		await pagina.close();
	}
}
