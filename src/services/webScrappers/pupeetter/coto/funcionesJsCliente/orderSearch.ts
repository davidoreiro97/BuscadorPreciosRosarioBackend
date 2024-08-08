export const orderSearch = () => {
	let element:any =
		document.getElementById("sortBySelect")?.children[5];
	let $optionMinToMax= element?.value||""
	location = $optionMinToMax.toString();
};
