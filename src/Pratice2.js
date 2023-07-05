import React, { useState } from 'react'

export const Pratice2 = () => {
    const[name,setName]=useState();
    const[email,seteEmail]=useState();
    const[password,setPassword]=useState();
    const collectdata=()=>{
        console.log(name,email,password);
        alert("name:- " + name +"   Emailid:-  "+email+"  Password:-  "+password);
    }
  return (
    <div>
        <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/><br/>
        <input type='text' value={email} onChange={(e)=>seteEmail(e.target.value)}/><br/>
        <input type='text' value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
        <button onClick={collectdata}>submit</button>


    </div>
  )
}
