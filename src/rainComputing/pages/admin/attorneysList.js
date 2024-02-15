import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button } from "reactstrap"
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"
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
import { allAttorneysList } from "rainComputing/helpers/backend_helper"

const AttorneyList = () => {
  const [loading, setLoading] = useState(false)
  const [attorneyData, setAttorneyData] = useState([])

  const idFormatter = (cell, row, rowIndex) => {
    return rowIndex + 1
  }

  const nameFormatter = (cell, row) => {
    return row?.regUser?.firstname + " " + row?.regUser?.lastname
  }

  const barNumberFormatter = (cell, row) => {
    return row?.barNumber
  }

  const emailFormatter = (cell, row) => {
    return row?.regUser?.email
  }

  const statusFormatter = (cell, row) => {
    return (
      <span
        className={`label ${
          row?.regUser?.aflag ? "text-success" : "text-danger"
        }`}
      >
        {row?.aflag ? "Active" : "DeActive"}
      </span>
    )
  }

  const detailsFormatter = (cell, row) => {
    return (
      <Link to={`/attorney-Detail?id=${row?.regUser?._id}`}>
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
      dataField: "name",
      text: "Name",
      sort: true,
      formatter: nameFormatter,
    },
    {
      dataField: "barNumber",
      text: "Bar Number",
      sort: true,
      formatter: barNumberFormatter,
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
    totalSize: attorneyData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: "5", value: 5 },
    { text: "10", value: 10 },
    { text: "15", value: 15 },
    { text: "20", value: 20 },
    { text: "25", value: 25 },
    { text: "All", value: attorneyData.length },
  ]

  const { SearchBar } = Search

  const getAllAttorneys = async () => {
    setLoading(true)
    const res = await allAttorneysList({})
    if (res.success) {
      setAttorneyData(res.attorneys)
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllAttorneys()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Attorney List | RainComputing </title>
        </MetaTags>
        {loading ? (
          <ChatLoader />
        ) : attorneyData && attorneyData.length > 0 ? (
          <div className="container-fluid">
            <Link to="/admin-page">
              <Breadcrumbs title="Admin" breadcrumbItem="Attorney List" />
            </Link>
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="_id"
                      columns={columns}
                      data={attorneyData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="_id"
                          columns={columns}
                          data={attorneyData}
                          search={{
                            searchFormatted: true,
                          }}
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
          <p className="text-center">You Don&apos;t have any Attorney</p>
        )}
      </div>
    </React.Fragment>
  )
}

export default AttorneyList
