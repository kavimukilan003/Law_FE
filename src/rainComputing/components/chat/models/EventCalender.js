import {
  getAllEvent,
  getEventsByCaseId,
} from "rainComputing/helpers/backend_helper"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

const EventCalender = ({ caseId }) => {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [receivedDate, setReceivedDate] = useState("")
  const [allEventsData, setAllEventsData] = useState([])
  const [filteredEvents, setFilteredEvents] = useState()
  const [getAllEvents, setGetAllEvents] = useState([])
  const handleSelectEvent = event => {
    setSelectedEvent(event.target.value)
  }

  const handleReceivedDate = event => {
    setReceivedDate(event.target.value)
  }

  const handleFilterEvents = () => {
    if (allEventsData.length > 0) {
      // Filter events based on selectedEvent and receivedDate
      const filteredEvents = allEventsData.filter(event => {
        const eventReceivedDate = new Date(event.receivedDate)
          .toISOString()
          .split("T")[0]
        const selectedDate = new Date(receivedDate).toISOString().split("T")[0]
        return (
          (event.docEvent === selectedEvent &&
            eventReceivedDate === selectedDate) ||
          event.docEvent === selectedEvent
        )
      })

      if (filteredEvents.length > 0) {
        setFilteredEvents(filteredEvents)
      } else {
        console.log("No matching events found")
        setFilteredEvents([])
      }
    } else {
      console.log("No events data available")
    }
  }

  useEffect(() => {
    const handleAllEvents = async () => {
      const payload = {
        caseId: caseId?._id,
      }
      const allEventsData = await getAllEvent(payload)
      setAllEventsData(allEventsData?.events)
    }
    handleAllEvents()
  }, [caseId])

  useEffect(() => {
    if (caseId) {
      const getCaseEvents = async () => {
        const payload = {
          caseId: caseId?._id,
        }
        const res = await getEventsByCaseId(payload)
        if (res.success) {
          setGetAllEvents(res?.caseEvents)
        }
      }
      getCaseEvents()
    }
  }, [])

  return (
    <div>
      <div className="d-flex">
        <div className="col-md-6">
          <label
            htmlFor="example-text-input"
            className="col-md-3 col-lg-2 col-form-label"
          >
            Event
          </label>
          <div className="col-md-11 d ">
            <select
              className="form-control"
              value={selectedEvent}
              onChange={handleSelectEvent}
            >
              <option value="">Select Events</option>{" "}
              {/* {getEvents.map((option, i) => (
                <option value={option?.value} key={i}>
                  {option?.name}
                </option>
              ))} */}
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <label
            htmlFor="example-text-input"
            className="col-md-3 col-lg-2 col-form-label"
            style={{ minWidth: "100px" }}
          >
            Received Date
          </label>
          <div className="col-md-11 d ">
            <input
              className="form-control"
              type="date"
              value={receivedDate}
              onChange={handleReceivedDate}
            />
          </div>
        </div>
      </div>
      <div>
        <p> </p>
      </div>
      <div>
        {filteredEvents && <h5 className="text-primary">Filtered Events:</h5>}
        {filteredEvents && filteredEvents.length > 0 ? (
          <table className="table table-bordered">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col">Event</th>
                <th scope="col">Response Date</th>
                <th scope="col">Response Text</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <React.Fragment key={event._id}>
                  {event.eventText.map((text, index) => (
                    <tr key={text.docDate}>
                      <td className="col-md-4"> {event.docEvent}</td>
                      <td className="col-md-4">
                        {text.docDate.substring(0, 10)}
                      </td>
                      <td className="col-md-6">{text.text}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          filteredEvents && (
            <p className="text-danger">No matching events found</p>
          )
        )}
      </div>

      <div className="d-flex justify-content-end ">
        <button className="btn btn-primary" onClick={handleFilterEvents}>
          Filter Events
        </button>
      </div>
    </div>
  )
}

EventCalender.propTypes = {
  caseId: PropTypes.object,
}

export default EventCalender
