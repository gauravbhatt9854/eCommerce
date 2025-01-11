import axios from "axios";
import { useState } from "react";

const CreateUser = () => {

const [msg  , setMsg] = useState("");
const user = {
    name : "golu bhatt",
    email : "gbhatt570@gmail.com",
    phone :"9105210359"
}

const storeUser = async() => {
    const res = await fetch('/api/webhook/db', {
      method: 'POST',
      body: JSON.stringify(user),
    })
    const data = await res.json()
    console.log(data)
}
  return (
    <div>
        <h1>this is database page</h1>
        <h2>{msg}</h2>
        <button onClick={storeUser} className="bg-red-600">Create user</button>
    </div>
  )
}

export default CreateUser