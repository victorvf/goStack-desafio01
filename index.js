const express = require('express');

const server = express();

server.use(express.json());
server.listen('3000');

const projects = [];

function findProject(id){
    return projects.find(project => project.id === Number(id));
};

function checkTitle(request, response, next){
    const {title} = request.body;

    if(!title){
        return response.status(400).json({
            error: "Undefined title"
        });
    };

    return next();
}

function checkProject(request, response, next){
    const { id } = request.params;

    const project = findProject(id);
    
    if(!project){
        return response.status(404).json({
            error: "Project not found"
        });
    }

    return next();
}

function checkRequest(request, response, next){
    console.count("Numero de requisições");

    return next();
}

server.use(checkRequest);

server.get('/projects', (request, response)=>{
    return response.json(projects);
});

server.post('/projects/create', checkTitle, (request, response)=>{
    const { id, title } = request.body;

    projects.push({
        id,
        title,
        tasks: []
    });

    return response.json(projects);
});

server.post('/projects/create/:id/tasks', checkProject, checkTitle, (request, response)=>{
    const { id } = request.params;
    const { title } = request.body;

    const project = findProject(id);

    project.tasks.push(title);
    
    return response.json(projects);
});

server.put('/projects/update/:id', checkProject, checkTitle, (request, response)=>{
    const { id } = request.params;
    const { title } = request.body;

    const project = findProject(id);
    
    project.title = title;
     
    return response.json(projects);
});

server.delete('/projects/delete/:id', checkProject, (request, response)=>{
    const { id } = request.params;

    const indexProject = projects.findIndex(item => item.id === Number(id));

    projects.splice(indexProject, 1);

    return response.json(projects);
});