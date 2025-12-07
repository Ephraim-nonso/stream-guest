"use client";

import { useState } from "react";
import { createScheduledCall, type CreateScheduledCallData } from "@/lib/api";
import type { User } from "@/lib/api";

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: User;
  clientAddress: string;
  onSuccess: () => void;
}

export function ScheduleCallModal({
  isOpen,
  onClose,
  expert,
  clientAddress,
  onSuccess,
}: ScheduleCallModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse expertise from expert
  const expertiseList = expert.areaOfExpertise
    ? expert.areaOfExpertise.split(",").map((e) => e.trim())
    : [];

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic));
  };

  const handleToggleExpertise = (exp: string) => {
    if (topics.includes(exp)) {
      handleRemoveTopic(exp);
    } else {
      setTopics([...topics, exp]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date || !time) {
      setError("Please select both date and time");
      return;
    }

    // Validate date is not in the past - check both date and time
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    
    // Add a 1 minute buffer to ensure the time is truly in the future
    const oneMinuteFromNow = new Date(now.getTime() + 60000);
    
    if (selectedDateTime <= oneMinuteFromNow) {
      setError("Please select a date and time that is at least 1 minute in the future");
      return;
    }

    setIsSubmitting(true);

    try {
      const callData: CreateScheduledCallData = {
        clientAddress,
        expertAddress: expert.address,
        date,
        time,
        duration: parseInt(duration, 10),
        hourlyRate: expert.hourlyRate || 0,
        topics: topics.length > 0 ? topics : undefined,
      };

      await createScheduledCall(callData);
      onSuccess();
      onClose();
      // Reset form
      setDate("");
      setTime("");
      setDuration("60");
      setTopics([]);
      setNewTopic("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to schedule call"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Get minimum date (today) and minimum time
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const isToday = date === today;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">
              Schedule Consultation
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Expert Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-[#1a1a2e] mb-1">
              {expert.fullName}
            </h3>
            <p className="text-sm text-gray-600">{expert.professionalTitle}</p>
            <p className="text-sm text-gray-600 mt-1">
              ${expert.hourlyRate}/hour
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    // If user selects today, ensure time is in the future
                    if (e.target.value === today && time && time <= currentTime) {
                      setTime("");
                    }
                  }}
                  min={today}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  min={isToday ? currentTime : undefined}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
                <option value="120">120 min</option>
              </select>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topics / Areas of Discussion
              </label>
              
              {/* Quick select from expertise */}
              {expertiseList.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Quick select from expert's expertise:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {expertiseList.map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => handleToggleExpertise(exp)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          topics.includes(exp)
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom topic input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                  placeholder="Add custom topic"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Selected topics */}
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(topic)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Scheduling..." : "Schedule Call"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

