from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from mongodbsetup import login, insert_user


# __name__ is equal to app.py
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
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
                {
                    "message": "User creation failed! Username or email might already exist."
                }
            ),
            400,
        )


# Login Route
@app.route("/api/login", methods=["POST"])
def login_route():
    data = request.get_json()

    email = data["email"]
    password = data["password"]

    authenticated, user_id = login(email, password)
    if authenticated:
        return jsonify({"status": "success", "user_id": user_id}), 200
    else:
        return (
            jsonify({"status": "failure", "message": "Invalid email or password!"}),
            401,
        )


@app.route("/", methods=["GET"])
def home():
    return "It's working", 200


if __name__ == "__main__":
    app.run(debug=True)
