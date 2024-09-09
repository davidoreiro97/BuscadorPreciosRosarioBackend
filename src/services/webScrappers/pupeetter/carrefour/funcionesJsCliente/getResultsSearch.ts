export const getResultsSearch = () => {
	let $productosContainer =
		document.querySelector(
			".valtech-carrefourar-search-result-0-x-gallery.flex.flex-row.flex-wrap.items-stretch.bn.ph1.na4.pl9-l"
		)?.children || null;
	if (!$productosContainer) {
		return [];
	}
	let todosLosProductos: any[] = [];
	let precio: number | null = 0;
	Array.from($productosContainer).forEach((e: any) => {
		let $element = e.children[0].getElementsByTagName("a")[0];
		let linkAProducto = $element?.href || null;
		let urlImagen =
			e.querySelector(
				".vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image"
			)?.src || "https://www.lareinaonline.com.ar/Fotos/Articulos/NoImagen.jpg";
		let titulo: string =
			e.querySelector(
				".vtex-product-summary-2-x-productBrand.vtex-product-summary-2-x-brandName.t-body"
			)?.innerText || "";

		precio =
			parseInt(
				e
					.querySelector(
						".valtech-carrefourar-product-price-0-x-sellingPriceValue"
					)[0]
					?.innerText.replace("$", "")
					.replace(".", "")
					.replace(",", ".")
			) || null;
		if (!precio) {
			precio =
				parseInt(
					e
						.querySelector(".valtech-carrefourar-product-price-0-x-listPrice")
						?.innerText.replace("$", "")
						.replace(".", "")
						.replace(",", ".")
				) || null;
			if (!precio) {
				precio =
					parseInt(
						e
							.querySelector(
								".valtech-carrefourar-product-price-0-x-currencyContainer"
							)
							?.innerText.replace("$", "")
							.replace(".", "")
							.replace(",", ".")
					) || null;
			}
		}

		todosLosProductos.push({
			titulo,
			precio,
			urlImagen,
			linkAProducto,
		});
	});
	// Solo devuelvo los primeros 16.
	return todosLosProductos;
};
