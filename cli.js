#!/usr/bin/env node
const inquirer = require('inquirer')
const faker = require('faker')
const fs = require('fs');
const chalkpipe = require('chalk-pipe');

const dim = chalkpipe('dim.blue.bold')

let projectsFolderPath = '';
let projectName = '';
let projectPath = '';

const defaultProjectsFolderPath = '/home/' + process.env.USER + '/projects';

let boilers = [];

boilers = getBoilerPlates();

// Ask for the user's projects path, the default is /home/$USER/projects
inquirer.prompt({
    type: "input",
    name: 'projectsFolderPath',
    message: 'Enter the path of your projects folder: ',
    default: function() {
        return defaultProjectsFolderPath;
    }
})
.then(answers => {
    projectsFolderPath = answers.projectsFolderPath;
    console.log(dim("Project folder set."))    
    //Ask for the new project's name, the default is a randomly generated one
    const defaultProjectName = faker.lorem.word() + '-' + faker.lorem.word()
    inquirer.prompt({
        type: "input",
        name: "projectName",
        message: 'Enter a name for the new project name: ',
        default: function() {
            return defaultProjectName;
        }
    })
    .then(answers => {
        projectName = answers.projectName;
        projectPath = projectsFolderPath + '/' + projectName
        console.log(dim("Target path set."))
        
        // Create the new project's folder
        fs.mkdirSync(projectPath)
        console.log(dim(projectPath + " created."))

        // Ask which type of project, Web or React
        inquirer.prompt({
            type: "list",
            name: 'type',
            message: "What type of project would you like to create: ",
            
            choices: boilers
        })
        .then(answers => {
            let repo = boilers[answers.type].repository
     
            const simpleGit = require('simple-git')(projectPath);
            simpleGit.clone(repo,projectPath)
           
            console.log(dim("Boilerplate code copied to target folder."))
            
            inquirer.prompt({
                type: 'confirm',
                name: 'open',
                message: 'Open with VSCode? ',
                default: function(){
                    return true;
                }
            })
            .then(answers => {
                if (answers.open) {
                    console.log(dim("Opening target folder in VS Code..."))
            
                    const open = require('open')
                    open(projectPath,{app:'code'})
                }
            })

        })
    })
})

function getBoilerPlates(){
    let rawdata = fs.readFileSync('./boilerplates.json');  
    let json = JSON.parse(rawdata)
    return json.boilerplates.map((val,i) => {
        let o = {
            value: i,
            name: `${val.name} - ${val.description}`,
            repository: val.repository
        }
        return o
    })
}