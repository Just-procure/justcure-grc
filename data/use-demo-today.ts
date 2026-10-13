"use client";

import { useSyncExternalStore } from "react";

const SERVER_TODAY = "2000-01-01";

function subscribeToClock(onChange: () => void) {
  const timer = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(timer);
}

function getTodaySnapshot() {
  return new Date().toISOString().slice(0, 10);
}

export function useDemoToday() {
  return useSyncExternalStore(subscribeToClock, getTodaySnapshot, () => SERVER_TODAY);
}

export function addDemoDays(today: string, days: number) {
  const date = new Date(`${today}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}