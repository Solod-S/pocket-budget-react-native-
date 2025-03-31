import React, { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import messages from "@/locales";
import useAuthStore from "@/store/authStore";
import appSettingsStore from "@/store/appSettingsStore";

type Props = {
  children: ReactNode;
};

type LocaleKeys = keyof typeof messages;

export default function LocalizationProvider({ children }: Props) {
  const { user } = useAuthStore();
  const { appSettings } = appSettingsStore();
  const locale: LocaleKeys =
    (user?.language as LocaleKeys) || (appSettings?.language as LocaleKeys);

  // console.log("Selected locale:", locale);
  // console.log(`appSettings in locale`, appSettings);
  // console.log(`appSettings`, appSettings);
  // console.log("Messages for selected locale:", messages[locale]);

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale] || messages.en}
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  );
}
