import React, { useEffect, useState } from "react";
import MenuBar from "../styles/MenuBar.tsx";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

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

type SortKey = "name" | "email" | "progress" | "totalLogins" | null;
type SortDirection = "asc" | "desc";

const UserDetails: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/progress/All")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
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

  const getHighestProgress = (progress: SectionProgress[] = []) => {
    if (!progress.length) return 0;
    return Math.max(...progress.map((p) => p.progressPercentage));
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort users based on sortKey and direction
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
      case "progress":
        aValue = getHighestProgress(a.courseProgress ?? []);
        bValue = getHighestProgress(b.courseProgress ?? []);
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
    
    <div      style={{
      backgroundColor: "#fff",
      color: "#000",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",}}
      >
      <MenuBar />
      <h1>User Details</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 10,
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "4px 8px",
              maxWidth: 400,
              backgroundColor: "#f9f9f9",
            }}
          >
            <SearchIcon style={{ marginRight: 8, color: "#666" }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flexGrow: 1,
                padding: 8,
                fontSize: 16,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                color: "#000",
              }}
            />
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginTop: "20px ",
            }}
          >
            <thead style={{ backgroundColor: "#fff", color: "#000" }}>
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  style={{
                    cursor: "pointer",
                    padding: 12,
                    textAlign: "left",
                    userSelect: "none",
                  }}
                >
                  User's Name{renderSortArrow("name")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{
                    cursor: "pointer",
                    padding: 12,
                    textAlign: "left",
                    userSelect: "none",
                  }}
                >
                  User's Email{renderSortArrow("email")}
                </th>
                <th
                  onClick={() => handleSort("progress")}
                  style={{
                    cursor: "pointer",
                    padding: 12,
                    textAlign: "center",
                    userSelect: "none",
                  }}
                >
                  Course Progress{renderSortArrow("progress")}
                </th>
                <th
                  onClick={() => handleSort("totalLogins")}
                  style={{
                    cursor: "pointer",
                    padding: 12,
                    textAlign: "center",
                    userSelect: "none",
                  }}
                >
                  Total Logins{renderSortArrow("totalLogins")}
                </th>
                <th style={{ padding: 12, textAlign: "center" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user, idx) => {
                  const highestProgress = getHighestProgress(user.courseProgress ?? []).toFixed(1);
                  const progressBarColor = highestProgress === "100.0" ? "#4caf50" : "#2196f3";

                  return (
                    <tr
                      key={user.email || idx}
                      style={{
                        borderBottom: "1px solid #ddd",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget.style.backgroundColor = "#f0f0f0");
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget.style.backgroundColor = "transparent");
                      }}
                    >
                      <td style={{ padding: 12, display: "flex", alignItems: "center" }}>
                        <PersonIcon style={{ marginRight: 8, color: "#555" }} />
                        {user.name || "Unknown"}
                      </td>
                      <td style={{ padding: 12 }}>{user.email || "N/A"}</td>
                      <td style={{ padding: 12, textAlign: "center" }}>
                        <div
                          style={{
                            backgroundColor: "#e0e0e0",
                            borderRadius: 10,
                            height: 24,
                            width: 200,
                            margin: "0 auto",
                            overflow: "hidden",
                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
                          }}
                        >
                          <div
                            style={{
                              width: `${highestProgress}%`,
                              height: "100%",
                              backgroundColor: progressBarColor,
                              color: "#fff",
                              fontWeight: "bold",
                              textAlign: "center",
                              lineHeight: "24px",
                              transition: "width 0.5s ease",
                            }}
                          >
                            {highestProgress}%
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 12, textAlign: "center" }}>
                        {(user.loginHistory ?? []).length}
                      </td>
                      <td style={{ padding: 12, textAlign: "center" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (user.email) {
                              navigate(`/courseprogressdetails/${encodeURIComponent(user.email)}`);
                            }
                          }}
                          style={{
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserDetails;
