import React from "react";
import DataGrid from "./DataGrid";
import ControlBox from "../../shared/ControlBox";
import {gridDef} from "./GridDefs"
import {ConfigContext, DataContext} from "../../contexts/ConfigContext";
//import {testGridData} from "./TestGridData";
import {nowTime} from "./dataUtils";

export default function ScoreBoard({options = {}}) {

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents undefined myConfig.[param_name] errors

    const { gridItems, setGridItems, gridData, setGridData } = React.useContext(DataContext)
    // pull in from above so retains across routes

                // /*
                // gridItems is the list of items, in our case a list of url strings, that gridDef acts upon
                // to produce gridData, the object that gets rendered in the scoreboard grid
                //
                // *** for now, gridItems is hard coded. eventually this could be fetched from a file,
                //     local browser data (from last time), a text file described by browser data, or,
                //     eventually, a list of urls from some source that passes back a list of urls. This could
                //     be iari/article.links data at some point.
                //
                // */
                // const [gridItems, setGridItems] = useState(""
                // + "http://www.uri.edu/artsci/ecn/starkey/ECN398%20-Ecology,%20Economy,%20Society/RAPANUI.pdf\n"
                // + "https://orb.binghamton.edu/cgi/viewcontent.cgi?article=1041&context=anthropology_fac\n"
                // + "https://www.lonelyplanet.com/chile/activities/private-tour-easter-island-caves/a/pa-act/v-41148P7/363257\n"
                // + "https://www.reuters.com/world/americas/chiles-easter-island-reopens-tourists-after-pandemic-shutdown-2022-08-05/\n"
                // )

    /*
    gridDef is the definition of operation(s) to apply for each column in the grid.
    The results are placed in gridData
    */
    const myGridDef = gridDef
    // NB chrome dev tools does not like imported constants...
    //  by assigning to a new variable, we fix this behavior

    // returns dict of results for each column operation in gridDef for item specified.
    const fetchRowData = async (item, gridDef) => {

        const options = {
            iariBase: myConfig.iariBase,
        }

        const promiseArray = gridDef.column_order.map(column_key => {
            const operation = gridDef.data_columns[column_key].operation
            return (operation)()(item, options)  // NB Note self-calling function
        })

        const resultPromises = await Promise.allSettled(promiseArray);
        const rowData = {}
        resultPromises.forEach( promiseData => {
            const myData = promiseData.value  // this seems to work...
            // myData is assumed to have "key" and "data" properties
            rowData[myData.key] = myData.data
        })
        console.log("[" + nowTime() +  "]fetchRowData returned values:", rowData)
        return rowData
    }


    const setItemStatus = (item, newStatus) => {

        setGridData(oldGridData => {
            const newItemState = oldGridData[item]

            // if item did not exist in old gridData, create it
            if (!newItemState) {
                return {
                    ...oldGridData,
                    [item]: getNewRow(item, newStatus)
                }
            }

            // else, update the status of the existing item
            newItemState.row_info.fetch_status = newStatus
            return {
                ...oldGridData,
                [item]: newItemState
            }
        })
    }

    const getNewRow = (item, status=0) => {
        return {
            row_info: {
                item_name: item,
                fetch_status: status,
                fetch_timestamp: null,
            },

            // leave empty - as column data comes in, new entry is created
            row_data: {}
        }
    }

    /* updateRowData
        - item: the item to update data for
        - newRowData: the data to insert

        if item does not exist in gridData, create it

        update the status and row data of the specified item

     */
    const updateRowData = (item, rowData) => {

        console.log(`updating new row data for item "${item}"`)

        // set new gridData state; only specified item's row data is changed

        setGridData(oldGridData => {

            const myItemData = oldGridData[item]
                // if oldGridData[item] exists, copy contents as myItemData
                ? {...oldGridData[item]}
                // else, myItemData is newly created row (with status 0)
                : getNewRow(item, 0)

            // insert new rowData in the current item's row_data
            Object.keys(rowData).forEach( key => {
                myItemData.row_data[key] = rowData[key]
            })

            // and set the current item's row status as settled ( 'OK', or 1 )
            myItemData.row_info.fetch_status = 1

            console.log(`updateRowData "${item}": newItemData: `, myItemData)

            // and return gridData state with new data replaced for this item
            return {
                ...oldGridData,
                [item]: myItemData
            }

        })
    }

    const refreshDataGrid = () => {

        const itemsToFetch = []

        // process gridItems to get list of items to process/fetch
        gridItems.split("\n").forEach( line => {
            if (line) itemsToFetch.push(line)
        })

        // for each of the items in gridItems:
        // - fetch data and update gridData
        // - set status of item to "fetching"

        itemsToFetch.forEach( (item, i) => {
            // gets array/or dict of values for each operation as applied to item
            // const results = fetchRowData(item, myGridDef)

            setItemStatus(item, 0)
``
            // fetchRowData returns a promise, so we can chain it with .then
            fetchRowData(item, myGridDef)

                .then( rowData => {
                    console.log(`[${nowTime()}] refreshDataGrid: rowData returned for row ${i}: `, rowData)

                    updateRowData(item, rowData)

                })
                .catch( e => {
                    alert(`refreshDataGrid: Encountered error: ${e.message}`)
                })
        })

        // errors should be caught in fetchRowData, and displayed with updateRowData if exists

            // } catch (error) {
            //     console.error('Error fetching data:', error.message);
            //     console.error(error.stack);
            //     setGridData([ {item: `Error encountered (${error.message})`}])
            // }
        console.log("refreshDataGrid: done")

    }


    const handleAction = (result) => {
        // TODO handle error if result is not object of format: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`ScoreBoard:handleAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
        }

                    // // testPromises is a placeholder for testing async operations
                    // else if (action === "testPromises") {
                    //     // value is ???
                    //     testPromises().then( response => {
                    //         console.log("ack!")
                    //         alert("Results from testPromises: " + response)
                    //     })  // ignore results
                    // }

        else if (action === "refreshDataGrid") {
            refreshDataGrid()
        }

        else {
            console.log(`ScoreBoard Action "${action}" not supported.`)
            alert(`Scoreboard Action "${action}" not supported.`)
        }

    }

    const controlBox = <ControlBox caption={"Controls"} className={""}>

        <div className={"row controls"}>
            <div className={"col"} style={{paddingLeft: "0"}}>

                {(false) && <button type={"button"}
                                  className={"btn utility-button debug-button"}
                                  onClick={() => handleAction({action:"testPromises"})}>Test Promise
                </button>}

            </div>
        </div>

        <div className={"row"}>Enter URLs as a list below to apply operations to, and then <button type={"button"}
                                                                                   className={"btn utility-button debug-button"}
                                                                                   style={{display:"inline", xxwidth:"100%", width: "15em", marginLeft:"1em", xxmargin:"0 auto"}}
                                                                                   onClick={() => handleAction({action: "refreshDataGrid"})}>Refresh Data Grid
            </button>
        </div>

    <hr/>

        <div className="row">
            <div className="col col-12">

                <h2>URLs List</h2>
                <textarea className={`data-lines`}
                    // readOnly={!editable}
                          value={gridItems}
                          onChange={(e) => setGridItems(e.target.value)}
                />
<hr/>
                {/*<h2>Data Grid</h2>*/}
                {/*<DataGrid gridData={gridData} gridDef={myGridDef}/>*/}

            </div>
        </div>

    </ControlBox>

    const datagrid =
    <div className="row">
        <div className={"col"}>
            <h2>Data Grid Results</h2>
            <DataGrid gridData={gridData} gridDef={myGridDef}/>
        </div>
    </div>


    return <div className="scoreboard">

        {controlBox}

        {datagrid}

    </div>
}
