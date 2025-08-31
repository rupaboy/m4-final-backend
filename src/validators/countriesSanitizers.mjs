import { cca3ToCca2 } from '../helpers/ccaCodes.mjs'

export function filterCountries(countries) {
    return countries.filter(
        c => Array.isArray(c.continents) && !c.continents.includes("Antarctica")
    ).filter(c => c.cca2 !== "IO"); //Excluding 'British Indian Ocean Territory'
}

export function sanitizeCountryObject(raw) {
    // Exclude British Indian Ocean Territory directly
    if (raw.cca2 === "IO") {
        return null;
    }
    let continents = Array.isArray(raw.continents) //Exclude Antartica territories
        ? raw.continents.filter(c => c !== "Antarctica")
        : [];
    // Special Rule for Russia to be previewed in Asia first, instead of Europe
    if (raw.cca2 === "RU") {
        if (continents.includes("Asia") && continents.includes("Europe")) {
            continents = ["Asia", "Europe"];
        }
    }
    return {
        code: raw.cca2?.toUpperCase() || "N/A",
        name: raw.name?.common?.trim() || "Unknown",
        area: Number(raw.area) || 0,
        population: Number(raw.population) || 0,
        continents,
        flag: raw.flags?.svg?.trim() || "",
        languages: raw.languages
            ? Object.values(raw.languages).filter(l => !l.includes("Sign Language"))
            : [],
        capitals: raw.capital?.map(c => c.trim()) || ["N/A"],
        borders: Array.isArray(raw.borders)
            ? raw.borders
                .map(c => cca3ToCca2[c]) // Translate code if cca2 exists
                .filter(Boolean)         // Discard if they don't (like "UNK" from unknown borders)
            : [], //no borders
        timezones: raw.timezones || [],
    };
}

