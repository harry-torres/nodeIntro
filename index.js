const express = require('express');
const server = express();

server.use(express.json());
// localhost:3000/test
// query params: ?param=1
// route params: /param/1
// request body = {"param":"1"}

const users = ["Diego", "Henrique", "Robson"];

// middleware (teve req, res e manipulou isso ja e um middleware)
function checkUserExists(req,res,next){
  if(!req.body.name){
    return res.status(400).json({ error: "User name is required!"});
  }

  return next();
}

// outro middleware
function checkUserInArray(req,res,next){
  const user = users[req.params.id];
  if(!user){
    return res.status(400).json({ error: "User does not exist!"});
  }

  req.user = user;

  return next();
}

// one more middleware
server.use((req,res,next)=>{
  console.time('Req');
  console.log(`Método ${req.method} URL ${req.url}`);
  next();
  console.timeEnd('Req');
});

//                  this response is also a middleware 
server.get('/users', (req, res) => {
  return res.json(users);
});

//                        middleware1, response is middleware 2 
server.get('/users/:id', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

//                      middleware1, response is middleware 2 
server.post('/users', checkUserExists, (req, res)=>{
  const {name} = req.body;
  users.push(name);

  return res.json(users);
});

//                        middleware1,    middleware 2,   response is middleware 3 
server.put('/users/:id', checkUserInArray, checkUserExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  users[id] = name;
  return res.json(users); 
});

//                        middleware1, response is middleware 2 
server.delete('/users/:id', checkUserInArray, (req,res) =>  {
  const { id } = req.params;
  console.log('del');
  users.splice(id, 1);
  return res.json(users);
});


server.listen(3000);