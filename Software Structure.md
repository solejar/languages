# Software Structure



## public

### app 

*contains AngularJS files*

#### 	config

​	*contains all config files (currently unutilized)*

#### 	controllers

​	*contains all controllers and their tests*

##### 		adminCtrl.controller.js

​		*handles the admin page*

##### 		adminCtrl.specs.js

##### 		endingCtrl.controller.js

​		*handles declension*

##### 		endingCtrl.specs.js

#####		loginCtrl.controller.js

​		*handles login*

##### 		loginCtrl.specs.js

##### 		profileCtrl.controller.js

​		*handles profile page*

##### 		profileCtrl.specs.js



#### 	directives

​	*contains all directives*

#### 	filters

​	*contains all filters*

##### 		prepositions.filter.js

​	

#### 	services

​	*contains all services/factories*

##### 		account.factory.js

##### 		account.specs.js

##### 		auth.factory.js

##### 		auth.specs.js

##### 		decliner.factory.js

##### 		sharedProps.factory.js

#####		spellingRules.factory.js

##### 		spellingRules.specs.js

##### 		tester.factory.js

##### 		tester.specs.js

##### 		translator.factory.js

#####		translator.specs.js

##### 	app.js

​	*registers the Angular app, also handles global structure of the SPA (what page)*



### css

*contains all custom CSS (pre-defined Angular CSS in `./public/node_modules`)*



### images

*contains all static images such as `favicon.ico`, which might not require listing*



### node

*contains back-end files, except for `server.js`, which is located in  `./public`*

#### 	models

​	*will contain schemas when we add Mongoose*

#### 	mongo

​	*contains all Mongo querying code*

#### 	routes

​	*contains all HTTP request routes*	

##### 		index.js



### node_modules

*contains all npm packages, which I will not begin listing until absolutely necessary*



### views

*contains all front-end views, but since SPA, likely that this will just be`index.html`*

##### 	index.html



##### karma.conf.js

*config file for karma testing framework*

##### package-lock.json

##### package.json

##### server.js



