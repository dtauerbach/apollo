import unittest
import sys

sys.path.append('../src')
import api


class TestApi(unittest.TestCase):
    api.db.create_all()

    def setUp(self):
        self.client = api.app.test_client()

    def test_index(self):
        response = self.client.get('/api')
        assert response.status_code == 200
        assert 'API: is running.' in response.data

    def test_services(self):
        response = self.client.get('/api/streams.json')
        assert response.status_code == 200

    def test_registration(self):
        response = self.client.post('/api/auth/register', data=dict(username='me', email='foo', password='bar'))
        assert response.status_code == 200
        response = self.client.post('/api/auth/login', data=dict(email='foo', password='bar'))
        assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()
