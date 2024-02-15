import PropTypes from "prop-types"
import IntervalIdUpdateModel from "rainComputing/components/chat/models/IntervalIdUpdateModel"
import IntervalIdData from "rainComputing/components/chat/models/IntervalDataModel"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import {
  getCaseIdByIntervals,
  getEventsByCaseId,
  getIntervalById,
  getIntervalByIdActive,
} from "rainComputing/helpers/backend_helper"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import toastr from "toastr"

const EventByCase = ({ location }) => {
  const {
    toggleOpen: intervalIdUpdateModalOpen,
    setToggleOpen: setIntervalIdUpdateModalOpen,
    toggleIt: toggleintervalIdUpdateModal,
  } = useToggle(false)
  const {
    toggleOpen: intervalIddataModalOpen,
    setToggleOpen: setIntervalIddataModalOpen,
    toggleIt: toggleintervalIddataModal,
  } = useToggle(false)
  const caseData = location.state.caseData
  const tab = new URLSearchParams(location.search).get("tab")
  const [getAllEvents, setGetAllEvents] = useState([])
  const [selectedIntervalId, setSelectedIntervalId] = useState()

  const getCaseEvents = async () => {
    const payload = {
      caseId: caseData?._id,
    }
    const res = await getCaseIdByIntervals(payload)
    if (res.success) {
      setGetAllEvents(res?.intervals)
    }
  }

  useEffect(() => {
    if (caseData) {
      getCaseEvents()
    }
  }, [caseData])

  const handleChange = id => {
    setSelectedIntervalId(id)
    setIntervalIdUpdateModalOpen(true)
  }
  const handleClick = id => {
    setSelectedIntervalId(id)
    setIntervalIddataModalOpen(true)
  }
  const handleActiveInterval = async id => {
    const payload = {
      intervals: [
        {
          intervalId: id,
        },
      ],
    }
    const res = await getIntervalByIdActive(payload)
    if (res.success) {
      await getCaseEvents()
      toastr.success(`Interval Active successfully`, "Success")
    }
  }
  return (
    <div>
      <div className="py-5 my-5">
        <DynamicModel
          open={intervalIdUpdateModalOpen}
          toggle={toggleintervalIdUpdateModal}
          size="md"
          modalTitle="Interval"
          footer={false}
        >
          <DynamicSuspense>
            <IntervalIdUpdateModel
              setIntervalIdUpdateModalOpen={setIntervalIdUpdateModalOpen}
              intervalId={selectedIntervalId}
              getCaseEvents={getCaseEvents}
            />
          </DynamicSuspense>
        </DynamicModel>
        <DynamicModel
          open={intervalIddataModalOpen}
          toggle={toggleintervalIddataModal}
          size="md"
          modalTitle="Interval"
          footer={false}
        >
          <DynamicSuspense>
            <IntervalIdData
              setIntervalIdDataModalOpen={setIntervalIddataModalOpen}
              intervalId={selectedIntervalId}
              getCaseEvents={getCaseEvents}
            />
          </DynamicSuspense>
        </DynamicModel>
        <div>
          <div>
            <Link to="/chat-rc">
              <p>Chat /</p>
            </Link>
            <h6>Event Details</h6>
            <h5 className="text-primary">{caseData?.caseName}</h5>
          </div>
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="table table-bordered table-scrollable-x">
              <thead className="bg-primary text-white">
                <tr>
                  <th scope="col">Event</th>
                  <th scope="col">Received Date</th>
                  <th scope="col">Response Date</th>
                  <th scope="col">Response Text</th>
                  <th scope="col">Select</th>{" "}
                  {/* Add a column for checkboxes */}
                </tr>
              </thead>
              <tbody>
                <React.Fragment>
                  {getAllEvents?.map((data, index) =>
                    data?.events?.map((eve, i) => (
                      <React.Fragment key={i}>
                        {eve.intervals.map((int, inx) => (
                          <tr key={inx}>
                            {inx === 0 && ( // Render eventId and receivedDate only for the first interval
                              <>
                                <td
                                  className="col-md-2"
                                  rowSpan={eve.intervals.length}
                                >
                                  {eve?.eventId?.eventName}
                                </td>
                                <td
                                  className="col-md-2"
                                  rowSpan={eve.intervals.length}
                                >
                                  {eve?.receivedDate || ""}
                                </td>
                              </>
                            )}
                            <td className="col-md-2">
                              {int?.responseDate || ""}
                            </td>
                            <td className="col-md-3">{int?.responseText}</td>
                            <td className="col-md-1 justify-content-between">
                              <div>
                                {int?.isActive ? (
                                  <input
                                    type="checkbox"
                                    onClick={() => handleChange(int?._id)}
                                  />
                                ) : (
                                  <React.Fragment>
                                    <input
                                      type="checkbox"
                                      checked={!int?.isActive}
                                      onClick={() =>
                                        handleActiveInterval(int?._id)
                                      }
                                    />
                                    <p
                                      className=""
                                      onClick={() => handleClick(int?._id)}
                                    >
                                      <i className="bx bx-show-alt" /> view
                                    </p>
                                  </React.Fragment>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </React.Fragment>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

EventByCase.propTypes = {
  location: PropTypes.object.isRequired,
}

export default EventByCase
