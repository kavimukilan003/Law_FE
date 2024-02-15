import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  regAttorneyDetails,
  regAttorneyUpdate,
  regScheduleDates,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import toastr from "toastr"

const AttorneyCalendar = ({ setcalendarModalOpen }) => {
  const { currentAttorney } = useUser()
  const [attorneyDetail, setAttorneyDetail] = useState({})
  const [selectedDates, setSelectedDates] = useState([])
  console.log("selectdate", selectedDates)
  console.log("attorneyDetail", attorneyDetail)
  const handleDateSelect = info => {
    const clickedDate = info?.dateStr
    const index = selectedDates.indexOf(clickedDate)

    if (index === -1) {
      // clicked date not in the array, add it
      setSelectedDates([...selectedDates, clickedDate])
    } else {
      // clicked date already in the array, remove it
      const updatedDates = [...selectedDates]
      updatedDates.splice(index, 1)
      setSelectedDates(updatedDates)
    }
  }
  const handleTodaySelect = () => {
    const today = new Date()
    const clickedDate = today.toISOString().slice(0, 10) // Format date as YYYY-MM-DD
    if (selectedDates.includes(clickedDate)) {
      // clicked date already in the array, remove it
      const updatedDates = selectedDates.filter(date => date !== clickedDate)
      setSelectedDates(updatedDates)
    } else {
      setSelectedDates([clickedDate])
    }
  }

  const handleLast7DaysClick = () => {
    const next7Days = []
    for (let i = 1; i <= 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      next7Days.push(date.toISOString().slice(0, 10))
    }
    const allDatesSelected = next7Days.every(date =>
      selectedDates.includes(date)
    )
    if (allDatesSelected) {
      const updatedDates = selectedDates.filter(
        date => !next7Days.includes(date)
      )
      setSelectedDates(updatedDates)
    } else {
      setSelectedDates([...selectedDates, ...next7Days])
    }
  }

  const handleLast15DaysClick = () => {
    const next15Days = []
    for (let i = 1; i <= 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      next15Days.push(date.toISOString().slice(0, 10))
    }
    const allDatesSelected = next15Days.every(date =>
      selectedDates.includes(date)
    )
    if (allDatesSelected) {
      const updatedDates = selectedDates.filter(
        date => !next15Days.includes(date)
      )
      setSelectedDates(updatedDates)
    } else {
      setSelectedDates([...selectedDates, ...next15Days])
    }
  }
  const handleLast30DaysClick = () => {
    const next30Days = []
    for (let i = 1; i <= 29; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      next30Days.push(date.toISOString().slice(0, 10))
    }

    // Check if all dates from last30Days are already selected
    const allDatesSelected = next30Days.every(date =>
      selectedDates.includes(date)
    )

    if (allDatesSelected) {
      // Remove all dates from last30Days from the selection
      const updatedDates = selectedDates.filter(
        date => !next30Days.includes(date)
      )
      setSelectedDates(updatedDates)
    } else {
      // Add all dates from last30Days to the selection
      setSelectedDates([...selectedDates, ...next30Days])
    }
  }
  const handlecancel = () => {
    setcalendarModalOpen(false)
  }
  useEffect(() => {
    if (currentAttorney) {
      const payload = { id: currentAttorney._id }
      const getAttorneyinfo = async () => {
        const res = await regAttorneyDetails(payload)
        const { attorney } = res
        if (attorney) {
          setAttorneyDetail(attorney)
        }
      }
      getAttorneyinfo()
    }
  }, [currentAttorney])

  const handleScheduleUpdate = async () => {
    const payload = {
      attorneyID: currentAttorney._id,
      scheduleDates: selectedDates,
    }
    const res = await regAttorneyUpdate(payload)
    if (res.success) {
      toastr.success("Schedule updated successfully")
      setcalendarModalOpen(false)
    } else {
      toastr.error("Failed to Schedule update ", "Failed!!!")
    }
  }

  const calendarEvents = [
    ...(selectedDates
      ? selectedDates.map(date => ({
          start: date,
          end: date,
          display: "background",
          backgroundColor: "yellow",
          borderColor: "lightblue",
          borderRadius: "50%",
        }))
      : []),
    ...(attorneyDetail?.scheduleDates
      ? attorneyDetail.scheduleDates.map((date, index) => {
          const startTime = new Date(date)
          const eventDate = startTime.toISOString().split("T")[0]
          return {
            id: `${attorneyDetail._id}_${index}`,
            start: eventDate,
            display: "background",
            backgroundColor: "red",
          }
        })
      : []),
  ]

  console.log("attorney details", attorneyDetail?.scheduleDates)
  return (
    <div>
      <div>
        <button
          type="button"
          className="close py-3"
          data-dismiss="modal"
          aria-label="Close"
          style={{ width: "25px" }}
          onClick={() => handlecancel()}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="d-flex gap-4">
        <button className="btn btn-primary" onClick={handleTodaySelect}>
          Today
        </button>
        <button className="btn btn-primary" onClick={handleLast7DaysClick}>
          Next 7 days
        </button>
        <button className="btn btn-primary" onClick={handleLast15DaysClick}>
          Next 15 days
        </button>
        <button className="btn btn-primary" onClick={handleLast30DaysClick}>
          Next 30 days
        </button>{" "}
      </div>
      <div className="pt-3">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          slotDuration={"00:15:00"}
          handleWindowResize={true}
          themeSystem="bootstrap"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          editable={true}
          droppable={true}
          selectable={true}
          dateClick={handleDateSelect}
          events={calendarEvents}
        />
      </div>
      <div className=" pt-2 d-flex justify-content-end">
        <button className="btn btn-primary" onClick={handleScheduleUpdate}>
          Confirm
        </button>
      </div>
    </div>
  )
}
AttorneyCalendar.propTypes = {
  setcalendarModalOpen: PropTypes.func,
}
export default AttorneyCalendar
