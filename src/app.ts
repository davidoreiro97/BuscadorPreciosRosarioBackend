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
const corsOptions = {
	origin: "http://example.com", // Cambia esto al dominio que deseas permitir
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	allowedHeaders: "Content-Type,Authorization",
};

// Middlewares
//// Para parsear json
app.use(express.json());
//// Para guardar las peticiones en un archivo log, deshabilitar en el futuro.
app.use(loggerMiddleware);
//// Para manejar rutas
app.use("/", routes);
//// Morgan
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :date :hour"
	)
);
//// Cors
app.use(cors(corsOptions));
//// Helmet
app.use(helmet());
export default app;
