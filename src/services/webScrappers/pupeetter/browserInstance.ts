import puppeteer, { Browser } from "puppeteer";
//Para que no se abra un navegador por cada solicitud y para que no haya qeu reabrirlo y tarde.
let browser: Browser | null = null;

export const getBrowser = async () => {
	if (!browser) {
		browser = await puppeteer.launch({ headless: false, slowMo: 250 });
	}
	return browser;
};

export const closeBrowser = async () => {
	if (browser) {
		await browser.close();
		browser = null;
	}
};
