import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppSettingsDataType } from "@/types";
import { languages } from "@/constants/data";

interface AuthState {
  appSettings: AppSettingsDataType;
  setAppSettings: (data: AppSettingsDataType) => void;
  loadAppSettings: () => Promise<void>;
}

const appSettingsStore = create<AuthState>(set => ({
  appSettings: { language: languages[0]?.value, notification: true },

  setAppSettings: async data => {
    await AsyncStorage.setItem("appSettings", JSON.stringify(data));
    set(() => ({ appSettings: data }));
  },

  loadAppSettings: async () => {
    const storedSettings = await AsyncStorage.getItem("appSettings");
    if (storedSettings) {
      set(() => ({ appSettings: JSON.parse(storedSettings) }));
    }
  },
}));

export default appSettingsStore;
