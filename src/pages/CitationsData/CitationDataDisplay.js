import React from "react";
import './citationsData.css'
import '../Wiki/wiki.css'

import Table from "../../components/Table";


export default function CitationDataDisplay({
        citationData = {},
        citationLabel = null,
        options = {},
        onAction = null,
        errors = null,
    }) {

    // Example citationsDB data:
    /*
        {
          "earliest_revision_timestamp": "2023-09-05 18:04:34",
          "latest_revision_timestamp": "2024-10-04 03:30:52",
          "record_sha1": "4142ac1c9247e62f8a2fdf5d82c94cf26ddb1e53",
          "reference_normalized": "<ref>{{Cite book|access-date=19 March 2019|archive-date=9 December 2018|archive-url=https://web.archive.org/web/20181209181921/https://archive.org/details/easterislandisla00dosp|date=2011|isbn=978-0-307-78705-7|last=Dos Passos, John|oclc=773372948|publisher=Doubleday|title=Easter Island: Island of Enigmas|url-status=live|url=https://archive.org/details/easterislandisla00dosp}}</ref>",
          "reference_normalized_sha1": "42619de7f659a9a44141f078a80126b122128858"
        },
        {
          "earliest_revision_timestamp": "2021-06-17 17:57:09",
          "latest_revision_timestamp": "2024-10-04 03:30:52",
          "record_sha1": "3fd5cb623dc49896b8ceb177db150841b52723f1",
          "reference_normalized": "<ref>{{Cite web|access-date=2019-02-06|archive-date=7 February 2019|archive-url=https://web.archive.org/web/20190207072237/https://travelcollecting.com/easter-island-tapati-festival-rapa-nui/|date=2018-10-20|first=James|language=en-US|last=Ian|title=Easter Island: More Than Just Statues – Tapati Festival on Rapa Nui|url-status=live|url=https://travelcollecting.com/easter-island-tapati-festival-rapa-nui/|website=Travel Collecting}}</ref>",
          "reference_normalized_sha1": "53414dd053989f8659d764e64109ff3e0ab5b5cc"
        },
        {
          "earliest_revision_timestamp": "2024-04-27 12:56:29",
          "latest_revision_timestamp": "2024-10-04 03:30:52",
          "record_sha1": "e806e53b8bffff4aae1859d5efd79436c3a02823",
          "reference_normalized": "<ref>{{Cite journal|bibcode=1994GeoRv..84..172L|date=April 1994|doi=10.2307/215329|first=Dale R.|issue=2|journal=Geographical Review|jstor=215329|last=Lightfoot|pages=172–185|title=Morphology and Ecology of Lithic-Mulch Agriculture|volume=84}}</ref>",
          "reference_normalized_sha1": "46eaca02d4b9378e989069f50a205bd22ac78780"
        },
        {
          "earliest_revision_timestamp": "2024-02-27 21:28:52",
          "latest_revision_timestamp": "2024-10-04 03:30:52",
          "record_sha1": "e64dd7808cc7dbab37e458462deefda77f02e141",
          "reference_normalized": "<ref>{{Cite web|title=La desconocida historia de la base \"gringa\" albergada en Isla de Pascua|url=https://www.24horas.cl/nacional/la-desconocida-historia-de-la-base-gringa-albergada-en-isla-de-pascua-2132317|website=www.24horas.cl}}</ref>",
          "reference_normalized_sha1": "86e30ab909df9be8d8531227d736e1b7e26f5dc0"
        },
        ]
        }
     */
    const [showDetails, setShowDetails] = React.useState(false)

    const showDetailsButton = <button
        className={"utility-button detail-button"}
        onClick={() => {setShowDetails(prev => !prev)}}
    >
        <span>{'...'}</span>
    </button>

    const caption = citationLabel?.caption
        ? <>
            <h3 className={'citation-data-display-caption'}>{citationLabel.caption}{showDetailsButton}</h3>
            {showDetails
                ? <div className={'citation-data-display-caption-details'}>{citationLabel["details"]}</div>
                : null}
        </>
        : null

    const statistics = citationData
        ? <>
            <div>Execution time: {citationData["execution_time"]}</div>
            <div>{citationData["use_raw"] ? 'Showing raw reference data' : 'Showing normalized reference data'}</div>
        </>
        : <p>Nothing to show</p>

    console.log(`CitationsDataDisplay render`)


    const convertTableData = (citationData) => {
        // // Data format for table data

        // const columns = [
        //     { accessorKey: "id", header: "ID" },
        //     { accessorKey: "name", header: "Name" },
        //     { accessorKey: "age", header: "Age" },
        // ];

        // const data = [
        //     { id: 1, name: "Alice", age: 25 },
        //     { id: 2, name: "Bob", age: 30 },
        //     { id: 3, name: "Charlie", age: 35 },
        // ];

        const cols = [
            {accessorKey: "id_key", header: "Index"},
            {accessorKey: "earliest_revision_timestamp", header: "Earliest Revision"},
            {accessorKey: "latest_revision_timestamp", header: "Latest Revision"},
            {accessorKey: "record_sha1", header: "Record SHA1"},
            {accessorKey: "reference_normalized", header: "Reference"},
            {accessorKey: "reference_normalized_sha1", header: "Reference SHA1"}
        ];

        const rows = citationData.refs.map((ref, i) => ({
            id_key: i,
            earliest_revision_timestamp: ref.earliest_revision_timestamp,
            latest_revision_timestamp: ref.latest_revision_timestamp,
            record_sha1: ref.record_sha1,
            reference_normalized: ref.reference_normalized,
            reference_normalized_sha1: ref.reference_normalized_sha1
        }));

        return {
            cols,
            rows
        };
    }


    if (!citationData || typeof(citationData) !== 'object') {
        return <p>citationData is not a valid object.</p>
    }

    // test any specific properties of citationsData here to ensure compatibility;
    // return error markup if not successful
    // example:
    // if (!citationData.schema) {
    //     return <p>wikiData is missing "schema".</p>
    // }


    const tableData = convertTableData(citationData)


    return <div className="citation-data-display-container">

        <div className="citation-data-display-header">
            {caption}
            <div className="citation-data-display-statistics">
                {statistics}
            </div>
        </div>

        <div className={"wiki-details-body iari-ux-body"}>
            <div className="wiki-table">
                <Table
                    data={tableData.rows}
                    columns={tableData.cols}
                    sortable={true}
                />
            </div>
        </div>

    </div>
}


