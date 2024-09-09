export const getResultsSearch = () => {
	let $productosContainer =
		document.getElementById("gallery-layout-container")?.children || null;
	if (!$productosContainer) {
		return [];
	}
	let todosLosProductos: any[] = [];
	Array.from($productosContainer).forEach((e: any) => {
		let $element = e.children[0].getElementsByTagName("a")[0];
		let linkAProducto = $element.href;
		let urlImagen =
			e.querySelector(
				".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image.vtex-product-summary-2-x-image--defaultShelf"
			)?.src || "https://www.lareinaonline.com.ar/Fotos/Articulos/NoImagen.jpg";
		let titulo = $element.getElementsByClassName(
			"vtex-product-summary-2-x-productBrand vtex-product-summary-2-x-productBrand--defaultShelf-name vtex-product-summary-2-x-brandName vtex-product-summary-2-x-brandName--defaultShelf-name t-body"
		)[0].innerText;
		let precio = $element
			.querySelectorAll(
				'span[class="vtex-product-price-1-x-sellingPriceValue"]'
			)[0]
			.innerText.slice(1, -3)
			.replace(".", "");
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
