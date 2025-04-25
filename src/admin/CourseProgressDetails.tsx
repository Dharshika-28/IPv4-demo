import React, { useEffect, useState } from "react";
import MenuBar from "../styles/MenuBar.tsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa00ff", "#ff4081"];

const CourseProgressDetails: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/progress/All")
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
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

  const getUserHighestProgress = (progress: SectionProgress[] = []) => {
    if (!progress.length) return 0;
    return Math.max(...progress.map((p) => p.progressPercentage));
  };

  // Aggregate module progress for bar chart (sum or average progress by module)
  const getModuleProgressData = (progress: SectionProgress[] = []) => {
    // Group progress by module and average progressPercentage
    const map: Record<string, { total: number; count: number }> = {};
    progress.forEach(({ moduleName, progressPercentage }) => {
      if (!map[moduleName]) {
        map[moduleName] = { total: progressPercentage, count: 1 };
      } else {
        map[moduleName].total += progressPercentage;
        map[moduleName].count++;
      }
    });

    return Object.entries(map).map(([module, { total, count }]) => ({
      module,
      avgProgress: Math.round(total / count),
    }));
  };

  // Prepare pie chart data (completed vs incomplete sections)
  const getCompletionPieData = (progress: SectionProgress[] = []) => {
    const completed = progress.filter((p) => p.completed).length;
    const incomplete = progress.length - completed;
    return [
      { name: "Completed", value: completed },
      { name: "Incomplete", value: incomplete },
    ];
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <MenuBar />
      <div
        style={{
          maxWidth: 1200,
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 20,
            color: "#2c3e50",
            userSelect: "none",
          }}
        >
          User Progress Overview
        </h1>

        {loading && <p style={{ textAlign: "center", color: "#555" }}>Loading...</p>}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p style={{ textAlign: "center", color: "#777" }}>No user data available.</p>
        )}

        {!loading &&
          !error &&
          users.length > 0 &&
          users.map((user, idx) => {
            const highestProgress = getUserHighestProgress(user.courseProgress ?? []);
            const barData = getModuleProgressData(user.courseProgress ?? []);
            const pieData = getCompletionPieData(user.courseProgress ?? []);

            return (
              <div
                key={user.email || idx}
                style={{
                  marginBottom: 20,
                  padding: 16,
                  borderRadius: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                  userSelect: "none",
                }}
                onClick={() => toggleExpand(idx)}
                aria-expanded={expandedIndex === idx}
              >
                {/* Summary row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, color: "#34495e" }}>
                      {user.name || "Unnamed User"}
                    </h2>
                    <p style={{ margin: "4px 0 0", color: "#7f8c8d", fontSize: 14 }}>
                      {user.email || "No email"}
                    </p>
                  </div>

                  <div style={{ flex: 1, marginLeft: 20 }}>
                    <div
                      style={{
                        height: 16,
                        width: "100%",
                        backgroundColor: "#e0e0e0",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${highestProgress}%`,
                          height: "100%",
                          backgroundColor: highestProgress === 100 ? "#27ae60" : "#2980b9",
                          transition: "width 0.5s ease-in-out",
                        }}
                      ></div>
                    </div>
                    <p
                      style={{
                        margin: "6px 0 0",
                        fontSize: 14,
                        color: "#34495e",
                        fontWeight: "600",
                      }}
                    >
                      Progress: {highestProgress.toFixed(1)}%
                    </p>
                  </div>

                  <button
                    style={{
                      marginLeft: 20,
                      padding: "6px 12px",
                      backgroundColor: expandedIndex === idx ? "#e74c3c" : "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: 5,
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: 14,
                      userSelect: "none",
                    }}
                    aria-controls={`user-details-${idx}`}
                    aria-expanded={expandedIndex === idx}
                  >
                    {expandedIndex === idx ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {/* Expanded details */}
                {expandedIndex === idx && (
                  <div
                    id={`user-details-${idx}`}
                    style={{
                      marginTop: 20,
                      display: "flex",
                      gap: 24,
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Login History */}
                    <div style={{ flex: "1 1 350px", minWidth: 300 }}>
                      <h3
                        style={{
                          marginBottom: 12,
                          color: "#2c3e50",
                          borderBottom: "2px solid #2980b9",
                          paddingBottom: 4,
                        }}
                      >
                        Login History
                      </h3>
                      {(user.loginHistory && user.loginHistory.length > 0) ? (
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: 13,
                            color: "#000000", // text color black
                          }}
                        >
                          <thead>
                            <tr>
                              {["Date", "Time", "IP Address", "Location"].map((header) => (
                                <th
                                  key={header}
                                  style={{
                                    textAlign: "left",
                                    padding: "8px",
                                    backgroundColor: "#ecf0f1",
                                    borderBottom: "2px solid #bdc3c7",
                                    fontWeight: "600",
                                    color: "#000000", // black text for headers
                                  }}
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {user.loginHistory.map((login, i) => {
                              const dateObj = new Date(login.time);
                              return (
                                <tr
                                  key={i}
                                  style={{
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9fc",
                                    color: "#000000", // black text for table rows
                                  }}
                                >
                                  <td style={{ padding: "8px" }}>
                                    {dateObj.toLocaleDateString()}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {dateObj.toLocaleTimeString()}
                                  </td>
                                  <td style={{ padding: "8px" }}>{login.ip}</td>
                                  <td style={{ padding: "8px" }}>{login.location}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p
                          style={{
                            color: "#000000", // black text
                            fontStyle: "italic",
                            marginTop: 8,
                          }}
                        >
                          No login history available.
                        </p>
                      )}
                    </div>

                    {/* Course Progress */}
                    <div
                      style={{
                        flex: "1 1 350px",
                        minWidth: 300,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <h3
                        style={{
                          marginBottom: 12,
                          color: "#2c3e50",
                          borderBottom: "2px solid #27ae60",
                          paddingBottom: 4,
                        }}
                      >
                        Course Progress Details
                      </h3>

                      {(user.courseProgress && user.courseProgress.length > 0) ? (
                        <>
                          <table
                            style={{
                              width: "100%",
                              borderCollapse: "collapse",
                              fontSize: 13,
                              marginBottom: 16,
                              color: "#000000", // black text
                            }}
                          >
                            <thead>
                              <tr>
                                {[
                                  "Module",
                                  "Section",
                                  "Completed",
                                  "Progress %",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    style={{
                                      textAlign: "left",
                                      padding: "8px",
                                      backgroundColor: "#ecf0f1",
                                      borderBottom: "2px solid #bdc3c7",
                                      fontWeight: "600",
                                      color: "#000000", // black header text
                                    }}
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {user.courseProgress.map((progress, i) => (
                                <tr
                                  key={i}
                                  style={{
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: i % 2 === 0 ? "#fff" : "#f7f9fc",
                                    color: "#000000", // black text rows
                                  }}
                                >
                                  <td style={{ padding: "8px" }}>{progress.moduleName}</td>
                                  <td style={{ padding: "8px" }}>{progress.sectionName}</td>
                                  <td style={{ padding: "8px" }}>
                                    {progress.completed ? "Yes" : "No"}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {progress.progressPercentage}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* Bar Chart */}
                          <div
                            style={{
                              width: "100%",
                              height: 180,
                              marginBottom: 16,
                            }}
                          >
                            <ResponsiveContainer>
                              <BarChart
                                data={barData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                              >
                                <XAxis
                                  dataKey="module"
                                  tick={{ fill: "#34495e", fontSize: 12 }}
                                />
                                <YAxis
                                  domain={[0, 100]}
                                  tick={{ fill: "#34495e", fontSize: 12 }}
                                  tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: 8,
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                                    color: "#2c3e50",
                                    fontWeight: "600",
                                  }}
                                />
                                <Bar dataKey="avgProgress" fill="#27ae60" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Pie Chart */}
                          <div
                            style={{
                              width: "100%",
                              height: 180,
                              textAlign: "center",
                            }}
                            aria-label="Completion pie chart"
                          >
                            <ResponsiveContainer>
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={60}
                                  label={(entry) =>
                                    `${entry.name}: ${entry.value}`
                                  }
                                  labelStyle={{ fill: "#34495e", fontWeight: "700" }}
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  verticalAlign="bottom"
                                  height={36}
                                  wrapperStyle={{ fontSize: 13, color: "#34495e" }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      ) : (
                        <p
                          style={{
                            color: "#000000", // black text
                            fontStyle: "italic",
                            marginTop: 8,
                          }}
                        >
                          No course progress available.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CourseProgressDetails;
