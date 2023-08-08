# monogodbsetup.py

import pymongo
from pymongo.errors import DuplicateKeyError
import uuid
from datetime import datetime

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://databasemain:123@asp-project.xy7kyod.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(MONGO_URI)

db = client['chat_app']


def test_connection():
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(e)
        return False


## Functions Relating to User Database 
def insert_user(username, email, password_hashed):
    users = db['users']
    try:
        result = users.insert_one({
            'username': username,
            'email': email,
            'password': password_hashed
        })
        return result.inserted_id
    except DuplicateKeyError:
        print("Username or email already exists!")
        return None

def login(email, password_hashed):
    users = db['users']
    user = users.find_one({'email': email, 'password': password_hashed})
    if user:
        return True, user
    else:
        return False, None

def update_user(user_id, new_data):
    users = db['users']
    result = users.update_one({'_id': user_id}, {'$set': new_data})
    return result.modified_count > 0

def delete_user(user_id):
    users = db['users']
    result = users.delete_one({'_id': user_id})
    return result.deleted_count > 0

def fetch_user(criteria):
    users = db['users']
    return users.find_one(criteria)



## Functions Relating Companion Database 

def create_companion(user_id,companion_name, friendliness, humor_level, specific_interests):

    companion_id = str(uuid.uuid4())  # Generate a unique companion_id

    chat_settings = db['companion_settings']
    chat_settings.insert_one({
        'user_id': user_id,
        'companion_id': companion_id,
        'companion_name': companion_name,
        'friendliness': friendliness,
        'humor_level': humor_level,
        'specific_interests': specific_interests
    })


def list_all_companion_names():
    companion_settings = db['companion_settings']
    
    # Using list comprehension to get all companion names from the collection
    companion_names = [doc['companion_name'] for doc in companion_settings.find() if 'companion_name' in doc]
    
    return companion_names

# names = list_all_companion_names()
# if names:
#     print("All companion names:", ', '.join(names))
# else:
#     print("No companions found.")


## Functions Relating Messages Database 

def current_timestamp():
    """Returns the current timestamp in the desired format."""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def insert_ai_message(user_id, companion_id, message_content):
    """Insert a message from the AI into the messages collection."""
    messages = db['messages']
    message_data = {
        'user_id': user_id,
        'companion_id': companion_id,
        'sender': 'AI',
        'timestamp': current_timestamp(),
        'message_content': message_content
    }
    return messages.insert_one(message_data).inserted_id

def insert_user_message(user_id, companion_id, message_content):
    """Insert a message from the User into the messages collection."""
    messages = db['messages']
    message_data = {
        'user_id': user_id,
        'companion_id': companion_id,
        'sender': 'User',
        'timestamp': current_timestamp(),
        'message_content': message_content
    }
    return messages.insert_one(message_data).inserted_id

# Example usage:
# insert_ai_message(user_id="some_user_id", companion_id="some_companion_id", 
#                   message_content="Hello, I'm the AI!")

# insert_user_message(user_id="some_user_id", companion_id="some_companion_id", 
#                     message_content="Hello, how are you?")


def get_messages(user_id, companion_id):
    """Retrieve all messages for a specific user_id and companion_id."""
    messages = db['messages']
    # Find messages based on user_id and companion_id
    results = messages.find({
        'user_id': user_id,
        'companion_id': companion_id
    })
    # Extracting message content from the results
    message_contents = [message['message_content'] for message in results]
    return message_contents

# Example usage:
# messages_list = get_messages(user_id="some_user_id", companion_id="some_companion_id")
# for msg in messages_list:
#     print(msg)


if __name__ == "__main__":
    # This code only runs if you execute this file directly, not if you import it
    test_connection()

   