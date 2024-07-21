//Punto de entrada a la app express.
import app from "./app";

const PORT: number = parseInt(process.env.PORT as string) || 3000;
const LISTEN_ADDRESS: string = process.env.HOST || "0.0.0.0";

app.listen(PORT, LISTEN_ADDRESS, () => {
	console.log(
		`Servidor Express corriendo en puerto ${PORT}
    escuchando todas las interfaces de red (${LISTEN_ADDRESS})`
	);
});
