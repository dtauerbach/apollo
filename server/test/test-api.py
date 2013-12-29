import unittest
import sys
import json

sys.path.append('../src')
import api


class TestApi(unittest.TestCase):
    api.db.create_all()

    def setUp(self):
        self.client = api.app.test_client()

    def test_index(self):
        res = self.client.get('/api')
        assert res.status_code == 200
        assert 'API: is running.' in res.data

    def test_services(self):
        res = self.client.get('/api/streams.json')
        assert res.status_code == 200

    def test_registration(self):
        res = self.client.post('/api/auth/register', data=dict(username='me', email='foo', password='bar'))
        assert res.status_code == 200
        assert json.loads(res.data)['success'] is True

        res = self.client.post('/api/auth/register', data=dict(username='one', email='foo', password='two'))
        assert res.status_code == 200
        assert json.loads(res.data)['success'] is False

        res = self.client.post('/api/auth/login', data=dict(email='foo', password='bar'))
        assert res.status_code == 200
        assert json.loads(res.data)['success'] is True


if __name__ == '__main__':
    unittest.main()
