from unittest import TestCase
from main import *
import ast
from mongodbsetup import (
    insert_user,
    login,
    insert_ai_message,
    insert_user_message,
    get_messages,
)
from chatgptapi import CustomChatGPT


class IntegrationTest(TestCase):
    def test_emoji(self):
        client = app.test_client()
        res = ast.literal_eval(
            client.get("/api/emojify?statement=love is compassion").data.decode("utf-8")
        )[0]
        emoji_res = res["emoji"]
        self.assertEqual(int(emoji_res), 2)

    def test_new_user_success(self):
        client = app.test_client()
        res = client.post(
            "/api/login", json={"email": "name@email.net", "password": "pass"}
        )
        self.assertEqual(res.status_code, 200)
        res = ast.literal_eval(res.data.decode("utf-8"))["status"]
        self.assertEqual(res, "success")

    def test_chat_history(self):
        client = app.test_client()
        res = client.post(
            "/api/login", json={"email": "name@email.net", "password": "pass"}
        )
        self.assertEqual(res.status_code, 200)
        data = res.data
        print("data: {}".format(data))
        res = ast.literal_eval(data.decode("utf-8"))["status"]
        self.assertEqual(res, "success")
        user_id = ast.literal_eval(data.decode("utf-8"))["access_token"]
        client = app.test_client()
        res = client.get(
            "/api/chat_history",
            json={"email": "name@email.net", "password": "pass"},
            headers={"Authorization": "Bearer " + str(user_id)},
        )
        self.assertEqual(res.status_code, 200)


if __name__ == "__main__":
    main(module="test_module", exit=False)
    unittest.main()
