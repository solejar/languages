#Software Structure

##langDB - *contains all files related to the DB (source jsons etc)*

​	-exceptionsRU.json

​	-prepositionsRU.json

​	-ruleGroupsRU.json

​	-labelsRU.json

​	-russianCollection.json - *collation of all data in previous 4 jsons*

​	-users.json

​	-testingResults.json - *results from testing all of the rule groupings*

**public** - *contains all files related to front/back-end development*

​	**app** - *contains AngularJS files*

​		**config** - *contains all config files (currently unutilized)*

​		**controllers** - *contains all controllers and their tests*

​		**directives** - *contains all directives*

​		**filters** - *contains all filters*

​		**services** - *contains all services/factories*

​		app.js - *registers the Angular app, also handles global structure of the SPA (what page)*

​	**css** - *contains all custom CSS (pre-defined Angular CSS in node_modules)*

​	**images** - *contains all static images such as favicon.ico*

​	**node** - *contains back-end files, except for server*

​		**models** - *will contain schemas when we add Mongoose*

​		**mongo** - *contains all Mongo querying code*

​		**routes** - *contains all HTTP request routes*	

​	**node_modules** - *contains all npm packages*	

​	**views** - *contains all front-end views, but since SPA, likely that this will just be index.*

​	-karma.conf.js

​	-package-lock.json



