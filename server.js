const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
require('dotenv').config()
const db = process.env.DB_CONNECT;
app.use(express.json())

app.use('/api/cars/' , require('./routes/carsRoute'))
app.use('/api/users/' , require('./routes/usersRoute'))
app.use('/api/bookings/' , require('./routes/bookingsRoute'))


const path = require('path')

if(process.env.NODE_ENV==='production')
{

    app.use('/' , express.static('client/build'))

    app.get('*' , (req , res)=>{

          res.sendFile(path.resolve(__dirname, 'client/build/index.html'));

    })

}

app.get('/', (req, res) => res.send('Hello World!'))

mongoose.set('strictQuery', true)



mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


const PORT = process.env.PORT || 7000;

 


app.listen(port, () => console.log(`Node JS Server Started in Port ${port}`))