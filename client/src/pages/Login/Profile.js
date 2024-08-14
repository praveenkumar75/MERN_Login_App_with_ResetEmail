import React, { useState } from 'react'
import './Login.css'
import avatar from '../../assets/images/profile.png'
import {Link, useNavigate} from 'react-router-dom'
import toast, {Toaster} from 'react-hot-toast';
import {useFormik} from 'formik'
import { profileValidation } from '../../helper/validate';
import convertToBase64 from '../../helper/convert';
import useFetch from '../../hooks/fetch.hooks';
import { useAuthStore } from '../../store/store';
import { updateUser } from '../../helper/helper';

const Profile = () => {

  const [file, setFile] = useState();
  const navaigate = useNavigate()
  const {username} = useAuthStore(state => state.auth)
  const [{isLoading,apiData,serverError}] = useFetch()

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      mobile: apiData?.mobile || '',
      email: apiData?.email || '',
      address: apiData?.address || ''
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {profile: file || apiData?.profile || ''});
      let updatePromise = updateUser(values)
      toast.promise(updatePromise,{
        loading: 'updating...!',
        success: <b>Updated Successfully...!</b>,
        error: <b>Could not update...!</b>
      })
      console.log(values)
    }
  })

  if(isLoading) return <h1>isLoading</h1>
  if (serverError) {
    <h1>{serverError.message}</h1>
  }

  const userLogOut = () => {
    localStorage.removeItem('token')
    navaigate('/')
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
                  <h4>Profile</h4>
                </div>
                <div className='content-text-frame'>
                  <p>Your can update your details</p>
                </div>
                <form onSubmit={formik.handleSubmit}>
                  <div className='profile-image'>
                    <label htmlFor='profile'>
                      <img src={apiData?.profile || file || avatar} alt="profile picture" />
                    </label>
                    <input type='file' id='profile' name='profile' onChange={(e)=>onUpload(e)} />
                  </div>
                  <div className='input-frame mb-3'>
                    <div className='row'>
                      <div className='col-md-6 col-sm-12'>
                        <input {...formik.getFieldProps('firstName')} type='text' placeholder='First Name' className='form-control mb-3' />
                      </div>
                      <div className='col-md-6 col-sm-12'>
                        <input {...formik.getFieldProps('lastName')} type='text' placeholder='Last Name' className='form-control mb-3' />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-6 col-sm-12'>
                        <input {...formik.getFieldProps('mobile')} type='text' placeholder='Mobile No.' className='form-control mb-3' />
                      </div>
                      <div className='col-md-6 col-sm-12'>
                        <input {...formik.getFieldProps('email')} type='text' placeholder='Email' className='form-control mb-3' />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-md-12'>
                        <textarea {...formik.getFieldProps('address')} placeholder='Address' className='form-control mb-3'></textarea>
                      </div>
                    </div>
                  </div>
                  <div className='frame-button mb-3'>
                    <button type='submit' className='btn btn-danger'>Register</button>
                  </div>
                </form>
                <div className='frame-footer'>
                  <p className='mb-0'>come back later? <Link onClick={userLogOut}>Logout</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile