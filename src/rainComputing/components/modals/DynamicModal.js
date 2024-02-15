import React from "react"
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
import "../chat/style/case-grid.scss"

const DynamicModel = ({
  size = "lg",
  open,
  toggle,
  modalTitle,
  modalSubtitle,
  children,
  footer = true,
  isClose = false,
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
        <>{children}</>
        {footer && (
          <div className="d-flex justify-content-end my-2">
            <button className="btn btn-primary" onClick={() => toggle()}>
              DONE
            </button>
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

DynamicModel.propTypes = {
  size: PropTypes.string,
  modalSubtitle: PropTypes.string,
  modalTitle: PropTypes.string,
  children: PropTypes.any,
  open: PropTypes.bool,
  footer: PropTypes.bool,
  toggle: PropTypes.func,
  isClose: PropTypes.bool,
}

export default DynamicModel
