import React from 'react'

type ChildrenProp = {
  children: React.ReactNode
}

const Layout = ({ children }: ChildrenProp) => {
  return (
    <div className='w-full'>
      {children}
    </div>
  )
}

export default Layout
