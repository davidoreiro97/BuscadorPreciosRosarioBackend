import puppeteer, { Browser } from "puppeteer";
//Para que no se abra un navegador por cada solicitud y para que no haya qeu reabrirlo y tarde.
let browser: Browser | null = null;

export const getBrowser = async () => {
	if (!browser) {
		browser = await puppeteer.launch({
			headless: true,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-accelerated-2d-canvas",
				"--disable-gpu",
				"--no-zygote",
				"--single-process",
				"--disable-background-networking",
				"--enable-features=NetworkService",
				"--disable-background-timer-throttling",
				"--disable-backgrounding-occluded-windows",
				"--disable-breakpad",
				"--disable-client-side-phishing-detection",
				"--disable-component-update",
				"--disable-default-apps",
				"--disable-dev-shm-usage",
				"--disable-domain-reliability",
				"--disable-extensions",
				"--disable-features=AudioServiceOutOfProcess",
				"--disable-hang-monitor",
				"--disable-ipc-flooding-protection",
				"--disable-popup-blocking",
				"--disable-print-preview",
				"--disable-prompt-on-repost",
				"--disable-renderer-backgrounding",
				"--disable-sync",
				"--disable-translate",
				"--metrics-recording-only",
				"--mute-audio",
				"--no-first-run",
				"--safebrowsing-disable-auto-update",
				"--enable-automation",
				"--password-store=basic",
				"--use-mock-keychain",
			],
			slowMo: 150,
		});
	}
	return browser;
};

export const closeBrowser = async () => {
	if (browser) {
		await browser.close();
		browser = null;
	}
};
