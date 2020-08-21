const chalk = require('chalk');
const jsonParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000


// app.use(jsonParser.json())
app.use(express.json())

app.get('/', (incoming, out) => {
  log(incoming)
  out.send('Hello World!')
})

app.post('/panda', (incoming, out) => {
  log(incoming)
  console.log(chalk.magenta('-- BODY -----------------------'))
  console.log(incoming.body)
  out.json({ panda: incoming.body.panda.toUpperCase() })
})

app.get('/panda', (incoming, out) => {
  log(incoming)
  out.json({ panda: 'chocky' })
})

app.get('*', (incoming, out) => {
  log(incoming)
  out.send(`404 invalid incoming ${incoming.url}`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


function log(incoming) {
  console.log(
    adamsColours(),
    chalk.yellow(incoming.url),
  );
  console.log(incoming.headers)
  console.log(chalk.magenta('--------------------------------'));

  function adamsColours() {
    if (incoming.method === 'GET') {
      return (chalk.bgGreen.bold(incoming.method))
    } else {
      return (chalk.bgBlue.bold(incoming.method))
    }
  }
}
