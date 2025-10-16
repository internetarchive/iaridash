/*
RouteHeader

provides consistent manner to display "page" headers

 */
import React from "react";

export default function RouteHeader({caption = "section", subCaption = ""}) {

    const sub = subCaption ? <p>{subCaption}</p> : null

    return <div className={"nav-route-header"}>
        <h1>{caption}</h1>
        {sub}
    </div>

}
