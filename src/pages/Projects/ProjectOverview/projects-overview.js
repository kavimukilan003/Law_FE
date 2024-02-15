import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link, useLocation, withRouter } from "react-router-dom"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import ProjectDetail from "./projectDetail"
import { regAttorneyDetails } from "rainComputing/helpers/backend_helper"

function useQuery() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}
const ProjectsOverview = props => {
  const [loading, setLoading] = useState(true)
  const [attorneyDetails,setAttorneyDetail] = useState({})
  let query = useQuery()

    const getAttorneyinfo = async () => {
      setLoading(true)
      const res = await regAttorneyDetails({id:query.get("uid")})
      if (res) {
        setAttorneyDetail(res.attorney)
      setLoading(false)
    }
  }
  useEffect(() =>{
    getAttorneyinfo()
  },[])

  return (
    <React.Fragment>
    
      <div className="py-5 my-5">
      {loading ? (
              <Row>
                <Col xs="12">
                  <div className="text-center my-3">
                    <Link to="#" className="text-success">
                      <i className="bx bx-hourglass bx-spin me-2" />
                      Loading. . .
                    </Link>
                  </div>
                </Col>
              </Row>
            ) : (
        <Container fluid>
          {/* Render Breadcrumbs */}
          {/* <Breadcrumbs title="Projects" breadcrumbItem="Project Overview" /> */}
          {!isEmpty(attorneyDetails) && (
            <>
              <Row>
                <Col>
                  <ProjectDetail project={attorneyDetails} />
                </Col>

                
                {/* <Col lg="4">
                  <TeamMembers team={projectDetail.team} />
                </Col> */}
              </Row>
              <Row>
                {/* <Col lg="4">
                  <OverviewChart options={options} series={series} />
                </Col> */}
                {/* <Col lg="4">
                  <AttachedFiles files={projectDetail.files} />
                </Col> */}
                {/* <Col lg="4">
                  <Comments comments={projectDetail.comments} />
                </Col> */}
              </Row>
             
            </>
          )}
        </Container>
        )}
      </div>

    </React.Fragment>
  )
}
ProjectsOverview.propTypes = {
  match: PropTypes.object,
}
export default withRouter(ProjectsOverview)
