// messaging.js
import { getMessaging } from "firebase/messaging";
import { app } from './firebaseConfig';

const messaging = getMessaging(app);

export { messaging };
