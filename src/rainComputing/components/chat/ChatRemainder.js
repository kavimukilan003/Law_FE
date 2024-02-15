import React, { useEffect, useState } from "react"
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import PropTypes from "prop-types"
import { createReminder } from "rainComputing/helpers/backend_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { useChat } from "rainComputing/contextProviders/ChatProvider"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import moment from "moment"
import DeleteModal from "../modals/DeleteModal"
const ChatRemainder = ({
  setModalOpen,
  curMessageId,
  selectdate,
  getAllReminderById,
}) => {
  const { currentRoom: currentChat, setMessages, messages } = useChat()
  const { currentUser } = useUser()
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(selectdate)
  console.log("date", date)
  const timeOption = getTimeOptions()
  const [time, setTime] = useState(timeOption[0]?.key)

  const [scheduledTime, setScheduledTime] = useState("")
  const [selectedMembers, setSelectedMembers] = useState([])
  const [selectedDates, setSelectedDates] = useState([date])

  const [userId, setUserId] = useState(null)
  const [isChecked, setIsChecked] = useState("")

  toastr.options = {
    progressBar: true,
    closeButton: true,
  }
  useEffect(() => {
    if (isChecked) {
      setUserId(currentUser?.userID)
    } else {
      setUserId("")
    }
  }, [isChecked, currentUser])

  const handleAddingNewSelectedgroupMembers = id => {
    if (selectedMembers.includes(id)) {
      const membersAfterRemove = selectedMembers.filter(m => m !== id)
      setSelectedMembers(membersAfterRemove)
    } else {
      setSelectedMembers([...selectedMembers, id])
    }
  }

  const handleChange = e => {
    setIsChecked(e.target.checked)
  }
  const handlereminderCancel = () => {
    setModalOpen(false)
  }

  const handleChanges = event => {
    const selectedValue = event.target.value
    // Do something based on the selected value
    if (selectedValue === "daily") {
      handleDaily()
    } else if (selectedValue === "weekly") {
      handleWeekly()
    } else if (selectedValue === "monthly") {
      handleMonthly()
    } else if (selectedValue === "select") {
      handleSelect()
    }
  }
  const handleSelect = () => {
    setSelectedDates([date])
  }
  const handleWeekly = () => {
    const startDate = new Date(date) // replace with desired start date
    const endDate = new Date() // replace with desired end date
    endDate.setDate(startDate.getDate() + 365) // set end date to 1 year from start date

    const selectedDates = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      selectedDates.push(currentDate.toISOString().slice(0, 10))
      currentDate.setDate(currentDate.getDate() + 7) // increment by 7 days for every week
    }

    setSelectedDates(selectedDates)
  }
  const handleMonthly = () => {
    const selectedDates = []
    const selectedDate = new Date(date)
    const endDate = new Date()
    endDate.setFullYear(selectedDate.getFullYear() + 1)

    let currentDate = new Date(selectedDate)

    while (currentDate <= endDate) {
      const dayOfMonth = selectedDate.getDate()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()

      let reminderDate = new Date(currentYear, currentMonth, dayOfMonth + 1)

      // If the reminder date is in the past, move it to the next month
      if (reminderDate < currentDate) {
        reminderDate.setMonth(currentMonth + 1)
      }

      selectedDates.push(reminderDate.toISOString().slice(0, 10))

      currentDate.setMonth(currentMonth + 1)
    }

    setSelectedDates(selectedDates)
  }

  const handleDaily = () => {
    const startDate = new Date(date)
    const endDate = new Date(startDate.getFullYear(), 11, 31) // set end date to 31st December of current year
    const days = []

    // loop through each day from start date to end date and add to array
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d).toISOString().slice(0, 10))
    }

    setSelectedDates(days)
  }

  const handleReminderCreate = async () => {
    const scheduledTime = selectedDates
      .sort((a, b) => {
        const dateA = new Date(a)
        const dateB = new Date(b)
        return dateA - dateB
      })
      .map(selectedDate => {
        return new Date(`${selectedDate}T${time}:00.000Z`).toISOString()
      })
    console.log("scheduled time: ", selectedDates[0])
    const payload = {
      groupId: currentChat?._id,
      selectedMembers: [currentUser?.userID, ...selectedMembers],
      messageId: curMessageId,
      title: title,
      scheduledTime: scheduledTime, // Pass the scheduledTime value to the API
      createdBy: currentUser?.userID,
      nextScheduledTime: new Date(
        `${selectedDates[0]}T${time}:00.000Z`
      ).toISOString(),
    }

    if (isChecked) {
      payload.userId = currentUser?.userID
    }

    const reminderData = await createReminder(payload)

    if (reminderData.success) {
      // console.log("remindata :",reminderData)
      toastr.success("Reminder Create Successfully")

      setModalOpen(false)
    } else {
      toastr.error(`${reminderData?.msg}`)
      setModalOpen(false)
    }
  }
  const handleCreate = async () => {
    // const scheduledTime = new Date(`${date}T${time}:00.000Z`).toISOString()
    const scheduledTime = selectedDates
      .sort((a, b) => {
        const dateA = new Date(a)
        const dateB = new Date(b)
        return dateA - dateB
      })
      .map(selectedDate => {
        return new Date(`${selectedDate}T${time}:00.000Z`).toISOString()
      })
    console.log("scheduled time: " + scheduledTime)
    const payload = {
      groupId: currentChat?._id,
      selectedMembers: [currentUser?.userID, ...selectedMembers],
      title: title,
      scheduledTime: scheduledTime, // Pass the scheduledTime value to the API
      createdBy: currentUser?.userID,
      nextScheduledTime: new Date(
        `${selectedDates[0]}T${time}:00.000Z`
      ).toISOString(),
    }

    if (isChecked) {
      payload.userId = currentUser?.userID
    }

    const res = await createReminder(payload)

    if (res.success) {
      await getAllReminderById()
      // console.log("remindata :",reminderData)
      toastr.success("Reminder Create Successfully")
      setModalOpen(false)
    } else {
      toastr.error(`${res?.msg}`)
      setModalOpen(false)
    }
  }

  const getMemberName = id => {
    const memberName = currentChat?.groupMembers?.find(
      member => member?.id?._id === id
    )
    if (memberName)
      return memberName?.id?.firstname + " " + memberName?.id?.lastname
    return id
  }
  function getTimeOptions() {
    const options = []
    const now = new Date()
    const currentMinutes = Math.ceil(now.getMinutes() / 15) * 15
    for (let i = 0; i <= 23; i++) { // changed start time to 0
      const hour = i < 10 ? `0${i}` : `${i}`
      for (let j = 0; j <= 45; j += 15) {
        const minutes = j < 10 ? `0${j}` : `${j}`
        const time = `${hour}:${minutes}`
        if (i === now.getHours() && j < currentMinutes) {
          continue
        }
        options.push(
          <option key={time} value={time}>
            {time}
          </option>
        )
      }
    }
    return options
  }
  

  const handleTimeChange = e => {
    setTime(e.target.value)
  }
  return (
    <>
      <Row>
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Title
        </label>
        <div className="col-md-8">
          <input
            className="form-control"
            type="text"
            placeholder="What do you want to remember?"
            value={title}
            name="title"
            onChange={e => setTitle(e.target.value)}
          />
        </div>
      </Row>
      <Row className="my-md-3">
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Date
        </label>
        <div className="col-md-4">
          {selectdate ? (
            <input className="form-control" value={date} />
          ) : (
            <input
              className="form-control"
              type="date"
              placeholder="DD/MM/YYYY"
              value={date}
              name="date"
              onChange={e => setDate(e.target.value)}
            />
          )}
        </div>
        <div className="col-md-4">
          <select className="form-select" onChange={handleChanges}>
            <option value="select">Select</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </Row>

      <Row className="my-md-3">
        <label
          htmlFor="example-text-input"
          className="col-md-3 col-lg-2 col-form-label"
        >
          Time
        </label>
        <div className="col-md-8">
          <select
            className="form-control"
            value={time}
            name="select-time"
            onChange={handleTimeChange}
          >
            {timeOption}
          </select>
        </div>
      </Row>
      <Row className="my-md-3">
        <div className=" d-flex pt-2">
          <div className="form-check pl-4">
            {/* <input
              className="form-check-input "
              type="checkbox"
              id="flexCheckDefault"
              value={userId}
              onChange={handleChange}
              checked={isChecked}
            />
            <label className="form-check-label ms-2" htmlFor="flexCheckDefault">
              ** Keep it as a reminder for yourself
            </label> */}

            <Row>
              <Col xs={6} className="px-3 border-end border-info">
                <span className="text-muted">Group Member</span>
                <div className="d-flex flex-wrap gap-4 my-2">
                  {currentChat &&
                    currentChat.groupMembers
                      .filter(
                        f =>
                          f?.id?._id &&
                          !selectedMembers.some(g => g === f?.id?._id) &&
                          f?.id?._id !== currentUser?.userID
                      )
                      .filter(a => a?.id?._id !== currentUser?.userID)
                      .map((member, m) => (
                        <div
                          key={m}
                          className="bg-light px-2 py-1 rounded pointer"
                          onClick={() =>
                            handleAddingNewSelectedgroupMembers(member?.id?._id)
                          }
                        >
                          <span>
                            {member?.id?.firstname} {member?.id?.lastname}
                          </span>
                          <i className="mdi mdi-plus-circle-outline pt-1 px-1" />
                        </div>
                      ))}
                </div>
              </Col>
              <Col xs={6} className="px-3">
                <span className="text-muted">Selected group Member</span>
                <div className="d-flex flex-wrap gap-4 my-2">
                  <div
                    className="bg-success px-2 py-1 rounded pointer"
                    onClick={() => handleAddingNewSelectedgroupMembers(member)}
                  >
                    <span>
                      {currentUser?.firstname} {currentUser?.lastname}
                    </span>
                    <i className="mdi mdi-account-remove-outline pt-1 px-2" />
                  </div>
                  {selectedMembers &&
                    selectedMembers.map((member, m) => (
                      <div
                        key={m}
                        className="bg-success px-2 py-1 rounded pointer"
                        onClick={() =>
                          handleAddingNewSelectedgroupMembers(member)
                        }
                      >
                        <span>
                          {getMemberName(member)}
                          {/* {member?.id?.firstname} {member?.id?.lastname} */}
                        </span>
                        <i className="mdi mdi-account-remove-outline pt-1 px-2" />
                      </div>
                    ))}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Row>

      <Row>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary "
            data-dismiss="modal"
            onClick={() => {
              handlereminderCancel()
            }}
          >
            Close
          </button>
          {selectdate ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleCreate()}
            >
              Confirm
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleReminderCreate()}
            >
              Confirm
            </button>
          )}
        </div>
      </Row>
    </>
  )
}

ChatRemainder.propTypes = {
  setModalOpen: PropTypes.func,
  getAllReminderById: PropTypes.func,
  curMessageId: PropTypes.any,
  selectdate: PropTypes.any,
}

export default ChatRemainder
