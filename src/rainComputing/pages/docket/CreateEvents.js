import React, { useEffect, useState } from "react"
import PropTypes, { any } from "prop-types"
import {
  createEvent,
  getAllEvent,
  getAllStatus,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { Link } from "react-router-dom"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const CreateEvents = ({ caseId }) => {
  const { currentAttorney } = useUser()
  const [docIntervals, setDocIntervals] = useState(Array(1).fill(""))
  const [eventText, setEventText] = useState(Array(1).fill(""))
  const [eventName, setEventName] = useState(Array(1).fill(""))
  const [eventIntervals, setEventIntervals] = useState(Array(1).fill(""))
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)
  const [allEventsData, setAllEventsData] = useState([])
  const [showFields, setShowFields] = useState(false)
  const selecteEvent = [
    { value: "", text: "Select" },
    { value: "days", text: "Days " },
    { value: "weeks", text: "Weeks " },
    { value: "months", text: " Months" },
  ]
  const currentCase = caseId?._id
  const handleIconClick = () => {
    setDocIntervals(prevInputs => [...prevInputs, ""])
  }
  const handleEventTextIconClick = () => {
    setEventText(prevInputs => [...prevInputs, ""])
  }
  const handleReceivedDateIconClick = () => {
    setEventIntervals(prevInputs => [...prevInputs, ""])
  }
  const handleEventTextChange = (index, value) => {
    // Validate the length before updating the state
    if (value.length > 30) {
      toastr.error('Event text must be 30 characters or less',);
      return;
    }
    
  
    setEventText(prevInputs => {
      const newEventsTexts = [...prevInputs];
      newEventsTexts[index] = value;
      return newEventsTexts;
    });
  };
  
  const handleEventIntervalChange = (index, value) => {
    setEventIntervals(prevInputs => {
      const newRecievedDate = [...prevInputs]
      newRecievedDate[index] = value
      return newRecievedDate
    })
  }
  const handleDateTypeChange = (index, value) => {
    setDocIntervals(prevInputs => {
      const newInputs = [...prevInputs]
      newInputs[index] = value
      return newInputs
    })
  }
  const handleCreateEvent = async () => {
    if (eventName.trim() === '' || eventName.length > 30) {
      toastr.error('Event name must be 1 to 30 characters',);
      return;
    }
    const eventData = {
      eventName: eventName,
      firmId: currentAttorney?._id,
      events: [],
    }
    for (let i = 0; i < docIntervals.length; i++) {
      eventData.events.push({
        scheduledType: docIntervals[i],
        responseText: eventText[i],
        interval: eventIntervals[i],
      })
    }
    try {
      const response = await createEvent(eventData)
      if (response.success) {
        await handleAllEvents()
        toastr.success(`Event has been updated successfully`, "Success")
        setIsSaved(true)
        setEventName([])
        setDocIntervals([])
        setEventIntervals([])
        setEventText([])
        handleIconClick()
        handleEventTextIconClick()
        handleReceivedDateIconClick()
      } else {
        console.log("Failed to create event")
      }
    } catch (error) {
      console.log("Error creating event:", error)
    }
  }

  useEffect(() => {
    setIsSaveDisabled(
      docIntervals.some(date => date === "") ||
        eventText.some(date => date === "") ||
        eventIntervals.some(date => date === "")
    )
  }, [docIntervals, eventText, eventName, eventIntervals])
  const toggleFields = () => {
    setShowFields(!showFields)
  }
  const handleAllEvents = async () => {
    const payload = {
      id: currentAttorney?._id,
    }
    const allEventsData = await getAllEvent(payload)
    setAllEventsData(allEventsData?.data)
  }
  useEffect(() => {
    handleAllEvents()
  }, [currentAttorney])

  const handleRemoveField = index => {
    if (docIntervals.length === 1) {
      return // Do not remove the input when there is only one input
    }

    setDocIntervals(prevInputs => {
      const newInputs = [...prevInputs]
      newInputs.splice(index, 1)
      return newInputs
    })

    setEventText(prevInputs => {
      const newInputs = [...prevInputs]
      newInputs.splice(index, 1)
      return newInputs
    })

    setEventIntervals(prevInputs => {
      const newInputs = [...prevInputs]
      newInputs.splice(index, 1)
      return newInputs
    })
  }
const handleEventNameChange = (value) => {
  if (value.length > 30) {
    toastr.error('EventName text must be 30 characters or less',);
    return;
  }else{
  setEventName(value)
  }
}
  return (
    <div className="py-5 my-5">
      <div>
        <h4>Create a New Event</h4>
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-primary">
              {currentAttorney?.regUser?.firstname}{" "}
              {currentAttorney?.regUser?.lastname}
            </h3>
          </div>
        </div>
      </div>
      {showFields && (
        <>
          <div className="d-flex justify-content-end">
            <i
              className="bx bx-plus-circle pt-4 pointer text-primary"
              style={{ fontSize: "18px" }}
              onClick={e => {
                e.preventDefault()
                handleIconClick()
                handleEventTextIconClick()
                handleReceivedDateIconClick()
              }}
            ></i>
          </div>
          <div className="row">
            <div className="col-md-5 col-sm-12 mb-3">
              <label htmlFor="example-text-input" className="form-label">
                Event
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter the events name"
                value={eventName}
                onChange={(e) => handleEventNameChange(e.target.value)}
              />
            </div>
            <div className="col-md-2 col-sm-12 mb-3">
              <label htmlFor="example-text-input" className="form-label">
                No of Days/Weeks/Months
              </label>
              {eventIntervals.map((rdate, index) => (
                <div key={index} style={{ marginBottom: "16px" }}>
                  <span className="d-flex">
                    <input
                      className="form-control"
                      type="number"
                      value={rdate}
                      onChange={e =>
                        handleEventIntervalChange(index, e.target.value)
                      }
                    />
                    <select
                      className="form-control"
                      value={docIntervals[index]}
                      onChange={e =>
                        handleDateTypeChange(index, e.target.value)
                      }
                    >
                      {selecteEvent.map(event => (
                        <option key={event.value} value={event.value}>
                          {event.text}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              ))}
            </div>

            <div className="col-md-5 col-sm-12 mb-3">
              <label htmlFor="example-text-input" className="form-label">
                Event Text
              </label>
              {eventText.map((text, index) => (
                <div key={index} className="input-group mb-3">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter the events Textname"
                    value={text}
                    onChange={e => handleEventTextChange(index, e.target.value)}
                  />
                  <span className="input-group-text">
                    {docIntervals.length === 1 ? (
                      <i
                        className="bx bx-minus-circle text-danger pointer"
                        title="Minimum one Event is required"
                        style={{ cursor: "not-allowed" }}
                      />
                    ) : (
                      <i
                        className="bx bx-minus-circle text-danger pointer"
                        title="Remove this Event"
                        onClick={() => handleRemoveField(index)}
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
              onClick={() => {
                handleCreateEvent()
              }}
              disabled={isSaveDisabled}
            >
              Save
            </button>
          </div>
        </>
      )}

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
      <div style={{ maxHeight: "500px", overflowY: "scroll" }}>
  <table className="table table-bordered">
    <thead className="bg-primary text-white" style={{ position: "sticky", top: 0 }}> 
      <tr>
        <th scope="col">Event Name</th>
        <th scope="col">No of Intervals</th>
        <th scope="col">Event Text</th>
        <th scope="col">View/Edit</th>
      </tr>
    </thead>
    <tbody>
      {allEventsData?.map((data, key) => (
        <tr key={key}>
          <td>{data?.eventName}</td>
          <td>
            <ul>
              {data?.events?.map((event, index) => (
                <li key={index}>
                  {event?.interval}-{event?.scheduledType}
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
          <td>
            <Link to={`/manage_events?eid=${data._id}`}>
              <i className="bx bx-show-alt" /> View
            </Link>{" "}
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

CreateEvents.propTypes = {
  caseId: PropTypes.object,
  closeModal: PropTypes.any,
}

export default CreateEvents
