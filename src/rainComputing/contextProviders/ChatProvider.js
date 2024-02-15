import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import { getAllChatRooms } from "rainComputing/helpers/backend_helper"
import { useNotifications } from "./NotificationsProvider"

const ChatContext = React.createContext()

export const useChat = () => {
  return useContext(ChatContext)
}

export function ChatProvider({ socket, children }) {
  const currentUser = JSON.parse(localStorage.getItem("authUser"))
  const { notifications, setNotifications } = useNotifications()
  const [chats, setChats] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageStack, setMessageStack] = useState([])
  const getRoomsonEveryMessage = async () => {
    const chatRoomsRes = await getAllChatRooms({ userID: currentUser.userID })
    if (chatRoomsRes.success) {
      setChats(chatRoomsRes.chats)
    } else {
      setChats([])
    }
  }
  const handleSendingMessage = async msgData => {
    setMessageStack(prevStae => [...prevStae, msgData])
    await socket.emit("s_m", msgData)
  }

  const handleSendingReplyMessage = async msgData => {
    setMessageStack(prevStae => [...prevStae, msgData])
    await socket.emit("s_r", msgData)
  }

  //   useEffect(() => {
  //     if (socket == null) return

  //     socket.once("receive_message", async msgData => {
  //       if (!currentRoom) {
  //         setNotifications([msgData, ...notifications])
  //       } else {
  //         if (msgData.chatRoomId === currentRoom._id) {
  //           setMessages([...messages, { message: msgData }])
  //         } else {
  //           setNotifications([msgData, ...notifications])
  //         }
  //       }

  //       await getRoomsonEveryMessage()
  //     })
  //   }, [socket, handleSendingMessage])
  useEffect(() => {
    if (currentRoom) {
      if (socket == null) return
      socket.off("receive_message").once("receive_message", async msgData => {
        if (msgData.chatRoomId === currentRoom._id) {
          if (notifications.length > 0) {
            const filteredNotification = notifications.filter(
              n => n.chatRoomId !== currentRoom._id
            )
            setNotifications(filteredNotification)
          }
          setMessages([...messages, msgData])
        } else {
          setNotifications([msgData, ...notifications])
        }
        await getRoomsonEveryMessage()
      })
    } else {
      const notification = new Audio(currentUser?.notificationSound)
      if (socket == null) return
      socket.off("receive_message").once("receive_message", async msgData => {
        setNotifications([msgData, ...notifications])
      })
    }
  }, [socket, handleSendingMessage, handleSendingReplyMessage])

  useEffect(() => {
    if (currentRoom) {
      if (socket == null) return
      socket.off("r_m").once("r_m", async msgData => {
        if (msgData?.groupId === currentRoom._id) {
          const audioElement = new Audio(currentUser?.notificationSound)

          const newMessages = messages.filter(
            message =>
              message?.groupId === currentRoom._id && !message.playedSound
          )

          if (newMessages.length > 0) {
            newMessages.forEach(message => {
              // Wait for user interaction before playing audio

              audioElement.play()

              // Update the message to mark it as played
              message.playedSound = true
            })
            setMessages([...messages, msgData])
          }
        } else {
          setNotifications([msgData, ...notifications])
          console.log("msgData", msgData)
          const options = {
            title: "Rain Computing",
            body: `New Message From Rain Computing ${msgData?.messageData}`,
            icon: "https://t3.ftcdn.net/jpg/00/96/93/40/360_F_96934079_NnI7vUzC4f3q4Z15ZA3OoC7sG9cRNELb.jpg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
            dir: "ltr",
            // tag: "tag",
            click_action: "http://localhost:3000/chat-rc",
          }
          const notification = new Notification(
            "Rain Computing Notification",
            options
          )
        }
      })
      socket.off("s_s").once("s_s", async msgData => {
        setMessageStack([])
        setMessages([...messages, msgData])
      })

      socket.off("r_r").once("r_r", async msgData => {
        if (msgData?.groupId === currentRoom._id) {
          setMessages([...messages, msgData])
        } else {
          setNotifications([msgData, ...notifications])
          const options = {
            title: "Rain Computing",
            body: `New Message From Rain Computing ${msgData?.msg}`,
            icon: "https://t3.ftcdn.net/jpg/00/96/93/40/360_F_96934079_NnI7vUzC4f3q4Z15ZA3OoC7sG9cRNELb.jpg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
            dir: "ltr",
            // tag: "tag",
            click_action: "http://localhost:3000/chat-rc",
          }
          const notification = new Notification(
            "Rain Computing Notification",
            options
          )
        }
      })
      // socket.off("r_s").once("r_s", async msgData => {
      //   setMessageStack([])
      //   setMessages([...messages, msgData])
      // })
    } else {
      if (socket == null) return
      socket.off("r_m").once("r_m", async msgData => {
        setNotifications([msgData, ...notifications])
        const options = {
          title: "Rain Computing",
          body: `New Message From Rain Computing ${msgData?.messageData}`,
          icon: "https://t3.ftcdn.net/jpg/00/96/93/40/360_F_96934079_NnI7vUzC4f3q4Z15ZA3OoC7sG9cRNELb.jpg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
          dir: "ltr",
          // tag: "tag",
          href: "http://localhost:3000/chat-rc",
          click_action: "http://localhost:3000/chat-rc",
        }
        const notification = new Notification(
          "Rain Computing Notification",
          options
        )
      })
      if (socket == null) return
      socket.off("r_r").once("r_r", async msgData => {
        setNotifications([msgData, ...notifications])
        const options = {
          title: "Rain Computing",
          body: `New Message From Rain Computing ${msgData?.msg}`,
          icon: "https://t3.ftcdn.net/jpg/00/96/93/40/360_F_96934079_NnI7vUzC4f3q4Z15ZA3OoC7sG9cRNELb.jpg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
          dir: "ltr",
          // tag: "tag",
          href: "http://localhost:3000/chat-rc",
          click_action: "http://localhost:3000/chat-rc",
        }
        const notification = new Notification(
          "Rain Computing Notification",
          options
        )
      })
    }
    socket.off("u_l").once("u_l", async msgData => {
      setNotifications([...msgData, ...notifications])
    })
  }, [socket, handleSendingMessage, handleSendingReplyMessage, notifications])

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentRoom,
        setChats,
        setCurrentRoom,
        getRoomsonEveryMessage,
        handleSendingMessage,
        handleSendingReplyMessage,
        messages,
        setMessages,
        messageStack,
        setMessageStack,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

ChatProvider.propTypes = {
  children: PropTypes.any,
  socket: PropTypes.any,
}
