import * as Localization from "expo-localization";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  Header,
  Image,
  ListItem,
  Overlay,
} from "react-native-elements";
import Icon from "react-native-vector-icons/Feather";
import { DeviceStorage } from "../service/DeviceStorage";
import {
  cancelAllNotifications,
  scheduleAllNotification,
  scheduleAllNotifications,
} from "../service/Notifications";
import {
  Events,
  getEvents,
  getFilteredDates,
  PushyaDate,
} from "../service/PushyDate";
import { formatTime } from "../service/TimeZone";
import CarouselViewer from "./CarouselViewer";
import Intro from "./Intro";
import * as Notifications from "expo-notifications";
import NotificationOverlay from "./NotificationOverlay";
import { logDebug } from "../service/AppInsight";

export interface HomeProps {
  content: Notifications.NotificationContent | undefined;
}

const Home: React.FC<HomeProps> = ({ content }) => {
  const [visible, setVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [list, setList] = useState<PushyaDate[]>([]);
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [events, setEvents] = useState<Events[]>([]);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const togglenotificationVisible = () => {
    setNotificationVisible(!notificationVisible);
  };

  useEffect(() => {
    const getDates = async () => {
      const dates = await getFilteredDates();
      setList(dates);
      await scheduleAllNotification(dates.map((v) => v.start));
      const notifyState =
        (await DeviceStorage.getItem(DeviceStorage.REMINDER_STATE)) == "true";
      const events = await getEvents();
      setEvents(events);
      setNotifyEnabled(notifyState);
    };

    getDates();
  }, []);

  useEffect(() => {
    setNotificationVisible(!!content);
  }, [content]);

  useEffect(() => {
    const changeFtu = async () => {
      const ftuState = await DeviceStorage.getItem(DeviceStorage.FTU_STATE);
      if (!ftuState) {
        setVisible(true);
      }
    };

    changeFtu();
  }, []);

  useEffect(() => {});

  const createAlert = (notifyEnabled: boolean) => {
    if (notifyEnabled) {
      return Alert.alert(
        "Turn off pushya nakshatra reminders",
        "Do you want to cancel all reminders?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await cancelAllNotifications();
              setNotifyEnabled(false);
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      return Alert.alert(
        "Turn on pushya nakshatra reminders",
        "Do you want to turn on reminders?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await scheduleAllNotifications(list.map((v) => v.start));
              setNotifyEnabled(true);
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  return (
    <View>
      <Header
        containerStyle={styles.header}
        leftComponent={
          <Image
            source={require("../assets/logo192round.png")}
            style={{ width: 30, height: 30 }}
            onPress={() => {
              logDebug("Clicking logo");
              Linking.openURL("https://hlp.world");
            }}
          />
        }
        centerComponent={{
          text: `HLP WORLD`,
          style: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: 5,
          },
        }}
        rightComponent={
          <Button
            buttonStyle={styles.button}
            icon={
              notifyEnabled ? (
                <Icon name="bell-off" size={15} color="white" />
              ) : (
                <Icon name="bell" size={15} color="white" />
              )
            }
            onPress={async () => {
              createAlert(notifyEnabled);
            }}
          />
        }
      />
      <View>
        {events.length > 0 && <CarouselViewer events={events}></CarouselViewer>}
      </View>
      <View>
        <Text
          style={styles.dates}
        >{`Pushya dates for ${Localization.timezone}`}</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {list.map((l, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>
                {`Start : ${formatTime(l.start)}`}
              </ListItem.Title>
              <ListItem.Title>{`End   : ${formatTime(l.end)}`}</ListItem.Title>
            </ListItem.Content>
            {i == 0 && <Icon name={"sunrise"} size={30} />}
          </ListItem>
        ))}
      </ScrollView>
      <ScrollView>
        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          overlayStyle={styles.introScrollView}
        >
          <Intro
            onKnowMore={() => {
              DeviceStorage.setItem(DeviceStorage.FTU_STATE, "1");
              toggleOverlay();
            }}
          />
        </Overlay>
      </ScrollView>
      <ScrollView>
        {content && (
          <Overlay
            isVisible={notificationVisible}
            overlayStyle={styles.introScrollView}
          >
            <NotificationOverlay
              content={content}
              onClose={() => {
                togglenotificationVisible();
              }}
            />
          </Overlay>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  introScrollView: {
    backgroundColor: "#246a34",
  },
  textHeading: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#246a34",
  },
  header: {
    backgroundColor: "#246a34",
  },
  dates: {
    margin: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Home;
