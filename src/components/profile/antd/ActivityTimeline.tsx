"use client";

import { memo } from "react";

type ActivityTimelineProps = {
  items: string[];
};

function ActivityTimelineComponent({ items }: ActivityTimelineProps) {
  return (
    <div className="border rounded-2xl bg-card p-4 shadow-sm">
      <h5 className="font-semibold text-base mb-4">Recent Activity</h5>
      <div className="flex flex-col">
        {items.map((item, index) => (
          <div key={index} className="relative pl-8 pb-4 last:pb-0">
            {index < items.length - 1 && (
              <span className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-border" />
            )}
            <span className="absolute left-0 top-0.5 h-5 w-5 rounded-full border-2 border-[#5a3ea8] bg-background flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-[#5a3ea8]" />
            </span>
            <p className="text-sm">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const ActivityTimeline = memo(ActivityTimelineComponent);
export default ActivityTimeline;
