import { useNotifications } from "rainComputing/contextProviders/NotificationsProvider"
import React, { useEffect, useRef, useState } from "react"
import notification0 from "../../../assets/sound/1.mp3"
import notification1 from "../../../assets/sound/2.mp3"
import notification2 from "../../../assets/sound/3.mp3"
import notification3 from "../../../assets/sound/4.mp3"
import notification4 from "../../../assets/sound/5.mp3"
import notification5 from "../../../assets/sound/6.mp3"
import notification6 from "../../../assets/sound/7.mp3"
import notification7 from "../../../assets/sound/8.mp3"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import {
  notificationSound,
  notifySound,
} from "rainComputing/helpers/backend_helper"
import PropTypes from "prop-types"

const NotificationSettings = ({ setModalOpen }) => {
  const audioRef = useRef(null);
  const { currentUser, setCurrentUser } = useUser()
  const { notifications, setNotifications } = useNotifications()
  const [isNotifySound, setIsNotifySound] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
  const selectSounds = [
    { name: "Sound 1", url: notification0 },
    { name: "Sound 2", url: notification1 },
    { name: "Sound 3", url: notification2 },
    { name: "Sound 4", url: notification3 },
    { name: "Sound 5", url: notification4 },
    { name: "Sound 6", url: notification5 },
    { name: "Sound 7", url: notification6 },
    { name: "Sound 8", url: notification7 },
    // Add more sound URLs as needed
  ]
  const defaultNotificationSound = notification5
  const [selectedNotificationSound, setSelectedNotificationSound] = useState(
    currentUser?.notificationSound || defaultNotificationSound
  )
  const playNotificationSound = () => {
    const audio = new Audio(selectedNotificationSound);
    audioRef.current = audio;
    audio.play();
    setIsPlaying(true);

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });
  };

  const pauseNotificationSound = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };
  const handleSetNotifySound = async selectedSound => {
    const payload = {
      _id: currentUser?.userID,
      notificationSound: selectedSound,
    }

    const res = await notificationSound(payload)
    if (res.success) {
      localStorage.setItem("authUser", JSON.stringify(res))
      setCurrentUser(res)
    } else {
      console.log("audio is undefined")
    }
  }

  useEffect(() => {
    const handleInitialSetNotifySound = async () => {
      if (selectedNotificationSound) {
        await handleSetNotifySound(selectedNotificationSound)
      }
    }

    handleInitialSetNotifySound()
  }, [])

  const handleCheckboxChange = async event => {
    const isChecked = event.target.checked
    setIsNotifySound(isChecked)
    try {
      const response = await notifySound({
        _id: currentUser?.userID,
        isNotifySound: isChecked,
      })
      localStorage.setItem("authUser", JSON.stringify(response))
      setCurrentUser(response)
    } catch (error) {
      console.error("API error:", error)
    }
  }
  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <div>
      <p className="px-2">Enable/Disable </p>
      <div className="form-switch" style={{ paddingLeft: "55px" }}>
        <input
          className="form-check-input"
          type="checkbox"
          checked={currentUser?.isNotifySound}
          onClick={handleCheckboxChange}
        />
        <label className="px-2">Notification Sound</label>
      </div>
      <div className="select-sound-container px-2">
        <p>Select the Sound</p>
        <div className="select-wrapper d-flex">
      <select
        className="px-4"
        style={{
          border: "1px",
          height: "38px",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderRadius: "10px",
          boxShadow: "none",
          width: "65%",
        }}
        title="Select Notification sound"
        value={selectedNotificationSound}
        onChange={(e) => {
          const selectedValue = e.target.value;
          setSelectedNotificationSound(selectedValue);
          handleSetNotifySound(selectedValue);
        }}
      >
        <option value="">Select a sound</option>
        {selectSounds.map((sound) => (
          <option key={sound.url} value={sound.url}>
            {sound.name}
          </option>
        ))}
      </select>

      <div className="py-2 d-flex justify-content-center">
        {selectedNotificationSound && (
          <>
            {isPlaying ? (
              <i
                title="Pause your notification sound"
                className="bx bx-pause-circle font-size-24"
                style={{ cursor: "pointer", color: "blue", paddingLeft: "10%" }}
                onClick={pauseNotificationSound}
              />
            ) : (
              <i
                title="Play your notification sound"
                className="bx bx-play-circle font-size-24"
                style={{ cursor: "pointer", color: "blue", paddingLeft: "10%" }}
                onClick={playNotificationSound}
              />
            )}
          </>
        )}
      </div>
    </div>

        <div className="px-2  d-flex justify-content-end">
          <button className="btn btn-secondary" onClick={handleClose}>
            close
          </button>
        </div>
      </div>
    </div>
  )
}
NotificationSettings.propTypes = {
  setModalOpen: PropTypes.func,
}
export default NotificationSettings
