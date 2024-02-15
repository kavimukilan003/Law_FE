import React from 'react'
import PropTypes from 'prop-types'
const IntervalModel = ({reminder,setIntervalodalOpen}) => {
    const date = new Date(reminder?.start);
const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

 const handleClose = () => {
    setIntervalodalOpen(false)
 }

  return (
    <div>
        <div>
        <h5 className="text-primary">{reminder?.eventName}</h5>
        <p>Response Text for {formattedDate}</p>
       
        <p>{reminder?.title}</p>
        </div>
        <div className="modal-footer">
        <button
            type="button"
            className="btn btn-secondary "
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
IntervalModel.propTypes = {
    reminder: PropTypes.func,
    setIntervalodalOpen: PropTypes.func,
    
}
export default IntervalModel