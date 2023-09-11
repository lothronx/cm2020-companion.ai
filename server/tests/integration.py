from unittest import TestCase
from main import *
import ast

class IntegrationTest(TestCase):
    def test_emoji(self):
        client = app.test_client()
        res = ast.literal_eval(client.get('/api/emojify?statement=love is compassion').data.decode('utf-8'))[0]
        emoji_res = res['emoji']
        self.assertEqual(int(emoji_res), 2)

    def test_new_user(self):
        client = app.test_client()
        res = client.post('/api/new_user', json={
            'username': 'name',
            'email': 'name@email.net',
            'password': 'pass'
        })
        print('res: {}'.format(res))
        self.assertEqual(res.status_code, 201)

    def test_new_user(self):
        client = app.test_client()
        res = client.post('/api/login', json={
            'email': 'name@email.net',
            'password': 'pass'
        })
        self.assertEqual(res.status_code, 200)
        res = ast.literal_eval(res.data.decode('utf-8'))['status']
        self.assertEqual(res, 'success')


if __name__ == '__main__':
    main(module='test_module', exit=False)
    unittest.main()
