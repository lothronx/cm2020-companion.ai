from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
from mongodbsetup import login, insert_user, get_messages, get_single_companion_id
from chatgptapi import CustomChatGPT
from emojify2 import Emoji



# __name__ is equal to app.py
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
emoji_client = Emoji()
@app.route("/", methods=['GET'])
def home():
    return render_template('index.html')

@app.route("/chat", methods=['GET', 'POST'])
def chat():
    question = request.args['question']
    comp = Companion()
    response = comp.ask_question(question)
    return render_template("index.html", result=response)


@app.route("/emojify", methods=['GET', 'POST'])
def emojify():
    statement = request.args['statement']
    print('emojifying: {}'.format(statement))
    ret = emoji_client.emojify(statement)
    return render_template("index.html", result=ret)


# Create User
@app.route("/api/new_user", methods=["POST"])
def create_user_route():
    data = request.get_json()

    username = data["username"]
    email = data["email"]
    password = data["password"]

    # Insert the user into the database
    user_id = insert_user(username, email, password)

    if user_id:
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
        return jsonify({"status": "error", "message": "Email and password required!"}), 400


    email = data["email"]
    password = data["password"]

    authenticated, user_id = login(email, password)
    if not authenticated:
        return jsonify({"status": "failure", "message": "Invalid email or password!"}), 401

    # At this point, the user is authenticated
    session['user_id'] = user_id  # Storing user_id in session

    # Get the companion_id for the logged-in user
    companion_id = get_single_companion_id(user_id)
    if not companion_id:
        return jsonify({"status": "error", "message": "No companions found"}), 400

    # At this point, the companion ID is found
    session['companion_id'] = companion_id  # Storing companion_id in session

    return jsonify({"status": "success", "user_id": user_id, "companion_id": {companion_id}}), 200
# Set OpenAI API Route
# TODO: Implement this route
@app.route("/api/settings/openapi", methods=["POST"])
def settings_openapi_route():
    data = request.get_json()
    return jsonify({"status": "success"}), 200

# Server Testing Route 
@app.route("/", methods=["GET"])
def home():
    return "It's working", 200


#OpenAI Routes 


#Retreive Messages
@app.route("/api/chat_history", methods=["GET"])
def get_chat_history():
    user_id = session.get('user_id')
    companion_id = request.args["companion_id"]
    messages = get_messages(user_id, companion_id)
    return jsonify({"messages": messages}), 200



# Send Message to AI
@app.route("/api/chat", methods=["POST"])
def chat_with_ai():
    data = request.get_json()
    user_id = session.get('user_id')
    companion_id = data["companion_id"]
    user_message = data["message"]
    ai_response = CustomChatGPT(user_id, companion_id, user_message)
    return jsonify({"response": ai_response}), 200




if __name__ == "__main__":
    app.run(debug=True)
    app.secret_key = 'some_random_secret_key'
