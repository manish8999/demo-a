import React, { useState } from "react";

const Demo=()=>{
    const[name,setname]=useState([]);
    const[email,setemail]=useState([]);
    const[password,setpassword]=useState([]);

    const handeloutput=()=>{

    }
    return(
        <div>
           
            <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/><br/>
            <input type="text" value={email} onChange={(e)=>setemail(e.target.value)}/><br/>
            <input type="text" value={password} onChange={(e)=>setpassword(e.target.value)}/><br/>
        <button onClick={handeloutput}>Submit</button>
        </div>
    )
}

export default Demo;
