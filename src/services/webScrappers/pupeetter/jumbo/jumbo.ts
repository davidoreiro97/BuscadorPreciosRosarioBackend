import { getBrowser } from "../browserInstance";
import { scrollDown } from "./funciones/scrolDown";
import { getResultsSearch } from "./funciones/getResultsSearch";
export async function jumboScrapper(nombreProducto: string) {
	let resultadoBusqueda = [];
	//No se realiza una ordenada por precio en el mismo scrap o página ya que el buscador de la página funciona mal.
	let url_pagina_supermercado = `https://www.jumbo.com.ar/${nombreProducto}?_q=${nombreProducto}&map=ft`;
	const browser = await getBrowser();
	const pagina = await browser.newPage();
	pagina.setDefaultNavigationTimeout(45000); //Tiempo de espera máximo para la navegación.
	await pagina.setRequestInterception(true);
	pagina.on("request", (request) => {
		if (
			request.resourceType() === "stylesheet" ||
			request.resourceType() === "image" ||
			request.resourceType() === "font" ||
			request.resourceType() === "media" ||
			//request.resourceType() === "script" ||
			request.resourceType() === "fetch" ||
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
	let nombreFormatoQuery = encodeURIComponent(nombreProducto);
	await pagina.setCookie(
		{
			name: "biggy-search-history",
			value: `${nombreFormatoQuery}`,
			domain: "www.jumbo.com.ar",
		},
		{
			name: "CheckoutOrderFormOwnership",
			value: "",
			domain: "www.hiperlibertad.com.ar",
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
		await pagina.waitForSelector("#gallery-layout-container", {
			timeout: 30000,
		});
		await scrollDown(pagina);
		try {
			await pagina.waitForSelector(
				".vtex-product-summary-2-x-clearLink.h-100.flex.flex-column"
			);
			await pagina.waitForSelector(
				".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
			);
			await pagina.waitForSelector(
				".jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w"
			);
			await pagina.waitForSelector(
				".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image"
			);
			resultadoBusqueda = await pagina.evaluate(getResultsSearch);
		} catch (error: any) {
			if (error.name === "TimeoutError") {
				console.log(
					"Se excedio el tiempo de espera límite al realizar la busqueda en la página."
				);
				resultadoBusqueda = [];
			} else {
				console.error("Error al obtener los resultados de búsqueda:", error);
				resultadoBusqueda = [];
			}
		}
	} catch (error: any) {
		if (error.name === "TimeoutError") {
			try {
				await pagina.waitForSelector(
					".lh-copy.vtex-rich-text-0-x-paragraph.vtex-rich-text-0-x-paragraph--list-opss-green-title"
				);
				console.log("Busqueda sin resultados.");
			} catch (e) {
				console.log(
					"Se excedio el tiempo de espera límite al realizar la busqueda en la página."
				);
			} finally {
				resultadoBusqueda = [];
			}
		} else {
			console.log("No existen resultados para esta busqueda");
			resultadoBusqueda = [];
		}
	} finally {
		await pagina.close();
		return resultadoBusqueda;
	}
}
