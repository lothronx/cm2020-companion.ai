from mongodbsetup import (insert_user, login, create_companion, insert_user_message, 
                          insert_ai_message, get_messages)
from chatgptapi import CustomChatGPT

def test_modules():

    # 1. Insert a user into the users database
    print("Inserting user...")
    user_data = {
        'email': 'testuser@example.com',
        'username': 'testuser',
        'password': 'testpassword'  # Ideally, you'd hash this before insertion
    }

        # Extracting email and password from the dictionary
    user_username = user_data['username']
    user_email = user_data['email']
    password_hashed = user_data['password']  # Ideally, you'd hash this before passing
    insert_user(user_username, user_email, password_hashed)

    print(f" Success - Inserted User")


    # Login 
    success, user_id = login(user_email, password_hashed)

    if success:
        print(f"User ID retrieved: {user_id}")
    else:
        print("Login failed or user not found.")


    # 2. Set up companion settings
    print("Creating companion...")
    companion_name = "Jennifer"
    friendliness = 7
    humor_level = 5
    specific_interests = ['Movies', 'Sports']
    create_companion(user_id,  companion_name, friendliness, humor_level, specific_interests)

    print(f" Success -  Created Companion")
    # print(f"Created companion with ID: {companion_id}\n")

    # # 3. Send a message from a user to the AI and get a reply
    # user_input = "Hello, how's it going?"
    # print("Sending message to AI...")
    # ai_response = CustomChatGPT(user_id, companion_id, user_input)
    # print(f"AI replied: {ai_response}\n")

    # # Inserting the user message into the database
    # insert_user_message(user_id, companion_id, user_input)
    # # Inserting the AI message into the database
    # insert_ai_message(user_id, companion_id, ai_response)

    # # 4. Retrieve all messages for a specific user and companion
    # print("Fetching messages from the database...")
    # messages = get_messages(user_id, companion_id)
    # for msg in messages:
    #     print(f"{msg['sender']}: {msg['message_content']} at {msg['timestamp']}")

if __name__ == "__main__":
    test_modules()
