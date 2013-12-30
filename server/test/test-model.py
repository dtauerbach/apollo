import unittest
import sys

sys.path.append('../src')
import api
from repository import UserStream, Stream, UserRepository


class TestModel(unittest.TestCase):
    api.db.create_all()
    session = api.db.session

    def test_user_create_and_get(self):
        ur = UserRepository()
        email = 'something@sm'
        user = ur.create('nana', email, 'eh')
        assert ur.get(email) == user

    def test_connect_stream(self):
        repo = UserRepository()
        user = repo.create('bha', 'bla', 'eh')

        us = UserStream('dataaaaa', 'public')
        us.stream = Stream()
        user.connected_streams.append(us)

        self.session.commit()

        print self.query_db('select * from user')
        print self.query_db('select * from stream')
        print self.query_db('select * from user_stream')

        dbs = UserStream.query.one()
        assert dbs.extra_data == us.extra_data

    def query_db(self, query, args=(), one=False):
        cur = self.session.execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return (rv[0] if rv else None) if one else rv

if __name__ == '__main__':
    unittest.main()
