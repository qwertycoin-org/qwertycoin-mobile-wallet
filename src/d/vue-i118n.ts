declare class VueI18n {
	constructor(params: {
		locale ? : string,
		fallbackLocale ? : string
	});

	locale: string;

	setLocaleMessage(lang: string, data: any): void;
	setDateTimeFormat(lang: string, data: any): void;
	setNumberFormat(lang: string, data: any): void;

	t(key: string, variables ? : any): string;
	d(key: any, variables ? : any): any;
}

declare var i18n: VueI18n;