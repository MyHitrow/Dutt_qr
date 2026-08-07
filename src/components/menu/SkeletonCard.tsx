"use client";
import React from "react";

export const SkeletonCard: React.FC = () => (
  <div className="bg-[#1D1D1F] rounded-[20px] p-4 pt-14 mt-10 relative overflow-hidden">
    {/* Plate skeleton */}
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full dut-skeleton border-4 border-[#101011]" />
    <div className="h-4 w-3/4 mx-auto rounded-full dut-skeleton mb-2" />
    <div className="h-3 w-1/2 mx-auto rounded-full dut-skeleton mb-4" />
    <div className="h-px w-full bg-white/5 mb-3" />
    <div className="flex justify-between px-1">
      <div className="h-3 w-12 rounded-full dut-skeleton" />
      <div className="h-3 w-16 rounded-full dut-skeleton" />
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
