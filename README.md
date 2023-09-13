# Companion.ai

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
![Landing Page](/client/public/home.jpeg)

This is the home page of Companion.ai. You can:
- Click on the "Register" button to create a new account.
- Click on the "Log in" button to log in to an existing account.
- Click on the "Help" button to go to the documentation page.

If you have already logged in, you will be auto redirected to the chat page.

### Register Page
![Register Page](/client/public/register.jpeg)

On the register page, you can enter your username, email, and password to create a new account. 

The username must be at least 4 characters long and no more than 128 characters long, and can only contain letters, numbers, and underscores.

The password must be at least 1 character long and no more than 256 characters long and can only contain letters and numbers.

You will see an error message, if you have entered an invalid username, email or password, or if your username or email has already been taken.

If you have already registered, you can click on the "Already Registered" button to go to the login page. 

If you have already logged in, you will be auto redirected to the chat page.

### Login Page
![Login Page](/client/public/login.jpeg)

On the login page, you can enter your username and password to log in to your account.

You will see an error message, if you have entered an invalid username or password.

If you have not registered, you can click on the "I am a new user" button to go to the register page.

If you have already logged in, you will be auto redirected to the chat page.
### Chat Page
![Chat Page](/client/public/chat.jpeg)

On the chat page, you can chat with our ai.companion, receive kind and friendly responses, and see the emotion of the text you just submitted.

When you first open the chat page, you will see a welcome message from our ai.companion. If you are a returning user, you will also see all your previous conversations with our ai.companion. Chat history is stored in our secure database.

Note that the submit button will be disabled if the chat history is not fully loaded, if the system is still processing the previous request, or if the input is empty.

You can click on the arrow on the top left corner to go to the settings page.

### Settings Page
![Settings Page](/client/public/settings.jpeg)

On the settings page, you can:
- Enter your own OpenAI API key. If you do not have an OpenAI API key, you can use our default API key for testing purposes. Note that the default API key has a limited number of requests per day.
- Read the documentation of our project.
- Contact us via email if you have any questions or suggestions.
- Sign out of your account.
## Technologies Used

Companion.ai uses the following technologies:

1. React 18: A JavaScript library for building user interfaces.

2. Next.js: A React framework for production.

3. Flask: A Python framework for building web applications.

4. MongoDB: A document-oriented database program.

5. GPT-3.5: A powerful language model that produces text that resembles human language.

6. Emojify: A Python library that converts text to emojis.
   
## Credits

For UoL BSc in Computer Science CM2020 Agile Software Projects

Team: Team 46 (Tutor Group 5)

Authors: On On Tam (200151908), Yue Wu (210312838), Mohab Mohamed Metwally (210287617/1), Joseph Kinyodah (210193880)
