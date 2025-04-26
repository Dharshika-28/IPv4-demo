import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./AdminDashboard.css";
import MenuBar from "../styles/MenuBar.tsx";
import Dails from "../styles/Dails.tsx";

type LoginEntry = {
  time: string;
  ip: string;
  location: string;
};

type CourseProgress = {
  moduleName: string;
  progressPercentage: number;
};

type User = {
  name: string;
  email: string;
  loginHistory: LoginEntry[];
  courseProgress: CourseProgress[];
};

const COLORS = ["#007bff", "#28a745"];

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/progress/All")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        const cleanedData: User[] = data.map((user: any) => ({
          name: user.name,
          email: user.email,
          loginHistory: user.loginHistory || [],
          courseProgress: (user.courseProgress || []).map((progress: any) => ({
            moduleName: progress.moduleName,
            progressPercentage: progress.progressPercentage || 0,
          })),
        }));

        setUsers(cleanedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get the last module update per user
  const getLastProgress = (progressList: CourseProgress[]) => {
    return progressList.length > 0
      ? progressList[progressList.length - 1]
      : null;
  };

  // Count users who completed the last module with 100%
  const usersCompletedAll = users.filter((user) => {
    const lastProgress = getLastProgress(user.courseProgress);
    return lastProgress && lastProgress.progressPercentage === 100;
  }).length;

  // Average of all users' last module progress
  const avgProgress = users.length
    ? users.reduce((sum, user) => {
        const last = getLastProgress(user.courseProgress);
        return sum + (last ? last.progressPercentage : 0);
      }, 0) / users.length
    : 0;

  const totalLogins = users.reduce(
    (sum, user) => sum + user.loginHistory.length,
    0
  );

  const progressData = [
    { name: "Incomplete", value: users.length - usersCompletedAll },
    { name: "Completed Last Module", value: usersCompletedAll },
  ];

  const barChartData = users.map((user) => {
    const last = getLastProgress(user.courseProgress);
    return {
      name: user.name,
      module: last?.moduleName || "N/A",
      progress: last?.progressPercentage || 0,
    };
  });

  return (
    <div>
      <MenuBar />
      <div className="admin-dashboard">
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <>
            <div className="summary-cards">
              <div className="card">
                <h2>Total Users</h2>
                <p>{users.length}</p>
              </div>
              <div className="card">
                <h2>Average Last Module Progress</h2>
                <p>{avgProgress.toFixed(1)}%</p>
              </div>
              <div className="card">
                <h2>Total User Logins</h2>
                <p>{totalLogins}</p>
              </div>
              <div className="card">
                <h2>Users Completed <hr/> All Module</h2>
                <p>{usersCompletedAll}</p>
              </div>
            </div>

            <div className="charts">
              <div className="chart-box">
                <h3>Last Module Completion Overview</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={progressData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {progressData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-box">
                <h3>User Last Module Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, name: any, props: any) => [
                        `${value}%`,
                        "Progress",
                      ]}
                      labelFormatter={(label) =>
                        `User: ${label} - ${barChartData.find(
                          (u) => u.name === label
                        )?.module}`
                      }
                    />
                    <Bar dataKey="progress" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Dails />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
