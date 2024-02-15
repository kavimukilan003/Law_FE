import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap"
import DefaultAvatar from "assets/images/avatar-defult.jpg"

const FirmCardWithImage = ({ image, firstname, lastname, email }) => {
  return (
    <Card>
      <Row className="no-gutters align-items-center">
        <Col xs={4}>
          <CardImg className="img-fluid" src={DefaultAvatar} alt="Profile" />
        </Col>
        <Col xs={8}>
          <CardBody>
            <CardTitle>
              {firstname} {lastname}
            </CardTitle>

            <CardText>
              <small className="text-muted">{email}</small>
            </CardText>
            <CardText>
              Success is nothing more than a few simple disciplines, practiced
              every day.
            </CardText>
          </CardBody>
        </Col>
      </Row>
    </Card>
  )
}

FirmCardWithImage.propTypes = {
  image: PropTypes.any,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  email: PropTypes.string,
}

export default FirmCardWithImage
