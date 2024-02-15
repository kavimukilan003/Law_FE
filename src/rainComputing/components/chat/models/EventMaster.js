import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  createCaseInterval,
  getAllEvent,
  getEventById,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { Dropdown } from "reactstrap"
import holidays from "date-holidays"
import moment from "moment"
import toastr from "toastr"

const EventMaster = ({ caseId, closeModal }) => {
  const { currentAttorney } = useUser()
  const [docDate, setDocDate] = useState(Array(1).fill(""))
  const [selectedEvent, setSelectedEvent] = useState(Array(1).fill(""))
  const [eventText, setEventText] = useState(Array(1).fill(""))
  const [receivedDate, setReceivedDate] = useState(Array(1).fill(""))
  const [allEventsData, setAllEventsData] = useState([])
  const [responseDates, setResponseDates] = useState([])
  const [responseTextChange, setResponseTextChange] = useState([])
  const [eventId, setEventId] = useState()
  const currentCase = caseId?._id
  const [eventsData, setEventsData] = useState([])
  const hd = new holidays("US")
  const holiday = hd.getHolidays()
  // const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const event = eventsData[0]?.events
  const resText = event?.responseText
  const handleRecievedDateChange = (index, value) => {
    setReceivedDate(prevInputs => {
      const newRecievedDate = [...prevInputs]
      newRecievedDate[index] = value
      return newRecievedDate
    })
  }
  const handleEventChange = (index, value, id) => {
    const updatedSelectedEvent = [...selectedEvent]
    updatedSelectedEvent[index] = value

    setEventId(id) // Set the ID of the selected option

    setSelectedEvent(updatedSelectedEvent)

    const [interval, eventName] = value.split(", ")
    const selectedEventText =
      allEventsData.find(
        event => event.interval === interval && event.eventName === eventName
      )?.eventText || ""
    setEventText(selectedEventText)
  }

  const handleDateChange = (k, value) => {
    const updatedDocDate = [...docDate]
    updatedDocDate[k] = value
    setDocDate(updatedDocDate)
    return updatedDocDate
  }

  const handleAllEvents = async () => {
    const payload = {
      id: currentAttorney?._id,
    }
    const allEventsData = await getAllEvent(payload)
    setAllEventsData(allEventsData?.data)
  }

  const getEvents = async () => {
    const payload = {
      Id: eventId,
    }
    const res = await getEventById(payload)
    if (res.success) {
      setEventsData(res?.event)
    }
  }
  useEffect(() => {
    getEvents()
  }, [eventId])

  useEffect(() => {
    handleAllEvents()
  }, [currentAttorney])
  useEffect(() => {
    const responseTexts = event?.map(event => event.responseText)
    setResponseTextChange(responseTexts)
  }, [event])

  const handleReceivedDateChange = e => {
    setReceivedDate(e.target.value)
  }

  const isWeekend = date => {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday (0) or Saturday (6)
  }
  const isHoliday = date => {
    const formattedDate = date.toISOString().split("T")[0]
    return next50YearsallHolidays.includes(formattedDate)
  }
  function generateHolidays() {
    const holidays = []
    // Get the current year
    const currentYear = moment().year()
    // Create a new instance of the holiday calculation library
    // Iterate over the next 10 years
    for (let year = currentYear; year < currentYear + 50; year++) {
      // Get the list of holidays for the current year
      const yearHolidays = hd.getHolidays(year, "US")
      // Iterate over each holiday and extract the date and name
      yearHolidays.forEach(holiday => {
        const date = moment(holiday.date).format("YYYY-MM-DD")
        const name = holiday.name
        // Push the holiday object to the holidays array
        holidays.push({ date, name })
      })
    }
    return holidays
  }
  // Generate holidays for the next 10 years
  const next50YearsHolidays = generateHolidays()
  // console.log("next50YearsHolidays", next50YearsHolidays)
  const next50YearsallHolidays = next50YearsHolidays.map(date => date?.date)
  // Print the list of holidays
  // next50YearsHolidays.forEach(holiday => {
  //   console.log(`${holiday.date}: ${holiday.name}`);
  // });
  function generateWeekendDates() {
    const weekendDates = []
    // Get the current year
    const currentYear = moment().year()
    // Create a new instance of the holiday calculation library
    // Iterate over the next 50 years
    for (let year = currentYear; year < currentYear + 50; year++) {
      // Get the list of holidays for the current year
      const yearHolidays = hd.getHolidays(year)
      // Iterate over each day of the year
      for (let day = 0; day < 365; day++) {
        const date = moment().year(year).dayOfYear(day)
        // Check if the day falls on a Saturday or Sunday (0 = Sunday, 6 = Saturday)
        if (date.weekday() === 0 || date.weekday() === 6) {
          // Push the date to the weekendDates array
          weekendDates.push(date.format("YYYY-MM-DD"))
        }
      }
    }
    return weekendDates
  }
  // Generate weekdays for the next 50 years
  const next50YearsWeekdays = generateWeekendDates()
  // console.log("next50YearsWeekdays", next50YearsWeekdays)
  const calculateResponseDates = () => {
    const newResponseDates = event?.map(events => {
      const { interval, scheduledType } = events
      let responseDate = ""

      if (receivedDate) {
        const receivedDateObj = moment.tz(receivedDate, "America/New_York")
        // console.log("receivedDateObj", receivedDateObj);

        switch (scheduledType) {
          case "days":
            if (interval === 0) {
              responseDate = receivedDateObj
            } else {
              responseDate = moment(receivedDateObj).add(interval, "days")
            }
            break
          case "weeks":
            if (interval === 0) {
              responseDate = receivedDateObj
            } else {
              responseDate = moment(receivedDateObj).add(interval, "weeks")
            }
            break
          case "months":
            if (interval === 0) {
              responseDate = receivedDateObj
            } else {
              responseDate = moment(receivedDateObj).add(interval, "months")
            }
            break
          default:
            break
        }

        // Check if the response date falls on a weekend or holiday
        while (
          next50YearsWeekdays.includes(responseDate.format("YYYY-MM-DD")) ||
          next50YearsallHolidays.includes(responseDate.format("YYYY-MM-DD"))
        ) {
          responseDate.add(1, "days") // Move to the next day
        }
      }

      return responseDate ? responseDate.format("YYYY-MM-DD") : ""
    })

    setResponseDates(newResponseDates)
  }

  useEffect(() => {
    if (event) {
      calculateResponseDates()
    }
  }, [receivedDate])
  const handleCreateEvent = async () => {
    try {
      const intervals = responseTextChange.map((responseText, index) => ({
        responseDate: responseDates[index],
        responseText: responseText,
      }))

      const eventPayload = {
        caseId: currentCase,

        events: [
          {
            eventId: eventId,
            receivedDate: receivedDate,
            intervals: intervals,
          },
        ],
      }

      const res = await createCaseInterval(eventPayload)
      if (res.success) {
        toastr.success(`Event Created successfully`, "Success")
        closeModal(true)
        setEventId("")
        setEventText([])
        setReceivedDate("")
      }
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }
  // useEffect(() => {
  //   if(eventId && receivedDate !== "") {
  //     console.log("Received", receivedDate)
  //   setIsSaveDisabled(
  //      true
  //   )
  //   }
  // }, [eventId])
  return (
    <div className="">
      <div className="row">
        <div className="col-md-6">
          {/* Event select */}
          <div className="form-group">
            <label htmlFor="example-text-input" className="col-form-label">
              Event
            </label>
            {selectedEvent.map((event, index) => (
              <select
                key={index}
                className="form-control"
                value={event}
                onChange={e =>
                  handleEventChange(
                    index,
                    e.target.value,
                    e.target.selectedOptions[0].id
                  )
                }
              >
                <option value="">Select Event</option>
                {allEventsData.map((option, i) => (
                  <option
                    value={`${option.interval}, ${option?.eventName}`}
                    key={i}
                    id={option._id} // Assuming each option has an "eventId"
                  >
                    {option.eventName}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group ">
            <label htmlFor="example-text-input" className="col-form-label">
              Received Date
            </label>
            <input
              id="received-date"
              className="form-control"
              type="date"
              value={receivedDate}
              onChange={handleReceivedDateChange}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          {eventId && receivedDate !== "" && (
            <label htmlFor="example-text-input" className="col-form-label">
              Response Date
            </label>
          )}
          {eventId && receivedDate == "" && (
            <p
              htmlFor="example-text-input"
              className="col-form-label"
              style={{ textAlign: "center", color: "gray" }}
            >
              The response date displayed is determined based on the received
              date that you select.
            </p>
          )}
          {responseDates.length > 0 &&
            responseDates.map((responseDate, index) => (
              <div
                key={index}
                style={{ marginBottom: "10px" }}
                className="form-group"
              >
                <input
                  id={`response-date-${index}`}
                  className="form-control"
                  type="date"
                  value={responseDate}
                  readOnly
                />
              </div>
            ))}
        </div>
        <div className="col-md-6">
          {eventId && (
            <label htmlFor="example-text-input" className="col-form-label">
              Response Text
            </label>
          )}
          {responseTextChange?.map((text, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <div>
                <input
                  className="form-control"
                  type="text"
                  value={text}
                  onChange={e => {
                    const newText = e.target.value
                    setResponseTextChange(prevState =>
                      prevState.map((prevText, i) =>
                        i === index ? newText : prevText
                      )
                    )
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-end pt-2">
        <button
          className="btn btn-primary"
          onClick={handleCreateEvent}
          // disabled={isSaveDisabled}
        >
          save
        </button>
      </div>
    </div>
  )
}

EventMaster.propTypes = {
  caseId: PropTypes.object,
  closeModal: PropTypes.any,
}

export default EventMaster
