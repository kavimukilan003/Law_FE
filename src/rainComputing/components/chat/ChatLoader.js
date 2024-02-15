import React from "react"
import { Card, CardBody, CardText } from "reactstrap"

const ChatLoader = () => {
  return (
    <Card className="p-5">
      <CardBody>
        <div className="d-flex align-items-center flex-column ">
          <div className="spinner-grow text-primary m-1"></div>
          <span className="text-center">Loading ...</span>
        </div>
      </CardBody>
    </Card>
  )
}

export default ChatLoader
