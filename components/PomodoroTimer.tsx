import React, { useState, useEffect } from "react";
import { Button } from "./Button";

export const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or notify
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Finalizado!");
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case "focus":
        setTimeLeft(25 * 60);
        break;
      case "short":
        setTimeLeft(5 * 60);
        break;
      case "long":
        setTimeLeft(15 * 60);
        break;
    }
  };

  const setTimerMode = (newMode: "focus" | "short" | "long") => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case "focus":
        setTimeLeft(25 * 60);
        break;
      case "short":
        setTimeLeft(5 * 60);
        break;
      case "long":
        setTimeLeft(15 * 60);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm mr-4">
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold font-mono text-gray-800">
          {formatTime(timeLeft)}
        </span>
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {mode === "focus"
            ? "Foco"
            : mode === "short"
              ? "Pausa Curta"
              : "Pausa Longa"}
        </span>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="flex space-x-1">
          <button
            onClick={toggleTimer}
            className={`p-1 rounded-full ${isActive ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} hover:opacity-80 transition`}
            title={isActive ? "Pausar" : "Iniciar"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isActive ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              )}
            </svg>
          </button>
          <button
            onClick={resetTimer}
            className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            title="Reiniciar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => setTimerMode("focus")}
            className={`w-2 h-2 rounded-full ${mode === "focus" ? "bg-brand-500" : "bg-gray-300"}`}
            title="Foco (25m)"
          />
          <button
            onClick={() => setTimerMode("short")}
            className={`w-2 h-2 rounded-full ${mode === "short" ? "bg-brand-500" : "bg-gray-300"}`}
            title="Pausa Curta (5m)"
          />
          <button
            onClick={() => setTimerMode("long")}
            className={`w-2 h-2 rounded-full ${mode === "long" ? "bg-brand-500" : "bg-gray-300"}`}
            title="Pausa Longa (15m)"
          />
        </div>
      </div>
    </div>
  );
};
