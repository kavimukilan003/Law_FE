import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getAllEvent, getTrademarkSearchDetails } from "rainComputing/helpers/backend_helper";
import moment from "moment";
import { join } from "lodash";

const DocketResultModel = ({ caseId }) => {
  const [docketSearch, setDocketSearch] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  console.log("allEvents :",allEvents)

const name = docketSearch?.map(name =>
  name?.parties?.ownerGroups?.[10]?.map(name2 => name2?.name)
)
 const attNumber = docketSearch?.map(search => search?.status?.attrnyDktNumber)
const desription = docketSearch?.map(search => search?.status?.markElement)
  const handleSearch = async () => {
    const payload = {
      serialNumber: caseId?.serialNumber,
    };
    const res = await getTrademarkSearchDetails(payload);
    if (res) {
      setDocketSearch(res?.trademarks);
    }
  };

  const getAllCaseEvents = async () => {
    const payload = {
      caseId: caseId?._id,
    };
    const res = await getAllEvent(payload);
    if (res.success) {
      setAllEvents(res?.events);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    getAllCaseEvents();
  }, []);

  // const sortedEvents = allEvents.sort((a, b) => new Date(a?.docDate) - new Date(b?.docDate));

  // sortedEvents.forEach((event) => {
  //   event.eventText.sort((a, b) => new Date(a?.docDate) - new Date(b?.docDate));
  // });
  
  // console.log("filterDateEvents", sortedEvents);
  
  const timestamp = allEvents?.flatMap((m) => m?.eventText.map((m1) => m1?.docDate));
  const dateOnlyArray = timestamp.map((timestamp) => new Date(timestamp).toISOString().split("T")[0]);
  // const sortedDates = dateOnlyArray.sort((a, b) => new Date(a) - new Date(b));

  return (
    <div style={{ height: "500px", overflowY: "scroll", display: "block" }}>
      <p>Length of the Results ({allEvents?.length})</p>

      <table className="table table-striped">
        <thead style={{ position: "sticky", top: "1px" }} className="bg-primary text-white">
          <tr>
            <th scope="col">All/None</th>
            <th scope="col">Docketing Event Date</th>
            <th scope="col">Attorney Docket Number</th>
            <th scope="col">Docketing Event</th>
            <th scope="col">Reference Number</th>
            <th scope="col">Record Type</th>
            <th scope="col">Description</th>
            <th scope="col">Client</th>
            <th scope="col">PTO status</th>
          </tr>
        </thead>

        {allEvents?.map((data, i) => (
          <tbody style={{ fontSize: "10px" }} key={i}>
            <tr>
              <th scope="row">
                <input type="checkbox" />
              </th>
              <td>{dateOnlyArray[i]}</td>
              <td>{attNumber}</td>
              <td>{data?.docEvent}</td>
              <td>{caseId?.serialNumber }</td>
              <td>Trademarks</td>
              <td>{desription}</td>
              <td>{name}</td>
              <td>{data?.eventText[0]?.text}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

DocketResultModel.propTypes = {
  caseId: PropTypes.func,
  data: PropTypes.any,
};

export default DocketResultModel;
