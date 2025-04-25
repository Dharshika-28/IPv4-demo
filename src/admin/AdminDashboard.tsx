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
  module: string;
  completed: boolean;
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
    fetch(`http://localhost:8080/api/progress/All`)
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

  // Count users who have completed all modules (exclude users with zero modules)
  const usersCompletedAll = users.filter(
    (user) =>
      user.courseProgress.length > 0 &&
      user.courseProgress.every((module) => module.completed)
  ).length;

  // Calculate average progress percentage across all users
  const avgProgress = users.length
    ? users.reduce((sum, user) => {
        const totalModules = user.courseProgress.length;
        if (totalModules === 0) return sum;
        const completedCount = user.courseProgress.filter((m) => m.completed).length;
        return sum + (completedCount / totalModules) * 100;
      }, 0) / users.length
    : 0;

  // Total number of user logins
  const totalLogins = users.reduce((sum, user) => sum + user.loginHistory.length, 0);

  // Data for the pie chart (completion overview)
  const progressData = [
    { name: "Incomplete", value: users.length - usersCompletedAll },
    { name: "Completed All", value: usersCompletedAll },
  ];

  // Data for the bar chart (user progress percentages)
  const barChartData = users.map((user) => {
    const totalModules = user.courseProgress.length;
    if (totalModules === 0) return { name: user.name, progress: 0 };
    const completedCount = user.courseProgress.filter((m) => m.completed).length;
    return {
      name: user.name,
      progress: (completedCount / totalModules) * 100,
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
                <h2>Average Progress</h2>
                <p>{avgProgress.toFixed(1)}%</p>
              </div>
              <div className="card">
                <h2>Total User Logins</h2>
                <p>{totalLogins}</p>
              </div>
              <div className="card">
                <h2>
                  Completed All
                  <hr />
                  <br />
                  IPv4 course
                </h2>
                <p>{usersCompletedAll}</p>
              </div>
            </div>

            <div className="charts">
              <div className="chart-box">
                <h3>Completion Overview</h3>
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
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-box">
                <h3>User Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
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
