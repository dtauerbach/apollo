from api import app
print 'Setup database for app: %r' % app

from db import db
from repository import User
import repository

string = raw_input('Do you want to drop your existing database? [y/N] ').strip()
if string.lower() in ('y', 'yes'):
    db.drop_all()
db.create_all()

dan = User('dan@example.com', 'Dan', 'pass')
dan.global_privacy = repository.PRIVACY_PUBLIC
db.session.add(dan)
db.session.commit()
