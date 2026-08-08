"use client";
import React from "react";

export const SkeletonCard: React.FC = () => (
  <div
    className="rounded-[20px] overflow-hidden border flex flex-col justify-between"
    style={{ background: "var(--dut-card)", borderColor: "var(--dut-divider)" }}
  >
    {/* Photo container skeleton */}
    <div className="w-full h-32 dut-skeleton" />
    <div className="p-3.5 space-y-2">
      <div className="h-4 w-3/4 rounded-full dut-skeleton" />
      <div className="h-3 w-1/2 rounded-full dut-skeleton" />
      <div className="h-px w-full pt-1" style={{ background: "var(--dut-divider)" }} />
      <div className="flex justify-between pt-1">
        <div className="h-4 w-14 rounded-full dut-skeleton" />
        <div className="h-4 w-10 rounded-full dut-skeleton" />
      </div>
    </div>
  </div>
);

export const SkeletonHero: React.FC = () => (
  <div className="mx-4 mt-2 mb-3 rounded-[20px] overflow-hidden dut-skeleton h-36" />
);

export const SkeletonCategoryRow: React.FC = () => (
  <div className="flex gap-2 px-4 py-2">
    {[1,2,3,4].map(i => (
      <div key={i} className="h-9 w-24 rounded-full dut-skeleton flex-shrink-0" />
    ))}
  </div>
);
