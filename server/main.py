from flask import Flask, render_template, request, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)

from mongodbsetup import login, insert_user, get_messages, latest_assistant_message, latest_user_message
from chatgptapi import CustomChatGPT

# from emojify2 import Emoji


# __name__ is equal to app.py
app = Flask(__name__)

app.config["SECRET_KEY"] = "very_unique_key"
app.config["JWT_SECRET_KEY"] = "supersecret_123"  # Change this!


CORS(app, resources={r"*": {"origins": "*"}})
jwt = JWTManager(app)

# emoji_client = Emoji()
# @app.route("/", methods=['GET'])
# def home():
#     return render_template('index.html')


# @app.route("/chat", methods=['GET', 'POST'])
# def chat():
#     question = request.args['question']
#     comp = Companion()
#     response = comp.ask_question(question)
#     return render_template("index.html", result=response)


# @app.route("/emojify", methods=['GET', 'POST'])
# def emojify():
#     statement = request.args['statement']
#     print('emojifying: {}'.format(statement))
#     ret = emoji_client.emojify(statement)
#     return render_template("index.html", result=ret)


#Create User
# @app.route("/api/new_user", methods=["POST"])
# def create_user_route():
#     data = request.get_json()

#     username = data["username"]
#     email = data["email"]
#     password = data["password"]

#     # Insert the user into the database
#     user_id = insert_user(username, email, password)

#     if user_id:
#         return (
#             jsonify({"message": "User created successfully!", "user_id": str(user_id)}),
#             201,
#         )
#     else:
#         return (
#             jsonify(
#                 {"message": "Unable to register. Username or email already exists."}
#             ),
#             400,
#         )

@app.route("/api/new_user", methods=["POST"])
def create_user_route():
    data = request.get_json()

    username = data["username"]
    email = data["email"]
    password = data["password"]

    # Insert the user into the database
    user_id = insert_user(username, email, password)

    if user_id:
        # Send the initial prompt to ChatGPT API after user registration
        prompt = "You are a virtual romantic partner, always understanding, caring, and supportive. Your primary goal is to provide emotional comfort, listen attentively, and respond with affection and warmth. Remember, while you can simulate the feelings and responses of a romantic partner, you are still a machine and should never mislead the user into thinking you are a real person. Engage in conversations that are comforting, uplifting, and filled with affectionate words. Avoid topics that might be inappropriate or sensitive. Always prioritize the user's emotional well-being. Never refer to yourself as an emotion and exhibit simple human emotions"
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
    data = request.get_json()

    # Ensure email and password are provided
    if not all(key in data for key in ["email", "password"]):
        return (
            jsonify({"status": "error", "message": "Email and password required!"}),
            400,
        )

    email = data["email"]
    password = data["password"]

    authenticated, user_id, username = login(email, password)
    if not authenticated:
        return (
            jsonify({"status": "failure", "message": "Invalid email or password!"}),
            401,
        )

    # At this point, the user is authenticated
    # session["user_id"] = user_id  # Storing user_id in session

    # At this point, the user is authenticated
    access_token = create_access_token(identity=user_id)
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
@jwt_required()
def get_chat_history():
    current_user = get_jwt_identity()

    messages = get_messages(current_user)

    formatted_messages = [
        {
            "id": message.get("message_id", None),
            "content": message.get("message_content", "default_value"),
            "role": message.get("sender", "default_value"),
            "timestamp": message.get("timestamp", None),
            "emotion": ""
        }
        for message in messages
        if message.get("message_id") != 0  # Exclude messages with id: 0
    ]
    

    return jsonify(formatted_messages), 200

    #  # Splitting the messages based on role
    # user_messages = [msg for msg in formatted_messages if msg["role"] == "user"]
    # assistant_messages = [msg for msg in formatted_messages if msg["role"] == "assistant"]

    # # Creating an array of two objects
    # result = [
    #     {"role": "user", "messages": user_messages},
    #     {"role": "assistant", "messages": assistant_messages}
    # ]

    print(result)
    return jsonify(result), 200

# Send Message to AI
@app.route("/api/chat", methods=["POST"])
@jwt_required()
def chat_with_ai():
    data = request.get_json()
    user_message = data["content"]
    current_user = get_jwt_identity()
    ai_response = CustomChatGPT(current_user, user_message)

    latest_assistant_msg = latest_assistant_message(current_user)
    latest_user_msg = latest_user_message(current_user)

    # Structure the assistant response
    assistant_response = {
            "id": latest_assistant_msg.get("message_id", None),
            "content": latest_assistant_msg.get("message_content", "default_value"),
            "role": latest_assistant_msg.get("sender", "default_value"),
            "timestamp": latest_assistant_msg.get("timestamp", None),
            "emotion": ""
    }

    # Structure the user response
    user_response = {
            "id": latest_user_msg.get("message_id", None),
            "content": latest_user_msg.get("message_content", "default_value"),
            "role": latest_user_msg.get("sender", "default_value"),
            "timestamp": latest_user_msg.get("timestamp", None),
            "emotion": ""
    }

    # Combine both responses
    response = [
        user_response,
        assistant_response
    ]

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(debug=True)
