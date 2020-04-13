const functions = require('firebase-functions');
const admin= require('firebase-admin')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.newMessage=functions.firestore.document('chats/{chatsID}/chatsmap/{chatId}').onWrite(async(event)=>{
    const sender=event.after.get('sender')
    const reciever=event.after.get('reciever')
    const sendersDoc=await admin.firestore.doc(`users/${sender}`).get()
    const recieverDoc= await admin.firestore.doc(`users/${reciever}`).get()
    const arr=[sender,reciever].sort()
    const chatMap= await admin.database().ref('/chatsMap').where("map", "in", [arr]).get()
    const anonStatus=chatMap.get('anonStatus')
    const fullname= anonStatus[sender] ? sendersDoc.get('fullName') : sendersDoc.get('realName')
    const fcmToken=recieverDoc.get('fcmToken')

    if(typeof fcmToken=="string"){
        var message={
            notification:{
                title:'New Message On Noname',
                body:`You have a new message from ${fullname}`
            },
            token:fcmToken,
        }
    
        let response=await admin.messaging().send(message)
        console.log(response)
    }
    
})