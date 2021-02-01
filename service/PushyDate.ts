import dates from "../dates.json";
import { logDebug, logError } from "./AppInsight";
import { DeviceStorage } from "./DeviceStorage";
import { convertDateToUserTimezone, formatTime, isPastDate } from "./TimeZone";

export interface PushyaDates {
  [year: string]: PushyaDate[];
}

export interface PushyaDate {
  start: string;
  end: string;
}

export interface Events {
  Id: string;
  ClickUrl: string;
  ImageUrl: string;
}

const getDates = async (): Promise<PushyaDate[]> => {
  const currentYear = new Date().getFullYear().toString();
  await DeviceStorage.setItem(DeviceStorage.PUSHYA_DATES, "");
  try {
    const getDatesFromServer = async () => {
      const response = await fetch(
        "https://poosam.azurewebsites.net/api/Pushya",
      );
      const result = await response.json();
      dates = JSON.parse(result) as PushyaDates;
      await DeviceStorage.setItem(DeviceStorage.PUSHYA_DATES, result);

      return dates[currentYear];
    };

    let dates = JSON.parse(
      (await DeviceStorage.getItem(DeviceStorage.PUSHYA_DATES)) || "{}",
    ) as PushyaDates;

    if (dates && dates[currentYear]) {
      getDatesFromServer();
      return dates[currentYear];
    }

    return await getDatesFromServer();
  } catch (error) {
    logError("Error getting and parsing date", error);
    return dates[2021];
  }
};

export const getEvents = async (): Promise<Events[]> => {
  logDebug("Getting events");
  try {
    const response = await fetch("https://poosam.azurewebsites.net/api/Events");
    const result = await response.json();
    const events = JSON.parse(result) as Events[];
    return events;
  } catch (error) {
    logError("Error getting events", error);
    return [];
  }
};

export const getFilteredDates = async (): Promise<PushyaDate[]> => {
  logDebug("Getting filtered date");
  const dates = await getDates();
  const list: PushyaDate[] = [];
  if (dates) {
    for (const value of dates) {
      const localTime = convertDateToUserTimezone(value.end);
      if (!isPastDate(localTime)) {
        list.push({
          start: convertDateToUserTimezone(value.start),
          end: localTime,
        });
      }
    }
  }
  return list;
};
