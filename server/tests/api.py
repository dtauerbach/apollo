import unittest
import sys

sys.path.append('../src')
import main


class TestStream(unittest.TestCase):
    def setUp(self):
        self.client = main.app.test_client()

    def test_index(self):
        response = self.client.get('/api')
        assert response.status_code == 200
        assert 'API: is running.' in response.data

    def test_services(self):
        response = self.client.get('/api/services.json')
        assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()
