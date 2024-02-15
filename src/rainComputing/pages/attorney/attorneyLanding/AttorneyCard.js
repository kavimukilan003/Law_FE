import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import PropTypes from "prop-types"
//Import Images
import error from "assets/images/error-img.png"

const AttorneyCard = ({status}) => {
  const  handleStatus = {
    requested:"Your registration is under process",
    rejected:"You registeration process was rejected",
    default:""
  }
  return (
    <Container fluid>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <h4 className="text-uppercase">{handleStatus[status] || handleStatus['default']}</h4>
                <div className="mt-5 text-center">
                  <Link 
                    role="button"
                    to="#"
                  >
                   <u>View Status</u> 
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md="6" xl="4">
              <div>
                <img src={error} alt="" className="img-fluid" />
              </div>
            </Col>
          </Row>
        </Container>
  )
}
AttorneyCard.propTypes = {
  status: PropTypes.any,
}
export default AttorneyCard