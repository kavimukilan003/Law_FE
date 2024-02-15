import React, { useContext, useState } from "react"
import PropTypes from "prop-types"

const NotificationsContext = React.createContext()

export function useNotifications() {
  return useContext(NotificationsContext)
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

NotificationsProvider.propTypes = {
  children: PropTypes.any,
}
