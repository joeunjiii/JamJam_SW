import AsyncStorage from "@react-native-async-storage/async-storage";

const isWeb = typeof window !== "undefined" && !!window.localStorage;

export const storage = {
    async setItem(key, value) {
        if (isWeb) {
            window.localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    },
    async getItem(key) {
        if (isWeb) {
            return window.localStorage.getItem(key);
        } else {
            return await AsyncStorage.getItem(key);
        }
    },
    async removeItem(key) {
        if (isWeb) {
            window.localStorage.removeItem(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    },
};
