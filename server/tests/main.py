import unittest
from unittest import main
from emojify2 import Emoji
from mongodbsetup import (insert_user, login, insert_ai_message, get_messages)
from chatgptapi import CustomChatGPT


class TestEmoji(unittest.TestCase):
    def test_love(self):
        emoji = Emoji()
        analysis = emoji.emojify('i love you')
        self.assertEqual(analysis, 0)

    def test_smile(self):
        emoji = Emoji()
        analysis = emoji.emojify('love is compassion')
        self.assertEqual(analysis, 2)

    def test_disappointment(self):
        emoji = Emoji()
        analysis = emoji.emojify('was a bad day')
        self.assertEqual(analysis, 3)

    def test_food(self):
        emoji = Emoji()
        analysis = emoji.emojify('food was good')
        self.assertEqual(analysis, 4)

    def test_baseball(self):
        emoji = Emoji()
        analysis = emoji.emojify('i play baseball')
        self.assertEqual(analysis, 1)

class TestChatGpt(unittest.TestCase):
    def test_modules(self):
        # # 1. Insert a user into the users database
        # print("Inserting user...")
        # user_data = {
        #     'email': 'test265rt@example.com',
        #     'username': 'testuser102034',
        #     'password': 'testpassword'  # Ideally, you'd hash this before insertion
        # }

        # # Extracting email and password from the dictionary
        # user_username = user_data['username']
        # user_email = user_data['email']
        # password_hashed = user_data['password']  # Ideally, you'd hash this before passing
        # insert_user(user_username, user_email, password_hashed)
        user_email = 'test265rt@example.com'
        password_hashed = 'testpassword'

        # Login
        success, user_id, _ = login(user_email, password_hashed)

        self.assertEqual(success, True)

        # # 2. Set up companion settings
        # print("Creating companion...")
        # companion_name = "Jake"
        # friendliness = 7
        # humor_level = 5
        # specific_interests = ['Movies', 'Sports']
        # companion_id = create_companion(user_id,  companion_name, friendliness, humor_level, specific_interests)

        # print(f" Success -  Created Companion")
        # print(f"Created companion with ID: {companion_id}\n")

        # companion_id = "bd858874-2720-4e15-b009-f98edd790d3b"
        # user_id = "64de769fa8b4379871d54091"

        # # 3. Send a message from a user to the AI and get a reply
        # user_input = "How are you??"
        # print("Sending message to AI...")
        # ai_response = CustomChatGPT(user_id, user_input)
        # print(f"AI replied: {ai_response}\n")

        # # Inserting the user message into the database
        # insert_user_message(user_id,  user_input)
        # # Inserting the AI message into the database
        # insert_ai_message(user_id,  ai_response)

        # 4. Retrieve all messages for a specific user and companion

        print("Fetching messages from the database...")
        messages = get_messages(user_id)
        self.assertEqual(len(messages), 0)



if __name__ == '__main__':
    main(module='test_module', exit=False)
    print('testing from main')
    unittest.main()
