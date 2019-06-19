#!/usr/bin/env node
const inquirer = require('inquirer')
const faker = require('faker')
const fs = require('fs');

let projectsFolderPath = '';
let projectName = '';
let projectPath = '';

const defaultProjectsFolderPath = '/home/' + process.env.USER + '/projects';

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
        
        // Create the new project's folder
        fs.mkdirSync(projectPath)
        
        // Ask which type of project, Web or React
        inquirer.prompt({
            type: "list",
            name: 'type',
            message: "What type of project would you like to create: ",
            choices: [
                "Web Project",
                "React Project"
            ],
            filter: function(val){
                return val.toLocaleLowerCase()
            }
        })
        .then(answers => {
            const simpleGit = require('simple-git')(projectPath);
            switch(answers.type){
                case 'web project':
                    simpleGit.clone('https://gitlab.com/dittmaraz/html-boilerplate',projectPath)
                    break;
                case 'react project':
                    simpleGit.clone('https://gitlab.com/dittmaraz/react-boilerplate',projectPath)
                    break;
            }

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
                    const open = require('open')
                    console.log(projectPath)
                    open(projectPath,{app:'code'})
                }
            })

        })
    })
})
