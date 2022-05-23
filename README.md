# Adjacency Matrix v.s. Node-Link Diagram

In this exercise, an animated transition between a node-link diagram and an adjacency matrix is implemented in D3. Both visualizations are based on the Les Miserables Character Network dataset. 

In the node-link diagram, each node represents a character in Les Miserables and each link between two nodes indicates that the two characters have appeared in the same scene. A link with a darker color indicates that the two characters appear together more frequently. When a user hovers a node in the diagram, it will be highlighted with a change in both color and radius, with its label and ID displayed on the top left corner.

In the adjacency matrix, the ID of each character is displayed in the left-most column and the top row. A colored square indicates that the two characters have appeared in the same scene, and a darker color represents a higher number of times the two character have appeared together.

On the top of the page, there are two separate buttons. Clicking the adjacency matrix button when the current visualization is the node-link diagram will initiate an animated transition, in which the nodes of the node-link diagram will transition into the the IDs of the characters and the matrix will fade in. Clicking the node-link diagram buton when the current visualization is the adjacency matrix when initiate another animated sequence that reverse the change.

# Findings

As expected, Jean Valjean, the main protagonist of Les Miserables, is the center node of the node-link diagram and has the most links connected to other nodes. Marius, the deuteragnoist of Les Miserables, has the second highest number of links and appears the most frequently with Jean in the same scenes.

# Difficulties

In comparison to the second D3 exercise, there was more of a design process to decide what would be the best animated transition between the node-link diagram and the adjacency matrix, and how to make it look "smooth." In addition, a lot of the difficulties centered around how to best pre-process the provided data to simplify the later implementation stage. In this case, the nodes and links are provided in two separate csv files, therefore I decided to combine them into one single json file prior to being passed into the web app.

# How to run the code

* 

*

* Then, navigate into "nodejs-started-code" folder and run npm install and then npm start locally on your computer. It should start a local web server at http://localhost:8000/ .

* Note: You will need to install NodeJS in order to run this code. lease also note that this web app does not work with NodeJS 16. In order to run the application, you may need to downgrade Node to an earlier version like NodeJS 14.

# External Resources
