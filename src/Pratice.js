import React,{useState} from 'react';

const Pratice=()=>{

    const [name,setname]=useState([]);
    const [password,setpassword]=useState([]);
    const [email,setemail]=useState([]);

    const collectdata =async () =>{
        console.log(name,email,password);
    }
    return(
       <div>
        <input type="text" value={name} onChange={(e)=>setname(e.target.value)}/><br/>
        <input type='text' value={email} onChange={(e)=>setemail(e.target.value)}/><br/>
        <input type="text" value={password} onChange={(e)=>setpassword(e.target.value)}/> <br/>
        <button onClick={collectdata}>submit</button>
       </div>
    )
}

export default Pratice;
