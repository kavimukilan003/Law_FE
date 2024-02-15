import React, { lazy, useState } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import PropTypes from "prop-types"
import { Card, CardBody, CardTitle } from "reactstrap"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import DynamicSuspense from "../loader/DynamicSuspense"
const CreateSubGroup = lazy(() => import("./CreateSubGroup"))
const EditSubGroup = lazy(() => import("./EditSubGroup"))

const SubGroups = ({ groups, caseMembers, currentCaseId, getSubGroups }) => {
  const {
    toggleOpen: createSubGroupModelOpen,
    setToggleOpen: setCreateSubGroupModelOpen,
    toggleIt: toggleCreateSubGroupModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: updateSubGroupModelOpen,
    setToggleOpen: setUpdateSubGroupModelOpen,
    toggleIt: toggleUpdateSubGroupModelOpen,
  } = useToggle(false)

  const [clickedSubGroup, setClickedSubGroup] = useState(null)

  return (
    <>
      <DynamicSuspense>
        <CreateSubGroup
          open={createSubGroupModelOpen}
          setOpen={setCreateSubGroupModelOpen}
          toggleOpen={toggleCreateSubGroupModelOpen}
          caseMembers={caseMembers}
          caseId={currentCaseId}
          getSubGroups={getSubGroups}
        />
        {clickedSubGroup && (
          <EditSubGroup
            open={updateSubGroupModelOpen}
            setOpen={setUpdateSubGroupModelOpen}
            toggleOpen={toggleUpdateSubGroupModelOpen}
            caseMembers={caseMembers}
            getSubGroups={getSubGroups}
            subGroup={clickedSubGroup}
            resetSubGroup={setClickedSubGroup}
          />
        )}
      </DynamicSuspense>

      <div
        className="mt-1 d-flex gap-5 p-2 custom-scrollbar"
        style={{ overflowX: "auto" }}
      >
        {groups &&
          groups.map((sub, i) => (
            <Card
              key={i}
              className="rounded text-nowrap"
              style={{ minWidth: 220 }}
            >
              <CardTitle
                className="text-white px-2 pt-3 pb-2 pointer"
                style={{ backgroundColor: sub?.color || "#0000FF" }}
                onClick={() => {
                  setClickedSubGroup(sub), setUpdateSubGroupModelOpen(true)
                }}
              >
                {sub.groupName}
                <i className="bx bx-pencil font-size-14 align-middle mx-2"></i>
              </CardTitle>
              <CardBody className="p-2 my-2 text-nowrap">
                <PerfectScrollbar style={{ height: 180 }}>
                  {sub?.groupMembers &&
                    sub?.groupMembers.map((members, m) => (
                      <p key={m}>
                        {members?.id?.firstname + " " + members?.id?.lastname}
                      </p>
                    ))}
                </PerfectScrollbar>
              </CardBody>
            </Card>
          ))}
        <Card
          className="rounded border border-light d-flex flex-column text-black-50 justify-content-center align-items-center"
          style={{ minWidth: 220 }}
        >
          <i
            className="mdi mdi-plus-circle-outline mdi-48px pointer"
            onClick={() => {
              setCreateSubGroupModelOpen(true)
            }}
          />
        </Card>
      </div>
    </>
  )
}

SubGroups.propTypes = {
  groups: PropTypes.array,
  caseMembers: PropTypes.array,
  currentCaseId: PropTypes.any,
  getSubGroups: PropTypes.any,
}

export default SubGroups
