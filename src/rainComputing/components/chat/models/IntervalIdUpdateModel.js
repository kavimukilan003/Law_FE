import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  getintervalIdDetails,
  intervalIdUpdate,
} from "rainComputing/helpers/backend_helper"
import toastr from "toastr"
import { useUser } from "rainComputing/contextProviders/UserProvider"
const IntervalIdUpdateModel = ({
  setIntervalIdUpdateModalOpen,
  intervalId,
  getCaseEvents,
}) => {
  const [notes, setNotes] = useState()
  const [getUpdateIntervalId, setGetUpdateIntervalId] = useState([])

  const { currentUser } = useUser()
  const handleClose = () => {
    setIntervalIdUpdateModalOpen(false)
  }
  const handleUpdate = async () => {
    const payload = {
      intervals: [
        {
          intervalId: intervalId,
          userId: currentUser?.userID,
          notes: notes,
        },
      ],
    }
    const res = await intervalIdUpdate(payload)
    if (res.success) {
      await getCaseEvents()
      toastr.success(`Interval Cancel successfully`, "Success")
      setGetUpdateIntervalId(res?.updatedIntervals)
      setIntervalIdUpdateModalOpen(false)
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-2">
          <label htmlFor="example-text-input" className="col-form-label">
            Note
          </label>
        </div>
        <div className="col-md-10">
          <textarea
            style={{ maxHeight: "100px" }}
            type="text"
            className="form-control"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-danger "
          data-dismiss="modal"
          onClick={() => {
            handleClose()
          }}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary "
          data-dismiss="modal"
          onClick={() => {
            handleUpdate()
          }}
        >
          Save
        </button>
      </div>
    </div>
  )
}

IntervalIdUpdateModel.propTypes = {
  setIntervalIdUpdateModalOpen: PropTypes.func,
  intervalId: PropTypes.func,
  getCaseEvents: PropTypes.func,
}
export default IntervalIdUpdateModel
