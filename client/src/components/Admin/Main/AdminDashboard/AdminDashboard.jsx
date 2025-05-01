import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./AdminDashboard.css";
import helperService from "../../../../services/helperService";
import { AuthContext } from "../../../../contexts/AuthContext";

import adminUser from "../../../../images/admin-dashboard-user.webp";
import adminStar from "../../../../images/admin-star.webp";
import adminSubmission from "../../../../images/admin-submission.webp";

// Enhanced Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false, errorInfo: null };

  static getDerivedStateFromError(error) {
    console.error('Chart Error:', error);
    return { hasError: true };
  }

  // In the ErrorBoundary component
  componentDidCatch(error, info) {  // Keep 'error' parameter
    console.error('Chart Error:', error);  // Now 'error' is used
    console.log('Error Info:', info.componentStack);
    this.setState({ errorInfo: info.componentStack });
  }


  handleRetry = () => {
    this.setState({ hasError: false, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <></>
      );
    }
    return this.props.children;
  }
}

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
        animations: {
          enabled: false // Helps debug rendering issues
        }
      },
      xaxis: {
        categories: [],
        labels: {
          formatter: (value) => value.toString() // Force string conversion
        }
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
        name: "Submission Count",
        data: [],
      },
    ],
  });

  const [ authState ] = useContext(AuthContext);

  const fetchAdminDashboard = async () => {
    try {
      const { data, status } = await helperService.adminDashboard(
        {},
        { headers: { Authorization: authState?.user?.token } }
      );

      if (status === 200) {
        const dashboardData = data.dashboarDetails;
        const rawContests = dashboardData.contestSubmissions.contests;
        const rawCounts = dashboardData.contestSubmissions.submissionsCount;

        // Advanced Contest Name Sanitization
        const safeContests = rawContests.map((contest, index) => {
          try {
            if (!contest || typeof contest === 'function') {
              return `Contest ${index + 1}`;
            }

            // Handle React elements or components
            if (contest.$$typeof || contest.prototype?.isReactComponent) {
              return `Contest ${index + 1}`;
            }

            // Handle object types
            if (typeof contest === 'object') {
              return contest.name?.toString()?.trim() || `Contest ${index + 1}`;
            }

            // Final string conversion
            return contest.toString().trim();
          } catch (error) {
            console.error(`Contest ${index + 1} formatting error:`, error);
            return `Contest ${index + 1}`;
          }
        });

        // Validate counts
        const validatedCounts = rawCounts.map((count, index) => {
          const num = Number(count);
          if (!Number.isFinite(num) || num < 0) {
            console.warn(`Invalid count at index ${index}:`, count);
            return 0;
          }
          return num;
        });

        // Data consistency check
        if (safeContests.length !== validatedCounts.length) {
          console.error(
            'Data mismatch! Contests:', safeContests.length,
            'Counts:', validatedCounts.length
          );
          throw new Error('Data length mismatch between contests and submissions');
        }

        setContestSubmissions(prev => ({
          ...prev,
          options: {
            ...prev.options,
            xaxis: {
              ...prev.options.xaxis,
              categories: safeContests,
            },
          },
          series: [
            {
              name: "Submission Count",
              data: validatedCounts,
            },
          ],
        }));

        setTotalCounts({
          contests: safeContests.length,
          users: Number(dashboardData.usersCount) || 0,
          submissions: validatedCounts.reduce((a, b) => a + b, 0),
        });
      }
    } catch (error) {
      console.error('Dashboard Error:', error);
      props.snackBar(error.message || 'Data processing failed', 'error');
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  return (
    <div className="container-fluid dashboard-container">
      {/* Main Content */ }
      <div className="dashboard-content">
        <div className="metrics-row">
          {/* Users Card */ }
          <div className="metric-card">
            <div className="metric-content">
              <h1>{ totalCounts.users }</h1>
              <span>Total Users</span>
            </div>
            <img src={ adminUser } alt="Users" />
          </div>

          {/* Contests Card */ }
          <div className="metric-card">
            <div className="metric-content">
              <h1>{ totalCounts.contests }</h1>
              <span>Total Contests</span>
            </div>
            <img src={ adminStar } alt="Contests" />
          </div>

          {/* Submissions Card */ }
          <div className="metric-card">
            <div className="metric-content">
              <h1>{ totalCounts.submissions }</h1>
              <span>Total Submissions</span>
            </div>
            <img src={ adminSubmission } alt="Submissions" />
          </div>
        </div>

        {/* Chart Section */ }
        <div className="chart-section">
          <ErrorBoundary data={ contestSubmissions }>
            { contestSubmissions.series[ 0 ].data.length > 0 ? (
              <Chart
                options={ contestSubmissions.options }
                series={ contestSubmissions.series }
              />
            ) : (
              <div className="chart-loading">
                <span className="loader"></span>
                Preparing visualization...
              </div>
            ) }
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
