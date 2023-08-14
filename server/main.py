from flask import Flask, render_template, request
from companion import Companion
from emojify2 import Emoji

# __name__ is equal to app.py
app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(debug=True)
