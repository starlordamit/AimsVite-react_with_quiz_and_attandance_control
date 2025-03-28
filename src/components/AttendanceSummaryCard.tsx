import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import {
  ChevronRight,
  RotateCw,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Slider } from "@nextui-org/react";
import "react-circular-progressbar/dist/styles.css";
import { add } from "date-fns";

interface AttendanceSummaryProps {
  summary: {
    Percent: string;
    Total: number;
    Present: number;
  };
  onRefresh: () => void;
  refreshing: boolean;
}

export default function AttendanceSummaryCard({
  summary,
  onRefresh,
  refreshing,
}: AttendanceSummaryProps) {
  const navigate = useNavigate();
  const percentage = parseFloat(summary.Percent);
  const absent = summary.Total - summary.Present;
  const [targetPercentage, setTargetPercentage] = useState(75);

  const calculateRequiredLectures = (target: number) => {
    const currentAttendance = summary.Present;
    const totalLectures = summary.Total;
    const targetDecimal = target / 100;

    // Formula: (x + p) / (x + t) = target
    // where x = additional lectures needed
    // p = present lectures
    // t = total lectures
    // Solving for x:
    // x = (target * t - p) / (1 - target)

    let additionalLectures = Math.ceil(
      (targetDecimal * totalLectures - currentAttendance) / (1 - targetDecimal)
    );

    // If already achieved or impossible
    if (additionalLectures <= 0) {
      return 0;
    } else if (!isFinite(additionalLectures)) {
      return "Its Impossible, Infinite";
    } else if (target == 69) {
      return "🤤" + additionalLectures;
    }

    return additionalLectures;
  };

  const calculateLeavingLectures = (target: number) => {
    const currentAttendance = summary.Present;
    const targetDecimal = target / 100;

    // Formula: p / (t + x) = target
    // where x = lectures that can be missed
    // p = present lectures
    // t = total lectures
    // Solving for x:
    // x = (p / target) - t

    return Math.floor(currentAttendance / targetDecimal - summary.Total);
  };

  const getColorByPercentage = (percent: number) => {
    if (percent >= 85) return "#22c55e";
    if (percent >= 75) return "#eab308";
    return "#ef4444";
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    navigate("/attendance");
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Overall Attendance
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
          disabled={refreshing}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            refreshing ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          <RotateCw
            className={`w-5 h-5 text-violet-500 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Attendance Stats */}
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-40 h-40">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: getColorByPercentage(percentage),
                  textColor: getColorByPercentage(percentage),
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">
                  Present
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {summary.Present} classes
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${(summary.Present / summary.Total) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Absent</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {absent} classes
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${(absent / summary.Total) * 100}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Classes
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {summary.Total} classes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Calculator */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-violet-500" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Target Calculator
              </h4>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <span className="text-lg font-semibold text-violet-600 dark:text-violet-400">
                {targetPercentage}%
              </span>
            </div>
          </div>

          <Slider
            size="lg"
            step={1}
            maxValue={100}
            minValue={1}
            value={targetPercentage}
            onChange={(value) => setTargetPercentage(Number(value))}
            className="max-w-md"
            color="secondary"
            showTooltip={true}
            tooltipContent={(value) => `${value}%`}
          />

          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800/50">
            <div className="flex items-start space-x-3">
              {/* <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1 text-violet-500" /> */}
              <div>
                {percentage >= targetPercentage ? (
                  <>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                        {calculateLeavingLectures(targetPercentage)}
                      </p>
                      <p className="text-sm text-violet-600 dark:text-violet-400">
                        classes
                      </p>
                    </div>
                    <p className="text-sm text-violet-700 dark:text-violet-300 mt-1">
                      can be missed while maintaining {targetPercentage}%
                      attendance
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                        {calculateRequiredLectures(targetPercentage)}
                      </p>
                      <p className="text-sm text-violet-600 dark:text-violet-400">
                        classes
                      </p>
                    </div>
                    <p className="text-sm text-violet-700 dark:text-violet-300 mt-1">
                      needed to achieve {targetPercentage}% attendance
                    </p>
                  </>
                )}
                <div className="flex items-center mt-3 pt-3 border-t border-violet-200 dark:border-violet-700">
                  <p className="text-xs text-violet-600 dark:text-violet-400">
                    Current attendance:{" "}
                    <span className="font-semibold">{percentage}%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
