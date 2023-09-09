# Import necessary modules and libraries

# Flask is a micro web framework written in Python. It allows you to create web applications easily.
from flask import Flask, render_template, request, jsonify, make_response

# CORS (Cross Origin Resource Sharing) is a mechanism to let a user agent (your web page) gain permission to access
from flask_cors import CORS


# Flask-JWT-Extended is an extension for Flask that allows you to add JWT (JSON Web Token) authentication to your API.
# JWT is a compact, URL-safe means of representing claims to be transferred between two parties.
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
import json
import re

# Custom modules that that interact with MongoDB and ChatGPT API.
from mongodbsetup import login, insert_user, get_messages, latest_assistant_message, latest_user_message, update_user_message_emotion
from chatgptapi import CustomChatGPT

from emojify2 import Emoji

# A custom module for translating statements to emojis.
# Initialize Flask app
app = Flask(__name__)

# Flask app configurations
# Setting up secret keys for the Flask application and JWT. These keys should be kept secret and unique for security reasons.
app.config["SECRET_KEY"] = "very_unique_key"
app.config["JWT_SECRET_KEY"] = "supersecret_123"  # Change this!

# Specify where the JWT will be included in requests. Can be headers or query strings.
app.config["JWT_TOKEN_LOCATION"] = ['headers', 'query_string']

# Enable CORS for all routes and origins
CORS(app, resources={r"*": {"origins": "*"}})

# JWT Manager setup
jwt = JWTManager(app)

# Initialize emoji client
emoji_client = Emoji()

# Endpoint to emojify a statement
# This route translates a given statement into an emoji representation.
@app.route("/api/emojify", methods=['GET', 'POST'])
def emojify():
    statement = request.args['statement'].replace('"', '')
    print(statement)
    ret = emoji_client.emojify(statement)
    return json.dumps([{"emoji": ret}], default=str), 200

# API Endpoint: Register a new user
# This route creates a new user by taking their username, email, and password.@app.route("/api/new_user", methods=["POST"])
def create_user_route():
    data = request.get_json()

    username = data["username"]
    email = data["email"]
    password = data["password"]

    # Insert the user into the database
    user_id = insert_user(username, email, password)

    if user_id:
        # Send the initial prompt to ChatGPT API after user registration
        # prompt = "You are a virtual romantic partner, always understanding, caring, and supportive. Your primary goal is to provide emotional comfort, listen attentively, and respond with affection and warmth. Remember, while you can simulate the feelings and responses of a romantic partner, you are still a machine and should never mislead the user into thinking you are a real person. Engage in conversations that are comforting, uplifting, and filled with affectionate words. Avoid topics that might be inappropriate or sensitive. Always prioritize the user's emotional well-being. Never refer to yourself as an emotion and exhibit simple human emotions"
        prompt = "I want you to act as a romantic partner. I will provide some details about my daily life, and it will be your job to give me warm greetings and share your thoughts. I will provide details about my feelings, and it will be your job to give me assiduous and thoughtful attention. I will provide details about the conflicts and problems I encountered, and it will be your job to come up with considerate suggestions. Your responses should be gentle, understanding, empathetic, and comforting to make me feel better about myself. My first request is I need affectionate greetings from you. Youre responses should be short and human like."

        CustomChatGPT(str(user_id), prompt)

        return (
            jsonify({"message": "User created successfully!", "user_id": str(user_id)}),
            201,
        )
    else:
        return (
            jsonify(
                {"message": "Unable to register. Username or email already exists."}
            ),
            400,
        )




# Login Route
@app.route("/api/login", methods=["POST"])
def login_route():

     # Extract data from the request
    data = request.get_json()

    # Ensure email and password are provided
    if not all(key in data for key in ["email", "password"]):
        return (
            jsonify({"status": "error", "message": "Email and password required!"}),
            400,
        )

    email = data["email"]
    password = data["password"]

    # Authenticate the user using the provided email and password
    authenticated, user_id, username = login(email, password)

     # If authentication fails, return an error
    if not authenticated:
        return (
            jsonify({"status": "failure", "message": "Invalid email or password!"}),
            401,
        )

    # At this point, the user is authenticated
    # session["user_id"] = user_id  # Storing user_id in session

    # If authentication is successful, generate a JWT access token for the user
    access_token = create_access_token(identity=user_id)

    # Return success message, user_id, username, and access token
    return (
        jsonify(
            {
                "status": "success",
                "message": "Logged in successfully!",
                "user_id": user_id,
                "username": username,
                "access_token": access_token,
            }
        ),
        200,
    )


# Set OpenAI API Route
@jwt_required()
@app.route("/api/settings/openapi", methods=["POST"])
def settings_openapi_route():
    data = request.get_json()
    return jsonify({"status": "success"}), 200


# Server Testing Route
@app.route("/test", methods=["GET"])
def test():
    return "It's working", 200


# OpenAI Routes


# Retreive Messages


@app.route("/api/chat_history", methods=["GET"])
@jwt_required() # This route requires JWT authentication
def get_chat_history():

    # Get the identity (user_id) of the current authenticated user

    current_user = get_jwt_identity()

    # Fetch the chat messages for this user from the database

    messages = get_messages(current_user)

    # Format the messages for the response

    formatted_messages = [
        {
            "id": message.get("message_id", None),
            "content": message.get("message_content", "default_value"),
            "role": message.get("sender", "default_value"),
            "timestamp": message.get("timestamp", None),
            "emotion": message.get("emotion", None)
        }
        for message in messages
        if message.get("message_id") != 0  # Exclude messages with id: 0
    ]

    # Return the formatted messages as a response

    return jsonify(formatted_messages), 200

# API Endpoint: Chat with the AI
# Authenticated users can send a message and receive a response from the AI.
@app.route("/api/chat", methods=["POST"])
@jwt_required()
def chat_with_ai():
    data = request.get_json()
    user_message = data["content"]
    current_user = get_jwt_identity()

    # Sending the user's message to the ChatGPT API and receiving a response.
    ai_response = CustomChatGPT(current_user, user_message)


    # Fetching the latest messages for the user and the assistant from the database.
    latest_assistant_msg = latest_assistant_message(current_user)
    latest_user_msg = latest_user_message(current_user)

    # Structure the assistant response
    assistant_msg = re.sub('[^a-zA-Z ]+', '', latest_assistant_msg.get("message_content", "default_value"))
    assistant_response = {
            "id": latest_assistant_msg.get("message_id", None),
            "content": assistant_msg,
            "role": latest_assistant_msg.get("sender", "default_value"),
            "timestamp": latest_assistant_msg.get("timestamp", None),
            # "emotion": ""
    }

    # Structure the user response
    user_msg = re.sub('[^a-zA-Z ]+', '', latest_user_msg.get("message_content", "default_value"))
    user_emoji = int(emoji_client.emojify(user_msg)  if len(user_msg.split(" ")) <= 10 else -1)

    update_user_message_emotion(current_user, user_emoji)

    user_response = {
            "id": latest_user_msg.get("message_id", None),
            "content": user_msg,
            "role": latest_user_msg.get("sender", "default_value"),
            "timestamp": latest_user_msg.get("timestamp", None),
            "emotion": user_emoji
    }

    # Combine both responses
    response = [
        user_response,
        assistant_response
    ]

    return json.dumps(response, default=str), 200


if __name__ == "__main__":
    app.run(debug=True)
