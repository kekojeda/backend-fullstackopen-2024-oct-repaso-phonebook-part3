const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();

//para hacer uso de post necesitamos json-parser de express
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Configuración de Morgan para registrar solicitudes en modo tiny y mostrar el cuerpo de los POST
morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = Math.floor(Math.random() * 10000) + 1
    return maxId
  }

const isExist = (name) => {
    const exist = 
    persons.find(person=>person.name.toLowerCase() === name.toLowerCase())
    ? true
    : false
        
    return exist
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br/> ${new Date()}`);
  });

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id);
  console.log(person);
  
  if (person) {
    response.json(person);
  } else {
    response.status(400).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name ){
        return response.status(400).json({
            error: "name missing"
        })
    }
    if(!body.number ){
        return  response.status(400).json({
            error: "number missing"
        })
    }
    if(isExist(body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    
    response.json(person)
    
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
