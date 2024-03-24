import React from 'react'
import {Link} from 'react-router-dom'


const Landing = () => {
  return (
    <>
        {/* The Header to the landing page */}
     
   <header className='py-4 border-b-2 border-blue-300'>
       <div className='container mx-auto flex items-center justify-between'>
               {/* The Logo Div */}

           <div className='flex items-center ml-4'>
               <img src='/Images/Logo.png' className='h-16' alt='Website Logo' />
           </div>

           {/* The Navbar Div */}

           <nav>
               <ul className='flex space-x-4'>
                  <Link to='/' > <li className='hover:bg-blue-400 text-black hover:text-white text-xl py-2 px-5 rounded-3xl cursor-pointer'>Home</li></Link>
                   <li className='hover:bg-blue-400 text-black hover:text-white text-xl py-2 px-5 rounded-3xl cursor-pointer '>About Us</li>
                   <li className='hover:bg-blue-400 text-black hover:text-white text-xl py-2 px-5 rounded-3xl cursor-pointer'>University</li>
                   <li className='hover:bg-blue-400 text-black hover:text-white text-xl py-2 px-5 rounded-3xl cursor-pointer'>Contact Us</li>
               </ul>

           </nav>

           {/* The Login/Signup Div */}

           <div className='mr-4 flex space-x-4'>
              <Link to='/Signin' ><button className='text-blue-400 border border-blue-400 py-2 px-7 text-x rounded-3xl hover:bg-blue-400 hover:text-white cursor-pointer'>Login</button></Link> 
              <Link to='/Signup' > <button className='text-white bg-blue-400  py-2 px-5 rounded-3xl text-x hover:bg-white hover:text-blue-400 hover:border hover:border-blue-400 cursor-pointer'>Sign up</button> </Link> 
           </div>
       </div>  
       
   </header>

    {/* This is beginning of the body to the landing page */}

    <section className='w-100 h-[33.4rem]  flex items-center'>
       <div className='container mx-auto w-10/12 flex items-center justify-between'>

            {/* The content by the left hand side THE TEXT*/}
           <div className='space-y-8 '>
               <p className='text-6xl font-bold'><span className='text-blue-400'>Power Your</span><br/> Education, <span  className='text-blue-400'>Elevate</span><br/> Your Learning <br/>Journey</p>
               <p className='text-xl'>The Ultimate Collaboration Hub for Students <br/>and Lecturers to Expand Knowledge and Sharpen Skills.</p>
               <button className='text-white bg-blue-400  py-3 px-7 rounded-3xl hover:bg-white hover:text-blue-400 hover:border-2 hover:border-blue-400 cursor-pointer'>Get Started</button>

           </div>

            {/* The content by the left hand side THE IMAGE*/}
            
            <div className=''>
               <img className='h-[25rem]' src='/Images/img1.png' alt='A passionate lady' />
            </div>
            
            {/* The ring image by the bottom THE IMAGE*/}

            <div className='absolute bottom-0 left-[35rem]'>
               <img className='h-[20rem] -z-3' src='Images/img2.png' alt='The ring' />
            </div>
       </div>

    </section>


         {/* THE STATS DIV */}

         <section className='w-100 flex justify-center'>

           <div className='flex justify-evenly w-[70rem] py-10'>

               {/* RESOURCES */}
               <div className='flex items-center gap-3'>
                   <img className='h-16' src='/Images/img3.png' alt='Resources' />
                   <div>
                       <p className='font-bold text-2xl m-0'>1K+</p>
                       <p className='text-lg m-0'>Resources</p>
                   </div>
               </div>

               {/* PAST QUESTIONS */}
               <div className='flex items-center gap-3'>
                   <img className='h-16' src='/Images/img4.png' alt='Past questions' />
                   <div>
                       <p className='font-bold text-2xl m-0'>500+</p>
                       <p className='text-lg m-0'>Past Questions</p>
                   </div>
               </div>

               {/* UNIVERSITIES */}
               <div className='flex items-center gap-3'>
                   <img className='h-16' src='/Images/img5.png' alt='universities' />
                   <div>
                       <p className='font-bold text-2xl m-0'>100+</p>
                       <p className='text-lg m-0'>Universities</p>
                   </div>
               </div>
           </div>

         </section>


         {/* THE ABOUT US PAGE */}

         <section className='flex items-center h-[35rem] bg-gray-50'>
           <div className='container flex mx-auto w-10/12 items-center justify-between'>

               {/* IMAGE OF ABOUT US */}
               <div className='flex-1'>
                   <img className='h-96' src='Images/img6.png' alt='about us' />
               </div>

               {/* ABOUT US TEXT */}
               <div className='flex-1 space-y-5'>
                   <p className='font-bold text-3xl'><span className='text-blue-400'>About</span> Us</p>
                   <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                       incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                       consequat.<br/>
                       <br/>
                       

                       Duis aute irure dolor in reprehenderit in voluptate velit esse
                       cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                       proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                   </p>

                   <button className='bg-blue-400 px-7 py-2 rounded-3xl text-white font-bold'>Read More</button>
               </div>

           </div>
         </section>

         {/* THE AFTER ABOUT US */}

         <section className='flex items-center h-[33rem] '>
           <div className='container mx-auto flex w-10/12 items-center justify-between'>

               {/* LEFT CONTENT */}
               <div className='space-y-3'>
                   <img className='h-[17rem]' src='/Images/img8.png' alt='A lady' />
                   <p className='text-3xl font-bold'>Explore 1k+ Free <span className='text-blue-400'>Online Resources</span></p>
                   <p className='text-lg'>Lorem ipsum dolor sit amet, consectetur adipisicing<br/>
                       elit, sed do eiusmod tempor incididunt ut labore et<br/>
                       dolore magna aliqua. </p>
               </div>

               {/* RIGHT CONTENT (THE GRID) */}
               <div>
                   <div className='grid grid-cols-2 gap-6'>
                       <div className='bg-gray-100 pl-5 py-7 px-9 rounded-xl '>
                           <img className='h-16' src='/Images/img3.png' alt='grid 1' />
                           <p>Upload Materials</p>
                       </div>

                       <div className='bg-gray-100 pl-5 py-7 px-9 rounded-xl '>
                       <img className='h-16' src='/Images/img4.png' alt='grid 2' />
                       <p>Access Past <br/> Questions</p>
                       </div>

                       <div className='bg-gray-100 pl-5 py-7 px-9 rounded-xl '>
                       <img className='h-16' src='/Images/img5.png' alt='grid 3' />
                       <p>Study Resources</p>
                       </div>

                       <div className='bg-gray-100 pl-5 py-7 px-9 rounded-xl '>
                       <img className='h-16' src='/Images/img9.png' alt='grid 4' />
                       <p>Open Source <br/>Collaboration</p> 
                       </div>

                   </div>
               </div>

           </div>
         </section>

         {/* THE TESTIMONIAL PAGE */}

         <section className='bg-blue-400 mx-auto flex justify-center w-100 h-[30rem]'>
            
            <div className='container flex flex-col w-full items-center gap-10 justify-center'>
               <p className='text-white text-3xl font-bold'>Testimonial</p>
                 
                 {/* THE TWO REVIEWERS OR TESTIMONIEES */}
               <div className='flex gap-10'>

                   {/* LEFT  */}
                   <div  className='bg-white px-12 py-5 rounded-xl'>

                       {/* PROFILE */}
                       <div className='flex gap-4 items-center'>
                           <img src='/Images/profile.png' alt='Greggart9' />
                           <div>
                               <p className='text-blue-400 font-bold text-xl -mb-2'>Greggart9</p>
                               <p className='text-gray-400'>Funaab</p>
                               <img src='/Images/star.png' alt='rating' />
                           </div>

                       </div>

                       {/* TEXT */}
                       <div>
                       Lorem ipsum dolor sit amet, consectetur <br/>
                       adipisicing elit, sed do eiusmod tempor  <br/>
                        incididunt ut labore et dolore magna aliqua. <br/>
                         Ut enim ad minim veniam, quis nostrud    <br/>
                       exercitation ullamco laboris nisi ut aliquip ex <br/>
                        ea commodo consequat. 
                       </div>
                   </div>


                   {/* Right  */}
                   <div className='bg-white px-12 py-5 rounded-xl'>

                       {/* PROFILE */}
                       <div className='flex gap-4 items-center'>
                           <img src='/Images/profile.png' alt='Jimmy' />
                           <div>
                               <p className='text-blue-400 font-bold text-xl -mb-2'>Jimmy</p>
                               <p className='text-gray-400'>Abuad</p>
                               <img src='/Images/star.png' alt='rating' />
                           </div>

                       </div>

                       {/* TEXT */}
                       <div>
                       Lorem ipsum dolor sit amet, consectetur <br/>
                       adipisicing elit, sed do eiusmod tempor  <br/>
                        incididunt ut labore et dolore magna aliqua. <br/>
                         Ut enim ad minim veniam, quis nostrud    <br/>
                       exercitation ullamco laboris nisi ut aliquip ex <br/>
                        ea commodo consequat. 
                       </div>
                   </div>

               </div>

            </div>

         </section>

         {/* CONTACT US  */}

         <section className=' mx-auto flex items-center justify-center h-[35rem]'>
           <div className=' flex gap-20'>

               {/* LEFT CONTENT */}
               <div className='space-y-5'>
                   <p className='text-blue-400 font-bold text-2xl'>Send us a message</p>
                   <div className=''>
                       {/* NAME */}
                       <div className='flex gap-5'>
                           <div >
                           <label className='block text-gray-500'>Name</label>
                           <input className='py-1.5 px-3 rounded-md placeholder:text-gray-300 border-2' type='text' id='name' placeholder='Enter Full Name' />
                           </div>

                           <div>
                           <label className='block text-gray-500'>Email</label>
                           <input className='py-1.5 px-3 rounded-md placeholder:text-gray-300 border-2' type='email' id='email' placeholder='example@gmail.com' />
                           </div>


                       </div>
                   </div>
                   {/* SUBJECT */}
                   <div>
                   <label className='block text-gray-500'>Subject</label>
                   <input className='py-1.5 px-3 rounded-md w-[26.8rem] border-2' type='text' id='subject'/>
                   </div>

                   {/* MESSAGE */}
                   <div>
                     <label className='block text-gray-500'>Message</label>
                     <input className='py-1.5 px-3 rounded-md w-[26.8rem] h-32 border-2' type='textarea' id='subject'/>
                   </div>

                   <button className='bg-blue-400  py-3 px-12 font-bold text-white rounded-3xl '>Send</button>

               </div>

               {/* RIGHT CONTENT */}
               
               <div>
                   <img className='h-[28rem]'  src='/Images/img10.png' alt='message us' />
               </div>

           </div>
         </section>

         {/* FOOTER */}

         <section className='bg-black mx-auto flex justify-center items-center h-[13rem]'>
           <div className='container flex justify-between w-[75rem]'>

               {/* MOTTO */}
               <div className=''>
                   <p className='text-blue-400 mb-1 font-bold text-xl'>Greggart9</p>
                   <p className='text-white'>The Ultimate Collaboration Hub for <br/> Students and Lecturers
                   to Expand <br/>Knowledge and Sharpen Skills.</p>

               </div>

               {/* CONTACT US */}
               <div>
                   <p className='text-blue-400 mb-1 font-bold text-xl'>Contact Us</p>
                   <p className='text-blue-400'>Email:</p>
                   <p className='text-white'>info@greg.com</p>

                   <p className='text-blue-400'>Phone:</p>
                   <p className='text-white'>09079654499</p>
               </div>

               
               {/* FOLLOW US */}
               <div>
                   <p className='text-blue-400 mb-1 font-bold text-xl'>Follow Us On</p>
                   <div className='flex text-white gap-4'>
                       <img className='cursor-pointer' src='/Images/icon2.png' alt='Instagram' />
                       <img className='cursor-pointer'  src='/Images/icon1.png' alt='Facebook' />
                       <img className='cursor-pointer'  src='/Images/icon3.png' alt='Google' />
                       <img className='cursor-pointer'  src='/Images/icon4.png' alt='X' />
                       <img className='cursor-pointer'  src='/Images/icon5.png' alt='YouTube' />
                   </div>
               </div>

           </div>
         </section>
 


   </>
    
  )
}

export default Landing