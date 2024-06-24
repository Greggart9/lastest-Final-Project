import { useState, useEffect } from 'react';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';




function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [spin, setSpin] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = '';
  const endpoint = '/';

useEffect(() => {
     setErrorMessage('');
     setSuccessMessage('');
      // setEmailError('');
      // setPasswordError('');
}, []);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async () => {
      // Check if email and password are empty  
      if (email.trim() === '' && password.trim() === ''){
        setErrorMessage('Email and password are required.');
        setSuccessMessage('');
        setIsModalOpen(true);
        return;
      } else if (email.trim() === '') {
        setErrorMessage('Email is required.');
        setSuccessMessage('');
        setIsModalOpen(true);
        return;
      } else if(password.trim() === '') {
        setErrorMessage('Password is required.');
        setSuccessMessage('');
        setIsModalOpen(true);
        return;
      } 

    // Check if email is in a valid format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Email is invalid.');
      setSuccessMessage('');
      setIsModalOpen(true);
      return;
    }
    setSpin(true);
    // setErrorMessage('');
    // setSuccessMessage('');
    

    {/* Fetch Api */}
    try {
        const response = await fetch(BASE_URL + endpoint, {
          method: 'POST',
          headers: {
            'app-token': '',
            'Content-Type': '',
            'origin': '*',
          },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      // console.warn(data);
      // console.warn(JSON.stringify(data));
      localStorage.setItem('auth', JSON.stringify(data.status));
      // console.log('API response status:', response.status);

      if (!response.ok) {
        setErrorMessage('Incorrect email or password! Please try again');
        setSuccessMessage('');
        setIsModalOpen(true);
        return;
      } else {
        setSuccessMessage('Sign-in successful.');
        setErrorMessage('')
        setIsModalOpen(true);
      }

      setTimeout(() => {
        navigate('/Dashboard');
      }, 1000)

    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('An error occurred. Please try again.');
      // return;
    } finally {
      setSpin(false);
    }

  };

  const closeModal = () => {
    setIsModalOpen(false);
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

                <div className='p-5 py-6 bg-white md:bg-none md:bg-transparent rounded'>

              {/* LOGIN  */}

              <div className='mb-4'>
                <p className='text-blue-400 font-bold md:text-left text-center md:text-3xl text-2xl'>Sign In</p>
              </div>

                  {/* SIGN UP PART */}
                  <form className=' flex flex-col justify-center items-center lg:space-y-3 space-y-1' onSubmit={handleSubmit}>


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

                    {/* FORGOT PASSWORD */}
                    <div className='flex justify-start w-full'>
                      <p className='text-blue-400 text-md md:text-xl font-medium cursor-pointer'>Forgot Password?</p>
                    </div>


                    {/* SUBMIT BUTTON */}
                    <Link to='/Signup2'><div className=''>
                      <button type='' className='bg-gray-100 py-3 lg:w-[30rem] md:w-[25rem] w-[17rem] rounded-3xl mt-3 font-bold text-gray-600  hover:bg-blue-400 hover:text-white'>
                        {loading ? 'Loading...' : 'Next'}
                      </button>
                    </div></Link>

                    {/* SIGNUP */}
                    <p className='text-gray-400 text-sm font-bold mt-1'>
                      Already have an Account ? <Link to='/Signup'><span className='text-blue-400 cursor-pointer'>Sign Up</span></Link></p>
                  </form>

                </div>
              </div>
            </div>

          </div>
    </>

  );
}

export default Login;