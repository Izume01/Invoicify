import React from 'react'
import { getRegisterUser } from '@/components/hook/getRegisterUser'
import Sidebar from '@/components/layouts/Sidebar';

type childrenProp =  {
    children: React.ReactNode;
}

const layout = async ({children} : childrenProp) => {
    const { user, session } = await getRegisterUser();

    if (!user || !session) {
        return <div>Error: User or session not found</div>;
    }
  return (
    <>
        <Sidebar />
        <main className='ml-64 p-2 min-h-screen bg-gray-50'>
            {children}
        </main>
    </>
  )
}

export default layout