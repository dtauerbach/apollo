import unittest
import sys

sys.path.append('../src')
import api
import repository
from repository import User, UserStream, Stream, UserRepository, Project, UserStreamProject


class TestModel(unittest.TestCase):

    @classmethod
    def setUpClass(TestModel):
        api.db.drop_all()
        api.db.create_all()

    def setUp(self):
        self.session = api.db.session
        self.ur = UserRepository()

    def test_user_create_and_get(self):
        test_user = self.ur.create('user1', 'email@wahtever.com', 'beatiful pwd')
        assert self.ur.get('email@wahtever.com') == test_user

    def test_set_all_privacy_setting(self):
        test_user = self.ur.create('user2', 'email@hello.com', 'lala pwd')
        test_user.global_privacy = repository.PRIVACY_PRIVATE

        stream = Stream('23andMe', 'url', 'icon', 'key,words', repository.CONNECTION_TYPE_SCRAPING)
        project = Project('Sleep study', 'url', 'desc')
        stream.link_project(project)

        us = UserStream(stream, repository.PRIVACY_PRIVATE)
        test_user.connect_stream(us)

        usp = UserStreamProject(project, repository.PRIVACY_APPROVED_RESEARCHER)
        us.connect_project(usp)
        self.session.add(usp)

        self.session.commit()

        user_queried = User.query.filter_by(username='user2').one()
        assert user_queried.connected_streams[0].stream.name == '23andMe'
        assert user_queried.connected_streams[0].connected_projects[0].project.name == 'Sleep study'

    def query_db(self, query, args=(), one=False):
        cur = self.session.execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv


if __name__ == '__main__':
    unittest.main()
