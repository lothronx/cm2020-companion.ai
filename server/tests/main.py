import unittest
from unittest import main
from emojify2 import Emoji
from mongodbsetup import (
    insert_user,
    login,
    insert_ai_message,
    insert_user_message,
    get_messages,
)
from chatgptapi import CustomChatGPT

class TestEmoji(unittest.TestCase):
    def test_love(self):
        emoji = Emoji()
        analysis = emoji.emojify("i love you")
        self.assertEqual(analysis, 0)

    def test_smile(self):
        emoji = Emoji()
        analysis = emoji.emojify("love is compassion")
        self.assertEqual(analysis, 2)

    def test_disappointment(self):
        emoji = Emoji()
        analysis = emoji.emojify("was a bad day")
        self.assertEqual(analysis, 3)

    def test_food(self):
        emoji = Emoji()
        analysis = emoji.emojify("food was good")
        self.assertEqual(analysis, 4)

    def test_baseball(self):
        emoji = Emoji()
        analysis = emoji.emojify("i play baseball")
        self.assertEqual(analysis, 1)


class TestChatGpt(TestCase):
    def test_login_nouser(self):
        user_email = "abc@example.com"
        password_hashed = "abcd"
        success, user_id, _ = login(user_email, password_hashed)
        self.assertEqual(success, False)

    def test_insert_newuser(self):
        # Insert a user into the users database
        user_username = "test"
        user_email = "test265rt@example.com"
        password_hashed = "testpassword"
        insert_user(user_username, user_email, password_hashed)
        success, user_id, _ = login(user_email, password_hashed)
        self.assertEqual(success, True)
        print("Fetching messages from the database...")
        messages = get_messages(user_id)
        self.assertEqual(len(messages), 0)

    def test_insert_user_insert_chat(self):
        # Insert a user into the users database
        user_username = "test"
        user_email = "test265rt@example.com"
        password_hashed = "testpassword"
        insert_user(user_username, user_email, password_hashed)

        # Login
        success, user_id, _ = login(user_email, password_hashed)

        self.assertEqual(success, True)

        user_id = "64de769fa8b4379871d54091"
        user_input = "How are you??"
        ai_response = CustomChatGPT(user_id, user_input)

        insert_user_message(user_id, user_input)
        insert_ai_message(user_id, ai_response)

        print("Fetching messages from the database...")
        messages = get_messages(user_id)
        self.assertEqual(len(messages) > 0, True)


if __name__ == "__main__":
    main(module="test_module", exit=False)
    unittest.main()
