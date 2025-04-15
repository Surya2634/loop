import React, { useContext, useEffect, useState } from "react";
// import Chart from "react-apexcharts";
import "./AdminDashboard.css";
import helperService from "../../../../services/helperService";
import { AuthContext } from "../../../../contexts/AuthContext";

import adminUser from "../../../../images/admin-dashboard-user.webp";
import adminStar from "../../../../images/admin-star.webp";
import adminSubmission from "../../../../images/admin-submission.webp";
const AdminDashboard = (props) => {
  const [ totalCounts, setTotalCounts ] = useState({
    users: 0,
    contests: 0,
    submissions: 0,
  });
  const [ contestSubmissions, setContestSubmissions ] = useState({
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        labels: {
          formatter: (val) => val.toFixed(0),
        },
      },
      title: {
        text: "Total Contest Submissions",
        align: "center",
      },
    },
    series: [
      {
        name: "series-1",
        data: [],
      },
    ],
  });
  const [ authState ] = useContext(AuthContext);
  const fetchAdminDashboard = async () => {
    try {
      const {
        data: { dashboarDetails },
        status,
      } = await helperService.adminDashboard(
        {},
        { headers: { Authorization: authState?.user?.token } }
      );
      if (status === 200) {
        setContestSubmissions({
          ...contestSubmissions,
          options: {
            ...contestSubmissions.options,
            xaxis: {
              ...contestSubmissions.options.xaxis,
              categories: dashboarDetails.contestSubmissions.contests.map(
                (contest) =>
                  typeof contest === "string" || typeof contest === "number"
                    ? contest
                    : contest.name // fallback if it's an object
              ),
            },
          },
          series: [
            {
              name: "Submission Count",
              data: dashboarDetails.contestSubmissions.submissionsCount.map(Number),
            },
          ],
        });
        setTotalCounts({
          ...totalCounts,
          contests: dashboarDetails.contestSubmissions.contests.length,
          users: dashboarDetails.usersCount,
          submissions:
            dashboarDetails.contestSubmissions.submissionsCount.reduce(
              (total, count) => total + count,
              0
            ),
        });
      }
    } catch ({ message }) {
      props.snackBar(message, "error");
    }
  };
  useEffect(() => {
    fetchAdminDashboard();
  }, []);
  return (
    <div
      className="container-fluid"
      style={ { height: "100vh", overflowY: "scroll" } }
    >
      <div
        className="d-flex align-items-center justify-content-center flex-wrap"
        style={ { marginTop: "40px" } }
      >
        <div className="col-md-3 m-2 dash-highlight p-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <h1 className="user-count">{ totalCounts.users }</h1>
              <span className="user-span">Total no. of users</span>
            </div>
            <div className="img-start ">
              <img
                alt="someImage"
                src={ adminUser }
                height="80"
                width="80"
                className="img-fluid "
              />
            </div>
          </div>
        </div>
        <div className="col-md-3 m-2 dash-highlight p-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <h1 className="user-count">{ totalCounts.contests }</h1>
              <span className="user-span">Total no. of Contests</span>
            </div>
            <div className="img-start">
              <img
                alt="someImage"
                src={ adminStar }
                height="80"
                width="80"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
        <div className="col-md-4 m-2 dash-highlight p-3">
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-column">
              <h1 className="user-count">{ totalCounts.submissions }</h1>
              <span className="user-span">Total no. of Submissions</span>
            </div>
            <div className="img-start">
              <img
                alt="someImage"
                src={ adminSubmission }
                height="80"
                width="80"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="charts-container mt-5 container d-flex align-items-center justify-content-between flex-wrap">
        <Chart
          options={ contestSubmissions.options }
          series={ contestSubmissions.series }
          type="area"
          width="1000"
        />
      </div> */}
    </div>
  );
};

export default AdminDashboard;
