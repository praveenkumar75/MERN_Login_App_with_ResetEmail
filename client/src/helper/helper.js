import axios from 'axios'
import { jwtDecode } from "jwt-decode";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token){
        return Promise.reject("Cannot find Token");
    } 
    let decode = jwtDecode(token)
    return decode;
}

export async function authenticate(username){
    try{
        return await axios.post('/api/authenticate', {username})
    }catch(err){
        return {err: "Username doesn't exist...!"}
    }
}

export async function getUser({username}){
    try{
        const {data} = await axios.get(`/api/user/${username}`);
        return {data};
    }catch(err){
        return {err: "Password doesn't Match...!"}
    }
}

export async function registerUser(credentials){
    try {

        const {data:{msg}, status} = await axios.post(`/api/register`,credentials)

        let {username, email} = credentials;

        if(status === 201){
            await axios.post(`/api/registerMail`, {username, userEmail: email, text: msg})
        }

        return Promise.resolve(msg)
        
    } catch (error) {
        return Promise.reject({error})
    }
}

export async function verifyPassword({username, password}){
    try {
        if(username){
            const {data} = await axios.post('/api/login', {username, password})
            return Promise.resolve({data})
        }
    } catch (error) {
        return Promise.reject({error: "Password doesn't Match...!"})
    }
}

export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token')
        const data = await axios.put('/api/updateUser', response, {headers: {"Authorization": `Bearer ${token}`}})
        return Promise.resolve({data});
    } catch (error) {
        return Promise.reject({error: "Couldn't update your profile...!"})
    }
}

export async function generateOTP(username){
    try {
       const {data:{code}, status} = await axios.get('/api/generateOTP', {params: {username}}) 
       if(status===201){
        let {data: {email}} = await getUser({username})
        let msg = `Your Password recovery OTP is ${code}`
        await axios.post(`/api/registerMail`, {username, userEmail: email, text: msg, subject: "Password Recovery OTP"})
       }
       return Promise.resolve(code)
    } catch (error) {
        return Promise.reject({error})
    }
}

export async function verifyOTP({username, code}){
    try {
      const {data,status} = await axios.get('/api/verifyOTP', {params: {username, code}})
      return {data, status}
    } catch (error) {
        return Promise.reject({error})
    }
}

export async function resetPassword({username, password}){
    try {
        const {data,status} =  await axios.put('/api/resetPassword', {username, password})
        return Promise.resolve({data,status})
    } catch (error) {
        return Promise.reject({error})
    }
}