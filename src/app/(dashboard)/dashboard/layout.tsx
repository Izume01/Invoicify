import React from 'react'
import { getRegisterUser } from '@/components/hook/getRegisterUser'
import Sidebar from '@/components/layouts/Sidebar';
const layout = async () => {
    const { user, session } = await getRegisterUser();

    if (!user || !session) {
        return <div>Error: User or session not found</div>;
    }
  return (
    <>
        <Sidebar />
        <main className='ml-64 p-6 bg-red-400'>

        </main>
    </>
  )
}

export default layout