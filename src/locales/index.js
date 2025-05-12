import Locales from "i18n-js";
import { I18nManager } from "react-native";
import * as RNLocalize from "react-native-localize";

import ar from "./ar.json";
import en from "./en.json";
import fr from "./fr.json";
// import he from "./he.json";
// import it from "./it.json";
import ja from "./ja.json";
import ko from "./ko.json";
// import ptBR from "./pt-BR.json";
// import pt from "./pt.json";
// import ru from "./ru.json";
import zhHans from "./zh-Hans.json";
import zh from "./zh.json";

export const LANGUAGES = {
    ar,
    en,
    fr,
    // he,
    // it,
    ja,
    ko,
    // "pt-BR": ptBR,
    // pt,
    // ru,
    "zh-Hans": zhHans,
    zh,
};

export const defaultLocale = "en";

const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(
    Object.keys(LANGUAGES)
) || { languageTag: "en", isRTL: false };

I18nManager.forceRTL(isRTL || I18nManager.isRTL);

Locales.fallbacks = true;

Locales.defaultSeparator = "&";

Locales.translations = LANGUAGES;

Locales.locale = languageTag;

export const trans = Locales.t;

export default Locales;
