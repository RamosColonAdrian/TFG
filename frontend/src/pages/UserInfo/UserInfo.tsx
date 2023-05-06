import React, { useContext } from 'react'
import { authContext } from '../../contexts/authContext/authContext'
type Props = {}

function UserInfo({ }: Props) {
    const { userInfo, logout } = useContext(authContext)
    return (
        <div>
            {JSON.stringify(userInfo)}
            <button onClick={() => {
                logout()
            }}>LOGOUT</button>
        </div>
    )
}

export default UserInfo