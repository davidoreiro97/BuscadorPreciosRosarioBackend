import cheerio from "cheerio";
export const cheerioLaReinaScrapper = async (productoNombre: string) => {
	//Ver si antes de hacer el fetch no hay que abrir un navegador con pupetter.
	const urlFetch = `https://www.lareinaonline.com.ar/productosnl.asp?TM=Bus&cpoB=${productoNombre}`;
	const productos: {
		titulo: string;
		precio: number;
		urlImagen: string;
		linkAProducto: string;
	}[] = [];
	try {
		const optionsFetch = {
			headers: {
				Cookie: "cantP=50",
			},
		};
		let response = await fetch(urlFetch, optionsFetch);
		if (!response.ok) {
			throw new Error();
		}
		let resHTML = await response.text();
		const $ = cheerio.load(resHTML);
		$(".cuadProd").each((index, element) => {
			const titulo = $(element)
				.find(".desc")
				.text()
				.replace(/\s+/g, " ")
				.trim();
			const precio = parseInt(
				$(element)
					.find(".precio .izq")
					.text()
					.trim()
					.slice(1, -3)
					.replace(".", "")
			);
			const linkAProducto =
				"https://www.lareinaonline.com.ar/" +
				$(element).find(".FotoProd a").attr("href");
			const urlImagen =
				"https://www.lareinaonline.com.ar/" +
				$(element).find(".FotoProd a img").attr("src");
			productos.push({ titulo, precio, urlImagen, linkAProducto });
		});
		//Si devolvemos productos vacio no hubo resultados.
		if (productos.length > 0) {
			productos.sort((a, b) => a.precio - b.precio);
		}
		return productos.slice(0, 20);
	} catch (e) {
		throw e;
	}
};
