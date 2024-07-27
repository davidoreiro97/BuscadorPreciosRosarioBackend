import { getBrowser } from "../browserInstance";
import { scrollDown } from "./funcionesJsCliente/scrollDown";
import { getResultsSearch } from "./funcionesJsCliente/getResultsSearch";
export async function carrefourScrapper(nombreProducto: string) {
	let resultadoBusqueda = [];
	let url_pagina_supermercado = `https://www.carrefour.com.ar/${nombreProducto}?_q=${nombreProducto}&map=ft`;
	const browser = await getBrowser();
	const pagina = await browser.newPage();
	pagina.setDefaultNavigationTimeout(60000); //Tiempo de espera máximo para la navegación.
	await pagina.setRequestInterception(true);
	pagina.on("request", (request) => {
		if (
			//request.resourceType() === "stylesheet" ||
			request.resourceType() === "image" ||
			request.resourceType() === "font" ||
			request.resourceType() === "media" ||
			//request.resourceType() === "script" ||
			//request.resourceType() === "fetch" ||
			//request.resourceType() === "xhr" ||
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
	let nombreFormatoQuery = encodeURIComponent(nombreProducto);
	await pagina.setCookie(
		{
			name: "biggy-search-history",
			value: `${nombreFormatoQuery}`,
			domain: "www.carrefour.com.ar",
		},
		{
			name: "CheckoutOrderFormOwnership",
			value: "",
			domain: "www.carrefour.com.ar",
		}
	);
	try {
		await pagina.setViewport({ width: 1600, height: 1080 });
		await pagina.goto(url_pagina_supermercado);
	} catch (err: any) {
		if (err.name === "TimeoutError") {
			console.log(
				"Se excedio el tiempo de espera límite al conectar con la página."
			);
		}
		await pagina.close();
		return (resultadoBusqueda = []);
	}

	try {
		await scrollDown(pagina);
		await pagina.waitForSelector(
			".valtech-carrefourar-search-result-0-x-gallery.flex.flex-row.flex-wrap.items-stretch.bn.ph1.na4.pl9-l",
			{
				timeout: 10000,
			}
		);
		try {
			try {
				await pagina.waitForSelector(
					".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
				);
				await pagina.waitForSelector(
					".valtech-carrefourar-product-price-0-x-currencyContainer"
				);
				await pagina.waitForSelector(
					".vtex-product-summary-2-x-clearLink.vtex-product-summary-2-x-clearLink--contentProduct.h-100.flex.flex-column"
				);
				await pagina.waitForSelector(
					".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image"
				);
			} catch (e) {
				console.error(e);
			}
			await scrollDown(pagina);
			resultadoBusqueda = await pagina.evaluate(getResultsSearch);
		} catch (error: any) {
			if (error.name === "TimeoutError") {
				console.log(
					"Se excedio el tiempo de espera límite al realizar la busqueda en la página del Carrefour."
				);
				resultadoBusqueda = [];
			} else {
				console.error(
					"Error al obtener los resultados de búsqueda en Carrefour:",
					error
				);
				resultadoBusqueda = [];
			}
		}
	} catch (error: any) {
		if (error.name === "TimeoutError") {
			try {
				await pagina.waitForSelector(
					".lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--titleNotFound"
				);
				console.log("Busqueda sin resultados.");
			} catch (e) {
				console.log(
					"Se excedio el tiempo de espera límite al realizar la busqueda en la página del Carrefour."
				);
			} finally {
				resultadoBusqueda = [];
			}
		} else {
			console.log("No existen resultados para esta busqueda en el Carrefour.");
			resultadoBusqueda = [];
		}
	} finally {
		await pagina.close();
		return resultadoBusqueda;
	}
}
