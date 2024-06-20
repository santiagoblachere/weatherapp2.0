
export default function project(){
    let allProjects = [];
    function createProject(name, allProjects) {   
        console.log(name)
        console.log(allProjects)        
        if (typeof name === 'string') {
            const project = [];
            project.push(name.toUpperCase());
            allProjects.push(project);
            console.log(allProjects)
        } else {
            console.log('error')
        }  
    }
    function deleteProject(name, allProjects) {
        const projectToDeleteIndex = allProjects.findIndex((project) => {
            return project[0] === name;
            
        })
        allProjects.splice(projectToDeleteIndex, 1)
    }

    return { allProjects, createProject, deleteProject }

}
