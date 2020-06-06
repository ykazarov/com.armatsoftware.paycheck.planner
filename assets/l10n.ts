export class L10n {
    private static localeToCurrency = {
        "en-US": "USD",
        "en-AU": "AUD"
        // add locale specific currency abbreviations here
    };

    public static getLocalCurrencyFormatter(): Intl.NumberFormat {

        var localeName: string = Intl.NumberFormat().resolvedOptions().locale;
        // get the locale from the map...
        var currencyName = L10n.localeToCurrency[localeName] ?? "USD"; // take USD as default currency

        Logger.log([
            { "resolvedOptions": Intl.NumberFormat().resolvedOptions() },
            { "Locale": localeName },
            { "currency": currencyName }
        ]);

        return new Intl.NumberFormat(localeName, { style: 'currency', currency: currencyName, minimumFractionDigits: 2 })
    };

    public static getLocalDateFormatter(): Intl.DateTimeFormat {
        var options = options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric'
        };

        return new Intl.DateTimeFormat(Intl.NumberFormat().resolvedOptions().locale, options);
    }
}