// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyD_wNQtdLbu5niiW6LUe5_dV1kyHEzKcT8",
  authDomain: "anon30.firebaseapp.com",
  databaseURL: "https://anon30.firebaseio.com",
  projectId: "anon30",
  storageBucket: "anon30.appspot.com",
  messagingSenderId: "55903387198",
  appId: "1:55903387198:web:ef3b9a82f54df3a2839b6f",
  measurementId: "G-4XVDVNX6D6",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function (payload) {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "noname.png",
    };

    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });
}
