import React, { useState, useEffect } from "react";

export const BrasiliaClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const formattedTime = new Intl.DateTimeFormat("pt-BR", formatOptions).format(
    time,
  );

  return (
    <div className="text-sm font-mono text-gray-500 bg-gray-100 rounded px-3 py-1 border border-gray-200 shadow-sm flex items-center">
      <svg
        className="w-4 h-4 mr-2 text-brand-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {formattedTime} (Brasília)
    </div>
  );
};
