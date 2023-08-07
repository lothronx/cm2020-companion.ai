import pymongo

# Replace with your MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://databasemain:123@asp-project.xy7kyod.mongodb.net/?retryWrites=true&w=majority"

client = pymongo.MongoClient(MONGO_URI)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['chat_app']

# Create or get collections
# users = db['users']
# chat_settings = db['chat_settings']
# chat_sessions = db['chat_sessions']
# messages = db['messages']

# print("Database and collections set up!")


#users collection
users = db['users']
user_insert_result = users.insert_one({
    'username': 'User1',
    'email': 'user1@gmail.com',
    'password': 'hashed_password1'  # Make sure to hash passwords before storing
})
print(user_insert_result.inserted_id)  # This should print the ObjectID of the inserted document if successful

user_id = user_insert_result.inserted_id


# ChatSettings Collection
chat_settings = db['chat_settings']
chat_settings.insert_one({
    'user_id': user_id,
    'friendliness': 7,
    'humor_level': 5,
    'specific_interests': ['Music', 'Technology']
})

# ChatSessions Collection
chat_sessions = db['chat_sessions']
chat_sessions.insert_one({
    'user_id': user_id,
    'creation_time': '2023-08-04T09:00:00'
})

# Messages Collection
messages = db['messages']
messages.insert_many([
    {
        'chat_id': chat_sessions.find_one({})['_id'],
        'sender': 'User',
        'timestamp': '2023-08-04T09:01:00',
        'message_content': 'Hello, how are you?'
    },
    {
        'chat_id': chat_sessions.find_one({})['_id'],
        'sender': 'AI',
        'timestamp': '2023-08-04T09:01:10',
        'message_content': "Hello, I'm doing well. How about you?"
    }
])

# Query for demonstration
print(messages.find_one({'sender': 'AI'}))