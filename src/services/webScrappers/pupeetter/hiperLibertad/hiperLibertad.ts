import { getBrowser } from "../browserInstance";
import { getResultsSearch } from "./funciones/getResultsSearch";
import { scrollDown } from "./funciones/scrolDown";
export async function hiperLibertadScrapper(nombreProducto: string) {
	let resultadoBusqueda = [];
	const url_pagina_supermercado = `https://www.hiperlibertad.com.ar/${nombreProducto}?_q=${nombreProducto}&map=ft`;
	const browser = await getBrowser();
	const pagina = await browser.newPage();
	pagina.setDefaultNavigationTimeout(45000); //Tiempo de espera máximo para la navegación.
	let nombreFormatoQuery = encodeURIComponent(nombreProducto);
	await pagina.setCookie(
		{
			name: "CheckoutOrderFormOwnership",
			value: "true",
			domain: "www.hiperlibertad.com.ar",
		},
		{
			name: "store-name",
			value: "SANTA%2520FE%2520-%2520Hipermercado%2520Rosario",
			domain: "www.hiperlibertad.com.ar",
		},
		{
			name: "VTEXSC",
			value: "sc=11",
			domain: "www.hiperlibertad.com.ar",
		},
		{
			name: "storeType",
			value: "0",
			domain: "www.hiperlibertad.com.ar",
		},
		{
			name: "biggy-search-history",
			value: `${nombreFormatoQuery}`,
			domain: "www.hiperlibertad.com.ar",
		},
		{
			name: "store-sale-channel",
			value: "11",
			domain: "www.hiperlibertad.com.ar",
		},
		{
			name: "storeSelectorId",
			value: "111",
			domain: "www.hiperlibertad.com.ar",
		}
	);
	await pagina.setRequestInterception(true);
	pagina.on("request", (request) => {
		if (
			request.resourceType() === "stylesheet" ||
			request.resourceType() === "image" ||
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
	try {
		await pagina.goto(url_pagina_supermercado);
	} catch (err: any) {
		if (err.name === "TimeoutError") {
			console.log(
				"Se excedio el tiempo de espera límite al conectar con la página de HIPER LIBERTAD."
			);
		}
		await pagina.close();
		return (resultadoBusqueda = []);
	}
	await pagina.setViewport({ width: 1600, height: 900 });
	try {
		try {
			//Refrescar la página por que anda medio rara.
			let counter = 0;
			while (true && counter < 1) {
				await pagina.reload({
					waitUntil: ["networkidle0", "domcontentloaded"],
				});
				counter++;
			}
		} catch (error: any) {
			console.error("Error al refrescar la página  de HIPER LIBERTAD :", error);
			await pagina.close();
			return (resultadoBusqueda = []);
		}
		await pagina.waitForSelector("#gallery-layout-container", {
			timeout: 10000,
		});
		await scrollDown(pagina);
		try {
			await pagina.waitForSelector(
				".vtex-product-price-1-x-currencyContainer",
				{
					timeout: 5000,
				}
			);
			resultadoBusqueda = await pagina.evaluate(getResultsSearch);
		} catch (error: any) {
			if (error.name === "TimeoutError") {
				console.log(
					"Se excedio el tiempo de espera límite al realizar la busqueda en la página  de HIPER LIBERTAD. "
				);
				resultadoBusqueda = [];
			} else {
				console.error(
					"Error al obtener los resultados de búsqueda de HIPER LIBERTAD :",
					error
				);
				resultadoBusqueda = [];
			}
		}
	} catch (error: any) {
		if (error.name === "TimeoutError") {
			console.log(
				"Se excedio el tiempo de espera límite al realizar la busqueda en la página de HIPER LIBERTAD."
			);
			resultadoBusqueda = [];
		} else {
			console.log("No existen resultados para esta busqueda en HIPER LIBERTAD");
			resultadoBusqueda = [];
		}
	} finally {
		console.log(resultadoBusqueda);
		await pagina.close();
		return resultadoBusqueda;
	}
}
