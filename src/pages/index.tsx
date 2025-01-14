import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRight} from '@fortawesome/free-solid-svg-icons'
import {faTwitter} from '@fortawesome/free-brands-svg-icons'

import {useSession, signIn} from 'next-auth/react'

import Link from 'next/link'

interface HomepageProps {

}


const Homepage: React.FC<HomepageProps> = ({}) => {

    const {data:session} = useSession()

    return (
        <div className='w-screen h-screen homepageGradient px-[6%] py-[2%] text-white flex flex-col justify-start items-center'>
            
            {/* backdrop globe */}
            <div className='h-full w-[88%] absolute top-[0%] overflow-hidden z-10'>
                <img src="/assets/images/backdrop.png" className='h-full m-auto' />
            </div>

            {/* navbar */}
            <div className='w-full flex flex-row justify-between items-center h-[7vh] z-20'>
                <img src="/assets/images/defi-os-logo.png" className='h-full' />
                <div className='flex flex-row justify-end items-center w-full h-full' >
                    <a href='https://youtu.be/36O5ew_3qh0' target="_blank" className='mx-[2%] font-thin text-[2.5vh]'>Hype Video</a>
                    <a href='/whitepaper' target="_blank" className='mx-[2%] font-thin text-[2.5vh]'>Whitepaper</a>
                    <a href="mailto:abhi@defi-os.com?Subject=Product%20Query" className='mx-[2%] font-thin text-[2.5vh]'>Contact Us</a>
                </div>
            </div>

            <div className='h-full w-full flex justify-center items-center z-20'>
                <div className=''>
                    <div className="flex flex-row justify-center items-center leading-[12vh] text-[10vh] font-semibold workSansFont">
                        <div className='mx-[1%] gradientText1' >Making</div>
                        <div className='mx-[1%]' >Open</div>
                        <div className='mx-[1%]' >Source</div>
                    </div>
                    <div className="flex flex-row justify-center items-center leading-[12vh] text-[10vh] font-semibold workSansFont">
                        <div className='mx-[1%] gradientText1' >Sustainable for all</div>
                    </div>
                    <div className='flex flex-col justify-center items-center text-[2.3vh] w-[100%] m-auto my-[8%]'>
                        <div className='flex flex-row justify-center items-center w-full mb-[1%]'>
                            <div>DefiOS converts open source repositories into DAOs with</div>
                            <div className='ml-[1%] text-[#7082C3] font-bold'>project native</div>
                        </div>
                        <div className='flex flex-row justify-center items-center w-full'>
                            <div className='text-[#7082C3] font-bold'>tokens</div>
                            <div className='mx-[1%]' >that enterprise users can use to</div>
                            <div className='text-[#7082C3] font-bold'>incentivize developers.</div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center w-full text-[#1D242D] text-[2vh] font-semibold'>
                        
                        {!session && 
                        <button onClick={()=>signIn('github',{callbackUrl: `${window.location.origin}/dashboard`})} className='bg-[#D1D2D2] py-[2.5%] w-[27%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                            <div>Get Started</div>
                            <FontAwesomeIcon icon={faArrowRight} className='inline h-[2vh] ml-[3%]'/>
                        </button>
                        }
                        {session &&
                        <Link href='/dashboard'>
                            <button className='bg-[#D1D2D2] py-[2.5%] w-[27%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                                <div>Get Started</div>
                                <FontAwesomeIcon icon={faArrowRight} className='inline h-[2vh] ml-[3%]'/>
                            </button>
                        </Link>
                        }

                        <a href='https://twitter.com/defiOSofficial' target="_blank" className='bg-[#7082C3] py-[2.5%] w-[27%] rounded-[0.75vh] mx-[2%] flex flex-row justify-center items-center' >
                            <div>Latest Updates</div>
                            <FontAwesomeIcon icon={faTwitter} className='inline h-[3vh] ml-[2%]'/>
                        </a>
                    </div>
                </div>
            </div>



        </div>
    );
}

export default Homepage;
