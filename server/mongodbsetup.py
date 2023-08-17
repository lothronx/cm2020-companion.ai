# monogodbsetup.py

import pymongo
from pymongo.errors import DuplicateKeyError
import uuid
from datetime import datetime
import bcrypt
from bson.objectid import ObjectId


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
    except DuplicateKeyError:
        print("Username or email already exists!")
        return None
    

def login(email, password):
    users = db['users']
    user = users.find_one({'email': email})
    if user:

        # Check if the provided password, when hashed, matches the stored hashed password
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            user_id = str(user['_id'])  # Convert ObjectId to its string representation
            return True, user_id
        else:
            return False, None
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
    }
    )

    return companion_id


#T0-DO ( add _id to Identify for that Indivual)
def list_all_companion_names():
    companion_settings = db['companion_settings']
    
    # Using list comprehension to get all companion names from the collection
    companion_names = [doc['companion_name'] for doc in companion_settings.find() if 'companion_name' in doc]
    
    return companion_names


def get_single_companion_id(user_id):
    # Accessing the companion_settings collection
    companion_settings = db['companion_settings']
    
    # Querying the collection to find the record with the specified user_id
    result = companion_settings.find_one({'user_id':user_id})
    
    if result and 'companion_id' in result:
        return str(result['companion_id'])
    return None


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
        'sender': 'assistant',
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
        'sender': 'user',
        'timestamp': current_timestamp(),
        'message_content': message_content
    }
    return messages.insert_one(message_data).inserted_id



def get_messages(user_id, companion_id):
    """Retrieve all messages for a specific user_id and companion_id."""
    try:
        messages = db['messages']
        
        # Convert string IDs to ObjectId
        # user_id_obj = ObjectId(user_id)
        # companion_id_obj = ObjectId(companion_id)

        # Find messages based on user_id and companion_id
        # results = messages.find({ 
        #     '_id': user_id,
        #     'chat_id': companion_id_obj
        # })
        results = messages.find({ 
            'user_id': user_id,
            'companion_id': companion_id
        })
        
        # Extracting message content and sender from the results
        message_data = [{'role': message['sender'].lower(), 'content': message['message_content']} for message in results]
        
        # Logging the retrieved results for debugging
        print(f"Retrieved {len(message_data)} messages for user_id {user_id} and companion_id {companion_id}.")
        
        return message_data
    except Exception as e:
        # Print any exception that occurs
        print(f"An error occurred: {e}")
        return []



if __name__ == "__main__":
    # This code only runs if you execute this file directly, not if you import it
    test_connection()
    user_messages = get_messages("64de65ab40faf2488003dbbf", "fe7aca8c-8a00-42a2-9ee1-7fdc14fdfa2c")
    print(user_messages)
    # companion_id = get_single_companion_id("64da004e1f9ef2cc5a24a7e8")
    # print(companion_id)
   