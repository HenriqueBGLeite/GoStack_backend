const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

function logRequest(request, response, next) {
  const  { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next(); //Próximo Middleware
  
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}


app.use(logRequest); //Aplica o Middleware para toda aplicação
app.use('/projects/:id', validateProjectId); //Aplica o Middleware apenas nas rotas com o mesmo formato

app.get('/projects', logRequest, (request, response) => { //Aplica o Middleware apenas para o método
  const { title } = request.query;

  const results = title ? projects.filter(project => project.title.includes(title))
  : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };
  
  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params; //pega o valor enviado pela rota
  const { title, owner } = request.body;

  projectIndex = projects.findIndex(project => project.id === id);
  
  if ( projectIndex < 0 ) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params; //pega o valor enviado pela rota

  projectIndex = projects.findIndex(project => project.id === id);
  
  if ( projectIndex < 0 ) {
    return response.status(400).json({ error: 'Project not found.' })
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
    console.log('🚀 Back-end started!')
});