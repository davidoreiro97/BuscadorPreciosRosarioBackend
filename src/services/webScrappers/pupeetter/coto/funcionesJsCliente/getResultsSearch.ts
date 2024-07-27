export const getResultsSearch = () => {
	let $productosContainer =
		document.getElementById("products")?.querySelectorAll("li") || null;
	if (!$productosContainer) {
		return [];
	}
	let todosLosProductos: any[] = [];

	Array.from($productosContainer).forEach((e: any) => {
		let titulo = e.querySelector(".descrip_full")?.innerText || "";
		let precio =
			parseInt(
				e.querySelector(".price_discount")?.innerText.trim().replace("$", "")
			) ||
			parseInt(
				e
					.querySelector(".price_discount_gde")
					?.innerText.trim()
					.replace("$", "")
			) ||
			null;
		if (!precio) {
			precio = e
				.querySelector(".atg_store_newPrice")
				.innerText.trim()
				.slice(1, -3)
				.replace(".", "");
		}
		let linkAProducto =
			e.querySelector(".product_info_container").querySelector("a")?.href || "";
		let urlImagen =
			e.querySelector(".atg_store_productImage").querySelector("img")?.src ||
			"";

		todosLosProductos.push({
			titulo,
			precio,
			urlImagen,
			linkAProducto,
		});
	});
	// Solo devuelvo los primeros 20.
	return todosLosProductos.slice(0, 20);
};
