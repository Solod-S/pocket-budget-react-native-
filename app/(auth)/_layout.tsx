import appSettingsStore from "@/store/appSettingsStore";
import { Slot } from "expo-router";
import React, { useEffect } from "react";

export default function TabLayout() {
  const { loadAppSettings } = appSettingsStore();
  useEffect(() => {
    loadAppSettings();
  }, []);
  return <Slot />;
}
