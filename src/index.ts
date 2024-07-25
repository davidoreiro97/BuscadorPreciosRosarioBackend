//Punto de entrada a la app express.
import { getLaGallegaSession } from "./services/webScrappers/pupeetter/getLaGallegaSession";
import app from "./app";
import {
	getBrowser,
	closeBrowser,
} from "./services/webScrappers/pupeetter/browserInstance";
const PORT: number = parseInt(process.env.PORT as string) || 3000;
const LISTEN_ADDRESS: string = process.env.HOST || "0.0.0.0";

app.listen(PORT, LISTEN_ADDRESS, async () => {
	await getBrowser();
	await getLaGallegaSession();
	console.log(
		`Servidor Express corriendo en puerto ${PORT}
      	 escuchando todas las interfaces de red (${LISTEN_ADDRESS})`
	);
});

process.on("SIGINT", async () => {
	await closeBrowser();
	process.exit();
});
