import cheerio from "cheerio";
export const cheerioLaGallegaScrapper = async (productoNombre: string) => {
	//Ver si antes de hacer el fetch no hay que abrir un navegador con pupetter.
	const urlFetch = `https://www.lagallega.com.ar/Productos.asp?cpoBuscar=${productoNombre}`;
	const productos: {
		titulo: string;
		precio: number;
		linkAProducto: string;
	}[] = [];
	try {
		const optionsFetch = {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"Accept-Language": "en-US,en;q=0.9",
				"Accept-Encoding": "gzip, deflate, br",
				Connection: "keep-alive",
				Cookie: "ASPSESSIONIDCUBADTRR=CFEPOKEDADENCDHCOADNCKFH; cantP=100",
				Dnt: "1",
				Host: "www.lagallega.com.ar",
				"Sec-Fetch-Dest": "document",
				"Sec-Fetch-Mode": "navigate",
				"Sec-Fetch-Site": "none",
				"Sec-Fetch-User": "?1",
				"Upgrade-Insecure-Requests": "1",
				Referer: "https://www.lagallega.com.ar/",
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
			const linkAProducto = "https://www.lagallega.com.ar/Login.asp";
			productos.push({ titulo, precio, linkAProducto });
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