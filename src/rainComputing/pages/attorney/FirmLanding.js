import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import FirmCard from "./firmLanding/FirmCard"
import FirmCardWithImage from "./firmLanding/FirmCardWithImage"
import { getFirmsByAttorneyID } from "rainComputing/helpers/backend_helper"

const FirmLanding = () => {
  const { currentAttorney } = useUser()
  const [firms, setFirms] = useState([])
  const [myFirm, setMyFirm] = useState(null)

  useEffect(() => {
    const handleFetchingFirms = async () => {
      const res = await getFirmsByAttorneyID({
        attorneyId: currentAttorney._id,
      })
      if (res.success) {
        setFirms(res.firms)
        const attFirm = res.firms.filter(
          f => f.attorneyId === currentAttorney._id
        )
        if (attFirm.length > 0) {
          setMyFirm(attFirm[0])
        }
      } else {
        console.log("Error in fetching firms: ", res)
      }
    }

    handleFetchingFirms()
    return () => {}
  }, [currentAttorney])

  return (
    <div className="page-content ">
      <Container fluid>
        <Row sm="1" lg="2" className="justify-content-center">
          <Col sm="9" lg="5">
            <FirmCardWithImage
              image={""}
              firstname={currentAttorney?.regUser?.firstname}
              lastname={currentAttorney?.regUser?.lastname}
              email={currentAttorney?.regUser?.email}
            />
            {myFirm ? (
              <FirmCard
                firmid={myFirm?._id}
                firmname={myFirm?.firmName}
                isMyFirm
                membersCount={myFirm?.members?.length}
              />
            ) : (
              <Card>
                <CardBody>
                  <CardTitle className="mt-0">Create Firm</CardTitle>
                  <CardText>
                    You Are Not Having Firm Account So Please Create A Firm
                  </CardText>
                  <Link to="/firmcreate">
                    <Button color="info" type="submit">
                      Create Firm
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            )}
          </Col>
          <Col sm="9" lg="7">
            <Row className="align-items-center">
              {firms
                .filter(f => f.attorneyId !== currentAttorney._id)
                .map(i => (
                  <Col md="6" key={i}>
                    <FirmCard
                      firmid={i?._id}
                      firmname={i.firmName}
                      membersCount={i.members.length}
                    />
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FirmLanding
