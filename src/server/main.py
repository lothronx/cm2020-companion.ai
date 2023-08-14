from flask import Flask, render_template, request
from companion import Companion
from emojify2 import Emoji

# __name__ is equal to app.py
app = Flask(__name__)


@app.route("/", methods=['GET'])
def home():
    return render_template('index.html')

@app.route("/chat", methods=['POST'])
def chat():
    #TODO get question
    question = None
    comp = Companion()
    response = comp.ask_question(question)
    return render_template("index.html", result=response)


@app.route("/emojify", methods=['POST'])
def emojify():
    #TODO
    # 1) get statement
    statement = None
    # 2) query emojify
    # 3) return emoji
    emoji_client = Emoji()
    emoji = emoji_client.emojify(statement)
    return render_template("index.html", result=emoji)

if __name__ == "__main__":
    app.run(debug=True)
