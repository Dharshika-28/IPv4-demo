import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../css/ModulePage.css";
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import ProfileSummary from "./Profile.tsx";

interface ModulePageProps {
  username: string;
}

const ModulePage: React.FC<ModulePageProps> = ({ username }) => {
  // Removed default values, start empty/null
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
      "Section 5: Quick Trick - Finding Network & Host Bits",
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
      "Module 3 Quiz",
      "Section 9: Switch MAC Address Table",
      "Section 10: Broadcast, Unicast, Multicast",
      "Section 11: PoE - Power over Ethernet",
      "Section 12: VLAN (Intro Only)",
      "Section 13: Port Security (Sneak Peek)",
      "Section 14: Trunk Ports (Mini Intro)",
      "Section 15: Real-Life Application",
      "Section 16: Final Recap",
      "Module 3/2 Quiz"
    ],
    FINAL: ["Final Quiz"]
  };

  useEffect(() => {
    if (!username) return; // don't fetch if username is falsy
  
    fetch(`http://localhost:8080/api/user/login/${encodeURIComponent(username)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }
        return response.json();
      })
      .then((userProgress: { sectionName: string; completed: boolean }[]) => {
        const completed: Record<string, boolean> = {};
  
        userProgress.forEach((p) => {
          completed[p.sectionName] = p.completed;
        });
  
        setCompletedModules(completed);
  
        const calculated = calculateProgress(completed);
        setProgress(calculated);
      })
      .catch((error) => {
        console.error("Error fetching progress:", error);
      });
  }, [username]);
  
  const saveProgressToBackend = (
    moduleName: string,
    sectionName: string,
    completed: boolean,
    newProgress: number
  ) => {
    fetch('http://localhost:8080/api/progress/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: {
          username: username,
        },
        moduleName,
        sectionName,
        completed,
        progressPercentage: newProgress,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save progress");
        return res.json();
      })
      .then((data) => {
        console.log("Progress saved:", data);
      })
      .catch((err) => {
        console.error("Error saving progress:", err);
      });
  };
  
  

  const calculateProgress = (state = completedModules) => {
    const total = Object.values(modules).flat().length;
    const done = Object.entries(state).filter(([_, completed]) => completed).length;
    return Math.round((done / total) * 100);
  };

  const markAsComplete = (moduleName: string, section: string) => {
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
      "Module 1 Q2": "C",
      "Module 1 Q3": "A",
      "Module 1 Q4": "C",
      "Module 1 Q5": "C",
      "Module 2 Q1": "B",
    "Module 2 Q2": "C",
    "Module 2 Q3": "C",
    "Module 2 Q4": "B",
    "Module 2 Q5": "B",
    "Module 3 Q1": "B",
    "Module 3 Q2": "B",
    "Module 3 Q3": "C",
    "Module 3 Q4": "C",
    "Module 3 Q5": "C",
    "Module 3/2 Q1": "B",
    "Module 3/2 Q2": "B",
    "Module 3/2 Q3": "B",
    "Module 3/2 Q4": "C",
    "Module 3/2 Q5": "B",
    "Final Quiz Q1": "B", 
    "Final Quiz Q2": "B", 
    "Final Quiz Q3": "A", 
    "Final Quiz Q4": "B", 
    "Final Quiz Q5": "B", 
    "Final Quiz Q6": "C", 
    "Final Quiz Q7": "B", 
    "Final Quiz Q8": "B", 
    "Final Quiz Q9": "B", 
    "Final Quiz Q10": "C", 
  
    

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
        <p> Hey there! Let’s start with the basics.</p>
        <p>IPv4 stands for Internet Protocol version 4.</p>
        <p>It’s a set of rules that govern how data is sent and received over the internet.
          It’s like a home address for your device on the internet.</p>
        <p> 👉An IPv4 address looks like this: 192.168.1.1
          It's made up of 4 numbers separated by dots.</p>
        <p>Each number can be between 0 and 255.</p>

        <p><strong>🧠Why do we need IP addresses?</strong></p>
        <p>Because every device needs a unique address to talk on the internet—just like people need
          phone numbers to call each other.</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 1: What is IPv4?")}>Next section</button>
      </div>
    ),
    "Section 2: Network Bits & Host Bits": (
      <div className="module-content">
        <h3>Network Bits & Host Bits</h3>
        <p>Every IP address has two parts:</p>
        <ul>
          <li>Network part - tells us which network the device belongs to.</li>
          <li>Host part - tells us which device inside that network.</li>
        </ul>
        <p>That's where the Subnet Mask comes in!</p>
        <p><strong> Example:</strong></p>
        <ul>
          <li>
            IP: 192.168.1.1
          </li>
          <li>
            Subnet Mask: 255.255.255.0
          </li>
        </ul>
        <p> This means:</p>
        <ul>
          <li>
            Network bits: first 3 sections (192.168.1)
          </li>
          <li>
            Host bits: last section (1)
          </li>

        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 2: Network Bits & Host Bits")}>Next section</button>
      </div>
    ),
    "Section 3: IP Address Classes (A, B, C, D, E)": (
      <div className="module-content">
        <h3>IP Address Classes (A, B, C, D, E)</h3>
        <p>All IP addresses belong to one of five classes. Here's how they are categorized:</p>

        <table className="ip-class-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Start IP</th>
              <th>End IP</th>
              <th>Used For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A</td>
              <td>1.0.0.0</td>
              <td>126.255.255.255</td>
              <td>Big networks</td>
            </tr>
            <tr>
              <td>B</td>
              <td>128.0.0.0</td>
              <td>191.255.255.255</td>
              <td>Medium networks</td>
            </tr>
            <tr>
              <td>C</td>
              <td>192.0.0.0</td>
              <td>223.255.255.255</td>
              <td>Small networks</td>
            </tr>
            <tr>
              <td>D</td>
              <td>224.0.0.0</td>
              <td>239.255.255.255</td>
              <td>Multicasting</td>
            </tr>
            <tr>
              <td>E</td>
              <td>240.0.0.0</td>
              <td>255.255.255.255</td>
              <td>Reserved (research)</td>
            </tr>
          </tbody>
        </table>
        <p> <strong>🎓Tip to Remember:</strong></p>
        <p>Class A = Big networks, Class B = Medium networks, Class C = Small networks.</p>
        <p>Classes D and E are for special purposes.</p>

        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 3: IP Address Classes (A, B, C, D, E)")}>
          Next Section
        </button>
      </div>
    ),

    "Section 4: Public vs Private IPs": (
      <div className="module-content">
        <h3>Public vs Private IPs</h3>
        <p>Not all IPs can go to the internet directly. Here's a comparison between private and public IPs:</p>

        <table className="ip-class-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Private</td>
              <td>Used inside home or office networks</td>
              <td>192.168.x.x / 10.x.x.x / 172.16.x.x</td>
            </tr>
            <tr>
              <td>Public</td>
              <td>Used to connect to the internet, assigned by ISPs</td>
              <td>Given by ISPs (e.g., 8.8.8.8)</td>
            </tr>
          </tbody>
        </table>
        <p>💡Devices with private IPs talk to each other inside a local network.
          To go to the internet, they use a router with a public IP</p>

        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 4: Public vs Private IPs")}>
          Next Section
        </button>
      </div>
    ),
    "Section 5: Quick Trick - Finding Network & Host Bits": (
      <div className="module-content">
        <h3>Quick Trick - Finding Network & Host Bits</h3>
        <p>Just look at the Subnet Mask!</p>
        <ul>
          <li>
            255 = Network Bit
          </li>
          <li>
            0 = Host Bit
          </li>
        </ul>
        <p><strong>Example:</strong></p>
        <p><strong>Mask:</strong> 255.255.255.0 → 3 parts = network, 1 part = host</p>
        <p>So:</p>
        <ul>
          <li>
            Network bits = 24
          </li>
          <li>
            Host bits = 8
          </li>

        </ul>
        <p> 🎯Total bits = 32 (IPv4 is always 32-bit)</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 5: Quick Trick - Finding Network & Host Bits")}>Next Section</button>
      </div>
    ),
    "Section 6: What is IPv6?": (
      <div className="module-content">
        <h3>What is IPv6?</h3>
        <p>IPv6 is the newer version of IP.</p>
        <p>Why? Because IPv4 is running out of addresses!</p>
        <p><strong>IPv6 looks like this:</strong></p>
        <p>2001:0db8:85a3:0000:0000:8a2e:0370:7334</p>
        <p>It has 128 bits, so way more addresses!</p>
        <ul>
          <li>
            IPv4 = 32 bits = 4 billion addresses
          </li>
          <li>
            IPv4 = 32 bits = 4 billion addresses
          </li>
        </ul>
        <p>But don't worry, we mostly use IPv4 now in labs and practice.</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 6: What is IPv6?")}>Next Section</button>
      </div>
    ),
    "Section 7: Why You Should Care?": (
      <div className="module-content">
        <h3>Why You Should Care? </h3>
        <p>As a networking student:</p>
        <ul>
          <li>
            You'll assign IPs to routers, PCs, servers.
          </li>
          <li>
            You'll subnet and split networks.
          </li>
          <li>
            You'll identify public/private IPs.
          </li>
          <li>
            You'll troubleshoot using these basics every day.
          </li>
        </ul>
        <p>
          💪Master this now, and CCNA becomes super easy.
        </p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 7: Why You Should Care?")}>Next Section</button>
      </div>
    ),
    "Section 8: Summary Recap": (
      <div className="module-content">
        <h3>Summary Recap</h3>
        <ul>
          <li>IPv4 = 32-bit, written in 4 blocks (decimal)</li>
          <li>Has network + host parts (based on subnet mask)</li>
          <li>IPs are grouped into Classes (A-E)</li>
          <li>Private IPs stay local; Public IPs go online</li>
          <li>IPv6 = Newer version, longer, and future-proof</li>

        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_1", "Section 8: Summary Recap")}>Next Section</button>
      </div>
    ),

    "Module 1 Quiz": (
      <div className="module-content">
        <h3>Module 1 Quiz</h3>

        {/* Q1 */}
        <div className="quiz-question">
          <p>1. Which part of an IP address identifies the device in the network?</p>
          {["A", "B", "C", "D"].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="q1"
                onChange={() => handleAnswerChange("Module 1 Q1", opt)}
                checked={quizAnswers["Module 1 Q1"] === opt}
                disabled={quizAnswers["Module 1 Q1"] !== undefined}
              />{" "}
              {opt}) {["Network part", "Host part", "Subnet mask", "Gateway"][i]}
            </label>
          ))}
          {quizFeedback["Module 1 Q1"] !== undefined && (
            <p className={quizFeedback["Module 1 Q1"] ? "correct" : "incorrect"}>
              {quizFeedback["Module 1 Q1"] ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>

        {/* Q2 */}
        <div className="quiz-question">
          <p>2. What class does the IP 10.0.0.1 belong to?</p>
          {["A", "B", "C", "D"].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="q2"
                onChange={() => handleAnswerChange("Module 1 Q2", opt)}
                checked={quizAnswers["Module 1 Q2"] === opt}
                disabled={quizAnswers["Module 1 Q2"] !== undefined}
              />{" "}
              {opt}) {["Class B", "Class C", "Class A", "Class D"][i]}
            </label>
          ))}
          {quizFeedback["Module 1 Q2"] !== undefined && (
            <p className={quizFeedback["Module 1 Q2"] ? "correct" : "incorrect"}>
              {quizFeedback["Module 1 Q2"] ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>

        {/* Q3 */}
        <div className="quiz-question">
          <p>3. Which of the following is a private IP address?</p>
          {["A", "B", "C", "D"].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="q3"
                onChange={() => handleAnswerChange("Module 1 Q3", opt)}
                checked={quizAnswers["Module 1 Q3"] === opt}
                disabled={quizAnswers["Module 1 Q3"] !== undefined}
              />{" "}
              {opt}) {["192.168.1.100", "8.8.8.8", "172.33.0.1", "224.0.0.1"][i]}
            </label>
          ))}
          {quizFeedback["Module 1 Q3"] !== undefined && (
            <p className={quizFeedback["Module 1 Q3"] ? "correct" : "incorrect"}>
              {quizFeedback["Module 1 Q3"] ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>

        {/* Q4 */}
        <div className="quiz-question">
          <p>4. How many bits does an IPv4 address have?</p>
          {["A", "B", "C", "D"].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="q4"
                onChange={() => handleAnswerChange("Module 1 Q4", opt)}
                checked={quizAnswers["Module 1 Q4"] === opt}
                disabled={quizAnswers["Module 1 Q4"] !== undefined}
              />{" "}
              {opt}) {["64", "128", "32", "256"][i]}
            </label>
          ))}
          {quizFeedback["Module 1 Q4"] !== undefined && (
            <p className={quizFeedback["Module 1 Q4"] ? "correct" : "incorrect"}>
              {quizFeedback["Module 1 Q4"] ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>

        {/* Q5 */}
        <div className="quiz-question">
          <p>5. What does a subnet mask of 255.255.255.0 mean?</p>
          {["A", "B", "C", "D"].map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="q5"
                onChange={() => handleAnswerChange("Module 1 Q5", opt)}
                checked={quizAnswers["Module 1 Q5"] === opt}
                disabled={quizAnswers["Module 1 Q5"] !== undefined}
              />{" "}
              {opt}) {[
                "All 32 bits are host bits",
                "First 24 bits are host bits",
                "First 24 bits are network bits",
                "All bits are reserved"
              ][i]}
            </label>
          ))}
          {quizFeedback["Module 1 Q5"] !== undefined && (
            <p className={quizFeedback["Module 1 Q5"] ? "correct" : "incorrect"}>
              {quizFeedback["Module 1 Q5"] ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>

        <button
  onClick={() => markAsComplete("Module_1","Module 1 Quiz")}
  className="complete-btn"
  disabled={
    !quizAnswers["Module 1 Q1"] ||
    !quizAnswers["Module 1 Q2"] ||
    !quizAnswers["Module 1 Q3"] ||
    !quizAnswers["Module 1 Q4"] ||
    !quizAnswers["Module 1 Q5"]
  }
>
  Submit Quiz
</button>
      </div>
    ),

    "Section 1: What is a MAC Address?": (
      <div className="module-content">
        <h3> What is a MAC Address?</h3>
        <p>Welcome back! You've heard about IP addresses — but have you ever wondered how your
          device is recognized in a network physically?</p>
        <p>That's where the MAC address comes in.</p>
        <p>🧠MAC = Media Access Control</p>
        <p>It's a unique ID burned into your device's network card (NIC). Think of it like a serial number
          for your device's network brain.</p>
        <p><strong>Example:</strong></p>
        <p>00:1A:2B:3C:4D:5E</p>
        <p> Looks confusing? Don't worry, it's just:</p>
        <ul>
          <li>
            6 pairs of hexadecimal numbers (0-9, A-F)
          </li>
          <li>
            Separated by colons : or dashes -
          </li>
        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2", "Section 1: What is a MAC Address?")}>Next Section</button>
      </div>
    ),
    "Section 2: Where is the MAC Used?": (
      <div className="module-content">
        <h3>Where is the MAC Used?</h3>

        <p>Great question! Unlike IP addresses that can change often…</p>
        <p>💡MAC addresses never change. They're fixed.</p>
        <p>MAC is used inside the LAN (Local Area Network).</p>
        <p>When data travels between two devices in the same network, the switch uses MAC addresses 
        to forward the data.
        </p>
        <p> 🎯Switches use MAC addresses to learn who is who.</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2", "Section 2: Where is the MAC Used?")}>Next Section</button>
      </div>
    ),
    "Section 3: MAC vs IP - What's the Difference?": (
  <div className="module-content">
    <h3>MAC vs IP - What's the Difference?</h3>
    
    <table className="ip-class-table">
    <thead>
        <tr>
          <th>Feature</th>
          <th>MAC Address</th>
          <th>IP Address</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Type</td>
          <td>Physical (hardware)</td>
          <td>Logical (software)</td>
        </tr>
        <tr>
          <td>Example</td>
          <td>00:0C:29:4F:8E:31</td>
          <td>192.168.0.10</td>
        </tr>
        <tr>
          <td>Changes?</td>
          <td>No – permanent</td>
          <td>Yes – can change</td>
        </tr>
        <tr>
          <td>Used by</td>
          <td>Switch</td>
          <td>Router</td>
        </tr>
        <tr>
          <td>Layer</td>
          <td>Layer 2 (Data Link Layer)</td>
          <td>Layer 3 (Network Layer)</td>
        </tr>
      </tbody>
    </table>
    <p><strong> ✅Quick Tip:</strong></p>
    <ul>
      <li>
      Router = looks at IP
      </li>
      <li>
      Switch = looks at MAC
      </li>
    </ul>

    <button className="complete-btn" onClick={() => markAsComplete("MODULE_2", "Section 3: MAC vs IP - What's the Difference?")}>Next Section</button>
  </div>
),
    "Section 4: How does a switch use MAC?": (
      <div className="module-content">
        <h3>How does a switch use MAC?</h3>
        <p>Let's simplify this:</p>
        <ul>
          <li>
            Suppose PC1 wants to send data to PC2.
          </li>
          <li>
            PC1 already knows the IP of PC2, but what about the MAC?
          </li>
        </ul>
        <p>✅ARP (Address Resolution Protocol) steps in!</p>
        <ul>
          <li>
          PC1 asks: “Who has IP 192.168.1.2?”
          </li>
          <li>
          PC2 replies: “That's me, my MAC is 00:0A:95:9D:68:16”
          </li>
        </ul>
        <p>
        Then the switch:
        </p>
        <ul>
          <li>
          Learns which MAC is connected to which port.
          </li>
          <li>
          Forwards the frame directly, like a postal worker knowing your exact apartment
          </li>

        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2", "Section 4: How does a switch use MAC?")}>Next Section</button>
      </div>
    ),
    
    "Section 5: Format of a MAC Address?": (
      <div className="module-content">
        <h3>Format of a MAC Address</h3>
        <p> <strong>Standard format:</strong></p>
        <p> XX:XX:XX:YY:YY:YY</p>
        <ul>
          <li>
          First 3 pairs = OUI (Organizational Unique Identifier)
 👉This shows the manufacturer (like Cisco, Intel, etc.)
          </li>
          <li>
          Last 3 pairs = NIC-specific (like a serial number)
          </li>
        </ul>
        <p><strong> 🧠Example:</strong></p>
        <p>3C:5A:B4:12:34:56</p>
        <ul>
          <li>
          3C:5A:B4 = Belongs to a company (like Dell)
          </li>
          <li>
          12:34:56 = Unique to your device
          </li>
        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2", "Section 5: Format of a MAC Address?")}>Next Section</button>
      </div>
    ),
    "Section 6: Can a MAC Address be Changed?": (
      <div className="module-content">
        <h3>Can a MAC Address be Changed</h3>
        <p>Technically… yes, but it’s not common.</p>
        <p>🛠Some OS or software tools allow you to spoof a MAC address for testing or privacy.</p>
        <p>But in general:</p>
        <p>🟥MAC = permanent</p>
        <p>🟩IP = flexible</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2",  "Section 6: Can a MAC Address be Changed?")}>Next Section</button>
      </div>
    ),

    "Section 7: Why You Should Know This": (
      <div className="module-content">
        <h3> Why You Should Know This</h3>
        <p>As a networking student or future engineer:</p>
       <ul>
        <li>
        You’ll use MAC addresses to troubleshoot LAN issues
        </li>
        <li>
        You’ll learn to check MAC tables on switches
        </li>
        <li>
        You’ll understand how ARP works (super important in CCNA)
        </li>
        <li>
        You’ll see how DHCP assigns IPs based on MAC
        </li>
       </ul>
       <p>
       🔥
       In short: Knowing MAC = understanding the heartbeat of the network.
       </p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2",  "Section 7: Why You Should Know This")}>Next Section</button>
      </div>
    ),

    "Section 8: Recap Time": (
      <div className="module-content">
        <h3>Recap time</h3>
        <ul>
          <li>
          MAC = physical ID, unique to each device
          </li>
          <li>
          Written in hexadecimal (6 pairs)
          </li>
          <li>
          Used by switches to forward frames
          </li>
          <li>
          Works at Layer 2
          </li>
          <li>
          Never changes (usually)
          </li>
        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_2", "Section 8: Recap Time")}>Next Section</button>
      </div>
    ),
    "Module 2 Quiz": (
  <div className="module-content">
    <h3>Module 2 Quiz</h3>

    <div className="quiz-question">
      <p>1. What layer of the OSI model does the MAC address belong to?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q1"
            value={opt}
            onChange={() => handleAnswerChange("Module 2 Q1", opt)}
            checked={quizAnswers["Module 2 Q1"] === opt}
            disabled={quizAnswers["Module 2 Q1"] !== undefined}
          /> 
          {opt} {["Layer 1", "Layer 2", "Layer 3", "Layer 4"][i]}
        </label>
      ))}
      {quizFeedback["Module 2 Q1"] !== undefined && (
        <p className={quizFeedback["Module 2 Q1"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 2 Q1"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    <div className="quiz-question">
      <p>2. Which of the following is a valid MAC address?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q2"
            value={opt}
            onChange={() => handleAnswerChange("Module 2 Q2", opt)}
            checked={quizAnswers["Module 2 Q2"] === opt}
            disabled={quizAnswers["Module 2 Q2"] !== undefined}
          /> 
          {opt} {["192.168.1.1", "255.255.255.0", "00:1A:2B:3C:4D:5E", "10.0.0.1"][i]}
        </label>
      ))}
      {quizFeedback["Module 2 Q2"] !== undefined && (
        <p className={quizFeedback["Module 2 Q2"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 2 Q2"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    <div className="quiz-question">
      <p>3. What protocol is used to map an IP address to a MAC address?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q3"
            value={opt}
            onChange={() => handleAnswerChange("Module 2 Q3", opt)}
            checked={quizAnswers["Module 2 Q3"] === opt}
            disabled={quizAnswers["Module 2 Q3"] !== undefined}
          />
          {opt} {["DNS", "FTP", "ARP", "DHCP"][i]}
        </label>
      ))}
      {quizFeedback["Module 2 Q3"] !== undefined && (
        <p className={quizFeedback["Module 2 Q3"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 2 Q3"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    <div className="quiz-question">
      <p>4. Which device uses MAC addresses to forward data in a LAN?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q4"
            value={opt}
            onChange={() => handleAnswerChange("Module 2 Q4", opt)}
            checked={quizAnswers["Module 2 Q4"] === opt}
            disabled={quizAnswers["Module 2 Q4"] !== undefined}
          />
          {opt} {["Router", "Switch", "Firewall", "Modem"][i]}
        </label>
      ))}
      {quizFeedback["Module 2 Q4"] !== undefined && (
        <p className={quizFeedback["Module 2 Q4"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 2 Q4"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    <div className="quiz-question">
      <p>5. Which part of the MAC address identifies the manufacturer?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q5"
            value={opt}
            onChange={() => handleAnswerChange("Module 2 Q5", opt)}
            checked={quizAnswers["Module 2 Q5"] === opt}
            disabled={quizAnswers["Module 2 Q5"] !== undefined}
          />
          {opt} {["Last 6 digits", "First 3 digits", "Middle pair", "The IP address part"][i]}
        </label>
      ))}
      {quizFeedback["Module 2 Q5"] !== undefined && (
        <p className={quizFeedback["Module 2 Q5"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 2 Q5"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    <button
  onClick={() => markAsComplete("Module_2","Module 2 Quiz")}
  className="complete-btn"
  disabled={
    !quizAnswers["Module 2 Q1"] ||
    !quizAnswers["Module 2 Q2"] ||
    !quizAnswers["Module 2 Q3"] ||
    !quizAnswers["Module 2 Q4"] ||
    !quizAnswers["Module 2 Q5"]
  }
>
  Submit Quiz
</button>
  </div>
),

"Section 1: What is a Cisco Switch?": (
      <div className="module-content">
        <h3> What is a Cisco Switch?</h3>
        <p>Alright! You’ve learned about MAC addresses — now, let’s talk about the device that actually 
        uses them every second: the Switch!</p>
        <p> 🎓In networking, a switch is like the “tra c police” of your LAN. It connects multiple devices 
(PCs, printers, access points) and forwards data only where it needs to go.
        </p>
        <p>🧠Cisco is the most popular company that makes professional switches. In the real world 
(and in CCNA labs), you’ll use a Cisco switch in nearly every network setup.
        </p>
        
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 1: What is a Cisco Switch?")}>Next Section</button>
      </div>
    ),
    "Section 2: Why do we use a Switch?": (
      <div className="module-content">
        <h3>Why do we use a Switch?</h3>
        <p> Let’s say you have 10 computers. You want all of them to:</p>
        <ul>
          <li>
          Share files
          </li>
          <li>
          Access the internet
          </li>
          <li>
          Connect to a server
          </li>
        </ul>
        <p>You plug them into the <strong>switch</strong> using<strong> Ethernet cables</strong>.</p>
        <p>Now the switch: 
✅
 Creates a connection between only <strong>sender and receiver</strong></p>
 <p> ✅Learns MAC addresses of all devices
 </p>
 <p>✅
 Forwards frames to the correct port</p>
 <p>✅
 Reduces congestion (compared to a hub)</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 2: Why do we use a Switch?")}>Next Section</button>
      </div>
    ),
    "Section 3: Switch Ports - What Are They?": (
      <div className="module-content">
        <h3>What Are They?</h3>
        <p>Every switch has ports — those little holes where your Ethernet cables go.
        </p>
        <p>🧩Each port is like a doorway to a connected device.</p>
        <p> Example:</p>
        <ul>
          <li>
          <strong>Port 1 </strong>→ PC1
          </li>
          <li>
          <strong>Port 2 </strong>→ PC2
          </li>
          <li>
          <strong>Port 3 </strong>→ Printer
          </li>
        </ul>
        <p>🔌Common switch types</p>
        <p><strong>Fast Ethernet (FE)</strong> = 100 Mbps</p>
        <p><strong>Gigabit Ethernet (GE)</strong> = 1000 Mbps (1 Gbps)</p>
        <p>
        Cisco switches come with 24-port or 48-port models for larger networks.
        </p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3",  "Section 3: Switch Ports - What Are They?")}>Next Section</button>
      </div>
    ),

    "Section 4: Layer 2 vs Layer 3 Switches": (
      <div className="module-content">
        <h3>Layer 2 vs Layer 3 Switches</h3>
        <p>There are two types of Cisco switches:</p>
        <p><strong>🔹Layer 2 Switch</strong></p>
        <ul>
          <li>
          Operates using <strong>MAC addresses</strong>
          </li>
          <li>
          Works at<strong> Data Link layer</strong>
          </li>
          <li>
          Basic switching
          </li>
        </ul>
        <p><strong> 🔹Layer 3 Switch</strong></p>
        <ul>
          <li>
          Supports <strong>routing </strong>too!
          </li>
          <li>
          Can forward packets using <strong>IP addresses</strong>
          </li>
          <li>
          Works at <strong>Network layer</strong>
          </li>
        </ul>
        <p>💡In CCNA, you mostly learn with Layer 2, but Layer 3 becomes useful in big enterprise 
networks</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 4: Layer 2 vs Layer 3 Switches")}>Next Section</button>
      </div>
    ),

    "Section 5: Duplex Settings": (
      <div className="module-content">
        <h3>Duplex Settings</h3>
        <p>A very important concept: Duplex.</p>
        <p>It decides <strong>how data is sent/received</strong> on a port.</p>
        <p><strong>🔄Half Duplex</strong></p>
        <ul>
          <li>
          One direction at a time
          </li>
          <li>
          Like a walkie-talkie
          </li>
          <li>
          Older tech or hubs
          </li>
        </ul>
        <p><strong> 🔁Full Duplex</strong></p>
        <ul>
          <li>
          Send & receive at the same time
          </li>
          <li>
          Like a phone call
          </li>
          <li>
          Modern switches use this by default
          </li>
        </ul>
        <p>✅
        Cisco switches support auto-negotiation, so devices agree on the best duplex setting.

        </p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 5: Duplex Settings")}>Next Section</button>
      </div>
    ),

    "Section 6: Speed Options": (
      <div className="module-content">
        <h3>Speed Options</h3>
        <p>Switch ports can work at di erent speeds, based on the port and cable.</p>
        <p> 🚀Typical Speeds:</p>
        <ul>
          <li>
            <strong> 10 Mbps (very old)</strong>
          </li>
          <li>
            <strong>100 Mbps (Fast Ethernet)</strong>
          </li>
          <li>
            <strong>1000 Mbps (Gigabit)</strong>
          </li>
          <li>
 <strong>10 Gbps </strong>sand higher (in enterprise-grade models)

          </li>
        </ul>
        <p>The speed depends on:</p>
        <ul>
          <li>
          Port type
          </li>
          <li>
          Cable quality
          </li>
          <li>
          Device compatibility
          </li>
        </ul>
        <p>
        📍
        Tip: Always use <strong>CAT5e or CAT6 </strong>cables for Gigabit speeds.
        </p>
        
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 6: Speed Options")}>Next Section</button>
      </div>
    ),

    "Section 7: Show Commands (Just for Fun)": (
      <div className="module-content">
        <h3>Show Commands (Just for Fun)</h3>
        <p> In a real Cisco switch, you can run:</p>
        <p> show interfaces</p>
        <p>To view:</p>
        <ul>
          <li>Port speed</li>
          <li> Duplex setting</li>
          <li> MACs learned</li>
          <li>Errors, collisions, etc.</li>
        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 7: Show Commands (Just for Fun)")}>Next Section</button>
      </div>
    ),
    "Section 8: Recap Time Switch": (
      <div className="module-content">
        <h3>Show Commands (Just for Fun)</h3>
        
        <ul>
          <li>Cisco switch connects devices in LAN</li>
          <li>Uses MAC addresses for forwarding</li>
          <li>Each port is a path to a device</li>
          <li>Layer 2 = switching | Layer 3 = routing</li>
          <li>Duplex = half or full</li>
          <li>Speeds = 10 Mbps to 10 Gbps</li>

        </ul>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 8: Recap Time Switch")}>Next Section</button>
      </div>
    ),

    "Module 3 Quiz": (
  <div className="module-content">
    <h3>Module 3 Quiz</h3>
    
    {/* Question 1 */}
    <div className="quiz-question">
      <p>1. What does a switch use to forward data in a network?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q1"
            onChange={() => handleAnswerChange("Module 3 Q1", opt)}
            checked={quizAnswers["Module 3 Q1"] === opt}
            disabled={quizAnswers["Module 3 Q1"] !== undefined}
          />
          {opt}) {["IP address", "MAC address", "Port number", "Subnet mask"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q1"] !== undefined && (
        <p className={quizFeedback["Module 3 Q1"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q1"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 2 */}
    <div className="quiz-question">
      <p>2. Which duplex setting allows data to be sent and received at the same time?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q2"
            onChange={() => handleAnswerChange("Module 3 Q2", opt)}
            checked={quizAnswers["Module 3 Q2"] === opt}
            disabled={quizAnswers["Module 3 Q2"] !== undefined}
          />
          {opt}) {["Half duplex", "Full duplex", "Dual mode", "Walkie mode"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q2"] !== undefined && (
        <p className={quizFeedback["Module 3 Q2"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q2"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 3 */}
    <div className="quiz-question">
      <p>3. What command shows port speed and duplex on a Cisco switch?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q3"
            onChange={() => handleAnswerChange("Module 3 Q3", opt)}
            checked={quizAnswers["Module 3 Q3"] === opt}
            disabled={quizAnswers["Module 3 Q3"] !== undefined}
          />
          {opt}) {["show users", "show speed", "show interfaces", "show ip"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q3"] !== undefined && (
        <p className={quizFeedback["Module 3 Q3"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q3"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 4 */}
    <div className="quiz-question">
      <p>4. What’s the max speed of a Gigabit Ethernet port?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q4"
            onChange={() => handleAnswerChange("Module 3 Q4", opt)}
            checked={quizAnswers["Module 3 Q4"] === opt}
            disabled={quizAnswers["Module 3 Q4"] !== undefined}
          />
          {opt}) {["100 Mbps", "10 Mbps", "1 Gbps", "10 Gbps"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q4"] !== undefined && (
        <p className={quizFeedback["Module 3 Q4"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q4"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 5 */}
    <div className="quiz-question">
      <p>5. A Layer 3 switch can perform:</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q5"
            onChange={() => handleAnswerChange("Module 3 Q5", opt)}
            checked={quizAnswers["Module 3 Q5"] === opt}
            disabled={quizAnswers["Module 3 Q5"] !== undefined}
          />
          {opt}) {["Switching only", "Routing only", "Switching & Routing", "Neither"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q5"] !== undefined && (
        <p className={quizFeedback["Module 3 Q5"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q5"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Submit Button */}
    <button
      onClick={() => markAsComplete("Module_3","Module 3 Quiz")}
      className="complete-btn"
      disabled={
        !quizAnswers["Module 3 Q1"] ||
        !quizAnswers["Module 3 Q2"] ||
        !quizAnswers["Module 3 Q3"] ||
        !quizAnswers["Module 3 Q4"] ||
        !quizAnswers["Module 3 Q5"]
      }
    >
      Submit Quiz
    </button>
  </div>
),

"Section 9: Switch MAC Address Table": (
  <div className="module-content">
    <h3>Switch MAC Address Table</h3>
    <p>When you plug a device into a switch, the switch learns the MAC of the device.</p>
    <p> You can check this with:</p>
    <p> show mac address-table</p>
    <p>💡
    The switch remembers:</p>
    <ul>
      <li>
      Which MAC is connected to
      </li>
      <li>
      Which port
      </li>
    </ul>
    <p>
    So when tra c comes in, it knows exactly where to send it.
    </p>
    <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 9: Switch MAC Address Table")}>Next Section</button>
  </div>
),

"Section 10: Broadcast, Unicast, Multicast": (
  <div className="module-content">
    <h3>Broadcast, Unicast, Multicast</h3>
    <p>Switches also handle di erent frame types:</p>
    <ul>
      <li>
     <strong> Unicast</strong> → One-to-one
      </li>
      <li>
     <strong> Broadcast </strong>→ One-to-all (e.g., ARP)
      </li>
      <li>
      <strong>Multicast </strong>→ One-to-group (used in streaming)
      </li>
    </ul>
    <p>
    Switches forward broadcast frames to all ports, just once.
    </p>
    <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 10: Broadcast, Unicast, Multicast")}>Next Section</button>
  </div>
),

"Section 11: PoE - Power over Ethernet": (
  <div className="module-content">
    <h3> PoE – Power over Ethernet</h3>
    <p>Some Cisco switches support PoE – they send power + data on the same cable!</p>
    <p> Use cases:</p>
    <ul>
      <li>
      IP phones
      </li>
      <li> Wireless access points</li>
      <li>Security cameras</li>
    </ul>
    <p>🚫No extra power adapters needed!</p>


    <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 11: PoE - Power over Ethernet")}>Next Section</button>
  </div>
),

"Section 12: VLAN (Intro Only)": (
      <div className="module-content">
        <h3>VLAN (Intro Only)</h3>
        <p>You’ll explore this more in your next module — but a Cisco switch can segment a network into 
        smaller parts called VLANs.</p>
        <p>💡
        Think of VLAN like virtual switches inside one switch.</p>
        <p>Each VLAN can act like its own network, even if devices are connected to the same switch 
        physically.</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 12: VLAN (Intro Only)")}>Next Section</button>
      </div>
    ),

    "Section 13: Port Security (Sneak Peek)": (
      <div className="module-content">
        <h3>Port Security (Sneak Peek)</h3>
        <p>Cisco switches can be configured to lock a port to one MAC address.</p>
        <p>If a different device is plugged in? 
 The port can be shut down automatically!</p>
        <p>That’s called Port Security, and it helps prevent unauthorized access.

        </p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 13: Port Security (Sneak Peek)")}>Next Section</button>
      </div>
    ),

      "Section 14: Trunk Ports (Mini Intro)": (
      <div className="module-content">
        <h3>Trunk Ports (Mini Intro)</h3>
        <p>When we connect one switch to another, we need to carry multiple VLANs together.</p>
        <p>For this, we configure a Trunk port.</p>
        <p>A trunk port allows:
        </p>
        <ul>
          <li>
          Multiple VLANs
          </li>
          <li>One cable between switches</li>
        </ul>
        <p>🔌
        Regular ports = Access ports</p>
        <p>🔌
        Special ports = Trunk ports</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3",  "Section 14: Trunk Ports (Mini Intro)")}>Next Section</button>
      </div>
    ),

    "Section 15: Real-Life Application": (
      <div className="module-content">
        <h3>Real-Life Application</h3>
        <p> In any office, here’s what you’ll find:</p>
        <ul>
          <li> Cisco switch in the server room</li>
          <li>Each employee PC connected to a port</li>
          <li>Switch linked to router for internet</li>
          <li> Phones getting power from PoE ports</li>
          <li>VLANs separating HR, Admin, Sales teams
          </li>
        </ul>
        <p>You’ll configure ALL of this in your CCNA labs!</p>
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 15: Real-Life Application")}>Next Section</button>
      </div>
    ),

    "Section 16: Final Recap": (
      <div className="module-content">
        
        <ul>
          <li>Cisco switches = backbone of LAN</li>
          <li>MAC table = memory of devices</li>
          <li>Speeds range from 10 Mbps to 10 Gbps</li>
          <li> Duplex = full is best</li>
          <li>PoE = data + power
          </li>
          <li>VLAN = segmentation</li>
          <li>Trunk = inter-switch communication</li>
        </ul>
        
        <button className="complete-btn" onClick={() => markAsComplete("MODULE_3", "Section 16: Final Recap")}>Next Section</button>
      </div>
    ),

      "Module 3/2 Quiz": (
  <div className="module-content">
    <h3>Module 3 Quiz</h3>

    {/* Question 6 */}
    <div className="quiz-question">
      <p>6. Which command shows all learned MAC addresses in a switch?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q6"
            onChange={() => handleAnswerChange("Module 3 Q6", opt)}
            checked={quizAnswers["Module 3 Q6"] === opt}
            disabled={quizAnswers["Module 3 Q6"] !== undefined}
          />
          {opt}) {["show vlan", "show mac address-table", "show users", "show switchport"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q6"] !== undefined && (
        <p className={quizFeedback["Module 3 Q6"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q6"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 7 */}
    <div className="quiz-question">
      <p>7. What is PoE used for?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q7"
            onChange={() => handleAnswerChange("Module 3 Q7", opt)}
            checked={quizAnswers["Module 3 Q7"] === opt}
            disabled={quizAnswers["Module 3 Q7"] !== undefined}
          />
          {opt}) {["Enhancing IP range", "Sending power over Ethernet", "Speed boosting", "Internet load balancing"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q7"] !== undefined && (
        <p className={quizFeedback["Module 3 Q7"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q7"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 8 */}
    <div className="quiz-question">
      <p>8. What port allows multiple VLANs to pass?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q8"
            onChange={() => handleAnswerChange("Module 3 Q8", opt)}
            checked={quizAnswers["Module 3 Q8"] === opt}
            disabled={quizAnswers["Module 3 Q8"] !== undefined}
          />
          {opt}) {["Access port", "Trunk port", "Fast port", "Layer 2 port"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q8"] !== undefined && (
        <p className={quizFeedback["Module 3 Q8"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q8"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 9 */}
    <div className="quiz-question">
      <p>9. What is the purpose of Port Security?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q9"
            onChange={() => handleAnswerChange("Module 3 Q9", opt)}
            checked={quizAnswers["Module 3 Q9"] === opt}
            disabled={quizAnswers["Module 3 Q9"] !== undefined}
          />
          {opt}) {["Increase internet speed", "Stop ARP requests", "Restrict device access", "Allow trunking"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q9"] !== undefined && (
        <p className={quizFeedback["Module 3 Q9"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q9"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 10 */}
    <div className="quiz-question">
      <p>10. Which of these is a frame type handled by switches?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q10"
            onChange={() => handleAnswerChange("Module 3 Q10", opt)}
            checked={quizAnswers["Module 3 Q10"] === opt}
            disabled={quizAnswers["Module 3 Q10"] !== undefined}
          />
          {opt}) {["TCP", "Unicast", "ICMP", "Ping"][i]}
        </label>
      ))}
      {quizFeedback["Module 3 Q10"] !== undefined && (
        <p className={quizFeedback["Module 3 Q10"] ? "correct" : "incorrect"}>
          {quizFeedback["Module 3 Q10"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Submit Button */}
    <button
      onClick={() => markAsComplete("Module_3","Module 3/2 Quiz")}
      className="complete-btn"
      disabled={
        !quizAnswers["Module 3 Q6"] ||
        !quizAnswers["Module 3 Q7"] ||
        !quizAnswers["Module 3 Q8"] ||
        !quizAnswers["Module 3 Q9"] ||
        !quizAnswers["Module 3 Q10"]
      }
    >
      Submit Quiz
    </button>
  </div>
),


    "Final Quiz": (
  <div className="module-content">
    <h3>Final Quiz</h3>
    <p>This will cover all 3 modules.</p>

    {/* Question 1 */}
    <div className="quiz-question">
      <p>1. How many bits are in an IPv4 address?</p>
      {["A", "B", "C"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q1"
            onChange={() => handleAnswerChange("Final Quiz Q1", opt)}
            checked={quizAnswers["Final Quiz Q1"] === opt}
          />
          {opt}) {["16 bits", "32 bits", "64 bits"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q1"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q1"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q1"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 2 */}
    <div className="quiz-question">
      <p>2. What command shows the MAC address table on a Cisco switch?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q2"
            onChange={() => handleAnswerChange("Final Quiz Q2", opt)}
            checked={quizAnswers["Final Quiz Q2"] === opt}
          />
          {opt}) {["show vlan", "show mac address-table", "show ip route", "show interfaces"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q2"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q2"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q2"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 3 */}
    <div className="quiz-question">
      <p>3. What does PoE stand for?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q3"
            onChange={() => handleAnswerChange("Final Quiz Q3", opt)}
            checked={quizAnswers["Final Quiz Q3"] === opt}
          />
          {opt}) {["Power over Ethernet", "Port over Ethernet", "Power of Ethernet", "Plug over Ethernet"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q3"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q3"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q3"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 4 */}
    <div className="quiz-question">
      <p>4. What is the maximum speed of a Gigabit Ethernet port?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q4"
            onChange={() => handleAnswerChange("Final Quiz Q4", opt)}
            checked={quizAnswers["Final Quiz Q4"] === opt}
          />
          {opt}) {["100 Mbps", "1 Gbps", "10 Gbps", "100 Gbps"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q4"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q4"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q4"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 5 */}
    <div className="quiz-question">
      <p>5. What does a switch use to forward data in a network?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q5"
            onChange={() => handleAnswerChange("Final Quiz Q5", opt)}
            checked={quizAnswers["Final Quiz Q5"] === opt}
          />
          {opt}) {["IP address", "MAC address", "Port number", "Subnet mask"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q5"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q5"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q5"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 6 */}
    <div className="quiz-question">
      <p>6. What is the purpose of Port Security?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q6"
            onChange={() => handleAnswerChange("Final Quiz Q6", opt)}
            checked={quizAnswers["Final Quiz Q6"] === opt}
          />
          {opt}) {["Increase internet speed", "Stop ARP requests", "Restrict device access", "Allow trunking"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q6"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q6"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q6"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 7 */}
    <div className="quiz-question">
      <p>7. Which layer of the OSI model does the MAC address belong to?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q7"
            onChange={() => handleAnswerChange("Final Quiz Q7", opt)}
            checked={quizAnswers["Final Quiz Q7"] === opt}
          />
          {opt}) {["Layer 1", "Layer 2", "Layer 3", "Layer 4"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q7"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q7"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q7"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 8 */}
    <div className="quiz-question">
      <p>8. Which device uses MAC addresses to forward data in a LAN?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q8"
            onChange={() => handleAnswerChange("Final Quiz Q8", opt)}
            checked={quizAnswers["Final Quiz Q8"] === opt}
          />
          {opt}) {["Router", "Switch", "Firewall", "Modem"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q8"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q8"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q8"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 9 */}
    <div className="quiz-question">
      <p>9. Which of the following is a valid MAC address?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q9"
            onChange={() => handleAnswerChange("Final Quiz Q9", opt)}
            checked={quizAnswers["Final Quiz Q9"] === opt}
          />
          {opt}) {["192.168.1.1", "255.255.255.0", "00:1A:2B:3C:4D:5E", "10.0.0.1"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q9"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q9"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q9"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

    {/* Question 10 */}
    <div className="quiz-question">
      <p>10. Which command shows the port speed and duplex settings on a Cisco switch?</p>
      {["A", "B", "C", "D"].map((opt, i) => (
        <label key={i}>
          <input
            type="radio"
            name="q10"
            onChange={() => handleAnswerChange("Final Quiz Q10", opt)}
            checked={quizAnswers["Final Quiz Q10"] === opt}
          />
          {opt}) {["show interfaces", "show port-speed", "show mac address-table", "show ip config"][i]}
        </label>
      ))}
      {quizFeedback["Final Quiz Q10"] !== undefined && (
        <p className={quizFeedback["Final Quiz Q10"] ? "correct" : "incorrect"}>
          {quizFeedback["Final Quiz Q10"] ? "Correct!" : "Wrong Answer"}
        </p>
      )}
    </div>

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
            {activeModule ? (
              moduleContents[activeModule] || <p>Content not available.</p>
            ) : (
              <>
                <p>🎉 Welcome to the IPv4 Addressing for CCNA Course! 🎉</p>
                <p>
                  Get ready to dive into one of the most fundamental and crucial concepts
                  in networking! Whether you're starting your CCNA journey or brushing up
                  on your skills, mastering IPv4 addressing will lay the foundation for
                  your success in the world of networking.
                </p>
                <p>
                  In this course, you'll unlock the secrets of how data travels across
                  networks, understand the structure of IP addresses, and gain the
                  confidence to design and troubleshoot networks with ease. 🌐
                </p>
                <p>🚀 What you will achieve:</p>
                <ul>
                  <li>Grasp the core concepts of IP addressing and subnetting.</li>
                  <li>Learn how to efficiently manage and troubleshoot IPv4 networks.</li>
                  <li>
                    Prepare yourself for success in your CCNA certification and beyond!
                  </li>
                </ul>
                <p>
                  Remember, each challenge is an opportunity to grow. Stay curious,
                  practice relentlessly, and don’t hesitate to ask questions. You've got
                  this! 💡
                </p>
                <p>
                  Let’s get started, and together we’ll take your networking skills to the
                  next level! 💻🌟
                </p>
              </>
            )}
          </main>

        </div >
      </div >
    </div >
  );
};

export default ModulePage;