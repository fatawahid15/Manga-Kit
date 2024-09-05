import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginPage(){
const navigate = useNavigate()
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

async function handleLogin(e){
    e.preventDefault()
}

    return (
        <>hola</>
    )
}