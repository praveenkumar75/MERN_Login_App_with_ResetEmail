import React, { useEffect } from 'react'
import './Login.css'
import {Link, useNavigate, Navigate} from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { resetPasswordValidation } from '../../helper/validate';
import { resetPassword } from '../../helper/helper';
import { useAuthStore } from '../../store/store';
import useFetch from '../../hooks/fetch.hooks';

const Reset = () => {

  const {username} = useAuthStore(state => state.auth);
  const navigate = useNavigate();
  const [{isLoading,apiData,status,serverError}] = useFetch('createResetSession')

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: ''
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let resetPromise = resetPassword({username, password: values.password})
      toast.promise(resetPromise,{
        loading: 'Updating...!',
        success: "Reset Successfully",
        error: "Could not reset"
      })
      resetPromise.then(function() {navigate('/password')})
    }
  })

  if(isLoading) return <h1>isLoading</h1>
  if (serverError) {
    <h1>{serverError.message}</h1>
  }
  if(status && status !== 200) return <Navigate to={'/password'} replace={true}></Navigate>

  return (
    <>
      <div className='bg-layer-login'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='container'>
          <div className='row justify-content-center align-item-center height-100-vh'>
            <div className='col-xl-4 col-lg-6 col-md-6 col-sm-8 col-12'>
              <div className='frame'>
                <div className='heading-1'>
                  <h4>Reset</h4>
                </div>
                <div className='content-text-frame'>
                  <p>Enter your new password</p>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className='input-frame mb-3'>
                    <input {...formik.getFieldProps('password')} type='password' placeholder='New Password' className='form-control' />
                  </div>
                  <div className='input-frame mb-3'>
                    <input {...formik.getFieldProps('confirm_pwd')} type='password' placeholder='Repeat New Password' className='form-control' />
                  </div>
                  <div className='frame-button mb-3'>
                    <button type='submit' className='btn btn-success'>Reset</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Reset