import React, { useEffect, useState } from "react"
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import PropTypes from "prop-types"
import {
  createReminder,
  getAllReminders,
  getGroupIdReminders,
  removeReminder,
  UpdateReminder,
} from "rainComputing/helpers/backend_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import { useChat } from "rainComputing/contextProviders/ChatProvider"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import moment from "moment"
import { async } from "q"
import { removeData } from "jquery"
import DeleteModal from "components/Common/DeleteModal"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
const EditReminder = ({
  setEditModalOpen,
  reminder,
  setGetReminders,
  getReminders,
  groupId,
}) => {
  console.log("reminder", reminder)
  const remindere = new Date(reminder.scheduledTime[0])
  remindere.setHours(remindere.getHours() - 5)
  remindere.setMinutes(remindere.getMinutes() - 30)
  const formattedTime = remindere.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  })

  const options = { year: "numeric", month: "2-digit", day: "2-digit" }
  const formattedDate = remindere
    .toLocaleDateString("en-US", options)
    .split("/")
    .join("-")
    .replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$1-$2")
  // const scheduledTime = new Date(`${date}T${time}:00.000Z`).toISOString()
  const { currentRoom: currentChat, setMessages, messages } = useChat()
  const { currentUser } = useUser()
  const [title, setTitle] = useState(reminder?.title)
  const [date, setDate] = useState(formattedDate)
  const [time, setTime] = useState(formattedTime)
  const [removeData, setRemoveData] = useState()
  const [selectedDates, setSelectedDates] = useState([date])
  console.log("selectedDates", selectedDates)
  const reminderSelectedMembers = reminder?.selectedMembers
  const [selectedMembers, setSelectedMembers] = useState(
    reminderSelectedMembers
  )
  const [userId, setUserId] = useState(null)
  const [isChecked, setIsChecked] = useState("")
  const {
    toggleOpen: groupReminderDeleteModalOpen,
    setToggleOpen: setReminderDeleteModalOpen,
    toggleIt: togglegroupReminderDeleteModal,
  } = useToggle(false)
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

  const handleAddingNewSelectedgroupMembers = member => {
    if (selectedMembers.some(m => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id))
    } else {
      setSelectedMembers([...selectedMembers, member])
    }
  }

  const getSelectedReminderMembers = selectedMembers?.map(
    member => member.id._id
  )
  const handleChange = e => {
    setIsChecked(e.target.checked)
  }
  const handlereminderCancel = () => {
    setEditModalOpen(false)
  }
  const getAllReminderById = async () => {
    const payload = {
      groupId: groupId,
    }
    const res = await getGroupIdReminders(payload)
    if (res.success) {
      setGetReminders(res?.groupReminders)
    }
  }
  useEffect(() => {
    getAllReminderById()
  }, [])

  // useEffect(() => {
  //   if (currentUser) {
  //     getAllReminderById()
  //   }
  // }, [currentUser])
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
  const handleReminderUpdate = async () => {
    const scheduledTime = selectedDates.map(selectedDate => {
      return new Date(`${selectedDate}T${time}:00.000Z`).toISOString()
    })
    const payload = {
      reminderId: reminder?._id,
      selectedMembers: getSelectedReminderMembers,
      title: title,
      scheduledTime: scheduledTime,
      nextScheduledTime: new Date(
        `${selectedDates[0]}T${time}:00.000Z`
      ).toISOString(),
    }

    const reminderData = await UpdateReminder(payload)

    if (reminderData.success) {
      await getAllReminderById()
      toastr.success("Reminder updated successfully")
      setEditModalOpen(false)
    } else {
      toastr.error(`${reminderData?.msg}`)
    }
  }

  const handleRemove = async () => {
    const payload = {
      reminderId: removeData?._id,
    }
    const res = await removeReminder(payload)
    if (res.success) {
      toastr.success(`You have reminder remove  successfully`, "Success")

      setGetReminders(prevState =>
        prevState.filter(reminder => reminder._id !== removeData._id)
      )

      setEditModalOpen(false)
    }
  }
  const handleDelete = reminder => {
    setRemoveData(reminder)
    setReminderDeleteModalOpen(true)
  }
  const handleSelect = () => {
    setSelectedDates([date])
  }
  const handleTimeChange = e => {
    setTime(e.target.value)
  }
  const getTimeOptions = () => {
    const options = []
    const now = new Date()
    const currentMinutes = Math.ceil(now.getMinutes() / 15) * 15
    for (let i = 0; i <= 23; i++) {
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

  return (
    <>
      <i
        className="bi bi-trash text-danger  d-flex justify-content-end"
        title="Delete"
        onClick={() => handleDelete(reminder)}
        style={{ fontSize: "20px", cursor: "pointer" }}
      ></i>

      <DeleteModal
        show={groupReminderDeleteModalOpen}
        onDeleteClick={handleRemove}
        confirmText="Yes,Remove"
        cancelText="Cancel"
        onCloseClick={togglegroupReminderDeleteModal}
      />

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
          <input
            className="form-control"
            type="date"
            placeholder="DD/MM/YYYY"
            value={date}
            name="date"
            onChange={e => setDate(e.target.value)}
          />
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
            {getTimeOptions()}
          </select>
        </div>
      </Row>
      <Row className="my-md-3">
        <div className=" d-flex pt-2">
          <div className="form-check pl-4">
            <Row>
              <Col xs={6} className="px-3 border-end border-info">
                <span className="text-muted">Group Member</span>
                <div className="d-flex flex-wrap gap-4 my-2">
                  {reminder?.groupId?.groupMembers
                    .filter(
                      member =>
                        member.id && member.id._id !== currentUser.userID
                    )
                    .filter(
                      member =>
                        !selectedMembers.find(
                          selected => selected.id._id === member.id._id
                        )
                    )
                    .map((member, m) => (
                      <div
                        key={m}
                        className="bg-light px-2 py-1 rounded pointer"
                        onClick={() =>
                          handleAddingNewSelectedgroupMembers(member)
                        }
                      >
                        <span>
                          {member.id?.firstname} {member.id?.lastname}
                        </span>
                        <i className="mdi mdi-plus-circle-outline pt-1 px-1" />
                      </div>
                    ))}
                </div>
              </Col>
              <Col xs={6} className="px-3">
                <span className="text-muted">Selected group Members</span>
                <div className="d-flex flex-wrap gap-4 my-2">
                  <div
                    className="bg-success px-2 py-1 rounded pointer"
                    // onClick={() =>
                    //   handleAddingNewSelectedgroupMembers(currentUser?.userID)
                    // }
                  >
                    <span>
                      {currentUser?.firstname} {currentUser?.lastname}
                    </span>
                    <i className="mdi mdi-account-remove-outline pt-1 px-2" />
                  </div>
                  {selectedMembers
                    .filter(member => member.id._id !== currentUser.userID)
                    .map((member, i) => (
                      <div
                        key={i}
                        className="bg-success px-2 py-1 rounded pointer"
                        onClick={() =>
                          handleAddingNewSelectedgroupMembers(member)
                        }
                      >
                        <span>
                          {member?.id?.firstname}
                          {member?.id?.lastname}
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
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleReminderUpdate()}
          >
            Update
          </button>
        </div>
      </Row>
    </>
  )
}

EditReminder.propTypes = {
  setEditModalOpen: PropTypes.func,
  setGetReminders: PropTypes.func,
  getReminders: PropTypes.func,
  reminder: PropTypes.func,
  groupId: PropTypes.func,
}

export default EditReminder
