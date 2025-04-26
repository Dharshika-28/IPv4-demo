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
import ContactPageIcon from '@mui/icons-material/ContactPage';

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

type QuizScore = {
  quizName: string;
  score: number;
  totalQuestions: number;
  dateTaken: string;
};

type User = {
  name?: string;
  email?: string;
  loginHistory?: LoginEntry[];
  courseProgress?: SectionProgress[];
};


const BAR_COLORS = ["#27ae60", "#e74c3c"]; // Green for completed, Red for incomplete
const PIE_COLORS = ["lightblue", "lightgreen", "purple", "lavender"]; 

const CourseProgressDetails: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expandedEmails, setExpandedEmails] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");

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
          // Fetch quiz scores when user data is loaded
          fetchQuizScores(data.email);
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

  const fetchQuizScores = (userEmail: string) => {
    setQuizLoading(true);
    setQuizError("");
  
    fetch(`http://localhost:8080/api/progress/final-quiz/score/${encodeURIComponent(userEmail)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch quiz scores: ${res.status}`);
        return res.json(); // Just a number
      })
      .then((score: number) => {
        console.log("Fetched score:", score); // Debug log
  
        const fakeQuiz = {
          quizName: "Final IPv4 Quiz",   
          score: score,                  
          totalQuestions: 10,            
          dateTaken: new Date().toISOString(), 
        };
  
        setQuizScores([fakeQuiz]); // Important: Wrap it in an array []
        setQuizLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching quiz score:", err);
        setQuizError(err.message);
        setQuizLoading(false);
      });
  };


    

  const getHighestProgress = (progress: SectionProgress[] = []) => {
    if (progress.length === 0) return 0;
    return Math.max(...progress.map((p) => p.progressPercentage));
  };

  const toggleExpand = (userEmail: string) => {
    setExpandedEmails((prev) =>
      prev.includes(userEmail) ? prev.filter((e) => e !== userEmail) : [...prev, userEmail]
    );
    // Fetch quiz scores when expanding a user card
    if (!expandedEmails.includes(userEmail)) {
      const userToExpand = users.find(u => u.email === userEmail) || user;
      if (userToExpand?.email) {
        fetchQuizScores(userToExpand.email);
      }
    }
  };

  // For Bar Chart: aggregate completed vs incomplete counts per module
  const getModuleCompletionData = (progress: SectionProgress[] = []) => {
    const moduleMap: {
      [moduleName: string]: { completed: number; incomplete: number };
    } = {};

    progress.forEach(({ moduleName, completed }) => {
      if (!moduleMap[moduleName]) {
        moduleMap[moduleName] = { completed: 0, incomplete: 0 };
      }
      if (completed) moduleMap[moduleName].completed++;
      else moduleMap[moduleName].incomplete++;
    });

    return Object.entries(moduleMap).map(([moduleName, counts]) => ({
      moduleName,
      ...counts,
    }));
  };

  // For Pie Chart: bucket progress % into ranges and count
  const getProgressDistributionData = (progress: SectionProgress[] = []) => {
    const buckets = {
      "0-25%": 0,
      "26-50%": 0,
      "51-75%": 0,
      "76-100%": 0,
    };

    progress.forEach(({ progressPercentage }) => {
      if (progressPercentage <= 25) buckets["0-25%"]++;
      else if (progressPercentage <= 50) buckets["26-50%"]++;
      else if (progressPercentage <= 75) buckets["51-75%"]++;
      else buckets["76-100%"]++;
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  };

  const UserDetailCard: React.FC<{ user: User }> = ({ user }) => {
    const userEmail = user.email || "";
    const isExpanded = expandedEmails.includes(userEmail);

    // Local state for showing limited rows in Course Progress Table
    const [showAllSections, setShowAllSections] = useState(false);
    const MAX_ROWS = 3;

    const courseProgressToShow = showAllSections
      ? user.courseProgress ?? []
      : (user.courseProgress ?? []).slice(0, MAX_ROWS);

    const moduleCompletionData = getModuleCompletionData(user.courseProgress ?? []);
    const progressDistributionData = getProgressDistributionData(user.courseProgress ?? []);

    return (
      <div
        style={{
          marginTop: 0,
          margin: 40,
          padding: "30px 30px 80px",
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
            <h2 style={{ margin: 0, fontSize: 18, color: "#34495e", display: "flex", alignItems: "center", gap: 8 }}>
              <ContactPageIcon sx={{ color: "primary" }} />
              {user.name || "Unnamed User"}
            </h2>
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
            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {/* Final Quiz Section */}
              <div style={{ minWidth: 350 }}>
                <h3 style={{ marginBottom: 12, color: "black" }}>Final Quiz Score</h3>
                {quizLoading ? (
                  <p>Loading quiz scores...</p>
                ) : quizError ? (
                  <p style={{ color: "grey" }}> No final quiz data available.</p>
                ) : quizScores.length > 0 ? (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Quiz Name", "Score", "Date Taken"].map((header) => (
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
                      {quizScores.map((quiz, idx) => (
                        <tr
                          key={`${quiz.quizName}-${idx}`}
                          style={{
                            backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                          }}
                        >
                          <td style={{ padding: "8px" }}>{quiz.quizName}</td>
                          <td style={{ padding: "8px" }}>
                            {(quiz.score).toFixed(1)}%
                          </td>
                          <td style={{ padding: "8px" }}>
                            {new Date(quiz.dateTaken).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#7f8c8d", fontStyle: "italic" }}>
                    No final quiz data available.
                  </p>
                )}
              </div>

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
                      {user.loginHistory.map(({ time, ip, location }, idx) => {
                        const dateObj = new Date(time);
                        const date = dateObj.toLocaleDateString();
                        const timeStr = dateObj.toLocaleTimeString();
                        return (
                          <tr
                            key={`${time}-${ip}-${idx}`}
                            style={{
                              backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                            }}
                          >
                            <td style={{ padding: "8px" }}>{date}</td>
                            <td style={{ padding: "8px" }}>{timeStr}</td>
                            <td style={{ padding: "8px" }}>{ip}</td>
                            <td style={{ padding: "8px" }}>{location}</td>
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
              <div style={{ flex: "1 1 380px", minWidth: 320 }}>
                <h3 style={{ marginBottom: 12, color: "black" }}>Course Progress</h3>
                {user.courseProgress?.length ? (
                  <>
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
                        {courseProgressToShow.map(
                          ({ moduleName, sectionName, completed, progressPercentage }, idx) => (
                            <tr
                              key={`${moduleName}-${sectionName}-${idx}`}
                              style={{
                                backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                              }}
                            >
                              <td style={{ padding: "8px" }}>{moduleName}</td>
                              <td style={{ padding: "8px" }}>{sectionName}</td>
                              <td style={{ padding: "8px" }}>
                                {completed ? "✔️" : "❌"}
                              </td>
                              <td style={{ padding: "8px" }}>
                                {progressPercentage.toFixed(1)}%
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                    {user.courseProgress.length > MAX_ROWS && (
                      <button
                        onClick={() => setShowAllSections(!showAllSections)}
                        style={{
                          marginTop: 12,
                          backgroundColor: "#2980b9",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: 6,
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: 14,
                        }}
                      >
                        {showAllSections ? "Show Less" : `Show All (${user.courseProgress.length})`}
                      </button>
                    )}
                  </>
                ) : (
                  <p>No course progress data available.</p>
                )}
              </div>
            </div>

            {/* Charts */}
            <div
              style={{
                marginTop: 36,
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {/* Bar Chart: Completed vs Incomplete per Module */}
              <div style={{ flex: "1 1 400px", minWidth: 320, height: 300 }}>
                <h3 style={{ marginBottom: 12, textAlign: "center", color: "black" }}>
                  Module Completion Overview
                </h3>
                {moduleCompletionData.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={moduleCompletionData}
                      margin={{ top: 10, right: 20, bottom: 30, left: 10 }}
                      barCategoryGap="20%"
                    >
                      <XAxis
                        dataKey="moduleName"
                        tick={{ fontSize: 14, fill: "#34495e" }}
                        tickLine={false}
                        axisLine={{ stroke: "#bdc3c7" }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => value}
                        cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                      />
                      <Bar dataKey="completed" fill={BAR_COLORS[0]} stackId="a" />
                      <Bar dataKey="incomplete" fill={BAR_COLORS[1]} stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: "center", color: "#7f8c8d" }}>No module completion data.</p>
                )}
              </div>

              {/* Pie Chart: Progress Distribution */}
              <div style={{ flex: "1 1 300px", minWidth: 280, height: 300 }}>
                <h3 style={{ marginBottom: 12, textAlign: "center", color: "black" }}>
                  Progress Distribution
                </h3>
                {progressDistributionData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {progressDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ textAlign: "center", color: "#7f8c8d" }}>
                    No progress distribution data.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <main
        style={{
          backgroundColor:"white",
          color:'black',
        }}
      >
        <MenuBar />

        <h1 style={{ color: "#34495e", textAlign: "center" }}>
          Course Progress Details
        </h1>

        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && !error && (
          <>
            {email ? (
              user ? (
                <UserDetailCard user={user} />
              ) : (
                <p>No user data found for email: {email}</p>
              )
            ) : (
              <>
                {users.length === 0 && <p>No users found.</p>}
                {users.map((user, idx) => (
                  <UserDetailCard key={user.email ?? idx} user={user} />
                ))}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default CourseProgressDetails;