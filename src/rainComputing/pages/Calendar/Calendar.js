import React, { useEffect, useRef, useState } from "react"
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
import "@fullcalendar/bootstrap/main.css"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import ChatRemainder from "rainComputing/components/chat/ChatRemainder"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import PropTypes from "prop-types"
import {
  getAllReminders,
  getCaseIdByIntervals,
  getGroupIdReminders,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import EditReminder from "./EditReminder"
import { selectionEvents } from "make-event-props"
import IntervalModel from "rainComputing/components/chat/models/IntervalModel"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
const Calender = ({ setcalendarModalOpen, groupId, caseId }) => {
  const [selectedday, setSelectedDay] = useState(0)
  const [getReminders, setGetReminders] = useState([])
  const [selectedEvent, setSelectedEvent] = useState([])
  const [caseIdIntervals, setCaseIdIntervals] = useState([])
  const { currentUser } = useUser()
  const [searchDate, setSearchDate] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const calendarRef = useRef(null)
  console.log("searchDate",searchDate)

  let caseIdAllIntervals = [];


  const handleSearchSubmit = (e) => {
  e.preventDefault();
  // Convert searchDate string to a Date object
  const searchDateObject = new Date(searchDate);

  // Filter events based on the selected date and event name
  const filtered = caseIdAllIntervals.filter((event) => {
    // Extract the year, month, and day components from the event's start date
    const eventYear = event.start.getFullYear();
    const eventMonth = event.start.getMonth();
    const eventDay = event.start.getDate();

    // Extract the year, month, and day components from the searchDate
    const searchYear = searchDateObject.getFullYear();
    const searchMonth = searchDateObject.getMonth();
    const searchDay = searchDateObject.getDate();

    // Compare the components to check for a match in date
    const isDateMatch = eventYear === searchYear && eventMonth === searchMonth && eventDay === searchDay;

    // Check if the event title includes the search term (case-insensitive)
    const isTitleMatch = event.title.toLowerCase().includes(searchDate.toLowerCase());

    return isDateMatch || isTitleMatch;
  });

  console.log("Filtered Events", filtered);
  setFilteredEvents(filtered);

  if (filtered.length === 0) {
    // Show Toastr notification when no events are found
    toastr.warning('No events found for the selected date and event name.');
  }
};

  useEffect(()=>{
    if (calendarRef.current && searchDate) {
      if (filteredEvents.length > 0) {
        const filteredMonth = filteredEvents[0].start;
        console.log("filteredMonth",filteredMonth)
        calendarRef.current.getApi().gotoDate(filteredMonth);
      } else {
        calendarRef.current.getApi().gotoDate(new Date());
      }
    }else{
      calendarRef.current.getApi().gotoDate(new Date());
      setFilteredEvents("")
    }
  },[filteredEvents,searchDate])
  // const filteredEvents = caseIdAllIntervals.filter((event) => {
  //   // Filter events based on the searchDate
  //   return (
  //     event.start.toISOString().includes(searchDate) ||
  //     event.title.toLowerCase().includes(searchDate.toLowerCase())
  //   );
  // });

  const {
    toggleOpen: remainderModelOpen,
    setToggleOpen: setRemainderModelOpen,
    toggleIt: toggleremainderModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: editremainderModelOpen,
    setToggleOpen: setEditRemainderModelOpen,
    toggleIt: toggleeditremainderModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: intervalModelOpen,
    setToggleOpen: setIntervalModelOpen,
    toggleIt: toggleIntervalModelOpen,
  } = useToggle(false)
  const handleDateClick = arg => {
    const date = arg["date"]
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const currectDate = new Date()

    const currentHour = currectDate.getHours()
    const currentMin = currectDate.getMinutes()
    const currentSec = currectDate.getSeconds()
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    )
    const modifiedData = { ...arg, date: modifiedDate }

    setSelectedDay(modifiedData)
    toggleremainderModelOpen()
  }
  const handleCalendarCancel = () => {
    setcalendarModalOpen(false)
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
  const getCaseIdIntervals = async () => {
    const payload = {
      caseId: caseId,
    }
    const res = await getCaseIdByIntervals(payload)
    if (res.success) {
      setCaseIdIntervals(res?.intervals)
    }
  }
  useEffect(() => {
    getCaseIdIntervals()
  }, [])
  // const calendarEvents = getReminders.map(reminder => {
  //   const startTime = new Date(reminder.scheduledTime)
  //   startTime.setHours(startTime.getHours() - 5)
  //   startTime.setMinutes(startTime.getMinutes() - 30)
  //   return {
  //     id: reminder._id,
  //     title: reminder.title,
  //     start: startTime,
  //     allDay: false,
  //   }
  // })
  const calendarEvents = []
  getReminders.forEach(reminder => {
    reminder.scheduledTime.forEach(date => {
      const startTime = new Date(date)
      startTime.setHours(startTime.getHours() - 5)
      startTime.setMinutes(startTime.getMinutes() - 30)
      calendarEvents.push({
        id: reminder._id,
        title: reminder.title,
        start: startTime,
        allDay: false,
      })
    })
  })
  const handleSearchInputChange = e => {
    const value = e.target.value;

    if (value.length <= 30) {
      setSearchDate(value);
    } else {
      toastr.error('Maximum character limit reached (30 characters).');
    }
  };

  caseIdIntervals.forEach((caseInterval) => {
    const { caseId, events } = caseInterval;

    events.forEach((event) => {
      const { intervals, eventId } = event;

      intervals.forEach((interval) => {
        const { responseText, responseDate, _id, isActive } = interval;

        if (isActive) {
          const startDate = new Date(responseDate);
          startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

          caseIdAllIntervals.push({
            id: _id,
            title: responseText,
            eventName: eventId?.eventName,
            start: startDate,
            allDay: true, // Set allDay to true to indicate it's a full-day event
          });
        }
      });
    });
  });

  // calendarEvents.push(...caseIdAllIntervals)
  const handleEventClick = e => {
    const event = e.event
    const reminder = caseIdAllIntervals.find(r => r?.id === event?.id)
    setSelectedEvent(reminder)
    setIntervalModelOpen(true)
  }

  return (
    <React.Fragment>
      <button
        type="button"
        className="close py-3"
        data-dismiss="modal"
        aria-label="Close"
        style={{ width: "25px" }}
        onClick={() => handleCalendarCancel()}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <DynamicModel
        open={remainderModelOpen}
        toggle={toggleremainderModelOpen}
        size="md"
        modalTitle="NEW REMINDER"
        footer={false}
      >
        <DynamicSuspense>
          <ChatRemainder
            setModalOpen={setRemainderModelOpen}
            selectdate={selectedday?.dateStr}
            getAllReminderById={getAllReminderById}
          />
        </DynamicSuspense>
      </DynamicModel>
      <DynamicModel
        open={editremainderModelOpen}
        toggle={toggleeditremainderModelOpen}
        size="md"
        modalTitle="EDIT REMINDER"
        footer={false}
      >
        <DynamicSuspense>
          <EditReminder
            setEditModalOpen={setEditRemainderModelOpen}
            reminder={selectedEvent}
            setGetReminders={setGetReminders}
            getReminders={getReminders}
            groupId={groupId}
          />
        </DynamicSuspense>
      </DynamicModel>
      <DynamicModel
        open={intervalModelOpen}
        toggle={toggleIntervalModelOpen}
        size="md"
        modalTitle="Interval"
        footer={false}
      >
        <DynamicSuspense>
          <IntervalModel
            setIntervalodalOpen={setIntervalModelOpen}
            reminder={selectedEvent}
            setGetReminders={setGetReminders}
            getReminders={getReminders}
            groupId={groupId}
          />
        </DynamicSuspense>
      </DynamicModel>
      <Container fluid={true}>
        {/* Render Breadcrumb */}

        <Row>
          <Col className="col-12 pt-4">
            <Card>
              <CardBody>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  className="search-box"
                  placeholder="Search by MM-DD-YYYY & EventText"
                  value={searchDate}
                  onChange={handleSearchInputChange}
                />
                <Button color="primary" type="submit">
                  <i className="mdi mdi-magnify" />
                </Button>
                </form>

                <Row>
                  {/* fullcalendar control */}
                  <FullCalendar
                  ref={calendarRef}
                    plugins={[BootstrapTheme, dayGridPlugin, interactionPlugin]}
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
                    // dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    // events={calendarEvents}
                    events={
                      filteredEvents.length > 0
                        ? filteredEvents
                        : caseIdAllIntervals
                    }
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}
Calender.propTypes = {
  setcalendarModalOpen: PropTypes.func,
  groupId: PropTypes.func,
  caseId: PropTypes.func,
}
export default Calender
