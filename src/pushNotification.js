import React, { useEffect } from "react"

const SimpleNotification = () => {

  const showNotification = () => {
    const options = {
      title: "Rain Computing",
      body: "New Message From Rain Computing",
      icon: "https://t3.ftcdn.net/jpg/00/96/93/40/360_F_96934079_NnI7vUzC4f3q4Z15ZA3OoC7sG9cRNELb.jpg?    auto=compress&cs=tinysrgb&dpr=1&w=500",
      dir: "ltr",
      tag: "tag",
      link: "/chat-rc",
      sound: "../sound.mp3"
    }
    const notification = new Notification(
      "Rain Computing Notification",
      options
    )
  }

  //  const closeNotification = () => {
  //     notification.close();
  // }

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification")
    } else {
      Notification.requestPermission()
    }
  }, [])

  return (
    <div>{/* <button onClick={showNotification}>Notification</button> */}</div>
  )
}

export default SimpleNotification
