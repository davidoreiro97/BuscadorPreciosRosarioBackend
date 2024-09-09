//Punto de entrada a la app express.
import { getLaGallegaSession } from "./services/webScrappers/pupeetter/getLaGallegaSession";
import { getDarSession } from "./services/webScrappers/pupeetter/getDarSession";
import { getArcoirisSession } from "./services/webScrappers/pupeetter/getArcoirisSession";
import app from "./app";
import {
	getBrowser,
	closeBrowser,
} from "./services/webScrappers/pupeetter/browserInstance";
const PORT: number = parseInt(process.env.PORT as string) || 3000;
const LISTEN_ADDRESS: string = process.env.HOST || "0.0.0.0";

app.listen(PORT, LISTEN_ADDRESS, async () => {
	await getBrowser();
	console.log("|---> Abriendo pestañas para generar sesiones...");
	await getLaGallegaSession();
	await getDarSession();
	await getArcoirisSession();
	console.log(
		"|--->---> Se terminó de abrir las pestañas para generar sesiones."
	);
	console.log(
		`Servidor Express corriendo en puerto ${PORT}
      	 escuchando la direccion de loopback : (${LISTEN_ADDRESS})`
	);
});

process.on("SIGINT", async () => {
	await closeBrowser();
	process.exit();
});
