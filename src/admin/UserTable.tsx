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

type CourseProgress = {
  module: string;
  completed: boolean;
};

type User = {
  name: string;
  email: string;
  loginHistory: LoginEntry[];
  courseProgress: CourseProgress[];
};

type SortKey = "name" | "email" | "lastLogin" | "progress" | "totalLogins" | null;
type SortDirection = "asc" | "desc";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const getLastLogin = (loginHistory: LoginEntry[]) => {
    if (!loginHistory.length) return "No logins";
    const lastLogin = loginHistory.reduce((latest, entry) =>
      new Date(entry.time) > new Date(latest.time) ? entry : latest
    );
    const date = new Date(lastLogin.time);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} from ${lastLogin.location} (${lastLogin.ip})`;
  };

  const getUserProgressPercent = (progress: CourseProgress[]) => {
    if (!progress.length) return 0;
    const completedCount = progress.filter((m) => m.completed).length;
    return (completedCount / progress.length) * 100;
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortKey) return 0;
    let aValue: string | number, bValue: string | number;

    switch (sortKey) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "email":
        aValue = a.email.toLowerCase();
        bValue = b.email.toLowerCase();
        break;
      case "lastLogin": {
        const aLast = a.loginHistory.length
          ? new Date(a.loginHistory.reduce((latest, e) => new Date(e.time) > new Date(latest.time) ? e : latest).time)
          : new Date(0);
        const bLast = b.loginHistory.length
          ? new Date(b.loginHistory.reduce((latest, e) => new Date(e.time) > new Date(latest.time) ? e : latest).time)
          : new Date(0);
        aValue = aLast.getTime();
        bValue = bLast.getTime();
        break;
      }
      case "progress":
        aValue = getUserProgressPercent(a.courseProgress);
        bValue = getUserProgressPercent(b.courseProgress);
        break;
      case "totalLogins":
        aValue = a.loginHistory.length;
        bValue = b.loginHistory.length;
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
          
          <input
            type="text"
            placeholder= "Search by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                      <SearchIcon sx={{ml:2, fontSize:'30px'}}/>
            
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")} style={{textAlign:'left'}}>User's Name{renderSortArrow("name")}</th>
                  <th onClick={() => handleSort("email")} style={{textAlign:'left'}}>User's Email{renderSortArrow("email")}</th>
                  {/* <th onClick={() => handleSort("lastLogin")}>Last Login{renderSortArrow("lastLogin")}</th> */}
                  <th onClick={() => handleSort("progress")}>Course Progress{renderSortArrow("progress")}</th>
                  <th onClick={() => handleSort("totalLogins")}>Total Logins{renderSortArrow("totalLogins")}</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="no-users">No users found.</td>
                  </tr>
                )}
                {sortedUsers.map((user, index) => {
                  const progressPercent = getUserProgressPercent(user.courseProgress).toFixed(1);
                  const lastLogin = getLastLogin(user.loginHistory);

                  return (
                    <React.Fragment key={index}>
                      <tr onClick={() => toggleExpand(index)} className="user-row">
                        <td style={{textAlign:'left'}}><PersonIcon sx={{mr:'10px'}}/>{user.name}</td>
                        <td style={{textAlign:'left'}}>{user.email}</td>
                        {/* <td>{lastLogin}</td> */}
                        <td>
                          <div className="progress-wrapper">
                            <div
                              className={`progress-bar ${progressPercent === "100.0" ? "green" : "blue"}`}
                              style={{ width: `${progressPercent}%` }}
                            >
                              {progressPercent}%
                            </div>
                          </div>
                        </td>
                        <td>{user.loginHistory.length}</td>
                        <td><button className="view-button">{expandedIndex === index ? "Hide" : "View"}</button></td>
                      </tr>
                      {expandedIndex === index && (
                        <tr>
                          <td colSpan={6}>
                            <div className="expand-section">
                              <div>
                                <h4>Login History</h4>
                                <ul>
                                  {user.loginHistory.map((login, i) => (
                                    <li key={i}>
                                      <br/>
                                      {new Date(login.time).toLocaleDateString()}{" "}
                                      {new Date(login.time).toLocaleTimeString()} <br/><br/> - IP address: {login.ip} <br/> -Location: ({login.location})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4>Course Progress: IPv4 Course</h4>
                                <hr />
                                <ul>
                                  {user.courseProgress.map((mod, i) => (
                                    <li key={i}>
                                      {mod.module}:{mod.completed ? "✅ Completed" : "❌ Incomplete"}
                                    </li>
                                  ))}
                                </ul>
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

export default UserTable;
