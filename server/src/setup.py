from api import app

print 'Setup database for app: %r' % app

from db import db
from repository import User, Stream, Project
import repository

string = raw_input('Do you want to drop your existing database? [y/N] ').strip()
if string.lower() in ('y', 'yes'):
    db.drop_all()
db.create_all()

s = db.session

test_user = User('dan@example.com', 'Dan', 'pass', repository.PRIVACY_PUBLIC)
s.add(test_user)

stream1 = Stream('23andMe', 'http://23andme.com', '23andMe_Logo_blog.jpg',
                ','.join(['genes', 'genetics', 'biology', 'disease', '23andme']), repository.CONNECTION_TYPE_SCRAPING)
s.add(stream1)
s.add(Stream('Jawbone UP',
             'http://jawbone.com',
             'jawbone_up.jpg',
             ','.join(['jawbone', 'exercise', 'wellness', 'quantified self', 'jawbone up']),
             repository.CONNECTION_TYPE_OAUTH))
s.add(Stream('Electronic Health Record',
             'http://en.wikipedia.org/wiki/Electronic_health_record',
             'service_placeholder.png',
             ','.join(['upload', 'manual', 'electronic health record']),
             repository.CONNECTION_TYPE_MANUAL_UPLOAD))
s.add(Stream('Kaiser Permenante',
             'http://kaiser.com',
             'service_placeholder.png',
             ','.join(['insurance', 'care', 'kaiser permenante']),
             repository.CONNECTION_TYPE_MANUAL_UPLOAD))
s.add(Stream('Nike+',
             'http://nike.com',
             'nikeplus.jpg',
             ','.join(['exercise', 'wellness', 'quantified self', 'running', 'nike']),
             repository.CONNECTION_TYPE_OAUTH))

project1 = Project('Sleep Study', 'http://some-study1.com', 'Study about people\'s sleeping behaviour')
s.add(project1)
s.add(Project('Fitness Study',
              'http://some-study2.com',
              'Study about people\'s health and strength conditions'))
s.add(Project('Food Study',
              'http://some-study3.com',
              'Study about people\'s eating habits'))

s.commit()

test_user.update_stream_privacy(stream1.id, repository.PRIVACY_COMMON_RESEARCHER)
test_user.update_project_privacy(stream1.id, project1.id, repository.PRIVACY_APPROVED_RESEARCHER)
s.commit()
