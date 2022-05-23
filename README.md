# Adjacency Matrix v.s. Node-Link Diagram

In this exercise, an animated transition between a node-link diagram and an adjacency matrix is implemented in D3.

In the node-link diagram, each node represents a character in Les Miserables and each link indicates that the two characters appear in the same scene. A link with a darker color indicates that the two characters appear together more frequently. When a user hovers a node in the diagram, it will be highlighted with a change in both color and radius, with its label and ID displayed on the top left corner.

In the adjacency matrix, the ID of each character is displayed in the left-most column and the top row. A colored square indicates that the two characters have appeared in the same scene, and a darker color represents a higher number of times the two character have appeared together.

Clicking the adjacency matrix button when the current visualization is the node-link diagram will initiate an animated transition, in which the nodes of the node-link diagram will transition into the the IDs of the characters and the adjacency matrix will fade in. Clicking the node-link diagram buton when the current visualization is the adjacency matrix will initiate another animated sequence that reverses the change.

# Findings

As expected, Jean Valjean, the main protagonist of Les Miserables, is the center node of the node-link diagram and has the most links connected to other nodes. Therefore, the character also has the highest number of colored squares in the adjacency matrix. Marius, the deuteragnoist of Les Miserables, has the second highest number of links and appears the most frequently with Jean in the same scenes.

# Difficulties

In comparison to the previous D3 exercises, there was an additional design process to decide what the best animated transition between the node-link diagram and the adjacency matrix would be, and how to make it look "smooth." In addition, a lot of the difficulties centered around how to best pre-process the provided data to simplify the later implementation stage. In this case, the nodes and links are provided in two separate csv files, therefore I decided to combine them into one single json file prior to it being passed into the web app.

# How to run the code

* First, place `jean-complete-edge.csv` and `jean-complete-node.csv` in the same directory (e.g. staticdata). Install merge-convert-csv-to-json by running `npm install -g merge-convert-csv-to-json`. Then convert each csv file to an independent json file by running `merge-convert --pattern "./staticdata/jean-complete-edge.csv" --outputTo ./staticdata/data.json --assignTo links` and `--pattern "./staticdata/jean-complete-node.csv" --outputTo ./staticdata/nodes.json --assignTo nodes`. For more information, see here: https://www.npmjs.com/package/merge-convert-csv-to-json

* Then, install JQuerry by running `brew install jq` and combine the two json files into one by running `jq -s '.[0] * .[1]' links.json nodes.json > data.json`. This will create a new json file named `data.json` that includes all the needed information.	

* Then, navigate into "nodejs-started-code" folder and run npm install and then npm start locally on your computer. It should start a local web server at http://localhost:8000/ .

* Note: You will need to install NodeJS in order to run this code. Please also note that this web app does not work with NodeJS 16. In order to run the application, you may need to downgrade Node to an earlier version like NodeJS 14.

# External Resources

[Managing colors in d3.js](https://d3-graph-gallery.com/graph/custom_color.html)

[Bar Chart Example](https://bl.ocks.org/anonymous/bc5a9691a3417b403d4e8ade3297afa3/3a2434c1c2849e476791e581754ec27e055db4d6)

[Link Forces](https://bl.ocks.org/rsk2327/2ebd7f00d43b492e64eee14f35babeac)

[Netwrok Graph](https://d3-graph-gallery.com/graph/network_basic.html)

[D3 Link](https://bl.ocks.org/pram/fb6975acc5de7c24de560def3eecb23a)

[Co-occurrence Matrix](https://towardsdatascience.com/building-a-co-occurrence-matrix-with-d3-to-analyze-overlapping-topics-in-dissertations-fb2ae9470dee)
