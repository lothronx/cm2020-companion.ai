# Companion.ai

For UoL BSc in Computer Science CM2020 Agile Software Projects

Team: Team 46 (Tutor Group 5)

Authors: On On Tam (200151908), Yue Wu (210312838), Mohab Mohamed Metwally (210287617/1), Joseph Kinyodah (210193880)

## Features

Companion.ai offers the following features:

1. User Authentication:

Login: Existing users can log in using their credentials.

Register: New users can create an account by providing username, email, and password.

2. Chat:

Users can have conversations with the Chat GPT model and receive kind and friendly responses. The app uses the GPT-3.5 model, which is a powerful language model, to produce text responses that resemble human language.

3. Emotion Detection:

Users will receive an emoji that represents the emotion of the text they just submitted, along with the text response from the Chat GPT model. The app uses NLP model to detect the emotion of the text.

## Getting started

### Frontend:

Before running the frontend, please make sure you have installed Node.js and npm on your computer. The development environment we used is Node.js v18.16.1 and npm v9.5.1.

1. Open a new terminal and go to the client directory:
```bash
cd client
```

2. Install the dependencies:
```bash
npm i
```

3. Run the server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend:

1. Download [this dataset](https://www.kaggle.com/datasets/watts2/glove6b50dtxt?resource=download) and store the downloaded glove.6B.50d.txt file in `/server/emojify/data`.

2. Open a terminal and go to the server directory:
```bash
cd server
```

3. Create a python virtual environment:

For Mac:
```bash
virtualenv -p python3.9 env
source env/bin/activate
```

For Windows:
```bash
py -3 -m venv venv
venv\Scripts\activate
```
Please double check and make sure you are using the python virtual environment before proceeding.

4. Install the dependencies:
```bash
pip install -r requirements.txt
```

5. Run the server:
```bash
python main.py
```
Open [http://127.0.0.1:5000/test](http://127.0.0.1:5000/test) with your browser to see the result.



## How to run the tests

Please make sure you are in the server directory and have activated the python virtual environment before running the tests.

1. For unit tests of sentiment analysis emoji service, chatgpt, and database, please run the following:
```bash
python -m unittest tests.main
```

2. For integration test, please run the following:
```bash
python -m unittest tests.integration
```


## How to use the project

### Landing Page

### Register Page

### Login Page

### Chat Page

### Settings Page

## Technologies Used

Companion.ai uses the following technologies:

1. React 18: A JavaScript library for building user interfaces.

2. Next.js: A React framework for production.

3. Flask: A Python framework for building web applications.

4. MongoDB: A document-oriented database program.

5. GPT-3.5: A powerful language model that produces text that resembles human language.

6. Emojify: A Python library that converts text to emojis.
