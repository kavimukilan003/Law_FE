import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button } from "reactstrap"
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb"
import "../../components/chat/style/datatables.scss"
import ChatLoader from "../../components/chat/ChatLoader"
import { allUsersList } from "rainComputing/helpers/backend_helper"

const UserList = userId => {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState([])

  const idFormatter = (cell, row, rowIndex) => {
    return rowIndex + 1
  }
  const firstnameFormatter = (cell, row) => {
    return row?.firstname
  }
  const lastnameFormatter = (cell, row) => {
    return row?.lastname
  }
  const emailFormatter = (cell, row) => {
    return row?.email
  }
  const statusFormatter = (cell, row) => {
    return (
      <span className={`label ${row?.aflag ? "text-success" : "text-danger"}`}>
        {row?.aflag ? "Active" : "DeActive"}
      </span>
    )
  }
  const detailsFormatter = (cell, row) => {
    return (
      <Link to={`/user-Detail?id=${row?._id}`}>
        <button type="button" className="btn btn-primary">
          View
        </button>
      </Link>
    )
  }

  const columns = [
    {
      dataField: "_id",
      text: "S.NO",
      sort: true,
      formatter: idFormatter,
    },
    {
      dataField: "firstname",
      text: "First Name",
      sort: true,
      formatter: firstnameFormatter,
    },
    {
      dataField: "lastname",
      text: "Last Name",
      sort: true,
      formatter: lastnameFormatter,
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
      dataField: "details",
      text: "Details",
      sort: true,
      formatter: detailsFormatter,
    },
  ]

  const defaultSorted = [
    {
      dataField: "_id",
      order: "asc",
    },
  ]

  const pageOptions = {
    sizePerPage: 5,
    totalSize: userData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: "5", value: 5 },
    { text: "10", value: 10 },
    { text: "15", value: 15 },
    { text: "20", value: 20 },
    { text: "25", value: 25 },
    { text: "All", value: userData.length },
  ]

  const { SearchBar } = Search

  const getAllUsers = async () => {
    setLoading(true)
    const res = await allUsersList({})
    if (res.success) {
      setUserData(res.users)
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>User List | RainComputing </title>
        </MetaTags>
        {loading ? (
          <ChatLoader />
        ) : userData && userData.length > 0 ? (
          <div className="container-fluid">
            <Link to="/admin-page">
              <Breadcrumbs title="Admin" breadcrumbItem="Users List" />
            </Link>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="_id"
                      columns={columns}
                      data={userData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          columns={columns}
                          data={userData}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitProps.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row>

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
                                      classes={
                                        "table align-middle table-nowrap"
                                      }
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
          <p className="text-center">You Don&apos;t have any Users</p>
        )}
      </div>
    </React.Fragment>
  )
}

UserList.propTypes = {
  userId: PropTypes.string,
}
export default UserList
