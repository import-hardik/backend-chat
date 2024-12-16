import { WebSocketServer ,WebSocket, CONNECTING} from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  user:string;
}
console.log("Jai Shri Ram");
let allSockets: User[] =[];
let devices=0;
//@ts-ignore
// let fulllog=[];

wss.on("connection",(socket)=>{
  socket.on("close",()=>{
    //@ts-ignore
    let disConMemberName=allSockets.find(x=>x.socket==socket).user;
    //@ts-ignore
    let disConMemberroom=allSockets.find(x=>x.socket==socket).room;


    console.log("Disconnected "+disConMemberName);
    // let bef=allSockets.map((x)=>x.user);
    allSockets=allSockets.filter(x=>x.socket!=socket);
    // let aft=allSockets.map((x)=>x.user);
    devices-=1;
    console.log("Active Device:"+devices);
    for(let i=0;i< allSockets.length;i++){
      //testing room logic
      // console.log(allSockets[i].room+"===="+parsedMessage.payload.roomcode)
      if(allSockets[i].room ==disConMemberroom){
          //sending messages to room
          allSockets[i].socket.send(JSON.stringify({"type":"left",
                                                    "payload":{"who":disConMemberName,
                                                              "active":devices}}))
          console.log("reminding user who");
      }
    }
  })
  socket.on("message",(message)=>{
    //@ts-ignore
    const parsedMessage= JSON.parse(message);
    if(parsedMessage.type =="join"){
      devices+=1;
      console.log("Active Device:"+devices);
      console.log("User Name : "+parsedMessage.payload.userName);
      console.log(parsedMessage);
      allSockets.push({
        socket,
        room:parsedMessage.payload.roomId,
        user:parsedMessage.payload.userName,
      })
      for(let i=0;i< allSockets.length;i++){
        //testing room logic
        if(allSockets[i].room ==parsedMessage.payload.roomId){
            //sending messages to room
            allSockets[i].socket.send(
              JSON.stringify({"type":"connected",
                              "payload":{"who":parsedMessage.payload.userName,
                                         "active":devices}}))
            console.log("reminding user who");
        }
      }
    }
    if(parsedMessage.type =="chat"){
      // let constUserRoom=allSockets.find((x)=>x.socket==socket).room
      // let constUserRoom=null;
      // for(let i=0;i< allSockets.length;i++){
      //   if(allSockets[i].socket==socket)
      //     constUserRoom=allSockets[i].room
      //     console.log(constUserRoom);
      // }
      // fulllog.push(JSON.stringify(parsedMessage));
      //@ts-ignore
      // console.log("log: "+fulllog);
      for(let i=0;i< allSockets.length;i++){
        //testing room logic
        // console.log(allSockets[i].room+"===="+parsedMessage.payload.roomcode)
        if(allSockets[i].room ==parsedMessage.payload.roomcode){
            //sending messages to room
            allSockets[i].socket.send(JSON.stringify(parsedMessage));
            // allSockets[i].socket.send(JSON.stringify({"type":"condiv",
            //                                           "payload":{"devices":devices}}))
            console.log("Broadcasting: "+allSockets[i].user+" :"+JSON.stringify(parsedMessage));
        }
      }
    }
    //
  })
})
