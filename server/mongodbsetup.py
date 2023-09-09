# monogodbsetup.py

import pymongo
from pymongo.errors import DuplicateKeyError
import uuid
from datetime import datetime
import bcrypt
from bson.objectid import ObjectId


# MongoDB URI connection string; this is essential for connecting to the MongoDB Atlas cloud database.
MONGO_URI = "mongodb+srv://databasemain:123@asp-project.xy7kyod.mongodb.net/?retryWrites=true&w=majority"

# Establishing a connection to the MongoDB client using the provided URI.
client = pymongo.MongoClient(MONGO_URI)

# Selecting the 'chat_app' database within the MongoDB instance.
db = client['chat_app']


def test_connection():
     # Tests the connection to the MongoDB instance.  A successful ping indicates an active connection. 
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return True
    except Exception as e:
        print(e)
        return False


## Functions Relating to User Database 

   #Inserts a new user into the 'users' collection. Passwords are hashed using bcrypt for security.
def insert_user(username, email, password):  # Note the change in parameter name
    users = db['users']
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        result = users.insert_one({
            'username': username,
            'email': email,
            'password': hashed_password.decode('utf-8')  # Store the hashed password as a string
        })
        return result.inserted_id
        # If the username or email already exists in the database, notify the caller.
    except DuplicateKeyError:
        print("Username or email already exists!")
        return None
    

def login(email, password):
    # Authenticates a user based on their email and password. Returns a tuple indicating success, user ID, and username.
    users = db['users']
    user = users.find_one({'email': email})
    if user:

        # Check if the provided password, when hashed, matches the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            user_id = str(user['_id'])  # Convert ObjectId to its string representation
            username = user['username']
            return True, user_id, username
        else:
            return False, None, None
    else:
        return False, None, None



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


## Functions Relating Messages Database 

def current_timestamp():
    """Returns the current timestamp in the desired format."""
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def get_next_message_id(user_id):
    messages = db['messages']
    # Adding a filter criteria based on the user_id to fetch the last message for that specific user
    last_message = messages.find_one({'user_id': user_id}, sort=[('message_id', pymongo.DESCENDING)])
    
    if last_message and 'message_id' in last_message:
        return last_message['message_id'] + 1

    return 0


def insert_ai_message(user_id,  message_content):
    """Insert a message from the AI into the messages collection."""
    messages = db['messages']
    message_data = {
        'user_id': user_id,
        'message_id': get_next_message_id(user_id),
        'sender': 'assistant',
        'timestamp': current_timestamp(),
        'message_content': message_content
    }
    return messages.insert_one(message_data).inserted_id

def insert_user_message(user_id, message_content):
    """Insert a message from the User into the messages collection."""
    messages = db['messages']
    message_data = {
        'user_id': user_id,
        'message_id': get_next_message_id(user_id),
        'sender': 'user',
        'timestamp': current_timestamp(),
        'message_content': message_content,
        
    }
    return messages.insert_one(message_data).inserted_id

def update_user_message_emotion(user_id, emotion):
    """Update the latest user message with its corresponding emoji representation."""
    messages = db['messages']
    
    # Fetch the latest user message
    latest_message = messages.find({
        'user_id': user_id,
        'sender': 'user'
    }).sort('timestamp', pymongo.DESCENDING).limit(1).next()  # Get the latest message document

    # Update the latest user message with the provided emotion
    result = messages.update_one({'_id': latest_message['_id']}, {'$set': {'emotion': emotion}})
    
    return result.modified_count  # Returns the number of documents modified (should be 1 if successful)

def get_messages(user_id):
    """Retrieve all messages for a specific user_id."""
    try:
        messages = db['messages']

        results = messages.find({ 
            'user_id': user_id,
        })

        # Return the full message documents as a list
        message_data = list(results)

        print(f"Retrieved {len(message_data)} messages for user_id {user_id}.")
        return message_data
    except Exception as e:
        # Print any exception that occurs
        print(f"An error occurred: {e}")
        return []

def get_messages_openai(user_id):
    """Retrieve all messages for a specific user_id."""
    try:
        messages = db['messages']

        results = messages.find({ 
            'user_id': user_id,
        })

        # Extract only message_role and message_content, and convert ObjectId to string
        message_data = [{
            "role": "user" if doc["sender"] == "user" else "assistant",
            "content": doc["message_content"]
        } for doc in results]

        print(f"Retrieved {len(message_data)} messages for user_id {user_id}.")
        return message_data
    except Exception as e:
        # Print any exception that occurs
        print(f"An error occurred: {e}")
        return []
    

def latest_assistant_message(user_id):
    """Queries the Database to retrieve the last Ai generated message"""
    messages = db['messages']

    # Print total number of messages for this user_id
    total_messages = messages.count_documents({'user_id': user_id})
    # print(f"Total messages for user_id {user_id}: {total_messages}")

    # Print total number of 'assistant' messages for this user_id
    assistant_messages = messages.count_documents({'user_id': user_id, 'sender': 'assistant'})
    # print(f"Total assistant messages for user_id {user_id}: {assistant_messages}")

    # Print latest assistant message for this user_id
    latest_message = messages.find({
        'user_id': user_id,
        'sender': 'assistant'
    }).sort('timestamp', pymongo.DESCENDING).limit(1)
    
    for msg in latest_message:
        # print(f"Latest message: {msg}")
        return msg

    return None

def latest_user_message(user_id):
    """Queries the Database to retrieve the last user message"""
    messages = db['messages']

    # Print total number of messages for this user_id
    total_messages = messages.count_documents({'user_id': user_id})
    # print(f"Total messages for user_id {user_id}: {total_messages}")

    # Print total number of 'assistant' messages for this user_id
    assistant_messages = messages.count_documents({'user_id': user_id, 'sender': 'user'})
    # print(f"Total assistant messages for user_id {user_id}: {assistant_messages}")

    # Print latest assistant message for this user_id
    latest_message = messages.find({
        'user_id': user_id,
        'sender': 'user'
    }).sort('timestamp', pymongo.DESCENDING).limit(1)
    
    for msg in latest_message:
        # print(f"Latest message: {msg}")
        return msg

    return None


if __name__ == "__main__":
    # This code only runs if you execute this file directly, not if you import it
    test_connection()
