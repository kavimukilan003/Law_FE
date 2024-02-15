import React from "react"

const Dashboard = () => {
  return (
    <div className=" py-5 my-4">
      <div className="d-flex">

        <div className="d-flex justify-content-start">
          <p className="justify-content-start ">HLG</p>{" "}
        </div>
        <div className="d-flex ">
        <p className="me-1 justify-content-center ">view</p>
          <input className="justify-content-center " type="select" />
        </div>
      </div>
      <div className="d-flex p-3 bg-primary text-white">
        <div className="p-0 me-3">
          Perform Search
          <i className="bx bx-caret-down font-12"></i>
        </div>
        <div className="p-0 me-3">Create</div>
        <div className="p-0 me-3">Edit Multiple</div>
        <div className="p-0 me-3">Done</div>
      </div>
      <div className="">
      <div className="">
  <div className="row justify-content-start mt-2">
    <div className="col-4">
      Attorney Docket #
      <input />
    </div>
    <div className="col-4">
      Data Filter #
      <input />
    </div>
    <div className="col-4">
      Description
      <input />
    </div>
  </div>
  <div className="row justify-content-start mt-2">
    <div className="col-4">
      Reference #
      <input />
    </div>
    <div className="col-4">
     Status
      <input />
    </div>
    <div className="col-4">
      Dockting Event
      <input />
    </div>
  </div>
  <div  style={{height: "500px", overflowY: "scroll",display: "block"}}>
      <table className="table table-striped" >
  <thead style={{position: "sticky",  top: "1px"}} className="bg-primary text-white">
    <tr>
      <th scope="col">All/None</th>
      <th scope="col">Docketing Event Date</th>
      <th scope="col">Attorney Docket Number</th>
      <th scope="col">Docketing Event</th>
      <th scope="col">Reference Number</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row"><input type="checkbox"/></th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
  </tbody>
</table>
</div>
</div>
</div>
    </div>
  )
}

export default Dashboard
