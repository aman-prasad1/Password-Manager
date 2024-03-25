import React, { useEffect, useReducer, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';


const Manager = () => {
    const ref = useRef()
    const passref = useRef()
    const [form, setform] = useState({site : "", username : "", password : ""})
    const [passarr, setpassarr] = useState([])

    const getPass = async ()=>{
        let req = await fetch("http://localhost:3000")
        let passwords = await req.json()
        console.log(passwords)
        setpassarr(passwords)
    }

    useEffect(() => {
        getPass()
    }, [])

    const copyText = (text) =>{
        navigator.clipboard.writeText(text)
    }

    const savePassword = async () =>{
        if(form.site.length > 3 && form.username.length > 3 && form.password.length > 3){

            await fetch("http://localhost:3000", {method:'DELETE', headers:{"Content-Type": "application/json"}, body: JSON.stringify({id :form.id})})

            setpassarr([...passarr, {...form, id: uuidv4()}])
            let res = await fetch("http://localhost:3000/", {method: "post", headers: {"Content-Type": "application/json"}, body: JSON.stringify({...form, id: uuidv4()})})
            setform({site: "", username: "", password: ""})
        }
    }
    const deletePassword = async (id)=>{
        let c = confirm("Do you want to delete this")
        if(c){
            setpassarr(passarr.filter(item => item.id != id))
            let res = await fetch("http://localhost:3000", {method:'DELETE', headers:{"Content-Type": "application/json"}, body: JSON.stringify({id})})
        }
    }
    const editPassword = async (id)=>{
        setform({...passarr.filter(item=> item.id === id)[0], id:id})
        setpassarr(passarr.filter(item=> item.id !== id))
    }

    const handleChange = (e) => {
        setform({...form, [e.target.name]: e.target.value})
    }
    
    
    
    const showpass = () => {
      console.log(ref.current.src)
      if(ref.current.src.includes("icons/hidden.png")){
        ref.current.src = "icons/eye.png"
        passref.current.type = "password"
      }
      else{
        ref.current.src = "icons/hidden.png"
        passref.current.type = "text"
      }
    }
  return (
    <div>
        {/* Main container */}
        <div className="container md:mx-auto bg-green-100 md:px-10 max-w-5xl pt-[3rem] h-[100vh]">
            <div className="title h-[5rem] flex justify-center items-center text-2xl md:text-4xl font-bold text-green-900">Save Your Password Here!</div>
            {/* Container for input fields */}
            <div className='text-black flex flex-col p-4 gap-2'>
                {/* URL input */}
                <input value={form.site} onChange={handleChange} name='site' placeholder='Enter URL' className='rounded-lg border border-green-500 px-4 middle:focus:outline-none focus:outline-none' type="text" />
                {/* UserName and Password Input */}
                <div className='flex flex-col md:flex-row gap-2 min-w-full gap-x-2'>
                    <input value={form.username} onChange={handleChange} name='username' placeholder='Enter UserName' className='rounded-lg w-full border border-green-500 px-4 middle:focus:outline-none focus:outline-none' type="text" />
                    <div className="relative">
                        <input value={form.password} onChange={handleChange} ref={passref} name='password' placeholder='Enter Password' className='rounded-lg w-full border border-green-500 px-4 middle:focus:outline-none focus:outline-none' type="password"/>
                        <span className='absolute right-0 w-4 mx-1 mt-1 hover:cursor-pointer' onClick={showpass}><img ref={ref} src="icons/eye.png" alt="not hidden" /></span>
                    </div>
                </div>
            </div>
            <div className="button flex justify-center" onClick={savePassword}>
                <button type='submit' className='bg-green-600 hover:cursor-pointer w-[10rem] rounded-full font-bold text-white'>Add</button>
            </div>

            {/* All passwords */}
            <div className='passwords'>
                <div className='font-bold text-2xl my-5 text-slate-900'>
                    Your Passwords
                </div>
                <table className='table-fixed w-full rounded-md overflow-hidden text-center bg-green-200'>
                    <thead className='bg-green-800 text-white font-bold'>
                        <tr>
                            <th className='md:w-[50%]'>Site</th>
                            <th>UserName</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {passarr.map((item)=>{
                            return <tr>
                                <td className='inline'>{item.site} <img className='w-3 md:w-4 inline hover:cursor-pointer' onClick={()=>copyText(item.site)} src="icons/copy.png" alt="copy" /></td>
                                <td>{item.username} <img className='w-3 md:w-4 inline hover:cursor-pointer' onClick={()=>copyText(item.username)} src="icons/copy.png" alt="copy" /></td>
                                <td>{"*".repeat(item.password.length)} <img className='w-3 md:w-4 inline hover:cursor-pointer' onClick={()=>copyText(item.password)} src="icons/copy.png" alt="copy" /></td>
                                <td className='flex gap-4 justify-center'><img onClick={()=>{editPassword(item.id)}} className='w-3 md:w-4 inline hover:cursor-pointer' src="icons/edit.png" alt="Edit"/><img onClick={()=>{deletePassword(item.id)}} className='w-3 md:w-4 inline hover:cursor-pointer' src="icons/delete.png" alt="" /></td>
                            </tr>})
                        }
                    </tbody>
                </table>
            </div>

        </div>
    </div>
  )
}

export default Manager
