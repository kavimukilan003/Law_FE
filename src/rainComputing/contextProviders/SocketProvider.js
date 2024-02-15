import React, { useContext, useState } from "react"
import io from "socket.io-client"
import PropTypes from "prop-types"
import { SERVER_URL } from "rainComputing/helpers/configuration"

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const user = JSON.parse(localStorage.getItem("authUser"))
  const [socket, setSocket] = useState(() => {
    if (user)
      return io(SERVER_URL, {
        query: { id: user.userID },
      })
  })
  if (socket) {
    socket.once("connect", () => {
      // USER IS ONLINE
      socket.on("online", userId => {
        console.log(userId, "Is Online!") // update online status
      })
      // USER IS OFFLINE
      socket.on("offline", userId => {
        console.log(userId, "Is Offline!") // update offline status
      })
    })
  }
  const handleSetSocket = id => {
    setSocket(
      io(SERVER_URL, {
        query: { id },
      })
    )
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket: handleSetSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

SocketProvider.propTypes = {
  children: PropTypes.any,
}
