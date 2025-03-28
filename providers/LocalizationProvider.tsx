import React, { ReactNode } from "react";
import { IntlProvider } from "react-intl";
import messages from "@/locales";
import useAuthStore from "@/store/authStore";

type Props = {
  children: ReactNode;
};

type LocaleKeys = keyof typeof messages;

export default function LocalizationProvider({ children }: Props) {
  const { user } = useAuthStore();
  const locale: LocaleKeys = (user?.language as LocaleKeys) || "en";

  // console.log("Selected locale:", locale);
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
