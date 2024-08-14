import React from 'react'
import './Login.css'
import {Link, useNavigate} from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { passwordValidate } from '../../helper/validate';
import useFetch from '../../hooks/fetch.hooks';
import { useAuthStore } from '../../store/store';
import avatar from '../../assets/images/profile.png';
import { verifyPassword } from '../../helper/helper';

const Password = () => {
  const navigate = useNavigate()
  const {username} = useAuthStore(state => state.auth)
  const [{isLoading,apiData,serverError}] = useFetch(`user/${username}`)

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({username, password: values.password})
      toast.promise(loginPromise, {
        loading: 'Loading...!',
        success: <b>Login Successfully...!</b>,
        error: <b>Incorrect Password...!</b>
      })
      loginPromise.then(res => {
        let {token} = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
    }
  })

  if(isLoading) return <h1>isLoading</h1>
  if (serverError) {
    <h1>{serverError.message}</h1>
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
                  <h4>Hello {apiData?.firstName || apiData?.username}</h4>
                </div>
                <div className='content-text-frame'>
                  <p>Explore More by connect with us</p>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className='profile-image'>
                    <img src={apiData?.profile || avatar} alt="profile picture" />
                  </div>
                  <div className='input-frame mb-3'>
                    <input {...formik.getFieldProps('password')} type='password' placeholder='Password' className='form-control' />
                  </div>
                  <div className='frame-button mb-3'>
                    <button type='submit' className='btn btn-danger'>Sign In</button>
                  </div>
                </form>
                <div className='frame-footer'>
                  <p className='mb-0'>Forgot Password <Link to={'/recovery'}>Recovery</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Password