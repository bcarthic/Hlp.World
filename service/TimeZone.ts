import * as Localization from "expo-localization";
import * as moment from "moment-timezone";

export const convertDateToUserTimezone = (dateString: string): string => {
  const timezone = Localization.timezone;
  const newDate = moment.tz(dateString, timezone);
  const localTime = newDate.format();
  return localTime;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toDateString()} - ${date.toLocaleTimeString()}`;
};

export const isPastDate = (dateString: string): boolean => {
  const now = new Date();
  const date = new Date(dateString);
  return date <= now;
};
