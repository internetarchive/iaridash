import React from 'react'
import loader from '../images/spinny2.v2.gif'

const Loader = ({message, startTime, options={}}) => {

    console.log("Loader: ", message)

    const widthSpec = options?.width ?? '180px'

    return ( <div style={{display:"block", margin:"0 auto"}}>
        <img src={loader}
             alt={'Loading'}
             style={{
                 width: widthSpec,
                 margin:'1rem auto 1rem',
                 display:'block',
                 }}
        />
        <h4 style={{textAlign:"center", marginTop:0}}>{message}</h4>
        </div>
    )
}

export default Loader