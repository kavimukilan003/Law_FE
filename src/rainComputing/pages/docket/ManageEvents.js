import { eventUpdate, getEventById } from "rainComputing/helpers/backend_helper"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toastr from "toastr"

const ManageEvents = () => {
  const query = useQuery()
  const [eventsData, setEventsData] = useState([])
  const [showFields, setShowFields] = useState(false)
  const [responseText, setResponseText] = useState([])
  const [eventScheduleType, setEventScheduleType] = useState([])
  const [interval, setInterval] = useState([])
  const [eventName, setEventName] = useState()
  const [newInterval, setNewInterval] = useState([])
  const [newResponseText, setNewResponseText] = useState([])
  const [newEventScheduleType, setNewEventScheduleType] = useState([])
  const [newEvent, setNewEvent] = useState({
    interval: "",
    scheduledType: "",
    responseText: "",
  })

  const eventId = query.get("eid")
  const eventData = eventsData[0]
  const selecteEvent = [
    { value: "", text: "Select Intervals " },
    { value: "days", text: "Days " },
    { value: "weeks", text: "Weeks " },
    { value: "months", text: " Months" },
  ]
  const handleIntervalIconClick = () => {
    const updatedIntervals = [...interval, newInterval]
    const updatedEvents = [...eventsData[0].events, newEvent] // Add the new event
    setInterval(updatedIntervals)
    setNewInterval("")
    setEventsData([{ ...eventsData[0], events: updatedEvents }]) // Update eventsData with new event
    setNewEvent({ interval: "", scheduledType: "", responseText: "" }) // Reset newEvent state
  }

  const handleRemoveInput = index => {
    const updatedIntervals = [...interval];
    updatedIntervals.splice(index, 1); // Remove the interval at the specified index
    const updatedEvents = [...eventsData[0].events];
    updatedEvents.splice(index, 1); // Remove the event at the specified index
    setInterval(updatedIntervals);
    setEventsData([{ ...eventsData[0], events: updatedEvents }]); // Update eventsData with removed event
  };
  

  const handleEventTextIconClick = () => {
    setResponseText(prevInputs => [...prevInputs, newResponseText])
    setNewResponseText([])
  }

  const handleScheduleTypeIconClick = () => {
    setEventScheduleType(prevInputs => [...prevInputs, newEventScheduleType])
    setNewEventScheduleType([])
  }
  const toggleFields = () => {
    setShowFields(!showFields)
  }

  const handleEventUpdate = async () => {
    // const updatedEventData = {
    //   ...eventData,

    // }
    const payload = {
      eventId: eventId,
      events: eventData?.events?.map((data, index) => ({
        ...data,
        scheduledType: eventScheduleType[index],
        responseText: responseText[index],
        interval: interval[index],
      })),
    }
    console.log("payload :", payload)
    try {
      const res = await eventUpdate(payload)

      if (res.success) {
        console.log("res:", res)
        toastr.success(`Event has been updated successfully`, "Success")
        await getEventsById()
      }
    } catch (error) {
      console.error("An error occurred while updating the event:", error)
      // Handle the error in an appropriate way
    }
  }

  const handleTextChange = (index, value) => {
    const newText = [...responseText]
    newText[index] = value
    setResponseText(newText)
    setNewResponseText([])
  }

  const handleEventIntervalChange = (index, value) => {
    const newIntervals = [...interval]
    newIntervals[index] = value
    setInterval(newIntervals)
    setNewInterval([])
  }

  const handleEventScheduleTypeChange = (index, value) => {
    const newType = [...eventScheduleType]
    newType[index] = value
    setEventScheduleType(newType)
    setNewEventScheduleType([])
  }

  useEffect(() => {
    if (eventData) {
      setEventName(eventData?.eventName)
      setInterval(eventData?.events?.map(inter => inter?.interval))
      setEventScheduleType(eventData?.events?.map(type => type?.scheduledType))
      setResponseText(eventData?.events?.map(text => text?.responseText))
    } else {
      setEventName("")
      setInterval([])
      setEventScheduleType([])
      setResponseText([])
    }
  }, [eventData])

  const getEventsById = async () => {
    const payload = {
      Id: eventId,
    }
    const allEventsData = await getEventById(payload)
    setEventsData(allEventsData?.event)
  }

  useEffect(() => {
    getEventsById()
  }, [])

  return (
    <div className="py-5 my-5">
      <div className="px-3 px-md-5">
        <div className="d-flex">
        <Link to="/create_events">
          <p>Create Events / </p>
        </Link>
        <p>Manage Events  </p>
        </div>
        <h4>Manage Event</h4>
        <>
          <h5 className="text-primary">{eventName}</h5>

          {showFields && (
            <>
              <div className="d-flex justify-content-end">
                <i
                  className="bx bx-plus-circle pt-4 pointer text-primary"
                  style={{ fontSize: "18px" }}
                  onClick={e => {
                    e.preventDefault()
                    handleIntervalIconClick()
                    handleEventTextIconClick()
                    handleScheduleTypeIconClick()
                  }}
                ></i>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                  <label htmlFor="example-text-input" className="form-label">
                    Event
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                  />
                </div>
                <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                  <label htmlFor="example-text-input" className="form-label">
                    No of Days/Weeks/Months
                  </label>
                  {interval.map((intervalValue, index) => (
                    <div key={index} className="input-group mb-3">
                      <input
                        className="form-control"
                        type="number"
                        // min={index === 0 ? 0 : 1}
                        min={0}
                        value={intervalValue}
                        onChange={e =>
                          handleEventIntervalChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                  <label htmlFor="example-text-input" className="form-label">
                    Event Schedule
                  </label>
                  <div>
                    {eventScheduleType?.map((type, index) => (
                      <select
                        key={index}
                        style={{ marginBottom: "15px" }}
                        className="form-control"
                        value={type}
                        onChange={e =>
                          handleEventScheduleTypeChange(index, e.target.value)
                        }
                      >
                        {selecteEvent.map((event, index) => (
                          <option key={index} value={event.value}>
                            {event.text}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
                <div className="col-lg-5 col-md-6 col-sm-12 mb-3">
                  <label htmlFor="example-text-input" className="form-label">
                    Event Text
                  </label>
                  {responseText?.map((text, index) => (
                    <div key={index} className="input-group mb-3">
                      <input
                        className="form-control"
                        type="text"
                        value={text}
                        onChange={e => handleTextChange(index, e.target.value)}
                      />
                      <span className="input-group-text">
                    {interval.length === 1 ? (
                      <i
                        className="bx bx-minus-circle text-danger pointer"
                        title="Minimum one Event is required"
                        style={{ cursor: "not-allowed" }}
                      />
                    ) : (
                      <i
                        className="bx bx-minus-circle text-danger pointer"
                        title="Remove this Event"
                        onClick={() => handleRemoveInput(index)}
                      />
                    )}
                  </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={() => handleEventUpdate()}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </>
        <i
          className={`bx ${
            showFields ? "bx-caret-up" : "bx-caret-down"
          } d-flex pointer`}
          onClick={toggleFields}
        >
          {!showFields ? (
            <p style={{ fontFamily: "Poppins, sans-serif" }}>
              Click to Update an Event
            </p>
          ) : (
            <p style={{ fontFamily: "Poppins, sans-serif" }}>
              Click to Close the manage Field
            </p>
          )}
        </i>

        <div className="table-responsive">
          
          <table className="table table-bordered">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">No of Intervals</th>
                <th scope="col">Event Text</th>
              </tr>
            </thead>
            <tbody>
              {eventsData?.map((data, key) => (
                <tr key={key}>
                  <td>{data?.eventName}</td>
                  <td>
                    <ul>
                      {data?.events?.map((event, index) => (
                        <li key={index}>
                          {event?.interval}
                          {"-"}
                          {event?.scheduledType}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <ul>
                      {data?.events?.map((eve, i) => (
                        <li key={i}>{eve?.responseText}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageEvents
