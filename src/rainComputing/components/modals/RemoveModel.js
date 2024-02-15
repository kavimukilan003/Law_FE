import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import "../chat/style/case-grid.scss"
import add from "../../../assets/images/addadmin.png"

const RemoveModal = ({
  size = "lg",
  open,
  toggle,
  modalTitle,
  modalSubtitle,
  children,
  footer = true,
  isClose = false,
  RemoveClick
}) => {
  return (
    <Modal
      isOpen={open}
      toggle={toggle}
      centered={true}
      size={size}
      backdrop={"static"}
      
    >
      <ModalHeader>
        <div className="">
          <h5 className="fw-medium" style={{ display: "block" }}>
            {modalTitle}
          </h5>
          <h6 className="text-muted"> {modalSubtitle}</h6>
          {isClose && (
            <button
              onClick={() => {
                toggle()
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
      </ModalHeader>
      <ModalBody className="p-3" style={{ backgroundColor: "#fdfdfd" }}>
      <div className="d-flex justify-content-center pb-3" >
        <img src={add} style={{height:"100px"}}></img>
       
        </div>
        <p className="d-flex justify-content-center">Are you interested in removing an administrator account? </p>
        {footer && (
          <div className="d-flex justify-content-center my-2 gap-3">
               <button className="btn btn-primary" onClick={RemoveClick}>
              Yes
            </button>
            <button className="btn btn-primary" onClick={() => toggle()}>
              No
            </button>
         
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

RemoveModal.propTypes = {
  size: PropTypes.string,
  modalSubtitle: PropTypes.string,
  modalTitle: PropTypes.string,
  children: PropTypes.any,
  open: PropTypes.bool,
  footer: PropTypes.bool,
  toggle: PropTypes.func,
  isClose: PropTypes.bool,
  RemoveClick: PropTypes.any,
}

export default RemoveModal
