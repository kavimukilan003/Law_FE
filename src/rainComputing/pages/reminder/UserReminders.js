import DeleteModal from "components/Common/DeleteModal"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import {
  getAllReminders,
  removeReminder,
} from "rainComputing/helpers/backend_helper"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, Col, Container, Pagination, Row } from "reactstrap"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import toastr from "toastr"

const UserReminders = () => {
  const { currentUser } = useUser()
  const [pageLoader, setPageLoader] = useState(true)
  const [removeData, setRemoveData] = useState()
  const [getReminders, setGetReminders] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(9)
  const {
    toggleOpen: groupReminderDeleteModalOpen,
    setToggleOpen: setReminderDeleteModalOpen,
    toggleIt: togglegroupReminderDeleteModal,
  } = useToggle(false)
  useEffect(() => {
    const getAllReminderById = async () => {
      setPageLoader(true)
      if (currentUser) {
        const res = await getAllReminders(
          {
            currentUserID: currentUser?.userID,
          },
          page,
          limit
        )
        if (res.success) {
          setGetReminders(res?.reminders)
        }
      }
      setPageLoader(false)
    }
    getAllReminderById()
  }, [currentUser])

  const handleRemove = async () => {
    const payload = {
      reminderId: removeData?._id,
    }
    const res = await removeReminder(payload)
    if (res.success) {
      toastr.success(`You have reminder remove  successfully`, "Success")
      setGetReminders(prevState =>
        prevState.filter(reminder => reminder._id !== removeData._id)
      )
      setReminderDeleteModalOpen(false)
    }
  }
  const handleDelete = deleteRemind => {
    setRemoveData(deleteRemind)
    setReminderDeleteModalOpen(true)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={groupReminderDeleteModalOpen}
          onDeleteClick={handleRemove}
          confirmText="Yes,Remove"
          cancelText="Cancel"
          onCloseClick={togglegroupReminderDeleteModal}
        />
        {pageLoader ? (
          <Col xs="12">
            <div className="text-center my-3">
              <Link to="#" className="text-success">
                <i className="bx bx-hourglass bx-spin me-2" />
                Loading. . .
              </Link>
            </div>
          </Col>
        ) : (
          <>
            {getReminders?.length > 0 ? (
              <>
                <h5 className="text-primary">
                  Total Reminders :{getReminders?.length}
                </h5>
                <Row>
                  {getReminders
                    ?.sort(
                      (a, b) =>
                        new Date(b.scheduledTime) - new Date(a.scheduledTime)
                    )
                    .map((reminders, i) => (
                      <Col xl="4" md="6" sm="12" key={i}>
                        <Card
                          className="rounded-4"
                          style={{
                            height: "250px",
                            //   width: "400px",
                            overflowY: "auto",
                          }}
                        >
                          {" "}
                          <CardBody>
                            <div className="d-flex justify-content-end px-4">
                              {i === 0 ? (
                                <i className="fa fa-bell icon "></i>
                              ) : null}

                              <button
                                type="button"
                                className="close py-4"
                                data-dismiss="modal"
                                aria-label="Close"
                                style={{ width: "20px" }}
                                onClick={() => handleDelete(reminders)}
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div>
                              <div className=" d-flex px-4 pt-3">
                                <h6 className="mt-1 text-black-50 font-size-14 d-flex">
                                  Title :
                                  <p className="text-black px-2">
                                    {reminders?.title}
                                  </p>
                                </h6>
                              </div>
                              <div className=" d-flex px-4">
                                {reminders?.messageId?.messageData && (
                                  <h6 className=" text-black-50 font-size-14 d-flex">
                                    Message Data :
                                    <p className="text-black px-2">
                                      {reminders?.messageId?.messageData}
                                    </p>
                                  </h6>
                                )}
                              </div>
                              <div className="px-4 d-flex">
                                <div>
                                  <h6 className="text-black-50  font-size-14 d-flex">
                                    Date & Time :
                                    <p className="text-primary px-1">
                                      {reminders?.scheduledTime}
                                    </p>
                                  </h6>
                                  <ul className="list-inline mb-0">
                                    <li className=" font-size-14">
                                      <div className=""></div>
                                    </li>
                                  </ul>{" "}
                                  {reminders?.selectedMembers?.map(
                                    (members, i) => (
                                      <div
                                        className="list-inline mb-0 "
                                        key={i}
                                      >
                                        <h6 className="mt-1 text-black-50 font-size-14 d-flex ">
                                          {" "}
                                          Selected Member :
                                          <p className="text-primary px-2">
                                            {members?.id?.firstname}{" "}
                                            {members?.id?.lastname}
                                          </p>
                                        </h6>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                </Row>
                <div className="d-flex justify-content-center">
                  <Pagination
                    className="pagination-bar"
                    currentPage={page}
                    totalCount={getReminders?.length}
                    pageSize={limit}
                    onPageChange={p => setPage(p)}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-center">You Don&apos;t have any Reminders</p>
              </>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default UserReminders
