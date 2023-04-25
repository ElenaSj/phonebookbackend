const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

morgan.token('body',(request) => request.method === "POST" ? JSON.stringify(request.body) : null)

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let people = [
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

app.get("/api/persons", (request, response) => {
    response.json(people)
})

app.get("/api/persons/:id", (request, response) =>{
    let id = Number(request.params.id)
    const person = people.find(p => p.id===id)
    if (person) response.json(person)
    if (!person) response.status(404).end()
})

app.get("/info", (request, response) =>{
    let now = new Date()
    now=now.toString()
    response.send(`<p>Phonebook has info for ${people.length} people</p><p> ${now}</p>`)
})

app.delete("/api/persons/:id", (request, response) =>{
   let id = Number(request.params.id)
   people = people.filter(p => p.id!==id)
   response.status(204).end()
})

app.put("/api/persons/:id", (request, response) => {
    let id = Number(request.params.id)
    people = people.map(p => p.id!==id ? p : request.body)
    response.json(request.body)
})

app.post("/api/persons", (request, response)=>{
    const person=request.body
    if (!person.name){
        return response.status(400).json({
            error:"Name missing"})
    }
    if (!person.number){
        return response.status(400).json({
            error:"Number is missing"
        })
    }
    if (people.find(p => p.name===person.name)){
        return response.status(400).json({
            error:"Person already exists in phonebook"
        })
    }
    person.id = Math.floor(Math.random() * 150)
    people = people.concat(person)
    response.json(person)
})

const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})