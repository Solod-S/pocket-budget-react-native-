import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import Toast from "react-native-toast-message";
import { ReactNode, useEffect } from "react";
import { observer } from "mobx-react-lite";
import authStore from "../store/authStore";

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = observer(({ children }: MainLayoutProps) => {
  const { user, isAuthenticated, initAuthListener } = authStore;

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(`isAuthenticated`, isAuthenticated);
    // Check if the user is authenticated or not
    if (typeof isAuthenticated === "undefined") return;
    // user in app group
    const inApp = segments[0] === "(tabs)";
    const inAuth = segments[0] === "(auth)";

    if (isAuthenticated && !inApp) {
      // if user authenticated and not in (tabs) => redirect to home
      router.replace("/home");
    } else if (isAuthenticated === false && !inAuth) {
      // if user is not authenticated and not in (auth) => redirect to signIn
      router.replace("/welcome");
    }
  }, [isAuthenticated]);

  return <View style={{ flex: 1 }}>{children}</View>;
});

const RootLayout = () => {
  return (
    <MainLayout>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/profileModal"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </MainLayout>
  );
};

export default RootLayout;
