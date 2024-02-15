import React, { lazy, useEffect, useState } from "react"
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  UncontrolledTooltip,
} from "reactstrap"
// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
import "../../../components/chat/style/datatables.scss"
import ChatLoader from "../../../components/chat/ChatLoader"
import {
  createOnevsOneChat,
  getAllAppointmentRequestById,
  getCasesByUserId,
} from "rainComputing/helpers/backend_helper"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import moment from "moment"
import { useChat } from "rainComputing/contextProviders/ChatProvider"
import { Link } from "react-router-dom"
import DynamicModel from "rainComputing/components/modals/DynamicModal"
import DynamicSuspense from "rainComputing/components/loader/DynamicSuspense"
import { initialNewCaseValues } from "rainComputing/helpers/initialFormValues"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import PropTypes from "prop-types"
const CreateCase = lazy(() =>
  import("rainComputing/components/chat/CreateCase")
)
const ReqUserAppointmentDetails = ({ refetch = false }) => {
  const { currentUser } = useUser()
  const [loading, setLoading] = useState(false)
  const { currentAttorney } = useUser()
  const [newCase, setNewCase] = useState(initialNewCaseValues)
  const [contacts, setContacts] = useState([])
  const [appointmentUser, setAppointmentUser] = useState([])
  const [caseLoading, setCaseLoading] = useState(true)
  const [currentCase, setCurrentCase] = useState(null)
  const [allCases, setAllCases] = useState([])
  const [casePage, setCasePage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [allgroups, setAllgroups] = useState([])
  const {
    toggleOpen: newCaseModelOpen,
    setToggleOpen: setNewCaseModelOpen,
    toggleIt: toggleNewCaseModelOpen,
  } = useToggle(false)
  const ongetAllCases = async ({ isSet = false, isSearch = false }) => {
    setCaseLoading(true)
    const allCasesRes = await getCasesByUserId({
      userId: currentUser.userID,
      page: isSearch ? 1 : casePage,
      searchText,
    })
    if (allCasesRes.success) {
      setAllCases(allCasesRes.cases)
      if (isSet) {
        setCurrentCase(allCasesRes?.cases[0])
      }
    } else {
      setAllCases([])
      setCurrentCase(null)
      setAllgroups(null)
    }
    setCaseLoading(false)
  }
  const idFormatter = (cell, row, rowIndex) => {
    return rowIndex + 1
  }
  const nameFormatter = (cell, row) => {
    return row?.User?.firstname + " " + row?.User?.lastname
  }
  const emailFormatter = (cell, row) => {
    return row?.User?.email
  }
  const statusFormatter = (cell, row) => {
    return row?.appointmentstatus
  }
  const dateFormatter = (cell, row) => {
    return moment(row?.updatedAt).format("DD-MM-YY HH:mm")
  }
  const handleAdd = (row) => {
    if (row?.appointmentstatus === "approved" ) {
      setNewCaseModelOpen(true);
    }
  };
  const columns = [
    {
      dataField: "_id",
      text: "S.NO",
      sort: true,
      formatter: idFormatter,
    },
    {
      dataField: "username",
      text: "User Name",
      sort: true,
      formatter: nameFormatter,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      formatter: emailFormatter,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      formatter: dateFormatter,
    },
   {
  dataField: "Create Case",
  //   isDummyField: true,
  text: "Create case",
  formatter: (cell, row) => {
    return (
      row?.appointmentstatus==="approved"?(
      <i
        className="mdi mdi-notebook-edit-outline text-info mdi-24px"
        title="Create case"
        id="create"
        
        onClick={() => handleAdd(row)}
      />
      ):(
        <>
        <i
        className="mdi  mdi-do-not-disturb-off text-danger mdi-24px"
        title="Rejected"
        id="rejected"
      />
        </>
        ))
    
  },
  headerAlign: "center",
  style: {
    textAlign: "center",
  },
},
,
  ]
  const defaultSorted = [
    {
      dataField: "_id",
      order: "desc",
    },
  ]
  const pageOptions = {
    sizePerPage: 5,
    totalSize: appointmentUser.filter(a => a?.appointmentstatus !== "requested")
      ?.length, // replace later with size(customers),
    custom: true,
  }
  //   const { SearchBar } = Search
  const onGetAllAppointmentDetails = async () => {
    const RequestRes = await getAllAppointmentRequestById({
      userID: currentAttorney._id,
    })
    if (RequestRes.success) {
      setAppointmentUser(RequestRes.appointment)
    } else {
      setAppointmentUser([])
    }
  }
  useEffect(() => {
    onGetAllAppointmentDetails()
  }, [currentAttorney])
  useEffect(() => {
    if (refetch) onGetAllAppointmentDetails()
  }, [refetch])
  return (
    <React.Fragment>
      <DynamicModel
          open={newCaseModelOpen}
          toggle={toggleNewCaseModelOpen}
          size="lg"
          modalTitle="New Case"
          footer={false}
        >
          <DynamicSuspense>
            <CreateCase
              formValues={newCase}
              setFormValues={setNewCase}
              contacts={contacts}
              setModalOpen={setNewCaseModelOpen}
              getAllCases={ongetAllCases}
            />
          </DynamicSuspense>
        </DynamicModel>
      {loading ? (
        <ChatLoader />
      ) : appointmentUser && appointmentUser.length > 0 ? (
        <div>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField="_id"
                    columns={columns}
                    data={appointmentUser.filter(
                      a => a?.appointmentstatus !== "requested"
                    )}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField="_id"
                        columns={columns}
                        data={appointmentUser.filter(
                          a => a?.appointmentstatus !== "requested"
                        )}
                      >
                        {toolkitProps => (
                          <React.Fragment>
                            <Row>
                              <Col xl="12">
                                <div className="table-responsive">
                                  <BootstrapTable
                                    keyField={"_id"}
                                    responsive
                                    bordered={false}
                                    striped={false}
                                    defaultSorted={defaultSorted}
                                    // selectRow={selectRow}
                                    classes={"table align-middle table-nowrap"}
                                    headerWrapperClasses={"thead-light"}
                                    {...toolkitProps.baseProps}
                                    {...paginationTableProps}
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row className="align-items-md-center mt-30">
                              <Col className="inner-custom-pagination d-flex">
                                <div className="d-inline">
                                  <SizePerPageDropdownStandalone
                                    {...paginationProps}
                                  />
                                </div>
                                <div className="text-md-right ms-auto">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </React.Fragment>
                        )}
                      </ToolkitProvider>
                    )}
                  </PaginationProvider>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <p className="text-center">You Don&apos;t have any Appointment User</p>
      )}
    </React.Fragment>
  )
}
ReqUserAppointmentDetails.propTypes = {
  refetch: PropTypes.bool,
}
export default ReqUserAppointmentDetails






