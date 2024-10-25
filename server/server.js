const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//create a database connection
//create a seperate file for this and import that file here
mongoose.connect('mongodb+srv://mertsaglam349:Mert2003@mern.pmbfe.mongodb.net/').then(() => console.log('Connected')).catch(() => console.log('error')
)

const app = express()
const PORT = process.env.PORT || 5000


app.use(
    cors({
        origin: 'http://localhost:5173/',
        methods : ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders :["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
        credentials : true
    })
)
app.use(express.json())

app.listen(PORT, () => console.log("Server is now running on port")
)