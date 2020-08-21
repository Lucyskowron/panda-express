const chalk = require('chalk');
const jsonParser = require('body-parser')
const express = require('express')
const app = express()
const port = 4000

const pandaList = [
{
  id: 1,
  panda: "flumpy",
},
{
  id: 124,
  panda: "angelica",
},
{
  id: 125,
  panda: "chocky",
},
{
  id: 126,
  panda: "bertrum",
}
]

app.use(express.json())
app.use(loggingMiddleware);

function loggingMiddleware(incoming, out, next) {
  log(incoming);
  next();
}


// get "/panda/{name}" // /panda/flumpy => "{ id: 123, name: 'flumpy' ... }"

app.get('/panda/:id', (incoming, out) => {
  console.log(incoming.params)
  const maybePanda = pandaList.find((panda) => panda.panda === incoming.params.id)
  if (maybePanda) {
    out.json( maybePanda)
  } else {
    out.status(404)
      out.send(`404: ${incoming.params.id} id not found`)
  }
})

// get "/pandas" // => "[{ id: 123, name: 'flmupy'... }, { id: 34, name: 'Jelly' ...}]"

app.get('/pandas', (incoming, out) => {
  out.json(pandaList)
})

// post "/panda" body { id: 33, name: 'chocky' ...} // validate id is unique and has name, and has favourite foods

app.post('/panda', (incoming, out) => {
  const isNotUniquePanda = pandaList.find((panda) => panda.id === incoming.body.id)
  console.log(incoming.body)
  if (!isNotUniquePanda && incoming.body.id && incoming.body.panda) {
    pandaList.push({ id: incoming.body.id, panda: incoming.body.panda })
    out.json(pandaList)
  } else if (!incoming.body.id || !incoming.body.panda) {
    out.status(400)
    out.send('400: Missing data')
  } else {
    out.status(400)
    out.send(`400: panda with ID: ${incoming.body.id} already exists`)
  }
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
