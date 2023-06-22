const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const taskRoutes = require('./routes/task.routes')
const fileUpload = require('express-fileupload')
const port = 3003

const app = express()
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(taskRoutes)
app.use(fileUpload())
app.use(morgan('dev'))
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
