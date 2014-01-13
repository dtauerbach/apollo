import unittest
import sys
import json

sys.path.append('../src')
import api
import repository
from repository import User, Stream, Project


class TestApi(unittest.TestCase):

    def setUp(self):
        api.db.drop_all()
        api.db.create_all()
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
        self.session.add(Stream('sse', 'url1', 'i', 'none', repository.CONNECTION_TYPE_OAUTH))
        self.session.commit()

        res = self.client.get('/api/streams.json')
        assert res.status_code == 200
        assert 'sse' in json.loads(res.data)[0]['name']

    def test_projects(self):
        self.session.add(Project('prr', 'url1', 'descr'))
        self.session.commit()

        res = self.client.get('/api/projects.json')
        assert res.status_code == 200
        assert 'prr' in json.loads(res.data)[0]['name']

    def test_privacy(self):
        stream = Stream('23andMe', 'url2', 'i', 'none', repository.CONNECTION_TYPE_SCRAPING)
        project = Project('Sleep study', 'url2', 'descr')
        self.session.add(stream)
        self.session.add(project)
        self.session.commit()

        data = json.dumps({
            'privacy': 'public',
            'streams': {
                stream.id: {
                    'privacy': 'researchers',
                    'projects': {
                        project.id: {'privacy': 'private'}
                    }
                }
            }
        })

        user = User('priv_email', 'priv_user', 'bar')
        self.session.add(user)
        self.session.commit()
        with self.client.session_transaction() as sess:
            sess['user_id'] = user.id
            sess['_fresh'] = True  # http://pythonhosted.org/Flask-Login/#fresh-logins

        res = self.client.post('/api/privacy', data=data, content_type='application/json')
        assert res.status_code == 200


if __name__ == '__main__':
    unittest.main()
