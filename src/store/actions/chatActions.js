export const sendChat = (chat, uuid, auid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    const increment = firebase.firestore.FieldValue.increment(1);
    let chatMap = "";
    
    let arr = [uuid, auid];
    arr = arr.sort();

    //console.log(firestore.collection('chats'))

    /* firestore.collection('chats').doc(uid).set({
            user:uid,
            guest:gid,
            senderId:chat.sid,
            message:chat.message,
        }) */
    /* firestore.collection('chats').doc(uid).collection(gid).doc().set({
            user:uid,
            guest:gid,
            senderId:chat.sid,
            message:chat.message,
        })
        .then((response)=>{
            console.log(response)
        }) */
    firestore
      .collection("chatsMap")
      .where("map", "in", [arr])
      .get()
      .then((Response) => {
        
        Response.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          chatMap = { id: doc.id, ...doc.data() };
          
        });
      })
      .then(() => {
        if (chatMap !== "") {
          const chatRef = firestore
            .collection("chats")
            .doc(chatMap.id)
            .collection("chatsmap")
            .doc();

          const chatsmapRef = firestore.collection("chatsMap").doc(chatMap.id);

          const countRef = firestore
            .collection("chats")
            .doc(chatMap.id)
            .collection("chatsmap")
            .doc("--stats--");

          const batch = firestore.batch();

          batch.set(chatRef, {
            sender: auid,
            reciever: uuid,
            message: chat.message,
            timestamp: new Date(),
          });
          batch.update(
            chatsmapRef,
            {
              message: chat.message,
              timestamp: new Date(),
            }
          );
          batch.set(countRef, { chatsCount: increment }, { merge: true });
          batch.commit();
        } else {
          const anonStatus = {};
          anonStatus[uuid] = true;
          anonStatus[auid] = true;

          return firestore
            .collection("chatsMap")
            .doc()
            .set({
              map: arr,
              message: chat.message,
              timestamp: new Date(),
              anonStatus: anonStatus,
            })
            .then((Response) => {
              
              firestore
                .collection("chatsMap")
                .where("map", "in", [arr])
                .get()
                .then((Response) => {
                  
                  Response.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    chatMap = { id: doc.id, ...doc.data() };
                    
                  });
                })
                .then(() => {
                  const chatsRef = firestore
                    .collection("chats")
                    .doc(chatMap.id)
                    .collection("chatsmap")
                    .doc();

                  const countRef = firestore
                    .collection("chats")
                    .doc(chatMap.id)
                    .collection("chatsmap")
                    .doc("--stats--");
                  const batch = firestore.batch();

                  batch.set(chatsRef, {
                    sender: auid,
                    reciever: uuid,
                    message: chat.message,
                    timestamp: new Date(),
                  });

                  batch.set(
                    countRef,
                    { chatsCount: increment },
                    { merge: true }
                  );

                  batch.commit();
                });
            });
        }
      })
      .then(() => {
        dispatch({ type: "SEND_CHAT_SUCCESS", data: chatMap });
        
      })
      .catch((err) => {
        dispatch({ type: "SEND_CHAT_ERROR", err });
      });
  };
};

export const mapChats = (uuid, auid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();
    let chatMap = "";
    let arr = [uuid, auid];
    arr = arr.sort();

    firestore
      .collection("chatsMap")
      .where("map", "in", [arr])
      .get()
      .then((Response) => {
        Response.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          chatMap = { id: doc.id, ...doc.data() };
          
        });
      })
      .then((response) => {
        if (chatMap !== "") {
         
          return updateActiveChat(chatMap);
        } else {
          const anonStatus = {};
          anonStatus[uuid] = true;
          anonStatus[auid] = true;
          return firestore
            .collection("chatsMap")
            .doc()
            .set({
              map: arr,
              message: "",
              timestamp: new Date(),
              anonStatus: anonStatus,
            })
            .then((Response) => {
              
              firestore
                .collection("chatsMap")
                .where("map", "in", [arr])
                .get()
                .then((Response) => {
                  
                  Response.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    chatMap = { id: doc.id, ...doc.data() };
                    updateActiveChat(chatMap);
                    
                  });
                });
            });
        }
      })
      .then(() => {
        dispatch({ type: "CREATE_CHATMAP_SUCCESS", data: chatMap });
      })
      .catch((err) => {
        dispatch({ type: "CREATE_CHATMAP_ERROR", err });
      });
  };
};

export const updateActiveChat = (data) => {
  return (dispatch, getState) => {
    
    dispatch({ type: "UPDATE_ACTIVECHAT", data });
  };
};

export const updateAnonStatus = (activeChat, auid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = firebase.firestore();

    const anonStatus = { ...activeChat.anonStatus };
    anonStatus[auid] = !anonStatus[auid];
    const newActiveChat = activeChat;
    newActiveChat.anonStatus = anonStatus;

    firestore
      .collection("chatsMap")
      .doc(activeChat.id)
      .update({
        anonStatus: anonStatus,
      })
      .then((response) => {
        
        updateActiveChat(newActiveChat);
        dispatch({ type: "UPDATE_ANONSTATUS_SUCCESS" });
      })
      .catch((err) => {
        
        dispatch({ type: "UPDATE_ANONSTATUS_ERROR", err });
      });
  };
};
