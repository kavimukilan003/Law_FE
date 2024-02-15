import React, { useState, useEffect } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Table,
  Modal,
} from "reactstrap"
import { useQuery } from "rainComputing/helpers/hooks/useQuery"
import {
    getCasesByUserId,
    getGroupsByUserIdandCaseId,
  } from "rainComputing/helpers/backend_helper"

const CaseGroupDetails = () => {

    const query = useQuery()
    const [casesById, setCasesById] = useState([])
    const [currentCase, setCurrentCase] = useState([])
    const [subGroupsById, setSubGroupsById] = useState([])

    const getAllCases = async () => {
        const res = await getCasesByUserId({
          userId: query.get("id"),
        })
        if (res.success) {
          setCasesById(res.cases)
          setCurrentCase(res?.cases)
        }
      }
   
    const getAllSubGroups = async () => {
      const payLoad = {
        caseId: casesById._id,
        userId: query.get("id"),
      }
      const allSubGroupres = await getGroupsByUserIdandCaseId(payLoad)
      if (allSubGroupres.success){
        setSubGroupsById(allSubGroupres.groups)
      }
    }

    useEffect(() => {
        getAllCases()
        },[])
        
    useEffect(()=>{
      getAllSubGroups()
    },[])

  return (
    <React.Fragment>
      <div>
        <Container fluid>
              <h4 className="card-title mb-4">Case Details</h4>
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Col>
                        <div className="table-responsive">
                          <Table className="table table-striped mb-0">
                            <thead>
                              <tr>
                                <th scope="col">S No</th>
                                <th scope="col">Cases</th>
                                <th scope="col">Sub Groups</th>
                              </tr>
                            </thead>
                            <tbody>
                                {casesById?.map((cg,j) => (
                                  <tr key={j}>
                                    <td> {j+1} </td>
                                    <td>  {cg?.caseName}{"  "} {cg?.caseId}</td>
                                    <td> </td>
                                  </tr>
                                  ))}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default CaseGroupDetails
