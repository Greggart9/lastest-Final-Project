import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = 'https://35b6-102-89-23-79.ngrok-free.app/api';
  const endpoint = '/admin/sign-in';

  useEffect(() => {
    setErrors({});
    setSuccessMessage('');
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (email.trim() === '' && password.trim() === '') {
      setErrors({ general: 'Email and password are required.' });
      setSuccessMessage('');
      setIsModalOpen(true);
      return;
    } else if (email.trim() === '') {
      setErrors({ email: 'Email is required.' });
      setSuccessMessage('');
      setIsModalOpen(true);
      return;
    } else if (password.trim() === '') {
      setErrors({ password: 'Password is required.' });
      setSuccessMessage('');
      setIsModalOpen(true);
      return;
    }
      else if (confirmPassword.trim() === '') {
    setErrors({ confirmPassword: 'Confirm password is required.' });
    setSuccessMessage('');
    setIsModalOpen(true);
    return;
  } else if (password !== confirmPassword) {
    setErrors({ confirmPassword: 'Passwords do not match.' });
    setSuccessMessage('');
    setIsModalOpen(true);
    return;
  }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: 'Email is invalid.' });
      setSuccessMessage('');
      setIsModalOpen(true);
      return;
    }

  };

  return (
    <>
    
      <div >

      <div className='fixed h-screen w-screen md:hidden bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center'>

      </div>

      <div className='h-screen w-screen fixed -z-10 md:hidden bg-cover bg-center' style={{ backgroundImage: `url('/Images/img10.png')` }}>

      </div>

      <div className='flex '>


          {/* /* LEFT HAND */}
          <div className='h-screen hidden md:block'>

            <img className='lg:w-[40rem] md:w-[45rem] h-screen' src='/Images/img10.png' alt='' />

          </div>

          {/* RIGHT HAND */}


           <div className=' h-screen lg:w-[60rem] md:w-[55rem] w-[80rem] flex justify-center items-center relative'>

            <div className='p-3 py-8 bg-white md:bg-none md:bg-transparent rounded'>
                              
                {/* CREATE ACCOUNT  */}

              <div className='space-y-3'>
                <p className='text-blue-400 font-bold md:text-left text-center md:text-3xl text-2xl'>Create Account</p>

                <div className='flex flex-col'>
                    <div className='flex gap-2'>
                        <p className='border-[0.2rem] lg:w-[14.5rem] md:w-[12.5rem] w-[9rem] border-blue-400 mt-3 rounded'></p>
                        <p className='border-[0.2rem] lg:w-[15rem] md:w-[12.5rem]  w-[9rem] border-gray-200 mt-3 rounded'></p> 
                    </div>
                </div>
                <p className='text-sm text-gray-400 font-bold flex  pr-2 justify-end'>1 of 2</p>
              </div>



              {/* SIGN UP PART */}
              <form className=' flex flex-col justify-center items-center lg:space-y-2 space-y-1' onSubmit={handleSubmit}>
                {/* NAME */}
                <div className='space-y-1 items-start'>
                  <label htmlFor='name' className='text-gray-400 text-md md:text-xl'>Name</label><br />
                  <input
                    className=' bg-gray-100 h-11 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
                    type='text'
                    id='name'
                    name='name'
                    placeholder='Enter your name'
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className='space-y-1 items-start '>
                  <label htmlFor='email' className='text-gray-400 text-md md:text-xl '>Email</label><br />
                  <input
                    className='bg-gray-100 h-11 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
                    type='email'
                    id='email'
                    name='email'
                    placeholder='example@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                </div>

                {/* PASSWORD */}
                <div className='space-y-1 items-start relative'>
                  <label htmlFor='password' className='text-gray-400 text-md md:text-xl'>Password</label><br />
                  <input
                    className='bg-gray-100 h-11 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    name='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type='button' onClick={togglePasswordVisibility} className='absolute right-7 top-10'>
                    {showPassword ? <IoEyeOff className='text-gray-400 text-xl' /> : <IoEye className='text-gray-400 text-xl' />}
                  </button>
                  {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                </div>

                {/* CONFIRM PASSWORD */}
                  <div className='space-y-1 items-start relative'>
                    <label htmlFor='confirmPassword' className='text-gray-400 text-md md:text-xl'>Confirm Password</label><br />
                    <input
                      className='bg-gray-100 h-11 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded outline-gray-400 px-4'
                      type={showConfirmPassword ? 'text' : 'password'}
                      id='confirmPassword'
                      name='confirmPassword'
                      placeholder='Confirm your password'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button type='button' onClick={toggleConfirmPasswordVisibility} className='absolute right-7 top-10'>
                      {showConfirmPassword ? <IoEyeOff className='text-gray-400 text-xl' /> : <IoEye className='text-gray-400 text-xl' />}
                    </button>
                    {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
                  </div>

                {/* SUBMIT BUTTON */}
                <Link to='/Signup2'><div className=''>
                  <button type='' className='bg-gray-100 py-3 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded-3xl mt-3 font-bold text-gray-600  hover:bg-blue-400 hover:text-white'>
                    {loading ? 'Loading...' : 'Next'}
                  </button>
                </div></Link>

                {/* SIGNUP */}
                <p className='text-gray-400 text-sm font-bold mt-1'>
                  Already have an Account? <Link to='/Signin'><span className='text-blue-400 cursor-pointer'>Sign In</span></Link></p>
              </form>

              
            </div>


           </div>
        
        </div>

      </div>
    </>
  );
}

export default Signup;
