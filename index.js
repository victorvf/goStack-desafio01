const express = require('express');

const server = express();

server.use(express.json());
server.listen('3000');

const projects = [];

function checkProject(request, response, next){
    const { id } = request.params;
    
    projects.forEach(project=>{
        if(project.id === Number(id)){
            return next();
        }
    });
    return response.status(404).json({
        error: "Project not found"
    });
}

function checkRequest(request, response, next){
    console.count("Numero de requisições");

    return next();
}

server.use(checkRequest);

server.get('/projects', (request, response)=>{
    return response.json(projects);
});

server.post('/projects/create', (request, response)=>{
    const { id, title } = request.body;

    projects.push({
        id,
        title,
        tasks: []
    });

    return response.json(projects);
});

server.post('/projects/create/:id/tasks', checkProject, (request, response)=>{
    const { id } = request.params;
    const { title } = request.body;

    projects.forEach(project=>{
        if(project.id === Number(id)){
            project.tasks = [...project.tasks, title];
        };
    });

    return response.json(projects);
});

server.put('/projects/update/:id', checkProject, (request, response)=>{
    const { id } = request.params;
    const { title } = request.body;

    projects.forEach(project=>{
        if(project.id === Number(id)){
            project.title = title
        };
    });

    return response.json(projects);
});

server.delete('/projects/delete/:id', checkProject, (request, response)=>{
    const { id } = request.params;

    projects.forEach(project=>{
        if(project.id === Number(id)){
            const index  = projects.indexOf(project);
            projects.splice(index, 1);
        };
    });

    return response.json(projects);
});