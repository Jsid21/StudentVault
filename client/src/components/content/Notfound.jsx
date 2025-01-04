import React from 'react'

export const Notfound = () => {
  return (
    <>
        <div className="container-xxl">
            <div className="icondiv my-4" style={{display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center'}}>
            <i className="fa-solid fa-ban" style={{color:'red',fontSize:'3rem'}}></i>
            <h2 className='my-3' style={{color:'black', fontWeight:'700',fontSize:'2.5rem'}}>Page not found !</h2>
            </div>
        </div>
    </>
  )
}
