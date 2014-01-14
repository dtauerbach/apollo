import unittest
import sys

sys.path.append('../src')
import api
import repository
from repository import User, UserRepository, Stream, Project


class TestModel(unittest.TestCase):

    @classmethod
    def setUpClass(TestModel):
        api.db.drop_all()
        api.db.create_all()

    def setUp(self):
        self.session = api.db.session
        self.ur = UserRepository()

    def test_user_create_and_get(self):
        test_user = self.ur.create('user1', 'email@wahtever.com', 'beautiful pwd')
        assert self.ur.get('email@wahtever.com') == test_user

    def test_set_all_privacy_settings(self):
        test_user = self.ur.create('user2', 'email@hello.com', 'lala pwd')
        test_user.global_privacy = repository.PRIVACY_PRIVATE

        stream = Stream('23andMe', 'url', 'icon', 'key,words', repository.CONNECTION_TYPE_SCRAPING)
        project = Project('Sleep study', 'url', 'desc')
        stream.link_project(project)
        self.session.add(stream)
        self.session.add(project)
        self.session.commit()

        test_user.update_stream_privacy(stream.id, repository.PRIVACY_COMMON_RESEARCHER)

        test_user.update_project_privacy(stream.id, project.id, repository.PRIVACY_APPROVED_RESEARCHER)

        user_queried = User.query.filter_by(username='user2').one()
        assert user_queried.global_privacy == repository.PRIVACY_PRIVATE
        assert user_queried.connected_streams[0].stream == stream
        assert user_queried.connected_streams[0].privacy == repository.PRIVACY_COMMON_RESEARCHER
        assert user_queried.connected_streams[0].connected_projects[0].project == project
        assert user_queried.connected_streams[0].connected_projects[0].privacy == repository.PRIVACY_APPROVED_RESEARCHER

    def query_db(self, query, args=(), one=False):
        cur = self.session.execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv


if __name__ == '__main__':
    unittest.main()
