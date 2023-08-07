# monogodbsetup.py

import pymongo
from pymongo.errors import DuplicateKeyError


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


## Fucntions Relating to User Database 
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

def create_companion(user_id, friendliness, humor_level, specific_interests):
    chat_settings = db['chat_settings']
    chat_settings.insert_one({
        'user_id': user_id,
        'friendliness': friendliness,
        'humor_level': humor_level,
        'specific_interests': specific_interests
    })


## Functions Relating Chat Session Database 

def insert_chat_session(user_id, creation_time):
    chat_sessions = db['chat_sessions']
    return chat_sessions.insert_one({
        'user_id': user_id,
        'creation_time': creation_time
    }).inserted_id


## Functions Relating Messages Database 

def insert_messages(chat_id, messages_list):
    messages = db['messages']
    messages.insert_many(messages_list)


if __name__ == "__main__":
    # This code only runs if you execute this file directly, not if you import it
    test_connection()

    # user_id = insert_user('User1', 'user1@gmail.com', 'hashed_password1')

    # create_companion(user_id, 7, 5, ['Music', 'Technology'])

    # chat_id = insert_chat_session(user_id, '2023-08-04T09:00:00')

    # insert_messages(chat_id, [
    #     {
    #         'chat_id': chat_id,
    #         'sender': 'User',
    #         'timestamp': '2023-08-04T09:01:00',
    #         'message_content': 'Hello, how are you?'
    #     },
    #     {
    #         'chat_id': chat_id,
    #         'sender': 'AI',
    #         'timestamp': '2023-08-04T09:01:10',
    #         'message_content': "Hello, I'm doing well. How about you?"
    #     }
    # ])

    # messages = db['messages']
    # print(messages.find_one({'sender': 'AI'}))

# Assuming 'client' and 'db' are already defined
# user_schema = {
#     "$jsonSchema": {
#         "bsonType": "object",
#         "required": ["email", "username"],
#         "properties": {
#             "email": {
#                 "bsonType": "string",
#                 "description": "must be a string and is required",
#                 "pattern": "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"  # Basic regex for email
#             },
#             "username": {
#                 "bsonType": "string",
#                 "description": "must be a string and is required",
#                 "minLength": 3,
#                 "maxLength": 50
#             }
#         }
#     }
# }

# # Add the collection schema

# db.create_collection("users", validator=user_schema)

# users = db['users']
# users.create_index("email", unique=True)
# users.create_index("username", unique=True)

# print("Collection 'users' created with schema and unique indexes!")


# users = db['users']

# # Add a trial user
# trial_user = {
#     "email": "trialuser@example.com",
#     "username": "trialuser",
#     "password": "hashed_trial_password"  # Remember to hash passwords before inserting
# }

# try:
#     result = users.insert_one(trial_user)
#     print(f"Inserted trial user with ID: {result.inserted_id}")
# except pymongo.errors.DuplicateKeyError:
#     print("A user with the same email or username already exists!")
# except Exception as e:
#     print(f"An error occurred: {e}")
