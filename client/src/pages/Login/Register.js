import React, { useState } from 'react'
import './Login.css'
import avatar from '../../assets/images/profile.png'
import {Link, useNavigate} from 'react-router-dom'
import toast,{Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { registerValidation } from '../../helper/validate';
import convertToBase64 from '../../helper/convert';
import { registerUser } from '../../helper/helper';

const Register = () => {

  const [file, setFile] = useState();
  const navigate = useNavigate();

  const onUpload = async (e) => {
    // console.log(e.target.files[0])
    // setFile(URL.createObjectURL(e.target.files[0]));
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {profile: file || ''})
      //console.log(values)
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...!',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register...!</b>
      })
      registerPromise.then(function() {navigate('/')})
    }
  })

  return (
    <>
      <div className='bg-layer-login'>
        <Toaster position='top-center' reverseOrder={false}></Toaster>
        <div className='container'>
          <div className='row justify-content-center align-item-center height-100-vh'>
            <div className='col-xl-4 col-lg-6 col-md-6 col-sm-8 col-12'>
              <div className='frame'>
                <div className='heading-1'>
                  <h4>Hello Again</h4>
                </div>
                <div className='content-text-frame'>
                  <p>Happy to join with you</p>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className='profile-image'>
                    <label htmlFor='profile'>
                      <img src={file || avatar} alt="profile picture" />
                    </label>
                    <input type='file' id='profile' name='profile' onChange={(e)=>onUpload(e)} />
                  </div>
                  <div className='input-frame mb-3'>
                    <input {...formik.getFieldProps('email')} type='text' placeholder='Email' className='form-control mb-3' />
                    <input {...formik.getFieldProps('username')} type='text' placeholder='Username' className='form-control mb-3' />
                    <input {...formik.getFieldProps('password')} type='password' placeholder='Password' className='form-control mb-3' />
                  </div>
                  <div className='frame-button mb-3'>
                    <button type='submit' className='btn btn-danger'>Register</button>
                  </div>
                </form>
                <div className='frame-footer'>
                  <p className='mb-0'>Already Register? <Link to={'/'}>Login</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register