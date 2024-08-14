import React, { useEffect, useState } from 'react'
import './Login.css'
import {Link, useNavigate} from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { passwordValidate } from '../../helper/validate';
import { useAuthStore } from '../../store/store';
import { generateOTP, verifyOTP } from '../../helper/helper';

const Recovery = () => {
  const navigate = useNavigate()
  const {username} = useAuthStore(state => state.auth)
  const [OTP, setOTP] = useState();
  useEffect(()=>{
    generateOTP(username).then((OTP)=>{
      console.log(OTP)
      if(OTP) return toast.success("OTP has been sent to your email")
      return toast.error("Problem while generating OTP")
    })
  },[username])

  const otpSubmit = async (e) => {
    e.preventDefault();
    try {
      let {status} = await verifyOTP({username, code: OTP})
      if(status === 200){
        toast.success('Verified Successfully');
        navigate('/reset')
      }
    } catch (error) {
      return toast.error('Wrong OTP, Please Check Your Email')
    }
  }

  const resendOTP = () =>{
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise,{
      loading: 'Sending...!',
      success: "OTP Send Successfully",
      error: "Could not send"
    })
    sendPromise.then(OTP =>{
      console.log(OTP)
    })
  }

  return (
    <>
      <div className='bg-layer-login'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='container'>
          <div className='row justify-content-center align-item-center height-100-vh'>
            <div className='col-xl-4 col-lg-6 col-md-6 col-sm-8 col-12'>
              <div className='frame'>
                <div className='heading-1'>
                  <h4>Recovery</h4>
                </div>
                <div className='content-text-frame'>
                  <p>Enter OTP to recover password</p>
                </div>
                <form onSubmit={otpSubmit}>
                  <div className='input-frame mb-3'>
                    <p className='mb-3'>Enter OTP sent to your email address</p>
                    <input onChange={(e)=>setOTP(e.target.value)} type='text' placeholder='OTP' className='form-control' />
                  </div>
                  <div className='frame-button mb-3'>
                    <button type='submit' className='btn btn-danger'>Recover</button>
                  </div>
                </form>
                <div className='frame-footer'>
                  <p className='mb-0'>Can't get OTP? <a className='color-red' onClick={resendOTP}>Resend</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Recovery