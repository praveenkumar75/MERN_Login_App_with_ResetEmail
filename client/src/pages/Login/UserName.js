import React from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { usernameValidate } from '../../helper/validate';
import { useAuthStore } from '../../store/store';

const UserName = () => {

  const navigate = useNavigate()
  const setUsername = useAuthStore(state => state.setUsername)
  
  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      //console.log(values)
      setUsername(values.username)
      navigate('/password')
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
                  <p>Explore More by connect with us</p>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className='profile-image'>
                    <img src="https://media.istockphoto.com/id/1388253782/photo/positive-successful-millennial-business-professional-man-head-shot-portrait.jpg?s=612x612&w=0&k=20&c=uS4knmZ88zNA_OjNaE_JCRuq9qn3ycgtHKDKdJSnGdY=" alt="profile picture" />
                  </div>
                  <div className='input-frame mb-3'>
                    <input {...formik.getFieldProps('username')} type='text' placeholder='Username' className='form-control' />
                  </div>
                  <div className='frame-button mb-3'>
                    <button type='submit' className='btn btn-danger'>Let's Go</button>
                  </div>
                </form>
                <div className='frame-footer'>
                  <p className='mb-0'>Not a Member <a className='design-anchor' href={'/register'}>Register Now</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserName