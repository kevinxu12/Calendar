# Calendar
A personalized calendar side project. Technologies used: Passport/Google OAUTH, Node.js, express, react, MongoDB
(last updated May 19, 2020)
### Features
1. Live search of Events
2. Filtering and Categorization of Existing Events
3. Scheduling Events with Friends
4. Live Feed

### Instructions to Run for Development
* Step 1: open one terminal window npm install. cd into client then npm install
* Step 2: Call npm start in the home directory. 
* Step 3 (Optional)  If errors with npm start, run node server.js. Open a new terminal window, cd into client and run npm start
* Step 4: Contact owner (Kevin Xu) for local development keys files. Files have not been pushed to git hub for security purposes. 

### Instructions for Backend Development
1. New routes should be put in a file in the routes folder. Remember to require the file in server.js
2. New mongo models should be put in a file in the models folder. Remember to require the file in server.js
3. Development API keys should be put in the config/keys
4. Services or reusable files should be in the services folder

### Development Guidelines
1. Use caching when commands are common. You can use node-cache on the backend.
2. Try to use async as opposed to callbacks
3. Reduce the number of nested props

