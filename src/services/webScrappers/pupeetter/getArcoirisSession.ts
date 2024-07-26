import { getBrowser } from "./browserInstance";
import { setCacheVar, getCacheVar } from "../../cache/variablesEnCache";
export const getArcoirisSession = async () => {
	//La idea es mantener siempre la pestaña abierta para mantener el sessionID de asp y refrescarla cada 15m.
	const urlFetch = "https://arcoirisencasa.com.ar/Login.asp";
	const browser = await getBrowser();
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(60000);
	await page.setRequestInterception(true);
	page.on("request", (request) => {
		if (
			request.resourceType() === "stylesheet" ||
			request.resourceType() === "image" ||
			request.resourceType() === "font" ||
			request.resourceType() === "media" ||
			request.resourceType() === "script" ||
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
	await page.goto(urlFetch, {
		waitUntil: "networkidle2",
	});
	let cookies = await page.cookies();
	let sessionCookie = cookies.find((cookie) =>
		cookie.name.startsWith("ASPSESSIONID")
	);
	if (!sessionCookie) {
		throw new Error(
			"No se pudo encontrar una cookie de session para ARCOIRIS."
		);
	}
	await setCacheVar(
		"ARCOIRIS_ASP_SESSION_NAME",
		(sessionCookie?.name as string) ||
			((await getCacheVar("ARCOIRIS_ASP_SESSION_NAME")) as string)
	);
	await setCacheVar(
		"ARCOIRIS_ASP_SESSION_VALUE",
		(sessionCookie?.value as string) ||
			((await getCacheVar("ARCOIRIS_ASP_SESSION_VALUE")) as string)
	);

	setInterval(async () => {
		await page.reload({ waitUntil: "networkidle2" });
		cookies = await page.cookies();
		sessionCookie = cookies.find((cookie) =>
			cookie.name.startsWith("ASPSESSIONID")
		);
		await setCacheVar(
			"ARCOIRIS_ASP_SESSION_NAME",
			(sessionCookie?.name as string) ||
				((await getCacheVar("ARCOIRIS_ASP_SESSION_NAME")) as string)
		);
		await setCacheVar(
			"ARCOIRIS_ASP_SESSION_VALUE",
			(sessionCookie?.value as string) ||
				((await getCacheVar("ARCOIRIS_ASP_SESSION_VALUE")) as string)
		);
	}, 900000); // 900000ms = 15 minutos en milisegundos
};
