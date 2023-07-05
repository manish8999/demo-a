import React, { useEffect, useState } from "react";

const Pratice1=()=>{
    const[name,setname]=useState({firstname:"Manish",lastname:"Jagtap"});
    const handeloutput=()=>{
        setname({firstname:"Shubham",lastname:"Shinde"})
    }
    const[number,setnumber]=useState(0);

    useEffect(()=>{
        alert("Click Me");
    },[number])

    return(
        <div>
           <button onClick={()=>{setnumber(number+1)}}>Increase Count{number}</button>

           <h1>My First Name Is{name.firstname} and lastname is {name.lastname} </h1>
        <button onClick={handeloutput}>Submit</button>

        </div>
    )
}

export default Pratice1;
