"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameState";
import confetti from "canvas-confetti";

export default function MiningCavePage() {
  const router = useRouter();
  const {
    isLoaded,
    charName,
    energy,
    heroCoins,
    points,
    streak,
    tasks,
    mineTreasure,
    miningHistory,
  } = useGame();

  const [isStriking, setIsStriking] = useState(false); // Rock shake animation
  const [floatingTexts, setFloatingTexts] = useState([]); // Flying text list [{ id, text, type, x, y }]
  const [caveLog, setCaveLog] = useState("Chào mừng dũng sĩ đến Động Khai Thác! Hãy dùng Năng Lượng ⚡ đập đá ma thuật để tìm kho báu nhé! ⛏️");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isLoaded && !charName) {
      router.push("/");
    }
  }, [isLoaded, charName, router]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        <p className="mt-4 text-forest font-medium">Đang tải hang động ma thuật...</p>
      </div>
    );
  }

  // Buff state detections
  const hasExerciseBuff = tasks.some((t) => t.category === "strength" && t.completed);
  const hasReadingBuff = tasks.some((t) => t.category === "intellect" && t.completed);
  const hasStreakBuff = streak >= 3;

  // Handle Mining Click
  const handleMineClick = (e) => {
    if (energy < 1) {
      setErrorMessage("Hết Năng Lượng rồi dũng sĩ ơi! Hãy hoàn thành nhiệm vụ ngoài đời để nạp đầy bình ⚡");
      setTimeout(() => setErrorMessage(""), 4500);
      return;
    }

    // Trigger rock animation
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 150);

    // Call Context Mining
    const result = mineTreasure();
    
    if (result.success) {
      // Calculate floating text position near click or center
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left || 150;
      const clickY = e.clientY - rect.top || 150;

      let styleColor = "text-amber font-black";
      let prefix = "+";
      if (result.lootType === "legendary") styleColor = "text-red-500 font-extrabold text-lg animate-bounce";
      else if (result.lootType === "epic") styleColor = "text-amber-dark font-black text-base";
      else if (result.lootType === "rare") styleColor = "text-sky-dark font-black";

      const newFloatingText = {
        id: Date.now() + Math.random(),
        text: `${prefix}${result.coinReward} 🪙 ${result.isCritical ? "⚡ CHÍ MẠNG!" : ""}`,
        styleColor,
        x: clickX,
        y: clickY - 20,
      };

      setFloatingTexts((prev) => [...prev, newFloatingText]);

      // Log update
      if (result.lootType === "legendary") {
        setCaveLog(`🎉 QUÁ KHỦNG KHIẾP! Quốc Bảo đã đào được ${result.title} cực hiếm và nhận ngay +${result.coinReward} 🪙! 🎉`);
      } else if (result.lootType === "epic") {
        setCaveLog(`👑 Tuyệt vời! Con đã đào được ${result.title} nhận +${result.coinReward} 🪙!`);
      } else {
        setCaveLog(`⛏️ Con đập đá và thu được ${result.title} (+${result.coinReward} 🪙).`);
      }

      // Re-cleanup floating text after 1.5s
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((t) => t.id !== newFloatingText.id));
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col flex-grow relative pb-20">
      {/* Scrollable Cave Zone */}
      <div className="flex-grow p-5 space-y-5 overflow-y-auto">
        
        {/* Navigation header back button */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-xs font-bold text-gray-500 hover:text-forest-dark uppercase tracking-wider flex items-center gap-1"
          >
            🌳 Dashboard
          </button>
          
          {/* Dual Wallet Display */}
          <div className="flex items-center gap-2 select-none">
            {/* Points Wallet */}
            <div className="bg-forest-light/35 border border-forest/30 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span className="text-xs">⭐</span>
              <span className="text-[9px] font-black text-forest-dark">{points} ĐIỂM</span>
            </div>
            
            {/* Hero Coin Wallet */}
            <div className="bg-amber-light border border-amber/30 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <span className="text-xs animate-bounce">🪙</span>
              <span className="text-[9px] font-black text-amber-dark">{heroCoins} COIN</span>
            </div>
          </div>
        </div>

        {/* CAVE WELCOME BOARD */}
        <div className="bg-white border-2 border-sand p-4 rounded-3xl shadow-game-flat text-center space-y-1">
          <h2 className="text-sm font-black text-forest-dark uppercase tracking-widest flex items-center justify-center gap-1">
            <span>⛏️</span>
            <span>ĐỘNG KHAI THÁC ANH HÙNG</span>
            <span>⛏️</span>
          </h2>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Tiêu hao 1 Năng Lượng ⚡ = 1 Click Đào Kho Báu 💎</p>
        </div>

        {/* MAIN MINING WORKSPACE: Rock & Elixir Bottle */}
        <div className="grid grid-cols-3 gap-4 items-center">
          
          {/* Left: Mana / Energy Elixir Bottle */}
          <div className="col-span-1 bg-white border-2 border-sand p-3.5 rounded-3xl shadow-game-flat flex flex-col items-center justify-center text-center space-y-3.5 relative select-none">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Năng Lượng</span>
            
            {/* Bottle graphic representation */}
            <div className="w-10 h-16 bg-gray-100 border-2 border-sand rounded-b-2xl rounded-t-lg relative overflow-hidden shadow-inner flex flex-col justify-end">
              {/* Energy Liquid */}
              <div 
                className="bg-sky h-full w-full transition-all duration-500 relative animate-pulse"
                style={{ height: `${energy}%` }}
              >
                {/* Bubble FX */}
                <div className="absolute top-1 left-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-float"></div>
                <div className="absolute top-4 right-2 w-1 h-1 bg-white/40 rounded-full animate-float delay-75"></div>
              </div>
            </div>

            {/* Counter */}
            <div className="space-y-0.5">
              <p className="text-base font-black text-sky-dark">{energy}<span className="text-xs opacity-75">/100</span></p>
              <p className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wide">⚡ Năng lượng</p>
            </div>
          </div>

          {/* Right 2-cols: Interactive clicker magic ore */}
          <div className="col-span-2 bg-white border-2 border-sand p-4 rounded-3xl shadow-game-flat relative h-48 flex items-center justify-center overflow-hidden select-none">
            {/* Floating text values nổ lên */}
            {floatingTexts.map((ft) => (
              <div
                key={ft.id}
                className={`absolute text-xs font-black animate-float-up pointer-events-none z-30 select-none ${ft.styleColor}`}
                style={{ left: `${ft.x}px`, top: `${ft.y}px` }}
              >
                {ft.text}
              </div>
            ))}

            {/* Rock Magical Crystal Button */}
            <button
              onClick={handleMineClick}
              className={`relative focus:outline-none transition-transform duration-75 active:scale-90 ${
                isStriking ? "animate-wiggle scale-95" : ""
              } ${energy < 1 ? "opacity-45" : ""}`}
              disabled={energy < 1}
              type="button"
            >
              {/* Glowing Rare Ring effect */}
              {hasReadingBuff && (
                <div className="absolute inset-0 bg-amber/20 rounded-full blur-xl animate-pulse -z-10 scale-125"></div>
              )}
              {hasExerciseBuff && (
                <div className="absolute inset-0 bg-red-400/10 rounded-full blur-xl animate-pulse -z-10 scale-125"></div>
              )}

              {/* Ore Icon */}
              <div className="text-7xl filter drop-shadow-md select-none transform hover:scale-105 transition-transform">
                {energy < 1 ? "🪵" : hasReadingBuff ? "💎" : "💎"}
              </div>

              {/* Crack indicators */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-3xl text-white/50 opacity-40 font-black tracking-widest select-none">⚡</span>
              </div>
            </button>

            {/* Anti-spam text helper */}
            <div className="absolute bottom-2 text-[8px] font-bold text-gray-400 select-none">
              {energy > 0 ? "👉 Click liên tục lên đá để đào kho báu!" : "❌ Hết năng lượng!"}
            </div>
          </div>
        </div>

        {/* Energy Empty Warning Banner */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-2xl text-[10.5px] font-black text-terracotta text-center animate-bounce shadow-sm">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* BUFFS / BOOSTERS ACTIVE INDICATOR */}
        <div className="bg-white border-2 border-sand p-4 rounded-3xl shadow-game-flat space-y-2.5">
          <h3 className="text-xs font-black text-forest-dark uppercase tracking-wider flex items-center gap-1">
            <span>🛡️</span>
            <span>Bùa Lợi Đang Kích Hoạt (Habit Buffs)</span>
          </h3>
          
          <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold">
            {/* Exercise Buff */}
            <div className={`border rounded-xl p-2 flex flex-col items-center justify-center space-y-1.5 ${
              hasExerciseBuff ? "bg-rose-50 border-red-100 text-terracotta" : "bg-gray-50 border-gray-100 text-gray-400"
            }`}>
              <span className="text-base">🏃</span>
              <span>Thể Lực Buff</span>
              <span className="text-[7.5px] font-extrabold uppercase">
                {hasExerciseBuff ? "⚡ Chí Mạng x2" : "Khóa 🔒"}
              </span>
            </div>

            {/* Reading Buff */}
            <div className={`border rounded-xl p-2 flex flex-col items-center justify-center space-y-1.5 ${
              hasReadingBuff ? "bg-blue-50 border-blue-100 text-sky-dark" : "bg-gray-50 border-gray-100 text-gray-400"
            }`}>
              <span className="text-base">📚</span>
              <span>Trí Tuệ Buff</span>
              <span className="text-[7.5px] font-extrabold uppercase">
                {hasReadingBuff ? "💎 +Rare Item" : "Khóa 🔒"}
              </span>
            </div>

            {/* Streak Buff */}
            <div className={`border rounded-xl p-2 flex flex-col items-center justify-center space-y-1.5 ${
              hasStreakBuff ? "bg-amber-50 border-yellow-100 text-amber-dark" : "bg-gray-50 border-gray-100 text-gray-400"
            }`}>
              <span className="text-base">🔥</span>
              <span>Chuỗi Buff</span>
              <span className="text-[7.5px] font-extrabold uppercase">
                {hasStreakBuff ? "🍀 +Luck Gold" : "Khóa 🔒"}
              </span>
            </div>
          </div>
          <p className="text-[8px] text-gray-400 font-medium leading-normal text-center pt-1 select-none">
            💡 <strong>Mẹo anh hùng:</strong> Chăm chỉ hoàn thành nhiệm vụ đọc sách, thể dục và duy trì chuỗi Streak mỗi ngày ngoài đời để kích hoạt các bùa lợi cực mạnh khi đào mỏ!
          </p>
        </div>

        {/* LOG CONSOLE: Realtime actions display */}
        <div className="bg-sand-dark/15 border-2 border-sand p-3.5 rounded-2xl text-[10px] font-extrabold text-forest-dark italic leading-relaxed text-center select-none">
          {caveLog}
        </div>

        {/* MINING HISTORY LOG BOX */}
        <div className="bg-white border-2 border-sand p-4 rounded-3xl shadow-game-flat space-y-3">
          <h3 className="text-xs font-black text-forest-dark uppercase tracking-wider">📦 Kho Báu Đã Đào Được</h3>
          
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {miningHistory.length === 0 ? (
              <div className="text-center py-6 text-[10.5px] text-gray-400 font-bold">
                📭 Thùng gỗ rỗng! Hãy bắt đầu click đập đá để thu thập kho báu...
              </div>
            ) : (
              miningHistory.map((item) => {
                let badgeStyle = "bg-gray-100 text-gray-500 border-gray-200";
                if (item.rarity === "legendary") badgeStyle = "bg-rose-50 text-red-500 border-red-200 animate-pulse";
                else if (item.rarity === "epic") badgeStyle = "bg-amber-50 text-amber-dark border-yellow-200";
                else if (item.rarity === "rare") badgeStyle = "bg-blue-50 text-sky-dark border-blue-200";

                return (
                  <div 
                    key={item.id}
                    className="bg-sand-light border border-sand p-2 rounded-xl flex items-center justify-between text-[10.5px] font-bold text-forest-dark"
                  >
                    <div className="flex flex-col truncate">
                      <span className="truncate max-w-[200px]">{item.title}</span>
                      <span className="text-[7.5px] font-extrabold uppercase text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase ${badgeStyle}`}>
                        {item.rarityText}
                      </span>
                      <span className="text-xs font-black text-amber-dark">
                        +{item.coins} 🪙
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* BOTTOM TAB NAVIGATION (Duolingo style) */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t-2 border-sand p-2 flex items-center justify-around z-40 max-w-md mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-forest space-y-0.5"
        >
          <span className="text-xl">🌳</span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Phiêu Lưu</span>
        </button>

        <button
          onClick={() => router.push("/rewards")}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-forest space-y-0.5"
        >
          <span className="text-xl">🛒</span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Đổi Quà</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center p-2 text-forest-medium space-y-0.5"
        >
          <span className="text-xl">⛏️</span>
          <span className="text-[9px] font-black uppercase tracking-wider">Đào Mỏ</span>
        </button>

        <button
          onClick={() => router.push("/parent")}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-forest space-y-0.5"
        >
          <span className="text-xl">🔑</span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Bố Mẹ</span>
        </button>
      </div>
    </div>
  );
}
