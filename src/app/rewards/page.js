"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameState";

export default function RewardsPage() {
  const router = useRouter();
  const {
    isLoaded,
    charName,
    rewards,
    claimReward,
    toggleTimerState,
    screenTimeLeft,
    isTimerActive,
  } = useGame();

  const [selectedReward, setSelectedReward] = useState(null); // Reward to redeem
  const [pinInput, setPinInput] = useState(""); // Code to input
  const [errorMessage, setErrorMessage] = useState(""); // Pin error
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  useEffect(() => {
    if (isLoaded && !charName) {
      router.push("/");
    }
  }, [isLoaded, charName, router]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
        <p className="mt-4 text-forest font-medium">Đang tải...</p>
      </div>
    );
  }

  // Format screen time left to HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOpenPinModal = (reward) => {
    setSelectedReward(reward);
    setPinInput("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!pinInput) {
      setErrorMessage("Vui lòng nhập mã PIN!");
      return;
    }

    const result = claimReward(selectedReward.id, pinInput);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setSelectedReward(null);
      }, 1500);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="flex flex-col flex-grow relative pb-20">
      
      {/* Scrollable Area */}
      <div className="flex-grow p-5 space-y-6 overflow-y-auto">
        
        {/* Navigation header back button */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-xs font-bold text-gray-500 hover:text-forest-dark uppercase tracking-wider flex items-center gap-1"
          >
            🌳 Dashboard
          </button>
          <span className="text-xs font-black text-amber">🎁 CỬA HÀNG QUÀ TẶNG</span>
        </div>

        {/* SCREEN TIME COUNTDOWN CONTAINER */}
        <div className="bg-white border-2 border-sand p-5 rounded-3xl shadow-game-flat text-center space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-forest-dark uppercase tracking-wider">⏱️ Thời Gian Giải Trí Được Duyệt</h3>
            <p className="text-[10px] text-gray-400">Được cộng dồn khi hoàn thành nhiệm vụ hằng ngày</p>
          </div>

          {/* Time display */}
          <div className={`text-4xl font-black py-4 px-6 rounded-2xl border-2 font-mono shadow-inner tracking-wider select-none transition-all duration-300 ${
            screenTimeLeft > 0 
              ? "bg-amber-light border-amber text-amber animate-pulse" 
              : "bg-sand-light border-sand text-gray-400"
          }`}>
            {formatTime(screenTimeLeft)}
          </div>

          {/* Control buttons */}
          {screenTimeLeft > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimerState}
                className={`flex-grow font-extrabold text-sm py-3 px-4 rounded-xl border-2 btn-game-transition ${
                  isTimerActive 
                    ? "bg-terracotta border-terracotta text-white shadow-game-terracotta active:shadow-game-pressed"
                    : "bg-forest border-forest text-white shadow-game-forest active:shadow-game-pressed"
                }`}
              >
                {isTimerActive ? "TẠM DỪNG CHƠI ⏸️" : "BẮT ĐẦU CHƠI ▶️"}
              </button>
            </div>
          )}
        </div>

        {/* REWARDS STORE ITEMS LIST */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-forest-dark uppercase tracking-wider">🛒 Danh Sách Đổi Quà</h3>
          
          <div className="space-y-4">
            {rewards.map((r) => {
              // Determine theme based on reward type
              let colorClasses = "border-sand shadow-game-flat hover:border-sand-dark";
              let badgeText = "Đặc Quyền";
              let badgeColor = "bg-sand text-gray-500 border-sand";
              let costSymbol = "⭐";

              if (r.type === "game_time") {
                colorClasses = "border-amber/50 bg-amber-50/20 shadow-game-amber hover:border-amber";
                badgeText = "Giờ chơi";
                badgeColor = "bg-amber-light text-amber border-amber/30";
                costSymbol = "⏰";
              } else if (r.type === "perk") {
                colorClasses = "border-forest/50 bg-green-50/20 shadow-game-forest hover:border-forest";
                badgeText = "Món quà";
                badgeColor = "bg-forest-accent text-forest border-forest/30";
                costSymbol = "🎁";
              } else if (r.type === "card") {
                colorClasses = "border-sky/50 bg-blue-50/20 shadow-game-sky hover:border-sky";
                badgeText = "Thẻ Phép";
                badgeColor = "bg-sky-light text-sky border-sky/30";
                costSymbol = "🎟️";
              }

              return (
                <div
                  key={r.id}
                  className={`bg-white border-2 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all duration-100 ${colorClasses}`}
                >
                  {/* Reward Info */}
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full border uppercase ${badgeColor}`}>
                        {badgeText}
                      </span>
                      {r.parentApproved && (
                        <span className="text-[8px] font-bold text-forest-medium flex items-center gap-0.5">
                          ✓ Đã Duyệt
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-forest-dark leading-snug">{r.title}</h4>
                    <p className="text-[10px] text-gray-400">Yêu cầu hoàn thành: {r.cost} điểm thử thách {costSymbol}</p>
                  </div>

                  {/* Redeem Button */}
                  <button
                    onClick={() => handleOpenPinModal(r)}
                    className={`font-black text-xs px-4 py-2.5 rounded-xl border-2 btn-game-transition ${
                      r.type === "game_time" 
                        ? "bg-amber text-white border-amber shadow-game-amber" 
                        : r.type === "perk" 
                        ? "bg-forest text-white border-forest shadow-game-forest"
                        : "bg-sky text-white border-sky shadow-game-sky"
                    }`}
                  >
                    NHẬN QUÀ 🗝️
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* PASSCODE / PIN REDEEM DIALOG MODAL */}
      {selectedReward && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 z-50 animate-fade-in">
          <form 
            onSubmit={handleRedeem}
            className="bg-white border-4 border-forest rounded-3xl p-6 shadow-2xl w-full max-w-sm text-center space-y-5 relative"
          >
            
            {/* Modal Logo */}
            <div className="w-16 h-16 bg-forest-light rounded-full border-2 border-forest mx-auto flex items-center justify-center text-3xl shadow">
              🗝️
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-forest-dark uppercase tracking-wider">Xác Nhận Của Bố Mẹ</h3>
              <p className="text-[10.5px] text-gray-500">Bố mẹ vui lòng nhập mã PIN bảo mật để duyệt phần thưởng này</p>
            </div>

            {/* Input field */}
            <div className="space-y-2">
              <input
                type="password"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mã PIN..."
                className="w-full text-center bg-sand-light border-2 border-sand rounded-xl py-3 text-lg font-black text-forest-dark focus:outline-none focus:border-forest transition-colors letter-spacing-lg"
              />
              {errorMessage && <p className="text-[10px] font-bold text-terracotta">{errorMessage}</p>}
              {successMessage && <p className="text-[10px] font-bold text-forest">{successMessage}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedReward(null)}
                className="w-1/2 bg-white text-gray-400 font-extrabold text-xs py-3 rounded-xl border-2 border-sand shadow-game-flat btn-game-transition active:shadow-game-pressed"
              >
                HỦY BỎ
              </button>
              <button
                type="submit"
                className="w-1/2 bg-forest text-sand-light font-black text-xs py-3 rounded-xl border-2 border-forest shadow-game-forest btn-game-transition active:shadow-game-pressed"
              >
                DUYỆT QUÀ ✅
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BOTTOM TAB NAVIGATION */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t-2 border-sand p-2 flex items-center justify-around z-40 max-w-md mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-forest space-y-0.5"
        >
          <span className="text-xl">🌳</span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Phiêu Lưu</span>
        </button>

        <button
          onClick={() => {}}
          className="flex flex-col items-center p-2 text-forest-medium space-y-0.5"
        >
          <span className="text-xl">🛒</span>
          <span className="text-[9px] font-black uppercase tracking-wider">Đổi Quà</span>
        </button>

        <button
          onClick={() => router.push("/boss")}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-forest space-y-0.5"
        >
          <span className="text-xl">👾</span>
          <span className="text-[9px] font-extrabold uppercase tracking-wider">Boss Tuần</span>
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
