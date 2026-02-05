export const iariTestCommands = [
    "http://localhost:5001/v2/extract_grok?page_title=Easter_Island",
    "http://localhost:5001/v2/wiki_signals?domain=nytimes",

    // "https://iabot.wmcloud.org/api.php?action=statistics&format=flat", // from tarb_insighta
    "https://iabot-api.archive.org/services/context/iari-stage/v2/version", // version of stage IARI
    "https://iabot-api.archive.org/services/context/iari-stage/v2/tarb_insights", // TARB stats data

    "http://localhost:5001/v2/version",
    // "http://localhost:5001/v2/wiki_signals?domain=nytimes.com",
    // "http://localhost:5001/v2/tarb_insights",   // TARB stats data
    "http://localhost:5001/v2/wiki_insights",   // Wiki stats data

    "(following has CORS issue)", // TARB stats data
    "https://commons.wikimedia.org/w/index.php?title=Data%3AWikipedia%5Fstatistics%2Fexturls%2Etab&action=raw",

]
