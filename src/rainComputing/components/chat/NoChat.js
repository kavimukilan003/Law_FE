import React from "react"
import { Card, CardBody, CardText } from "reactstrap"

const NoChat = () => {
  return (
    <Card className="p-5">
      <CardBody>
        <CardText className="d-flex align-items-center flex-column ">
          <i className="mdi mdi-facebook-messenger mdi-48px text-primary" />
          <span className="text-center">
            Please choose any contact or create case to start your chat
            experience
          </span>
        </CardText>
      </CardBody>
    </Card>
  )
}

export default NoChat
