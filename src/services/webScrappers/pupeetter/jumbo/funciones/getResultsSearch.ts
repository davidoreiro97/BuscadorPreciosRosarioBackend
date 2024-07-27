export const getResultsSearch = () => {
	let $productosContainer =
		document.getElementById("gallery-layout-container")?.children || null;
	if (!$productosContainer) {
		return [];
	}
	let todosLosProductos: any[] = [];
	Array.from($productosContainer).forEach((e: any) => {
		let $element = e.children[0].getElementsByTagName("a")[0];
		let linkAProducto = $element?.href || null;
		let urlImagen =
			e.querySelector(
				".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image"
			)?.src || "https://www.lareinaonline.com.ar/Fotos/Articulos/NoImagen.jpg";
		let titulo =
			e.querySelector(
				".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
			)?.innerText || "";
		let precio =
			parseInt(
				e
					.querySelector(".jumboargentinaio-store-theme-1dCOMij_MzTzZOCohX1K7w")
					?.innerText.replace("$", "")
					.replace(".", "")
					.replace(",", ".")
			) || "";
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
