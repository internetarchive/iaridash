/*
different ways of getting archive data:

1. get IABot database entry
2. Use wayback machine url directly:
    https://web.archive.org/web/* /https://www.example.com
3. Use Wayback API:
    https://archive.org/wayback/available?url=example.com
    https://archive.org/wayback/available?url=mojomonger.com
    https://archive.org/wayback/available?url=http://travel.nationalgeographic.com/travel/world-heritage/easter-island

 */

// https://web.archive.org/web/*/http://travel.nationalgeographic.com/travel/world-heritage/easter-island/
// https://web.archive.org/web/*/https://mojomonger.com

export const getIabotArchiveData = async (urlLink) => {


    const resolveArchiveResults = (data) => {
        // "data" includes all fields
        // return {
        //     url: url,
        //     netloc: data.netloc,
        //     pay_level_domain: data.first_level_domain,
        //     status_code: data.status_code,
        //     status_code_method: data.status_code_method,
        //     status_code_error_details: data.status_code_error_details,
        //     archive_status: getArchiveStatusFromData(data)
        // }
        return data
    }

    const resolveErrorResults = (response) => {
        return {
            error_code: response.status,
            error_text: response.statusText ? response.statusText : "error from server",
        }
    }


    const iabotEndpoint = "https://iabot.wmcloud.org/api.php?wiki=enwiki"
    const modifiedUrl = urlLink  // shall use url protection fileter later...
    const endpoint = iabotEndpoint
        + `&action=searchurldata`
        + `&urls=${modifiedUrl}`

    // headers = {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "User-Agent": "http://en.wikipedia.org/wiki/User:GreenC via iabget.awk",
    // }

    // eslint-disable-next-line no-unused-vars
    let endpoint_status_code = 0

    const results = await fetch(endpoint, {cache: "no-cache"})

        .then( response => {

            endpoint_status_code = response.status

            if (response.ok) {
                return response.json().then(data => {
                    return Promise.resolve(resolveArchiveResults(data))
                })

            } else {
                // we may have a 504 or other erroneous status_code on the check-url call
                console.warn(`getArchiveData: Error fetching archive info for url: ${urlLink}.`)
                return Promise.resolve(resolveErrorResults(response))

            }
        })

        .catch( (_e) => { // if something bad happened, return fake synthesized url object

                console.warn(`archiveUtils: getIabotArchiveData: Something went wrong with url: ${urlLink}`)

                // return fake url data object so URL display interface is not broken
                return Promise.resolve({
                    url: urlLink,
                    status_code: 0,
                    status_code_error_details: "Failure with archive endpoint",
                    error_code: -1, // we don't know why this happened
                    error_text: "Failure during fetch archive (we don't know what happened)", // is there an error message available here?
                })
            }
        );

    return results;
    //
    // return {
    //     "status": "OK",
    //     "description": "Test Archive Feature here..."
    // }

}


export const getWaybackArchiveData = async (urlLink) => {


    const resolveResults = (data) => {

        /*
        {
            url: "http://travel.nationalgeographic.com/travel/world-heritage/easter-island",
            archived_snapshots: {
            closest: {
            status: "200",
            available: true,
            url: "http://web.archive.org/web/20161210002357/http://travel.nationalgeographic.com/travel/world-heritage/easter-island/",
            timestamp: "20161210002357"
            }
            }
            }


         OR

            {
            url: "http://travel.nationalgeographic.com/travel/world-xxx/easter-island",
            archived_snapshots: { }
            }
         */

        return data
    }

    const resolveErrorResults = (response) => {
        return {
            error_code: response.status,
            error_text: response.statusText ? response.statusText : "error from server",
        }
    }


    const iabotEndpoint = "https://archive.org/wayback/available"
    const modifiedUrl = urlLink  // shall implement url protection filter later...
    const endpoint = iabotEndpoint
        + `?url=${modifiedUrl}`

    // eslint-disable-next-line no-unused-vars
    let endpoint_status_code = 0

    const results = await fetch(endpoint, {cache: "no-cache"})

        .then( response => {

            endpoint_status_code = response.status

            if (response.ok) {
                return response.json().then(data => {
                    return Promise.resolve(resolveResults(data))
                })

            } else {
                // we may have a 504 or other erroneous status_code on the check-url call
                console.warn(`getWaybackArchiveData: Error fetching archive info for url: ${urlLink}.`)
                return Promise.resolve(resolveErrorResults(response))

            }
        })

        .catch( (_e) => { // if something bad happened, return fake synthesized url object

                console.warn(`archiveUtils: getWaybackArchiveData: Something went wrong with url: ${urlLink}`)

                // return fake url data object so URL display interface is not broken
                return Promise.resolve({
                    url: urlLink,
                    status_code: 0,
                    status_code_error_details: "Failure with archive endpoint",
                    error_code: -1, // we don't know why this happened
                    error_text: "Failure during fetch archive (we don't know what happened)", // is there an error message available here?
                })
            }
        );

    return results;

}
