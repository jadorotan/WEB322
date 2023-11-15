# WEB322 - LAB 4 Objective
Build a web form using Node.js, Express, and EJS that allows users to submit data. You can choose to handle the form data using either URL Encoded or Multipart form data.

# Include a brief explanation of your form handling choice (URL Encoded vs. Multipart) and why you made this choice.
I used Multipart as my form handling choice. This because we we're required to process a form submission that might've
included a file. To be able to process this correctly, we installed the third-party middleware: "Multer". This is a node.js
middleware for handling multipart/form-data, which is primarily used for uploading files with forms.

# How to run this Project in you own Machine
1. Download all the files within this Directory.
2. Install the dependencies needed for this app to work by running the command `npm install` in the terminal of where these files are located at.
3. Run the command `node server.js` in the same terminal after installing the dependencies.
4. Go to `http://localhost:3000/` on you browser after you start the server.
5. Done!