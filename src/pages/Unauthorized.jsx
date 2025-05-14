import React from 'react'
import { Helmet } from 'react-helmet';

const UnauthorizedPage = () => {
    return (
        <>
            <Helmet>
                <title>Unauthorized - Reusemart</title>
            </Helmet>

            <div className='@container relative'>
                <div className='w-full h-screen flex flex-col items-center justify-center p-4'>
                    <h1 className='text-4xl md:text-9xl font-bold text-green-500 text-center'>401</h1>
                    <h1 className='text-4xl md:text-6xl font-bold text-green-500 mb-5 text-center'>Unauthorized</h1>
                    <p className='text-2xl md:text-4xl text-green-500 text-center'>Anda tidak memiliki akses ke halaman ini</p>
                </div>
            </div>
        </>
    )
}

export default UnauthorizedPage