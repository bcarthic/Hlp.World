import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { DeviceStorage } from "./DeviceStorage";
import * as DeviceInfo from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface Tokens {
  Id: string;
  TokenValue: string;
  Name: string;
}

const getId = async () => {
  let id = await DeviceStorage.getItem(DeviceStorage.DEVICE_ID);
  if (!id) {
    id = `${DeviceInfo.modelName}_${Date.now()}`;
    await DeviceStorage.setItem(DeviceStorage.DEVICE_ID, id);
  }

  return id;
};

const postToken = async (token: string) => {
  const id = await getId();
  const name = DeviceInfo.deviceName!;
  const data: Tokens = {
    Id: id,
    TokenValue: token,
    Name: name,
  };

  const response = await fetch("https://poosam.azurewebsites.net/api/Tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    await response.text();
    console.log("Token stored", data);
  } catch (error) {
    console.error(error);
  }
};

export const registerForPushNotifications = async () => {
  let token: Notifications.ExpoPushToken | undefined;
  try {
    const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (!permission.granted) return;
    token = await Notifications.getExpoPushTokenAsync();
  } catch (error) {
    console.log("Error getting a token", error);
  }

  try {
    if (token) {
      await postToken(token.data);
    }
  } catch (error) {
    console.log("Error posting a token", error);
  }
};

export const scheduleNotification = async (dateString: string) => {
  try {
    const trigger = new Date(dateString);
    trigger.setHours(-12);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pushya nakshatra reminder",
        body: "Pushya nakshatra starts in 12 hours!",
      },
      trigger,
    });

    const trigger1 = new Date(dateString);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Pushya nakshatra reminder",
        body: "Pushya nakshatra started!!",
      },
      trigger: trigger1,
    });
  } catch (err) {
    console.log(err);
  }
};

export const scheduleAllNotification = async (dates: string[]) => {
  const notifyState =
    (await DeviceStorage.getItem(DeviceStorage.REMINDER_STATE)) === null;
  if (notifyState) {
    await scheduleAllNotifications(dates);
  }
};

export const scheduleAllNotifications = async (dates: string[]) => {
  for (const d of dates) {
    await scheduleNotification(d);
  }
  await DeviceStorage.setItem(DeviceStorage.REMINDER_STATE, "true");
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await DeviceStorage.setItem(DeviceStorage.REMINDER_STATE, "false");
};
