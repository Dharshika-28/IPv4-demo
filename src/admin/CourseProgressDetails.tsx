import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const COLORS = ["#0088FE", "#FF8042"];

const CourseProgressDetails: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expandedEmails, setExpandedEmails] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError("");

    if (email) {
      fetch(`http://localhost:8080/api/progress/details/${encodeURIComponent(email)}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      fetch(`http://localhost:8080/api/progress/All`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then((data: User[]) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [email]);

  const getHighestProgress = (progress: SectionProgress[] = []) => {
    if (progress.length === 0) return 0;
    return Math.max(...progress.map((p) => p.progressPercentage));
  };

  const toggleExpand = (userEmail: string) => {
    setExpandedEmails((prev) =>
      prev.includes(userEmail) ? prev.filter((e) => e !== userEmail) : [...prev, userEmail]
    );
  };

  const getModuleProgressData = (progress: SectionProgress[] = []) => {
    const moduleMap: { [module: string]: number[] } = {};
    progress.forEach(({ moduleName, progressPercentage }) => {
      if (!moduleMap[moduleName]) moduleMap[moduleName] = [];
      moduleMap[moduleName].push(progressPercentage);
    });

    return Object.entries(moduleMap).map(([moduleName, percentages]) => {
      const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
      return { moduleName, avgProgress: Number(avg.toFixed(1)) };
    });
  };

  const getCompletionPieData = (progress: SectionProgress[] = []) => {
    const completedCount = progress.filter((p) => p.completed).length;
    const incompleteCount = progress.length - completedCount;
    return [
      { name: "Completed", value: completedCount },
      { name: "Incomplete", value: incompleteCount },
    ];
  };

  const UserDetailCard: React.FC<{ user: User }> = ({ user }) => {
    const userEmail = user.email || "";
    const isExpanded = expandedEmails.includes(userEmail);
    const moduleProgressData = getModuleProgressData(user.courseProgress ?? []);
    const pieData = getCompletionPieData(user.courseProgress ?? []);

    return (
      <div
        style={{
          marginBottom: 20,
          padding: 16,
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          onClick={() => toggleExpand(userEmail)}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 18, color: "#34495e" }}>{user.name || "Unnamed User"}</h2>
            <p style={{ margin: "4px 0 0", color: "#7f8c8d", fontSize: 14 }}>{user.email || "No email"}</p>
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
                  width: `${getHighestProgress(user.courseProgress ?? [])}%`,
                  height: "100%",
                  backgroundColor:
                    getHighestProgress(user.courseProgress ?? []) === 100 ? "#27ae60" : "#2980b9",
                  transition: "width 0.5s ease-in-out",
                }}
              ></div>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#34495e", fontWeight: "600" }}>
              Progress: {getHighestProgress(user.courseProgress ?? [])?.toFixed(1)}%
            </p>
          </div>

          <button
            style={{
              marginLeft: 20,
              padding: "6px 12px",
              backgroundColor: isExpanded ? "#e74c3c" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Tables */}
            <div style={{ marginTop: 20, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-between" }}>
              {/* Login History Table */}
              <div style={{ flex: "1 1 300px", minWidth: 280 }}>
                <h3 style={{ marginBottom: 12, color: "black" }}>Login History</h3>
                {user.loginHistory?.length ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                              fontSize: 14,
                              color: "black",
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
                          <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                            <td style={{ padding: "8px", fontSize: 13, color: "black" }}>
                              {dateObj.toLocaleDateString()}
                            </td>
                            <td style={{ padding: "8px", fontSize: 13, color: "black" }}>
                              {dateObj.toLocaleTimeString()}
                            </td>
                            <td style={{ padding: "8px", fontSize: 13, color: "black" }}>{login.ip}</td>
                            <td style={{ padding: "8px", fontSize: 13, color: "black" }}>{login.location}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#7f8c8d", fontStyle: "italic" }}>No login history available.</p>
                )}
              </div>

              {/* Course Progress Table */}
              <div style={{ flex: "1 1 400px", minWidth: 350 }}>
                <h3 style={{ marginBottom: 12, color: "black" }}>Course Progress</h3>
                {user.courseProgress?.length ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Module", "Section", "Completed", "Progress %"].map((header) => (
                          <th
                            key={header}
                            style={{
                              textAlign: "left",
                              padding: "8px",
                              backgroundColor: "#ecf0f1",
                              borderBottom: "2px solid #bdc3c7",
                              fontWeight: "600",
                              fontSize: 14,
                              color: "black",
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {user.courseProgress.map((progress, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                          <td style={{ padding: "8px", fontSize: 13, color: "black" }}>{progress.moduleName}</td>
                          <td style={{ padding: "8px", fontSize: 13, color: "black" }}>{progress.sectionName}</td>
                          <td style={{ padding: "8px", fontSize: 13, color: "black" }}>
                            {progress.completed ? "Yes" : "No"}
                          </td>
                          <td style={{ padding: "8px", fontSize: 13, color: "black" }}>
                            {progress.progressPercentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#7f8c8d", fontStyle: "italic" }}>No course progress available.</p>
                )}
              </div>
            </div>

            {/* Charts */}
            <div style={{ marginTop: 30, display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
              <div style={{ flex: "1 1 400px", minWidth: 320, height: 300 }}>
                <h3 style={{ textAlign: "center", color: "#34495e" }}>Module Average Progress (%)</h3>
                {moduleProgressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={moduleProgressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="moduleName" tick={{ fontSize: 13, fill: "#34495e" }} />
                      <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 13, fill: "#34495e" }} />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Bar dataKey="avgProgress" fill="#2980b9" radius={[6, 6, 0, 0]} barSize={25} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: "center", color: "#7f8c8d" }}>No progress data available.</p>
                )}
              </div>

              <div style={{ flex: "1 1 320px", minWidth: 280, height: 300 }}>
                <h3 style={{ textAlign: "center", color: "#34495e" }}>Completion Status</h3>
                {user.courseProgress && user.courseProgress.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: "center", color: "#7f8c8d" }}>No completion data available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#f7f8fa", minHeight: "100vh", paddingBottom: 50 }}>
      <MenuBar />
      <div
        style={{
          margin: "40px auto",
          maxWidth: 1200,
          backgroundColor: "white",
          padding: 24,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
          {email ? `User Details: ${email}` : "All Users Course Progress"}
        </h1>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : email && user ? (
          <UserDetailCard user={user} />
        ) : (
          users.map((user, index) => <UserDetailCard key={index} user={user} />)
        )}
      </div>
    </div>
  );
};

export default CourseProgressDetails;
