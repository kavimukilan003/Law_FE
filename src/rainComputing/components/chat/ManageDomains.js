import React, { useEffect, useState } from "react"
import "toastr/build/toastr.min.css"
import toastr from "toastr"
import { useUser } from "rainComputing/contextProviders/UserProvider"
import {
  createDomains,
  updateDomains,
  deleteDomains,
} from "rainComputing/helpers/backend_helper"

const ManageDomains = () => {
  const user = localStorage.getItem("authUser")
  const { currentUser, setCurrentUser } = useUser(user)
  const [domainsname, setDomainsName] = useState([])
  const [alldomains, setAlldomains] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [hasUpdateChanges, setHasUpdateChanges] = useState(false)

  const isAddButtonEnabled = domainsname.some(domain => domain.trim() !== '');
  // const isUpdateButtonEnabled = hasUnsavedChanges;
useEffect(()=>{
  if(isAddButtonEnabled){
    setHasUnsavedChanges(true)
  }else{
    setHasUnsavedChanges(false)
  }
},[isAddButtonEnabled])
  useEffect(() => {
    setAlldomains(currentUser?.domains)
    setHasUnsavedChanges(false) // Reset unsaved changes flag when data is updated
  }, [currentUser])

  const handleIconClick = () => {
    setDomainsName(prevInputs => [...prevInputs, ""]);
    setHasUnsavedChanges(true);
  };
useEffect(()=>{
  setDomainsName(prevInputs => [...prevInputs, ""])

},[])
const handleEventTextChange = (index, value) => {
  // Validate the length before updating the state
  if (value.length > 50) {
    toastr.error('Domain name must be 50 characters or less',);
    return;
  }

  setDomainsName(prevInputs => {
    const newEventsTexts = [...prevInputs];
    newEventsTexts[index] = value;
    
    return newEventsTexts;
  });
};


  const handleRemoveField = index => {
    setDomainsName(prevInputs => {
      const newInputs = [...prevInputs]
      newInputs.splice(index, 1)
      setHasUnsavedChanges(true)
      return newInputs
    })
  }

  const handleSubmit = async () => {
    const payload = {
      email: currentUser?.email,
      domains: domainsname,
    }
    const res = await createDomains(payload)
    if (res.success) {
      setDomainsName([""])
      localStorage.setItem("authUser", JSON.stringify(res))
      setCurrentUser(res)
      setHasUnsavedChanges(false)
      toastr.success("Domains have been created successfully", "Success!!!")
    }
  }

  const handleChange = (index, value) => {
    const updatedDomains = [...alldomains]
    updatedDomains[index].name = value
    setAlldomains(updatedDomains)
    setHasUpdateChanges(true)
  }

  const handleUpdate = async () => {
    const payload = {
      email: currentUser?.email,
      domains: alldomains,
    }
    const res = await updateDomains(payload)
    if (res.success) {
      localStorage.setItem("authUser", JSON.stringify(res))
      setCurrentUser(res)
      setHasUnsavedChanges(false)
      toastr.success("Domains have been updated successfully", "Success!!!")
    }
  }

  const handleRemoveDomains = async (domainId, index) => {
    const deldomain = alldomains.filter(domain => domain._id === domainId)
    try {
      const payload = {
        email: currentUser?.email,
        domains: deldomain,
      }
      const response = await deleteDomains(payload)
      if (response.success) {
        setAlldomains(alldomains.filter(domain => domain._id !== domainId))
        localStorage.setItem("authUser", JSON.stringify(response))
        setCurrentUser(response)
        setHasUnsavedChanges(false)
        toastr.success("Domain has been removed successfully", "Success!!!")
      } else {
        console.error("Domain removal failed:", response.msg)
      }
    } catch (error) {
      console.error("Error during domain removal:", error.message)
    }
  }
  return (
    <div className="mt-5">
      <h4 className="card-title mb-4">Add Invited Domain </h4>
      <div className="d-flex justify-content-center">
        <i
          className="bx bx-plus-circle pt-4 pointer text-primary"
          style={{ fontSize: "18px" }}
          onClick={e => {
            e.preventDefault()
            handleIconClick()
          }}
        ></i>
      </div>
      {domainsname &&<div className="col-md-5 col-sm-12 mb-3">
        <label htmlFor="example-text-input" className="form-label">
          Add Invited Domain
        </label>
        {domainsname.map((text, index) => (
          <div key={index} className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              value={text}
              onChange={e => handleEventTextChange(index, e.target.value)}
            />
            <span className="input-group-text">
              {domainsname.length === 0 ? (
                <i
                  className="bx bx-minus-circle text-danger pointer"
                  title="Minimum one Event is required"
                  style={{ cursor: "not-allowed" }}
                />
              ) : (
                <i
                  className="bx bx-minus-circle text-danger pointer"
                  title="Remove this Event"
                  onClick={() => handleRemoveField(index)}
                />
              )}
            </span>
          </div>
        ))}
      </div>}
      <div className="d-flex justify-content-start">
        <button
          className="btn btn-primary"
          onClick={() => {
            handleSubmit()
          }}
          disabled={!hasUnsavedChanges}
           
        >
          Add domains
        </button>
      </div>
      <br/>
      <br/>
      {alldomains && 
      <div className="col-md-5 col-sm-12 mb-3">
        <label htmlFor="example-text-input" className="form-label">
          Manage Domains
        </label>
        {alldomains.map((domain, index) => (
          <div key={index} className="input-group mb-3">
            <input
              className="form-control"
              type="text"
              value={domain.name}
              onChange={e => handleChange(index, e.target.value)}
            />
            <span className="input-group-text">
              {alldomains.length === 0 ? (
                <i
                  className="bx bx-minus-circle text-danger pointer"
                  title="Minimum one Event is required"
                  style={{ cursor: "not-allowed" }}
                />
              ) : (
                <i
                  className="bx bx-minus-circle text-danger pointer"
                  title="Remove this Domain"
                  onClick={() => handleRemoveDomains(domain._id, index)}
                />
              )}
            </span>
          </div>
        ))}
      </div>}
      <br/>
      <div className="d-flex justify-content-start">
        <button
          className="btn btn-primary"
          onClick={() => {
            handleUpdate()
          }}
          disabled={!hasUpdateChanges}
        >
          update
        </button>
      </div>
    </div>
  )
}
export default ManageDomains
