import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import { getAttorneyByUserID } from "rainComputing/helpers/backend_helper"

const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ children }) {
  const user = JSON.parse(localStorage.getItem("authUser"))
  const [currentUser, setCurrentUser] = useState(user)
  const [currentAttorney, setCurrentAttorney] = useState({})
  useEffect(() => {
    if (currentUser) {
      const handleFetching = async () => {
        const res = await getAttorneyByUserID({ userID: currentUser.userID })
        if (res.success) {
          setCurrentAttorney(res.attorney)
        }
      }

      handleFetching()
    }
    return () => {}
  }, [currentUser])

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentAttorney,
        setCurrentAttorney
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.any,
}
