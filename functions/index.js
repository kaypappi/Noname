const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.newMessage = functions.firestore
  .document("chats/{chatsID}/chatsmap/{chatId}")
  .onWrite(async (event) => {
    const sender = event.after.get("sender");
    const reciever = event.after.get("reciever");
    const sendersDoc = await admin.firestore().doc(`users/${sender}`).get();
    const recieverDoc = await admin.firestore().doc(`users/${reciever}`).get();

    if (sender && reciever) {
      let arr = [sender, reciever]
      arr=arr.sort()
      console.log(arr);

      let chatsMap = "";
      admin
        .firestore()
        .collection("chatsMap")
        .where("map", "in", [arr])
        .get()
        .then((Response) => {
          Response.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            chatsMap = { id: doc.id, ...doc.data() };
          });
        })
        .then(async () => {
          console.log(chatsMap);
          const anonStatus = chatsMap.anonStatus
          const link= `https://nonames.netlify.app/user/${sender}`
          const fullname = anonStatus[sender]
            ? sendersDoc.get("fullName")
            : sendersDoc.get("realName");
          const fcmToken = recieverDoc.get("fcmToken");
          console.log(fcmToken,sendersDoc,recieverDoc,fullname)

          if (typeof fcmToken == "string") {
            var message = {
              notification: {
                title: "New Message On Noname",
                body: `You have a new message from ${fullname}`,
              },
              token: fcmToken,
              webpush: {
                headers: {
                  Urgency: "high"
                },
                fcm_options: {
                  link: link
                },
                notification: {
                  body: `You have a new message from ${fullname}`,
                  requireInteraction: true,
                  badge: "https://ibb.co/34R0HKB"
                }
              }
            };

            let response = await admin.messaging().send(message);
            console.log(response);
          }
        }).catch(err=>{
            console.log(err)
        });
    }
  });
