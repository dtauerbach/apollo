import unittest
import sys
import json
import repository
from repository import Stream, Project

sys.path.append('../src')
import api


class TestApi(unittest.TestCase):
    @classmethod
    def setUpClass(TestApi):
        api.db.drop_all()
        api.db.create_all()

    def setUp(self):
        self.client = api.app.test_client()
        self.session = api.db.session

    def test_index(self):
        res = self.client.get('/api')
        assert res.status_code == 200
        assert 'API: is running.' in res.data

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

    def test_streams(self):
        self.session.add(Stream('sse', 'url', 'i', 'none', repository.CONNECTION_TYPE_OAUTH))
        self.session.commit()

        res = self.client.get('/api/streams.json')
        assert res.status_code == 200
        assert 'sse' in json.loads(res.data)[0]['name']

    def test_projects(self):
        self.session.add(Project('prr', 'url', 'descr'))
        self.session.commit()

        res = self.client.get('/api/projects.json')
        assert res.status_code == 200
        assert 'prr' in json.loads(res.data)[0]['name']

    def test_privacy(self):
        data = json.dumps({
            'privacy': 'public',
            'streams': {
                '23andme': {
                    'privacy': 'researchers',
                    'projects': {
                        'sleep-study': {'privacy': 'private'}
                    }
                }
            }
        })
        res = self.client.post('/api/privacy', data=data, content_type='application/json')
        assert res.status_code == 200

if __name__ == '__main__':
    unittest.main()
