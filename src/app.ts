//Configuración de aplicación express
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes";
import loggerMiddleware from "./middleware/logger";
import helmet from "helmet";
import cors from "cors";

// Configurando dotenv
dotenv.config();
// Servidor express
const app = express();
// Modificando el formato de salida de morgan
morgan.token("date", () => new Date().toLocaleDateString());
morgan.token("hour", () => new Date().toLocaleTimeString());
// Configuración de CORS
// const corsOptions = {
// 	origin: "url", // Cambiar el dominio
// 	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 	allowedHeaders: "Content-Type,Authorization",
// };
// Middlewares
//// Para parsear json
app.use(express.json());
//// Morgan
app.use(
	morgan(
		"╔════════════════════ PETICION ════════════════════\n╠═══> FECHA Y HORA : :date :hour \n╠═══> METODO : :method\n╠═══> RECURSO : :url\n╠═══> ESTADO DE RTA : :status\n╠═══> TIPO-PESO RTA : :res[content-type] :res[content-length] Bytes\n╠═══> DEMORA RTA : :response-time ms\n╚══════════════════════════════════════════════════════════════╝"
	)
);
//// Cors
app.use(cors());
//// Helmet
app.use(helmet());
export default app;
//// Para guardar las peticiones en un archivo log, deshabilitar en el futuro.
app.use(loggerMiddleware);
//// Para manejar rutas
app.use("/", routes);
