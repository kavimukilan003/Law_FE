import React from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Button,
    Label,
    Input,
    Form,
    FormGroup,
    FormFeedback,
} from "reactstrap"
import { useHistory } from "react-router-dom"
import { useUser } from 'rainComputing/contextProviders/UserProvider'


const PremiumPage = () => {
    const { currentAttorney } = useUser()
    console.log("currentAttorney", currentAttorney)
    const history = useHistory()

    const handleCancelClick = () => {
        history.push("/")
    }
    const user = currentAttorney?.userID
    const handlePaymentClick = () => {
        history.push(`/payment-page`)
    }

    return (
        <div className="page-content">
            <Container fluid>
                <div>
                    <Row>
                        <Col lg="10">
                            <Card>
                                <CardBody>
                                    <div>
                                        <Row>
                                            <h1 className="d-flex justify-content-center text-primary-emphasis">Premium Attorney</h1>
                                        </Row>
                                        <Row>
                                            <h2 className="d-flex justify-content-center text-warning">$500</h2>
                                        </Row>
                                        <Row >
                                            <h3 className="d-flex justify-content-center text-primary-emphasis">Features</h3>
                                            <div className="d-flex justify-content-center">
                                                <ul>
                                                    <li className='text-secondary'>SubDomain</li>
                                                    <li className='text-secondary'>Chat</li>
                                                    <li className='text-secondary'>Case Creation</li>
                                                    <li className='text-secondary'>Docket System</li>
                                                </ul>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="modal-footer d-flex justify-content-center">
                                                <Button
                                                    type="button"
                                                    color="primary"
                                                    className="btn btn-primary ms-3 w-lg "
                                                    onClick={() => handlePaymentClick()}
                                                >
                                                    Buy Now
                                                </Button>

                                                <Button
                                                    type="button"
                                                    className="btn btn-danger ms-3 w-lg"
                                                    onClick={() => handleCancelClick()}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </Row>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default PremiumPage