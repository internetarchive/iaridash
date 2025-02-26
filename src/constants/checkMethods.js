export const UrlStatusCheckMethods = {
    IABOT: {
        key: 'IABOT',
        caption: 'IA Bot',
        sub_caption: 'Uses testdeadlink',
        endpoint: '',
    },

    WAYBACK: {
        key: 'WAYBACK',
        caption: 'Live Web Check',
        sub_caption: 'Uses livewebcheck',
        endpoint: 'https://iabot-api.archive.org/livewebcheck',
        // must use parameters in the form: ...?url=archive.org
        // don't forget to URL encode the url param value
    },


    CORENTIN: {
        key: 'CORENTIN',
        caption: 'Corentin',
        sub_caption: 'Uses undertaker',
        endpoint: 'https://iabot-api.archive.org/undertaker/'
    },


    IARI: {
        key: 'IARI',
        caption: 'IARI',
        endpoint: ''
    },


    IABOT_SEARCHURL: {
        key: 'IABOT_SEARCHURL',
        caption: 'IA Bot SearchUrlData',
        endpoint: '',
        hide: true
    },
}