export const postSearch = (productName: string) => {
	let $searchInput: HTMLInputElement | null = document.getElementById(
		"atg_store_searchInput"
	) as HTMLInputElement;
	if ($searchInput) {
		$searchInput.value = productName;
	}
	let $nttInput: HTMLInputElement = document.getElementById(
		"Ntt"
	) as HTMLInputElement;
	if ($nttInput) {
		$nttInput.value = productName;
	}
	let $searchForm: HTMLFormElement = document.getElementById(
		"searchForm"
	) as HTMLFormElement;
	$searchForm.submit();
};
