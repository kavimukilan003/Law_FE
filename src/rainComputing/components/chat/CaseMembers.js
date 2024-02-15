import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Card, CardBody, CardImg, CardText, CardTitle } from "reactstrap"
import profile from "assets/images/avatar-defult.jpg"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import { addAdmin, removeAdmin } from "rainComputing/helpers/backend_helper"
import toastr from "toastr"
import { useToggle } from "rainComputing/helpers/hooks/useToggle"
import AddModal from "../modals/AddModel"
import RemoveModal from "../modals/RemoveModel"

const CaseMembers = ({ members, admins, caseId }) => {
  const { currentUser } = useUser()
  const [addAdmins, setAddAdmin] = useState([])
  const [removeAdmins, setRemoveAdmin] = useState([])
  const [caseAdmins, setCaseAdmins] = useState(admins)
  toastr.options = {
    progressBar: true,
    closeButton: true,
  }

  const onAddingAdmin = async () => {
    const payload = {
      caseId,
      admin: addAdmins,
    }
    const res = await addAdmin(payload)
    if (res.success) {
      toastr.success(`You have added an admin successfully`, "Success")
      setAddAdmin([])
      setModelOpen(false)
      setCaseAdmins([...caseAdmins, addAdmins])
    }
  }

  const onRemovingAdmin = async () => {
    const payload = {
      caseId,
      admin: removeAdmins,
    }
    const res = await removeAdmin(payload)
    if (res.success) {
      toastr.success(`You have remove an admin successfully`, "Success")
      setRemoveAdmin([])
      setModelOpen1(false)
      const newAdmins = caseAdmins.filter(admin => admin !== removeAdmins)
      setCaseAdmins(newAdmins)
    }
  }
  const {
    toggleOpen: modelOpen,
    setToggleOpen: setModelOpen,
    toggleIt: toggleAddModelOpen,
  } = useToggle(false)
  const {
    toggleOpen: modelOpen1,
    setToggleOpen: setModelOpen1,
    toggleIt: toggleRemoveModelOpen,
  } = useToggle(false)

  const handleAdd = () => {
    onAddingAdmin(addAdmins)
    setModelOpen(true)
  }
  const handleRemove = () => {
    onRemovingAdmin(removeAdmins)
    setModelOpen1(true)
  }
  const MembersCard = ({ member }) => (
    <Card className="pointer member-card ">
      <CardImg
        top
        className="avatar-lg  align-self-center rounded-circle "
        src={member?.id?.profilePic ? member?.id?.profilePic : profile}
        alt="members"
        style={{ objectFit: "cover" }}
      />
      <CardBody className="text-center px-4 text-nowrap ">
        <CardTitle className="mt-0">
          {member?.id?.firstname} {member?.id?.lastname}
        </CardTitle>
        <CardText className="my-1">{member?.id?.email}</CardText>
        <CardText className="m-0">Rain Computing</CardText>
        {member?.id?.attorneyStatus ? (
          <CardText className="text-primary fw-semibold">Attorney</CardText>
          ):(
            <CardText><br/></CardText>
          )
        }
        <CardText className="text-muted">
          Added by{" "}
          {member?.addedBy?._id === currentUser?.userID
            ? "You"
            : member?.addedBy?.firstname + " " + member?.addedBy?.lastname}
        </CardText>
      </CardBody>
    </Card>
  )

  return (
    <>
      <AddModal
        size="md"
        open={modelOpen}
        toggle={toggleAddModelOpen}
        isClose={true}
        AddClick={handleAdd}
        // children={"You want to create an admin?"}
      />
      <RemoveModal
        size="md"
        open={modelOpen1}
        toggle={toggleRemoveModelOpen}
        isClose={true}
        RemoveClick={handleRemove}
      />
      <div
        className="mt-5 d-flex gap-5 p-2 custom-scrollbar"
        style={{ overflowX: "auto" }}
      >
        {members.map((member, m) => (
          <div key={m} className="position-relative " style={{ width: 240 }}>
            <MembersCard member={member} />
            {admins?.includes(currentUser?.userID) &&
            !caseAdmins?.includes(member?.id?._id) ? (
              <span
                style={{ position: "absolute", top: 10, right: 10 }}
                onClick={() => {
                  setAddAdmin(member?.id?._id)
                  setModelOpen(true)
                }}
              >
                <i
                  className="bx bx-plus bg-danger font-size-16 rounded-circle text-white fw-medium "
                  id="Admin"
                  title="Make an admin"
                  style={{cursor:"pointer"}}
                />
              </span>
            ) : (
              <>
                {admins?.includes(currentUser?.userID) &&
                  caseAdmins?.includes(member?.id?._id) &&
                  member?.id?._id !== caseAdmins[0] &&
                  member?.id?._id !== currentUser.userID && (
                    <span
                      style={{ position: "absolute", top: 10, right: 10 }}
                      onClick={() => {
                        setRemoveAdmin(member?.id?._id)
                        setModelOpen1(true)
                      }}
                    >
                      <i className="bx bx-minus bg-danger font-size-16 rounded-circle text-white fw-medium" title="Remove an Admin" style={{cursor:"pointer"}} />
                    </span>
                  )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

CaseMembers.propTypes = {
  members: PropTypes.array,
  admins: PropTypes.array,
  member: PropTypes.object,
  caseId: PropTypes.string,
}

export default CaseMembers
