export const timeout = async (tiempo: number) => {
	return new Promise((resolve: any) => {
		setTimeout(() => resolve(), tiempo);
	});
};
