import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Home from "./components/Home";
import { registerForPushNotifications } from "./service/Notifications";
import * as Notifications from "expo-notifications";

const App = () => {
  const [content, setContent] = useState<
    Notifications.NotificationContent | undefined
  >(undefined);
  let responseListener: any;

  useEffect(() => {
    registerForPushNotifications();

    responseListener = Notifications.addNotificationResponseReceivedListener(
      (response: Notifications.NotificationResponse) => {
        console.log("Setting content");
        setContent(response.notification.request.content);
      },
    );

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <>
      <View style={styles.scrollView}>
        <Home content={content} />
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
});

export default App;
