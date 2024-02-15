import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap"
import classnames from "classnames"
import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumbs from "../../../../components/Common/Breadcrumb"
//Import images
import paymentImg from "../../../../assets/images/paymentsuccess.png"
import { useHistory } from "react-router-dom"
import { getPaymentId } from "rainComputing/helpers/backend_helper"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"
import { useStripe } from "@stripe/react-stripe-js"

const PaymentStatus = () => {
  const history = useHistory()
  let query = useQuery()
  const stripe = useStripe()
  const [message, setMessage] = useState(null)

  const handleClick = () => {
    history.push("/appointment-status")
  }
  useEffect(() => {
    if (!stripe) {
      return
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    )

    if (!clientSecret) {
      return
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!")
          break
        case "processing":
          setMessage("Your payment is processing.")
          break
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.")
          break
        default:
          setMessage("Something went wrong.")
          break
      }
    })
  }, [stripe])

  useEffect(() => {
    const getUserPaymentData = async () => {
      const res = await getPaymentId({ pi: query.get("payment_intent") })
    }
    getUserPaymentData()
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Status | RainComputing</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs title="Rain" breadcrumbItem="Payment Successfully" /> */}

          <Row className="justify-content-center">
            <Col xl="5" sm="8">
              <Card>
                <CardBody>
                  <div className="text-center">
                    <Row className="justify-content-center">
                      <Col lg="10">
                        <h4 className="mt-4 font-weight-semibold">
                          Thank You For Your Payment !
                        </h4>
                        <h7 className="text-primary">
                          Transaction ID {query.get("payment_intent")}
                        </h7>
                        <p className="text-muted mt-3">
                          Your payment is successful ! Attorney{" "}
                          <p className="text-primary">
                            {"Hsuanyeh Chang, PhD, Esq."}
                          </p>
                          will Review Your Case and Get Back To You.
                        </p>

                        <div className="mt-4">
                          {/* button triggers modal */}
                          <Button
                            type="button"
                            color="primary"
                            onClick={handleClick}
                          >
                            View Status
                          </Button>
                        </div>
                      </Col>
                    </Row>

                    <Row className="justify-content-center mt-1 mb-2">
                      <Col sm="6" xs="8">
                        <div>
                          <img src={paymentImg} alt="" className="img-fluid" />
                        </div>
                      </Col>
                    </Row>
                    <Row className="justify-content-center mb-2">
                      <Col sm="6" xs="8">
                        <div>
                          {message && <div id="payment-message">{message}</div>}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PaymentStatus
