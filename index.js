require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const app = express();
const Person = require('./models/person')

//para hacer uso de post necesitamos json-parser de express
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

// Configuración de Morgan para registrar solicitudes en modo tiny y mostrar el cuerpo de los POST
morgan.token('body', (req, res) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


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
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.post('/api/persons', (request, response,next) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)


const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
