import { initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, onMessage } from "firebase/messaging";
import { sendTokenToBackend } from "../Utils/Api";

const firebaseConfig = {

  apiKey: import.meta.env.VITE_APIKEY,

  authDomain: import.meta.env.VITE_AUTHDOMAIN,

  projectId: import.meta.env.VITE_PROJECTID,

  storageBucket: import.meta.env.VITE_STORAGEBUCKET,

  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,

  appId: import.meta.env.VITE_APPID,

  measurementId: import.meta.env.VITE_MEASUREID,

};
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    if (Notification.permission === "granted") {
      const vapidKey = "BMXYxiMBDYawK_hfhlHkcRoGluVTWB6Q-qLYwoNFDtZSDJ3BbXV6XfL8enuYfSmLR_i0h7dfAZTdbVsju3YgxjM";
      const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
        if (error.code === "messaging/token-unsubscribed" || error.code === "messaging/invalid-token") {
          await deleteToken(messaging).catch(() => console.log("No token to delete"));
          return await getToken(messaging, { vapidKey });
        }
        throw error;
      });

      if (token && typeof token === "string" && token.length >= 50) {
        // console.log("Existing FCM Token:", token);
        await sendTokenToBackend(token);
        return token;
      }
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      if (permission !== "granted") {
        console.warn("Notification permission not granted:", permission);
        return null;
      }
    }

    const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
    const token = await getToken(messaging, { vapidKey });

    if (!token || typeof token !== "string" || token.length < 50) {
      return null;
    }

    await sendTokenToBackend(token);
    return token;
  } catch (error) {
    return null;
  }
};

export const monitorToken = async () => {
  try {
    const vapidKey = "BB-kLe4vRvnBrHpgtnGuaVLdXTLRKbxJMmX3Ja7Tw92tW9NDKoGzQW1WXZDOII2ObL_bjPzBQvLOL9L6PnkbYxw";
    const token = await getToken(messaging, { vapidKey }).catch(async (error) => {
      if (error.code === "messaging/token-unsubscribed" || error.code === "messaging/invalid-token") {
        const newToken = await generateToken();
        return newToken;
      }
      throw error;
    });

    if (token && typeof token !== "string" || token.length < 50) {
      console.warn("Monitored token appears invalid");
      return null;
    }

    await sendTokenToBackend(token);
    return token;
  } catch (error) {
    return null;
  }
};

export { onMessage };