import toast from "react-hot-toast";
import { authenticate } from "./helper";

export async function usernameValidate(values){
    const error = usernameVerify({}, values);
    if(values.username){
        const {status} = await authenticate(values.username);
        if(status !== 200){
            error.exists = toast.error("Username does not exists...!")
        }
    }
    return error
}

export async function passwordValidate(values){
    const error = passwordVerify({}, values);
    return error
}

export async function resetPasswordValidation(values) {
    const error = passwordVerify({}, values);
    if(values.password !== values.confirm_pwd){
        error.password = toast.error('Password not match...!')
    }
    return error
}

export async function registerValidation(values) {
    const error = usernameVerify({}, values);
    passwordVerify(error, values)
    emailVerify(error, values)
    return error
}

export async function profileValidation(values){
    const error = emailVerify({},values)
    return error;
}

function passwordVerify(error = {}, values) {
    var regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g
    if(!values.password){
        error.password = toast.error('Password Required...!');
    }else if(values.password.includes(" ")){
        error.password = toast.error('Wrong Password...!')
    }else if(values.password.length < 4){
        error.password = toast.error('Password need to grater than 4 character')
    }else if(!regex.test(values.password)){
        error.password = toast.error('Special character is missing in the password')
    }
    return error;
}

function usernameVerify(error = {}, values) {
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid Username...!')
    }
    return error;
}

function emailVerify(error={},values){
    var emailReg = /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/g
    if(!values.email){
        error.email = toast.error('Email Required');
    }else if(values.email.includes(" ")){
        error.email = toast.error('Wrong Email..!')
    }else if(!emailReg.test(values.email)){
        error.email = toast.error('Invalid Email..!')
    }
    return error;
}