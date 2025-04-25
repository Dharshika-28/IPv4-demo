import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import MenuBar from "../styles/MenuBar.tsx";
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

type LoginEntry = {
  time: string;
  ip: string;
  location: string;
};

type SectionProgress = {
  moduleName: string;
  sectionName: string;
  completed: boolean;
  progressPercentage: number;
};

type User = {
  name?: string;
  email?: string;
  loginHistory?: LoginEntry[];
  courseProgress?: SectionProgress[];
};

type SortKey = "name" | "email" | "lastLogin" | "progress" | "totalLogins" | null;
type SortDirection = "asc" | "desc";

const UserDetails: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    fetch("http://localhost:8080/api/progress/All")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched users data:", data);
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const getLastLogin = (loginHistory: LoginEntry[] = []) => {
    if (loginHistory.length === 0) return "No logins";
    const lastLogin = loginHistory.reduce((latest, entry) =>
      new Date(entry.time) > new Date(latest.time) ? entry : latest
    );
    const date = new Date(lastLogin.time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} from ${lastLogin.location} (${lastLogin.ip})`;
  };

  const getUserHighestProgress = (progress: SectionProgress[] = []) => {
    if (!progress.length) return 0;
    return Math.max(...progress.map(p => p.progressPercentage));
  };

  // Filter users by search term (name or email)
  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort users based on current sort key and direction
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortKey) return 0;

    let aValue: string | number, bValue: string | number;

    switch (sortKey) {
      case "name":
        aValue = (a.name || "").toLowerCase();
        bValue = (b.name || "").toLowerCase();
        break;
      case "email":
        aValue = (a.email || "").toLowerCase();
        bValue = (b.email || "").toLowerCase();
        break;
      case "lastLogin": {
        const aLast = (a.loginHistory ?? []).length
          ? new Date((a.loginHistory ?? []).reduce((latest, e) => new Date(e.time) > new Date(latest.time) ? e : latest).time)
          : new Date(0);
        const bLast = (b.loginHistory ?? []).length
          ? new Date((b.loginHistory ?? []).reduce((latest, e) => new Date(e.time) > new Date(latest.time) ? e : latest).time)
          : new Date(0);
        aValue = aLast.getTime();
        bValue = bLast.getTime();
        break;
      }
      case "progress":
        aValue = getUserHighestProgress(a.courseProgress ?? []);
        bValue = getUserHighestProgress(b.courseProgress ?? []);
        break;
      case "totalLogins":
        aValue = (a.loginHistory ?? []).length;
        bValue = (b.loginHistory ?? []).length;
        break;
      default:
        aValue = 0;
        bValue = 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <div>
      <MenuBar />
      <div className="admin-dashboard">
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <>
            <div
              className="search-wrapper"
              style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
            >
              <input
                type="text"
                placeholder="Search by name or email..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon sx={{ ml: 2, fontSize: "30px" }} />
            </div>

            <div className="table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      User's Name{renderSortArrow("name")}
                    </th>
                    <th
                      onClick={() => handleSort("email")}
                      style={{ textAlign: "left", cursor: "pointer" }}
                    >
                      User's Email{renderSortArrow("email")}
                    </th>
                    <th onClick={() => handleSort("progress")} style={{ cursor: "pointer" }}>
                      Course Progress{renderSortArrow("progress")}
                    </th>
                    <th onClick={() => handleSort("totalLogins")} style={{ cursor: "pointer" }}>
                      Total Logins{renderSortArrow("totalLogins")}
                    </th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="no-users">
                        No users found.
                      </td>
                    </tr>
                  )}
                  {sortedUsers.map((user, index) => {
                    const highestProgress = getUserHighestProgress(user.courseProgress ?? []).toFixed(1);

                    return (
                      <React.Fragment key={user.email || index}>
                        <tr
                          onClick={() => toggleExpand(index)}
                          className="user-row"
                          style={{ cursor: "pointer" }}
                        >
                          <td style={{ textAlign: "left" }}>
                            <PersonIcon sx={{ mr: "10px" }} />
                            {user.name || "Unknown"}
                          </td>
                          <td style={{ textAlign: "left" }}>{user.email || "N/A"}</td>
                          <td>
                            <div className="progress-wrapper">
                              <div
                                className={`progress-bar ${highestProgress === "100.0" ? "green" : "blue"}`}
                                style={{ width: `${highestProgress}%` }}
                              >
                                {highestProgress}%
                              </div>
                            </div>
                          </td>
                          <td>{(user.loginHistory ?? []).length}</td>
                          <td>
                            <button className="view-button">
                              {expandedIndex === index ? "Hide" : "View"}
                            </button>
                          </td>
                        </tr>
                        {expandedIndex === index && (
                          <tr>
                            <td colSpan={6}>
                              <div className="expand-section" style={{ display: "flex", gap: "2rem" }}>
                                {/* Login History Table */}
                                <div style={{ flex: 1 }}>
                                  <h4>Login History</h4>
                                  {(user.loginHistory && user.loginHistory.length > 0) ? (
                                    <table
                                      className="inner-table"
                                      style={{ width: "100%", borderCollapse: "collapse" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Time</th>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>IP Address</th>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Location</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {user.loginHistory.map((login, i) => {
                                          const dateObj = new Date(login.time);
                                          return (
                                            <tr key={i}>
                                              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {dateObj.toLocaleDateString()}
                                              </td>
                                              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {dateObj.toLocaleTimeString()}
                                              </td>
                                              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {login.ip}
                                              </td>
                                              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {login.location}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <p>No login history available.</p>
                                  )}
                                </div>

                                {/* Course Progress Table */}
                                <div style={{ flex: 1 }}>
                                  <h4>Course Progress</h4>
                                  {(user.courseProgress && user.courseProgress.length > 0) ? (
                                    <table
                                      className="inner-table"
                                      style={{ width: "100%", borderCollapse: "collapse" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Module</th>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Section</th>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Completed</th>
                                          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Progress %</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {user.courseProgress.map((progress, i) => (
                                          <tr key={i}>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                              {progress.moduleName}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                              {progress.sectionName}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                              {progress.completed ? "Yes" : "No"}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                              {progress.progressPercentage}%
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <p>No course progress available.</p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
