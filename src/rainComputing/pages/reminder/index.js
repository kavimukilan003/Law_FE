import React, { useEffect, useState } from "react"
import { Modal, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledTooltip } from "reactstrap"
import PropTypes from "prop-types"
import GroupReminder from "./GroupReminder"
import SelfReminder from "./SelfReminder"
// import { getReminder } from "rainComputing/helpers/backend_helper"
import moment from "moment"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import toastr from "toastr"
import { date } from "yup"

const Reminders = ({ toggle, open, setOpen, show = false }) => {
  const [groupReminder, setGroupReminder] = useState([])
  const { currentUser } = useUser()

  // console.log("groupReminder",groupReminder)
  // const getReminderData = async () => {
  //   try {
  //     if (!currentUser) {
  //       return
  //     }
  //     const res = await getReminder({ currentUserID: currentUser?.userID })
  //     if (!res.success) {
  //       return
  //     }
  //     const reminders = res?.nextReminders[0]

  //     const nextNotify = res?.nextNotificationTime
  //     if (nextNotify) {
  //       const newReminders = []

  //       const now = new Date()

  //       // for (const notificationTime of scheduledTime) {
  //       const currentNotify = new Date(nextNotify)
  //       currentNotify.setHours(currentNotify.getHours() - 5)
  //       currentNotify.setMinutes(currentNotify.getMinutes() - 30)

  //       const timeDiff = currentNotify - now
  //       // console.log("now",now)
  //       // console.log("notificationTime",notificationTime.getTime())
  //       // console.log("timeDiff",timeDiff)

  //       if (timeDiff < 30000) {
  //         setTimeout(() => {
  //           // setGroupReminder(reminders);

  //           toastr.success(`You have new  remainder`)
  //           setOpen(true)
  //         }, timeDiff)
  //       } else {
  //         newReminders.push(reminders)
  //       }

  //       // }

  //       setGroupReminder(reminders)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const intervalTime = 30000 // 30 seconds in milliseconds

  // useEffect(() => {
  //   // define a function to run the getReminderData function at the specified interval
  //   const intervalId = setInterval(getReminderData, intervalTime)
  //   // clear the interval on component unmount
  //   return () => clearInterval(intervalId)
  // }, [])

  // console.log("dk:",groupReminder);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getReminderData()
  //   }, 60 * 1000) // Call the function every minute
  //   return () => clearInterval(interval)
  // }, [currentUser])

  // useEffect(() => {
  //   getReminderData()
  // }, [currentUser])
  return (
    <div>
      <i
        className="bi bi-alarm fs-4 w-3"
        onClick={toggle}
        data-toggle="modal"
        style={{
          cursor: "pointer",
        }}
        id="reminder1Tooltip"
      ></i>
      <UncontrolledTooltip
      placement="bottom"
      target="reminder1Tooltip"
    >
      Reminder
    </UncontrolledTooltip>

      <Modal isOpen={open} toggle={toggle} scrollable={true}>
        <div className="d-flex justify-content-center p-4">
          <i className="bi bi-alarm fs-3 w-2 me-1" />
          <h3 className="modal-title  text-primary ">Reminder</h3>

        </div>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          style={{ width: "20px" }}
          onClick={() => setOpen(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <GroupReminder />
      </Modal>
    </div>
  )
}

Reminders.propTypes = {
  open: PropTypes.bool,
  toggle: PropTypes.func,
  setOpen: PropTypes.func,
  show: PropTypes.func,
}

export default Reminders
