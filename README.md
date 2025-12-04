# Getting Started

Welcome to your new project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).


## Debug mode sales-order-backend-service
28 
29 - cf enable-ssh sales-order-backend-service
30 - cf restart sales-order-backend-service
31 
32 - cf ssh sales-order-backend-service
33 - ps aux | grep node
34 - kill -usr1 <PID> # enables the debug mode
35 - ctrl + D
36 - cf ssh -N -L 9229:127.0.0.1:9229 sales-order-backend-service
37 - Access chrome://inspect
38 - Access sources tab