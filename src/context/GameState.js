"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

const GameContext = createContext();

const DEFAULT_TASKS = [
  { id: "t1", title: "Dậy đúng giờ đón bình minh 🌅", exp: 10, category: "discipline", completed: false, statKey: "discipline", statVal: 1 },
  { id: "t2", title: "Tập thể dục năng động 15 phút 🏃‍♂️", exp: 20, category: "strength", completed: false, statKey: "strength", statVal: 2 },
  { id: "t3", title: "Đọc sách tinh hoa 20 phút 📚", exp: 20, category: "intellect", completed: false, statKey: "intellect", statVal: 2 },
  { id: "t4", title: "Học tiếng Anh hoặc tìm hiểu AI 🤖", exp: 20, category: "intellect", completed: false, statKey: "intellect", statVal: 2 },
  { id: "t5", title: "Giúp đỡ việc nhà cho bố mẹ 🧹", exp: 15, category: "help", completed: false, statKey: "help", statVal: 2 },
  { id: "t6", title: "Làm chủ cảm xúc, luôn mỉm cười 🌸", exp: 15, category: "help", completed: false, statKey: "help", statVal: 1 },
  { id: "t7", title: "Sắp xếp phòng ngủ ngăn nắp ✨", exp: 20, category: "discipline", completed: false, statKey: "discipline", statVal: 2 },
  { id: "t8", title: "Viết nhật ký cảm xúc & bài học ngày ✍️", exp: 15, category: "creative", completed: false, statKey: "creative", statVal: 1 },
  { id: "t9", title: "Hoạt động vẽ tranh/lắp ráp sáng tạo 🎨", exp: 25, category: "creative", completed: false, statKey: "creative", statVal: 2 },
  { id: "t10", title: "Tuân thủ giới hạn xem TV/chơi Game 📺", exp: 30, category: "discipline", completed: false, statKey: "discipline", statVal: 3 },
];

const DEFAULT_REWARDS = [
  { id: "r1", title: "Đổi 20 phút chơi game / xem TV 📺", cost: 40, type: "game_time", value: 20, parentApproved: false },
  { id: "r2", title: "Đổi 45 phút chơi game / xem TV 🚀", cost: 80, type: "game_time", value: 45, parentApproved: false },
  { id: "r3", title: "Bố mẹ nấu món ăn Quốc Bảo yêu thích 🍕", cost: 100, type: "perk", value: "favorite_meal", parentApproved: false },
  { id: "r4", title: "Một ngày đi chơi công viên nước cùng cả nhà 🎡", cost: 200, type: "perk", value: "special_day", parentApproved: false },
  { id: "r5", title: "Thẻ bài miễn làm 1 nhiệm vụ ngày 🎟️", cost: 150, type: "card", value: "skip_task", parentApproved: false },
];

export function GameProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Character state
  const [charName, setCharName] = useState("Quốc Bảo");
  const [charClass, setCharClass] = useState("Warrior"); // Warrior, Mage, Druid
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [energy, setEnergy] = useState(100);

  // Stats System
  const [stats, setStats] = useState({
    strength: 10,  // ❤️ Thể lực
    intellect: 10, // 🧠 Trí tuệ
    discipline: 10, // ⚡ Kỷ luật
    creative: 10,   // 🎨 Sáng tạo
    help: 10,       // 🤝 Giúp đỡ
  });

  // Lists state
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [rewards, setRewards] = useState(DEFAULT_REWARDS);

  // Weekly Boss state
  const [bossHp, setBossHp] = useState(100);
  const [bossMaxHp] = useState(100);
  const [bossName, setBossName] = useState("Thần Lười Biếng 😴");
  const [bossDefeated, setBossDefeated] = useState(false);

  // Entertainment system (Screen Time)
  const [screenTimeLeft, setScreenTimeLeft] = useState(0); // in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Parent controls
  const [parentPin, setParentPin] = useState("1234");
  const [encouragements, setEncouragements] = useState([
    { id: "e1", text: "Chúc Chiến Binh Quốc Bảo một mùa hè tràn đầy năng lượng! Cố lên con trai! 💪", read: false },
  ]);

  // Sound helper (Web Audio API for simple pop sound effects)
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "complete") {
        // High pleasant pitch
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "level-up") {
        // Fanfare chord
        const playTone = (freq, delay, duration) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          g.gain.setValueAtTime(0.15, ctx.currentTime + delay);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
          o.start(ctx.currentTime + delay);
          o.stop(ctx.currentTime + delay + duration);
        };
        playTone(523.25, 0, 0.2); // C5
        playTone(659.25, 0.1, 0.2); // E5
        playTone(783.99, 0.2, 0.3); // G5
        playTone(1046.50, 0.3, 0.5); // C6
      } else if (type === "uncomplete") {
        // Low dull tone
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.log("Audio not supported or interaction needed first", e);
    }
  };

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("quocbao_game_state");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCharName(data.charName || "Quốc Bảo");
        setCharClass(data.charClass || "Warrior");
        setLevel(data.level || 1);
        setExp(data.exp || 0);
        setStreak(data.streak || 0);
        setEnergy(data.energy !== undefined ? data.energy : 100);
        setStats(data.stats || { strength: 10, intellect: 10, discipline: 10, creative: 10, help: 10 });
        setTasks(data.tasks || DEFAULT_TASKS);
        setRewards(data.rewards || DEFAULT_REWARDS);
        setBossHp(data.bossHp !== undefined ? data.bossHp : 100);
        setBossDefeated(data.bossDefeated || false);
        setScreenTimeLeft(data.screenTimeLeft || 0);
        setParentPin(data.parentPin || "1234");
        setEncouragements(data.encouragements || []);
      } catch (e) {
        console.error("Error loading local state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on state change
  useEffect(() => {
    if (isLoaded) {
      const data = {
        charName,
        charClass,
        level,
        exp,
        streak,
        energy,
        stats,
        tasks,
        rewards,
        bossHp,
        bossDefeated,
        screenTimeLeft,
        parentPin,
        encouragements,
      };
      localStorage.setItem("quocbao_game_state", JSON.stringify(data));
    }
  }, [
    isLoaded,
    charName,
    charClass,
    level,
    exp,
    streak,
    energy,
    stats,
    tasks,
    rewards,
    bossHp,
    bossDefeated,
    screenTimeLeft,
    parentPin,
    encouragements,
  ]);

  // Screen Time Countdown Timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && screenTimeLeft > 0) {
      interval = setInterval(() => {
        setScreenTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, screenTimeLeft]);

  // Formula: EXP needed to level up
  const expToNextLevel = level * 100;

  // Toggle complete task
  const completeTask = (id) => {
    playSound("complete");
    
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;

          if (nextCompleted) {
            // Apply rewards
            let newExp = exp + t.exp;
            let currentLevel = level;
            
            // Check Level Up
            const needed = currentLevel * 100;
            if (newExp >= needed) {
              newExp -= needed;
              currentLevel += 1;
              
              // Level up effect
              setTimeout(() => {
                playSound("level-up");
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ["#2E7D32", "#4CAF50", "#D97706", "#FAF8F5"],
                });
              }, 100);
            }

            setExp(newExp);
            setLevel(currentLevel);
            setEnergy((prev) => Math.min(100, prev + 5));

            // Increase character stats
            if (t.statKey) {
              setStats((prevStats) => ({
                ...prevStats,
                [t.statKey]: prevStats[t.statKey] + t.statVal,
              }));
            }

            // Attack weekly boss
            setBossHp((prevHp) => {
              if (bossDefeated) return 0;
              const damage = Math.ceil(t.exp / 3);
              const nextHp = Math.max(0, prevHp - damage);
              if (nextHp === 0) {
                setBossDefeated(true);
                setTimeout(() => {
                  confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5 },
                  });
                }, 300);
              }
              return nextHp;
            });
          } else {
            // Deduct stats & EXP if uncompleted
            playSound("uncomplete");
            setExp((prev) => Math.max(0, prev - t.exp));
            setEnergy((prev) => Math.max(0, prev - 5));
            if (t.statKey) {
              setStats((prevStats) => ({
                ...prevStats,
                [t.statKey]: Math.max(10, prevStats[t.statKey] - t.statVal),
              }));
            }
            // Heal boss slightly
            setBossHp((prevHp) => {
              if (bossDefeated) return 0;
              return Math.min(bossMaxHp, prevHp + Math.ceil(t.exp / 3));
            });
          }

          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // Claim Reward with parent PIN verification
  const claimReward = (id, pin) => {
    if (pin !== parentPin) {
      return { success: false, message: "Mã PIN của bố mẹ không đúng! ❌" };
    }

    const reward = rewards.find((r) => r.id === id);
    if (!reward) return { success: false, message: "Phần thưởng không tồn tại! ❌" };

    // Mark as approved & redeem
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, parentApproved: true } : r))
    );

    if (reward.type === "game_time") {
      setScreenTimeLeft((prev) => prev + reward.value * 60);
      setIsTimerActive(true);
    }

    confetti({
      particleCount: 80,
      spread: 60,
      colors: ["#D97706", "#4CAF50", "#2E7D32"],
    });

    return { success: true, message: `Thành công! Đã quy đổi: ${reward.title} 🎉` };
  };

  // Add custom task (Parent only)
  const addCustomTask = (title, expVal, category) => {
    const newId = "custom_" + Date.now();
    let statKey = "discipline";
    if (category === "strength") statKey = "strength";
    if (category === "intellect") statKey = "intellect";
    if (category === "creative") statKey = "creative";
    if (category === "help") statKey = "help";

    const newTask = {
      id: newId,
      title,
      exp: parseInt(expVal) || 15,
      category,
      completed: false,
      statKey,
      statVal: 2,
      custom: true,
    };

    setTasks((prev) => [...prev, newTask]);
    return { success: true };
  };

  // Delete task (Parent only)
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    return { success: true };
  };

  // Add custom reward (Parent only)
  const addCustomReward = (title, costVal, typeVal, minutes = 0) => {
    const newId = "reward_" + Date.now();
    const newReward = {
      id: newId,
      title,
      cost: parseInt(costVal) || 50,
      type: typeVal, // game_time, perk, card
      value: typeVal === "game_time" ? parseInt(minutes) : "custom_perk",
      parentApproved: false,
      custom: true,
    };

    setRewards((prev) => [...prev, newReward]);
    return { success: true };
  };

  // Delete reward (Parent only)
  const deleteReward = (id) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
    return { success: true };
  };

  // Reset daily tasks (Parent/System check-in)
  const resetDailyTasks = () => {
    // Check if at least 3 tasks completed to update streak
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount >= 3) {
      setStreak((prev) => prev + 1);
    } else if (completedCount === 0 && streak > 0) {
      // Lose streak if absolutely no activity today
      setStreak(0);
    }

    setTasks((prev) => prev.map((t) => ({ ...t, completed: false })));
    setEnergy(100);
    setRewards((prev) => prev.map((r) => ({ ...r, parentApproved: false })));
    
    // Reset Weekly Boss HP if defeated
    if (bossDefeated) {
      setBossHp(100);
      setBossDefeated(false);
    }
  };

  // Send parent encouragement message
  const sendEncouragement = (text) => {
    const newMsg = {
      id: "msg_" + Date.now(),
      text,
      read: false,
    };
    setEncouragements((prev) => [newMsg, ...prev]);
  };

  // Read all encouragements
  const readAllMessages = () => {
    setEncouragements((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  // Full reset (Start fresh adventure)
  const resetEntireGame = () => {
    localStorage.removeItem("quocbao_game_state");
    setCharName("Quốc Bảo");
    setCharClass("Warrior");
    setLevel(1);
    setExp(0);
    setStreak(0);
    setEnergy(100);
    setStats({ strength: 10, intellect: 10, discipline: 10, creative: 10, help: 10 });
    setTasks(DEFAULT_TASKS);
    setRewards(DEFAULT_REWARDS);
    setBossHp(100);
    setBossDefeated(false);
    setScreenTimeLeft(0);
    setIsTimerActive(false);
    setEncouragements([
      { id: "e1", text: "Chào mừng Quốc Bảo bước vào Hành trình anh hùng mùa hè! Con sẵn sàng chưa? 🌳", read: false }
    ]);
  };

  return (
    <GameContext.Provider
      value={{
        isLoaded,
        charName,
        setCharName,
        charClass,
        setCharClass,
        level,
        exp,
        expToNextLevel,
        streak,
        setStreak,
        energy,
        setEnergy,
        stats,
        setStats,
        tasks,
        completeTask,
        rewards,
        claimReward,
        bossHp,
        bossMaxHp,
        bossName,
        bossDefeated,
        screenTimeLeft,
        setScreenTimeLeft,
        isTimerActive,
        setIsTimerActive,
        parentPin,
        setParentPin,
        encouragements,
        sendEncouragement,
        readAllMessages,
        addCustomTask,
        deleteTask,
        addCustomReward,
        deleteReward,
        resetDailyTasks,
        resetEntireGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
