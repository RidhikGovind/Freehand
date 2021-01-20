# Freehand
### An interactive whiteboard made with Fabric.js. 

### Features: 
- Brush with assorted color options
- Create Text boxes 
- Create Shapes 
- Download the Canvas content with one-click
- Desktop and Tablet screen responsiveness
- Canvas content can be saved, loaded and can be deleted from Firestore Firebase Database.

### Tech stack
* HTML 
* CSS 
* React.js
* Firebase

### Installation guide

1. `npm i` - to install dependencies
2. create a `firebase.js` file inside 'src' folder
3. Copy the following code into `firebase.js` file  
```
import firebase from "firebase";

//********COPY AND PASTE FIREBASE CONFIG FILE BELOW**********




// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

```
4. In the given space above, copy the firebase and paste the config details of your firebase app.
5. `npm start` - to view React app in the browser