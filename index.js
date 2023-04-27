const client=require('./connection.js');
const express =require('express')
const app=express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });


http.listen(3300, () => {
    console.log('server is now listening at port 3300');
    console.log('http://localhost:3300/getusers');
  });

app.use(express.json());
app.use(cors());


const fetchAndUpdateUsers = () => {
  client.query(`SELECT * FROM users`, (err, result) => {
    if (!err) {
      io.emit('mydata', result.rows);
    }
  });
};

app.get('/getusers',(req,res)=>{
  client.query(`select * from  users`,(err,result)=>{
    if(!err){
      // console.log('result-rows',result.rows)
      console.log('getusers',result.rows);
                res.send(result.rows)
            }
        })
        client.end;
})

app.post('/createusers',(req,res)=>{
    const user=req.body;
    let insertQuery=`insert into users(username)
    values('${user.username}')`
    
    client.query(insertQuery,(err,result)=>{
      if(!err){
            res.send('insertion was successful')
            fetchAndUpdateUsers();

        }
        else{
            console.log(err.message)
        }
    })
    client.end;
})
app.delete('/users/:id', (req, res)=> {
  let insertQuery = `delete from users where id=${req.params.id}`

  client.query(insertQuery, (err, result)=>{
      if(!err){
          res.send('Deletion was successful')
      }
      else{ console.log(err.message) }
  })
  client.end;
})
io.on('connection', (socket) => {
  console.log('a user connected');
  fetchAndUpdateUsers();

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('fetchusers', () => {
    fetchAndUpdateUsers();
  });
});



client.query('LISTEN users_updated');

client.on('notification', (notification) => {
  console.log('working');
  console.log('notficatio',notification);
  if (notification.channel === 'users_updated') {
    // Emit 'users updated' event to all connected sockets
    fetchAndUpdateUsers();
  }
});

client.connect();