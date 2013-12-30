from flask.ext.login import UserMixin
from flask.ext.security import RoleMixin, SQLAlchemyUserDatastore, login_user
from db import db

# Association table
roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
)


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


# Association object
class UserStream(db.Model):
    # SqlAlchemy wants to have a primary key
    # http://docs.sqlalchemy.org/en/latest/faq.html#how-do-i-map-a-table-that-has-no-primary-key
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    stream_id = db.Column(db.Integer, db.ForeignKey('stream.id'), primary_key=True)
    extra_data = db.Column(db.String(50))
    privacy = db.Enum('not_shared', 'researcher', 'approved_researcher', 'public')
    stream = db.relationship('Stream', backref='user')

    def __init__(self, extra, privacy):
        self.extra_data = extra
        self.privacy = privacy


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    privacy_setting = db.Column(db.String(80))
    global_privacy = db.Enum('not_shared', 'researcher', 'approved_researcher', 'public')
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
    connected_streams = db.relationship('UserStream', backref='user', cascade='all, delete-orphan')

    def __init__(self, email, username, password, active=None, roles=None):
        self.email = email
        self.username = username
        self.password = password


# Association table
streams_projects = db.Table(
    'streams_projects',
    db.Column('stream_id', db.Integer, db.ForeignKey('stream.id')),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))
)


class Stream(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    url = db.Column(db.String(255), unique=True)
    icon = db.Column(db.String(255))
    keywords = db.Column(db.String(255))
    connection_type = db.Enum('scraping', 'oauth', 'manual_upload')
    linked_projects = db.relationship('Project', secondary=streams_projects, backref=db.backref('streams'))


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    url = db.Column(db.String(255), unique=True)
    description = db.Column(db.String(255))


class UserRepository(object):
    def __init__(self):
        self.user_datastore = SQLAlchemyUserDatastore(db, User, Role)

    def get(self, email):
        return self.user_datastore.get_user(email)

    def create(self, username, email, pwd):
        user = self.user_datastore.create_user(
            email=email,
            username=username,
            password=pwd
        )
        db.session.commit()
        return user

    def login(self, email, pwd):
        user = self.get(email)
        if user:
            if user.password == pwd:
                return login_user(user)
        return False

    def register(self, username, email, pwd):
        user = self.get(email)
        if not user:
            user_obj = self.create(username, email, pwd)
            return login_user(user_obj)
        else:
            return False
