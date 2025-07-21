/*
These are example exampleEndpoints to be thrown to the user
that can be run right away. 
I guess its like their own personal library.
 */


export const exampleEndpoints = [

        "version",

        "refs_lookup?url=https://en.wikipedia.org/wiki/Siemens_scandal",

        "check-url?url=https://example.com/",

        "check-url"
        + "?refresh=true"
        + "&method=wayback"
        + "&url=google.com/",

        "check-url"
            + "?url=https://www.easterisland.travel/easter-island-facts-and-info/tapati-rapa-nui-festival/",

        "check-url"
        + "?refresh=true"
        + "&method=wayback"
        + "&url=https://www.easterisland.travel/easter-island-facts-and-info/tapati-rapa-nui-festival/",
    ]