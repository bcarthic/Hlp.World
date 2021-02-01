import React from "react";
import { Linking, StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-elements";
import * as Notifications from "expo-notifications";
import { logDebug } from "../service/AppInsight";

interface NotificationOverlayProps {
  content: Notifications.NotificationContent;
  onClose: () => void;
}

const getValue = (content: Notifications.NotificationContent) => {
  const data = content.data;
  console.log("DATA", data);
  if (data) {
    try {
      return {
        value: data["value"] as string,
        url: data["url"] as string,
      };
    } catch (error) {
      return {
        value: "",
        url: "",
      };
    }
  }
};

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
  content,
  onClose,
}) => {
  const data = getValue(content);
  logDebug("Viewed notification", data);
  return (
    <Card containerStyle={styles.card}>
      <Card.Title>{content.title}</Card.Title>
      <Text style={styles.subtitle}>{content.body}</Text>
      {data && data.value && <Text style={styles.text}>{data.value}</Text>}
      {data && data.url && (
        <Text
          style={styles.link}
          onPress={() => {
            logDebug("Clicking notification link", data);
            Linking.openURL(data.url);
          }}
        >
          Click here to know more
        </Text>
      )}
      <Button buttonStyle={styles.button} title="Close" onPress={onClose} />
    </Card>
  );
};

export default NotificationOverlay;

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    margin: 10,
  },
  subtitle: {
    margin: 10,
  },
  link: {
    color: "blue",
    margin: 10,
  },
  image: {
    margin: 10,
  },
  button: {
    margin: 10,
    backgroundColor: "#246a34",
  },
});
