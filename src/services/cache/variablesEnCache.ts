//Se va a usar para guardar y recuperar variables en tiempo de ejecución
//Se utiliza para mantener la sesion ASP de La Gallega con pupetteer, cada 15 minutos se refresca la página y se vuelve a guardar la sesion.
import NodeCache from "node-cache";
const cache = new NodeCache();

export const setCacheVar = async (variableNombre: string, valor: string) => {
	cache.set(variableNombre, valor);
	console.log(`Se guardo en memoria ${variableNombre} con el valor ${valor}`);
};

export const getCacheVar = async (variableNombre: string) => {
	const valor = cache.get(variableNombre);
	console.log(`Se recupero la ${variableNombre} y tiene el valor ${valor}`);
	return valor;
};
