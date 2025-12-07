"use client";

import { useState, useEffect } from "react";
import { updateScheduledCall, type ScheduledCall } from "@/lib/api";

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: ScheduledCall;
  onSuccess: () => void;
}

export function EditScheduleModal({
  isOpen,
  onClose,
  call,
  onSuccess,
}: EditScheduleModalProps) {
  const [date, setDate] = useState(call.date || "");
  const [time, setTime] = useState(call.time || "");
  const [duration, setDuration] = useState(call.duration?.toString() || "60");
  const [topics, setTopics] = useState<string[]>(call.topics || []);
  const [newTopic, setNewTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when call changes
  useEffect(() => {
    if (call) {
      setDate(call.date || "");
      setTime(call.time || "");
      setDuration(call.duration?.toString() || "60");
      setTopics(call.topics || []);
      setNewTopic("");
      setError(null);
    }
  }, [call]);

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter((t) => t !== topic));
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
      await updateScheduledCall(call.id, {
        proposedDate: date,
        proposedTime: time,
        proposedDuration: parseInt(duration, 10),
        proposedTopics: topics.length > 0 ? topics : [],
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request changes"
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
              Request Changes to Schedule
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

          {/* Current Schedule Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              Current Schedule
            </h3>
            <p className="text-sm text-gray-600">
              Date: {call.date} at {call.time}
            </p>
            <p className="text-sm text-gray-600">
              Duration: {call.duration} minutes
            </p>
            {call.topics && call.topics.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {call.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                  Proposed Date *
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
                  Proposed Time *
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
                Proposed Duration (minutes)
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
                Proposed Topics / Areas of Discussion
              </label>

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
                  placeholder="Add topic"
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
                {isSubmitting ? "Requesting Changes..." : "Request Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

