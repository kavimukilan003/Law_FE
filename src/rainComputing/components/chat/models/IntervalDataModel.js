import { getintervalIdDetails } from "rainComputing/helpers/backend_helper"
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"

const IntervalIdData = ({ setIntervalIdDataModalOpen, intervalId }) => {
  const [getIntervalByIdData, setGetIntervalByIdData] = useState([])
  const getIntervalIdData = async () => {
    const payload = {
      intervalId: intervalId,
    }
    const res = await getintervalIdDetails(payload)
    if (res.success) {
      setGetIntervalByIdData(res?.intervalData)
    }
  }
  useEffect(() => {
    getIntervalIdData()
  }, [])
  const handleClose = () => {
    setIntervalIdDataModalOpen(false)
  }
  const createAt = getIntervalByIdData?.note?.map(n => n.createdAt)
  return (
    <div className="">
      {getIntervalByIdData?.note &&
        getIntervalByIdData?.note.map((data, i) => (
          <div key={i} className="row">
            <div className="d-flex gap-2">
              <label htmlFor="example-text-input" className="col-md-2 ">
                Note :
              </label>
              <p className="">{data?.notes}</p>
            </div>
            <div className="d-flex gap-2">
              <label htmlFor="example-text-input" className="col-md-2">
                UserName :
              </label>
              <p className="pt-">
                {data?.userId?.firstname} {data?.userId?.lastname}
              </p>
            </div>
            <div className="d-flex gap-2">
              <label htmlFor="example-text-input" className="col-md-2">
                Time :
              </label>
              <p className="pt-">{createAt}</p>
            </div>
          </div>
        ))}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-danger"
          data-dismiss="modal"
          onClick={() => {
            handleClose()
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
IntervalIdData.propTypes = {
  setIntervalIdDataModalOpen: PropTypes.func,
  intervalId: PropTypes.func,
}
export default IntervalIdData
