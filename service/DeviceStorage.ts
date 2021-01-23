import AsyncStorage from "@react-native-community/async-storage";

export class DeviceStorage {
  public static readonly FTU_STATE = "FTU_STATE";
  public static readonly REMINDER_STATE = "REMINDER_STATE";
  public static readonly PUSHYA_DATES = "PUSHYA_DATES";
  public static readonly DEVICE_ID = "DEVICE_ID";

  public static async getItem(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting data from async storage", error);
      return "";
    }
  }

  public static async setItem(key: string, data: string) {
    try {
      await AsyncStorage.setItem(key, data);
    } catch (error) {
      console.error("Error storing data to async storage", error);
    }
  }

  public static async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing data from async storage", error);
    }
  }
}
