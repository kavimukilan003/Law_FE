import React, { useEffect, useState } from "react"
import { Row, Col, Card, CardBody, Button } from "reactstrap"
import { Link } from "react-router-dom"
// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider from "react-bootstrap-table2-toolkit"
//Import Breadcrumb
import "../../../components/chat/style/datatables.scss"
import ChatLoader from "../../../components/chat/ChatLoader"
import { allPaymentData } from "rainComputing/helpers/backend_helper"
import moment from "moment"

const PaymentTranaction = () => {
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState([])

  const idFormatter = (cell, row, rowIndex) => {
    return rowIndex + 1
  }
  const consumerFormatter = (cell, row) => {
    return row?.consumerId?.firstname +" "+ row?.consumerId?.lastname
  }
  const attorneyFormatter = (cell, row) => {
    return row?.attorneyId?.regUser?.firstname +" "+row?.attorneyId?.regUser?.lastname
  }
  const paymentFormatter = (cell, row) => {
    return row?.payAmount
  }
  const paymentstatusFormatter = (cell, row) => {
    return (
      <span className={`label ${row?.paymentStatus ? "text-success" : "text-danger"}`}>
        {row?.paymentStatus ? "Succeeded" : "Failed"}
      </span>
    )
  }
  const transactionidFormatter = (cell, row) => {
    return row?.transactionId
  }
  const dateFormatter = (cell, row) => {
    return  moment(row?.createdAt).format("DD-MM-YY HH:mm")
  }

  const columns = [
    {
      dataField: "_id",
      text: "S.NO",
      sort: true,
      formatter: idFormatter,
    },
    {
      dataField: "consumer",
      text: "Consumer",
      sort: true,
      formatter: consumerFormatter,
    },
    {
      dataField: "attorney",
      text: "Attorney",
      sort: true,
      formatter: attorneyFormatter,
    },
    {
      dataField: "payment",
      text: "Payment",
      sort: true,
      formatter: paymentFormatter,
    },
    {
      dataField: " paymentstatus",
      text: "Status",
      sort: true,
      formatter: paymentstatusFormatter,
    },
    {
      dataField: "transactionid",
      text: "Transaction Id",
      sort: true,
      formatter: transactionidFormatter,
    },
    {
      dataField: "date",
      text: "Date",
      sort: true,
      formatter: dateFormatter,
    },
  ]

  const defaultSorted = [
    {
      dataField: "_id",
      order: "desc",
    },
  ]

  const pageOptions = {
    sizePerPage: 5,
    totalSize: paymentData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: "5", value: 5 },
    { text: "10", value: 10 },
    { text: "15", value: 15 },
    { text: "20", value: 20 },
    { text: "25", value: 25 },
    { text: "All", value: paymentData.length },
  ]

//   const { SearchBar } = Search

  const getAllPaymentData = async () => {
    setLoading(true)
    const res = await allPaymentData({})
    if (res.success) {
      setPaymentData(res.paymentIntent)
    }
    setLoading(false)
  }

  useEffect(() => {
    getAllPaymentData()
  }, [])

  return (
    <React.Fragment>
        {loading ? (
          <ChatLoader />
        ) : paymentData && paymentData.length > 0 ? (
            <Card>
              <CardBody>
                <div className="mb-4 h4 card-title">Latest Transaction</div>
                <PaginationProvider
                  pagination={paginationFactory(pageOptions)}
                  keyField="_id"
                  columns={columns}
                  data={paymentData}
                >
                  {({ paginationProps, paginationTableProps }) => (
                    <ToolkitProvider
                      keyField="_id"
                      columns={columns}
                      data={paymentData}
                    >
                      {toolkitProps => (
                        <React.Fragment>
                          {/* <Row className="mb-2">
                            <Col md="4">
                              <div className="search-box me-2 mb-2 d-inline-block">
                                <div className="position-relative">
                                  <SearchBar {...toolkitProps.searchProps} />
                                  <i className="bx bx-search-alt search-icon" />
                                </div>
                              </div>
                            </Col>
                          </Row> */}

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
        ) : (
          <p className="text-center">You Don&apos;t have any Transaction</p>
        )}
    </React.Fragment>
  )
}

export default PaymentTranaction
