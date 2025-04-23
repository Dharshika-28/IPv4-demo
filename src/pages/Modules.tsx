import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../css/ModulePage.css";
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import ProfileSummary from "../pages/Profile.tsx";

interface ModulePageProps {
  username: string;
}

const ModulePage: React.FC<ModulePageProps> = ({ username }) => {
  const [quizFeedback, setQuizFeedback] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<number>(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});

  const modules: Record<string, string[]> = {
    MODULE_1: [
      "Section 1: What is IPv4?",
      "Section 2: Network Bits & Host Bits",
      "Section 3: IP Address Classes (A, B, C, D, E)",
      "Section 4: Public vs Private IPs",
      "Section 5: Quick Trick – Finding Network & Host Bits",
      "Section 6: What is IPv6?",
      "Section 7: Why You Should Care?",
      "Section 8: Summary Recap",
      "Module 1 Quiz"
    ],
    MODULE_2: [
      "Section 1: What is a MAC Address?",
      "Section 2: Where is the MAC Used?",
      "Section 3: MAC vs IP - What's the Difference?",
      "Section 4: How does a switch use MAC?",
      "Section 5: Format of a MAC Address?",
      "Section 6: Can a MAC Address be Changed?",
      "Section 7: Why You Should Know This",
      "Section 8: Recap Time",
      "Module 2 Quiz"
    ],
    MODULE_3: [
      "Section 1: What is a Cisco Switch?",
      "Section 2: Why do we use a Switch?",
      "Section 3: Switch Ports - What Are They?",
      "Section 4: Layer 2 vs Layer 3 Switches",
      "Section 5: Duplex Settings",
      "Section 6: Speed Options",
      "Section 7: Show Commands (Just for Fun)",
      "Section 8: Recap Time Switch",
      "Module 3 Quiz"
    ],
    FINAL: ["Final Quiz"]
  };

  useEffect(() => {
    if (!username) return;

    axios.get(`/api/progress/${username}`)
      .then(response => {
        const userProgress = response.data;
        const completed: Record<string, boolean> = {};

        userProgress.forEach((p: any) => {
          completed[p.sectionName] = p.completed;
        });

        setCompletedModules(completed);
        const calculated = calculateProgress(completed);
        setProgress(calculated);

        // Set activeModule to first unlocked section by default
        const allSections = Object.values(modules).flat();
        const firstUnlocked = allSections.find(section => !completed[section]);
        setActiveModule(firstUnlocked || allSections[0]);
      })
      .catch(error => console.error("Error fetching progress:", error));
  }, [username]);

  const saveProgressToBackend = (moduleName: string, sectionName: string, completed: boolean, newProgress: number) => {
    console.log("Saving progress to backend:", { moduleName, sectionName, completed, newProgress });
    axios.post('/api/progress/save', {
      username,
      moduleName,
      sectionName,
      completed,
      progress: newProgress
    })
    .then(res => {
      console.log("Progress saved response:", res.data);
    })
    .catch(err => {
      console.error("Error saving progress:", err);
    });
  };

  const calculateProgress = (state = completedModules) => {
    const total = Object.values(modules).flat().length;
    const done = Object.entries(state).filter(([_, completed]) => completed).length;
    return Math.round((done / total) * 100);
  };

  const markAsComplete = (moduleName: string, section: string) => {
    console.log(`Marking complete: ${section} in ${moduleName}`);

    const updated = { ...completedModules, [section]: true };
    setCompletedModules(updated);

    const allSections = Object.values(modules).flat();
    const currentIndex = allSections.indexOf(section);
    const nextSection = allSections[currentIndex + 1];

    if (nextSection) {
      setActiveModule(nextSection);
    }

    const newProgress = calculateProgress(updated);
    setProgress(newProgress);
    console.log("New progress:", newProgress);

    saveProgressToBackend(moduleName, section, true, newProgress);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  const isSectionUnlocked = (section: string) => {
    const allSections = Object.values(modules).flat();
    const index = allSections.indexOf(section);
    if (index === 0) return true;
    return completedModules[allSections[index - 1]];
  };

  const handleAnswerChange = (questionId: string, selectedOption: string) => {
    const correctAnswers: Record<string, string> = {
      "Module 1 Q1": "B",
      "Module 1 Q2": "A"
    };
    setQuizAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    setQuizFeedback(prev => ({
      ...prev,
      [questionId]: correctAnswers[questionId] === selectedOption
    }));
  };

  const moduleContents: Record<string, JSX.Element> = {
    "Section 1: What is IPv4?": (
      <div className="module-content">
        <h3>What is IPv4</h3>
        <p>IPv4 stands for Internet Protocol version 4.</p>
        <p>It acts like a home address for your device online.</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 1: What is IPv4?")}>Next section</button>
      </div>
    ),
    "Section 2: Network Bits & Host Bits": (
      <div className="module-content">
        <h3>Network Bits & Host Bits</h3>
        <p>Every IP has network and host parts.</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 2: Network Bits & Host Bits")}>Mark as Complete</button>
      </div>
    ),
    "Module 1 Quiz": (
      <div className="module-content">
        <h3>Module 1 Quiz</h3>
        <div className="quiz-question">
          <p>1. How many bits in IPv4?</p>
          {["A", "B", "C"].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="q1"
                onChange={() => handleAnswerChange("Module 1 Q1", opt)}
                checked={quizAnswers["Module 1 Q1"] === opt}
              /> {opt}) {["16", "32", "64"][i]}
            </label>
          ))}
          {quizFeedback["Module 1 Q1"] !== undefined && (
            <p className={quizFeedback["Module 1 Q1"] ? "correct" : "incorrect"}>
              {quizFeedback["Module 1 Q1"] ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>
        <button onClick={() => markAsComplete("MODULE_1", "Module 1 Quiz")} className="complete-btn">Submit Quiz</button>
      </div>
    ),
    "Final Quiz": (
      <div className="module-content">
        <h3>Final Quiz</h3>
        <p>This will cover all 12 modules. Coming soon!</p>
        <button onClick={() => markAsComplete("FINAL", "Final Quiz")} className="complete-btn">Mark Complete</button>
      </div>
    )
  };

  return (
    <div>
      <ProfileSummary 
        userName={username}
        profilePic={""}
        totalSections={Object.values(modules).flat().length}
        completedSections={Object.values(completedModules).filter(Boolean).length}
        lastSection={activeModule || ""}
      />
      <div className="ipv4-course">
        <div className="course-content">
          <aside className="course-sidebar">
            <div className="sidebar-top">
              <h3>{username}'s Progress</h3>
              <div className="sidebar-progress">
                <div className="progress-bar-small">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <span>{progress}%</span>
              </div>
            </div>
            {Object.entries(modules).map(([key, moduleSections]) => (
              <div key={key} className="module-section">
                <h4 onClick={() => toggleSection(key)} className="accordion-toggle">
                  {expandedSection === key ? '▼' : '▶'} {key.replace('_', ' ')}
                </h4>
                {expandedSection === key && (
                  <ul>
                    {moduleSections.map((section) => (
                      <li
                        key={section}
                        className={`${activeModule === section ? "active-section" : ""} ${!isSectionUnlocked(section) ? "locked" : ""}`}
                        onClick={() => isSectionUnlocked(section) && setActiveModule(section)}
                      >
                        {completedModules[section] ? <FaCheckCircle color="green" /> : <FaRegCircle />} {section}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </aside>

          <main className="module-display">
            {activeModule ? moduleContents[activeModule] || <p>Content not available.</p> : <p>Select a section to get started!</p>}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
