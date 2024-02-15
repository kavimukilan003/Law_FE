import PropTypes from "prop-types"
import React from "react"
import { Col, Modal, ModalBody, Row } from "reactstrap"

const DeleteModal = ({
  show,
  onDeleteClick,
  onCloseClick,
}) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true} size="sm" >
      <ModalBody className="py-3 px-2">
        <Row>

          <div className=" col-3 pt-2 px-2 d-flex justify-content-center">
            <i
              className="bi bi-exclamation-triangle px-2 "
              style={{ fontSize: "40px  ", color: "red" }}
            />
          </div>
          <div className=" col-9 pt-3 px-2 ">
            <h5 className="black">Are you sure?</h5>
            <p className="black">{"You won't be able to revert this !"}</p>
          </div>
        </Row>
        <Row>
          <div className="d-flex justify-content-end py-1 px-3">
            <i
              className=" btn-lg ms-2  bi bi-trash"
              style={{ fontSize: "20px", color: "green", cursor: "pointer" }}
              onClick={onDeleteClick}
            ></i>
            <br />
            <i
              className=" btn-lg ms-2 bi bi-x-circle"
              style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
              onClick={onCloseClick}
            ></i>
          </div>

        </Row>
      </ModalBody>
    </Modal>
  )
}

DeleteModal.propTypes = {
  onCloseClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  show: PropTypes.any,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
}

export default DeleteModal
