import {createContext, useState, useCallback, useEffect} from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();
export const AuthContextProvider = ({children}) =>{
const [user,setUser] = useState(null);
const [registerError, setRegisterError] = useState(null);
const [isRegisterLoading, setIsRegisterLoading] = useState(false);
const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password:"",
});


const [loginError, setLoginError] = useState(null);
const [isLoginLoading, setIsLoginLoading] = useState(false);
const [LoginInfo, setLoginInfo] = useState({
    email: "",
    password:"",
});

console.log("User", user);
console.log("loginInfo", LoginInfo);
useEffect(()=>{
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
}, []);

const updateRegisterInfo = useCallback((info) =>{
    setRegisterInfo(info);
},[]);

const updateLoginInfo = useCallback((info) =>{
    setLoginInfo(info);
},[]);

const loginUser = useCallback(
    async (e) => {
    e.preventDefault();

    setIsLoginLoading(true);
    setLoginError(null);

    const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(LoginInfo));

    setIsLoginLoading(false);
    if(response.error){
        return setLoginError(response);
    }

    localStorage.setItem("User", JSON.stringify(response));
    setUser(response);

}, [LoginInfo]); //Funcao responsavel por fazer o logib

const registerUser = useCallback(async(e)=> {
    e.preventDefault()
    setIsRegisterLoading(true)
    setRegisterError(null)

    const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))
    setIsRegisterLoading(false)
    if(response.error){
     return setRegisterError(response);
    } 
    localStorage.setItem("User", JSON.stringify(response))
    setUser(response)
}, [registerInfo]);

const logoutUser = useCallback(()=>{
    localStorage.removeItem("User");
    setUser(null);
},[])
    return (<AuthContext.Provider
    value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        LoginInfo,
        updateLoginInfo,
        isLoginLoading,
    }} // Inicializacao dos metodos para poder aceder
    //atraves de outras classe, como a classe interface login
    >
        {children}
    </AuthContext.Provider>);
}