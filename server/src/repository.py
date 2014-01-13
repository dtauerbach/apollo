import json

from flask.ext.login import UserMixin
from flask.ext.security import RoleMixin, SQLAlchemyUserDatastore, login_user
from db import db


CONNECTION_TYPE_SCRAPING = 0
CONNECTION_TYPE_OAUTH = 1
CONNECTION_TYPE_MANUAL_UPLOAD = 2

PRIVACY_PRIVATE = 0
PRIVACY_APPROVED_RESEARCHER = 1
PRIVACY_COMMON_RESEARCHER = 2
PRIVACY_PUBLIC = 3


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    global_privacy = db.Column(db.SmallInteger)
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
    connected_streams = db.relationship('UserStream', backref='user', cascade='all, delete-orphan')

    def __init__(self, email, username, password, global_privacy=None, active=None, roles=None):
        self.email = email
        self.username = username
        self.password = password
        self.global_privacy = global_privacy

    def connect_stream(self, stream):
        self.connected_streams.append(stream)

    def get_or_connect_stream(self, stream_name):
        user_stream = None
        for us in self.connected_streams:
            if us.stream.name in stream_name:
                user_stream = us
        if not user_stream:
            stream = Stream.query.filter_by(name=stream_name).one()
            user_stream = UserStream(stream, None)
            db.session.add(user_stream)
            self.connect_stream(user_stream)
        return user_stream

    def update_stream_privacy(self, stream_name, privacy):
        us = self.get_or_connect_stream(stream_name)
        us.privacy = privacy
        db.session.commit()

    def update_project_privacy(self, stream_name, project_name, privacy):
        us = self.get_or_connect_stream(stream_name)
        usp = us.get_or_connect_project(project_name)
        usp.privacy = privacy
        db.session.commit()

    def __repr__(self):
        return '<User %r>' % self.username


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __init__(self, name, description):
        self.name = name
        self.description = description

    def __repr__(self):
        return '<Role %r>' % self.name


class Stream(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    url = db.Column(db.String(255), unique=True)
    icon = db.Column(db.String(255))
    keywords = db.Column(db.String(255))
    connection_type = db.Column(db.SmallInteger)
    linked_projects = db.relationship('Project', secondary='streams_projects', backref=db.backref('streams'))

    def __init__(self, name, url, icon, keywords, connection_type):
        self.name = name
        self.url = url
        self.icon = icon
        self.keywords = keywords
        self.connection_type = connection_type

    def link_project(self, project):
        self.linked_projects.append(project)

    def __repr__(self):
        return '<Stream %r>' % self.name


# Association object
class UserStream(db.Model):
    # SqlAlchemy wants to have a primary key even for association
    # http://docs.sqlalchemy.org/en/latest/faq.html#how-do-i-map-a-table-that-has-no-primary-key
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    stream_id = db.Column(db.Integer, db.ForeignKey('stream.id'))
    privacy = db.Column(db.SmallInteger)
    stream = db.relationship('Stream', backref='user')
    connected_projects = db.relationship('UserStreamProject', backref='userstream', cascade='all, delete-orphan')

    def __init__(self, stream, privacy):
        self.stream = stream
        self.privacy = privacy

    def connect_project(self, usp):
        self.connected_projects.append(usp)

    def get_or_connect_project(self, project_name):
        user_stream_project = None
        for usp in self.connected_projects:
            if usp.project.name in project_name:
                user_stream_project = usp
        if not user_stream_project:
            project = Project.query.filter_by(name=project_name).one()
            user_stream_project = UserStreamProject(project, None)
            db.session.add(user_stream_project)
            self.connect_project(user_stream_project)
        return user_stream_project

    def __repr__(self):
        return '<UserStream user: %r stream: %r, privacy:%r>' % (self.user, self.stream, self.privacy)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True)
    url = db.Column(db.String(255), unique=True)
    description = db.Column(db.String(255))

    def __init__(self, name, url, description):
        self.name = name
        self.url = url
        self.description = description

    def __repr__(self):
        return '<Project %r>' % self.name


# Association object
class UserStreamProject(db.Model):
    # SqlAlchemy wants to have a primary key even for association
    # http://docs.sqlalchemy.org/en/latest/faq.html#how-do-i-map-a-table-that-has-no-primary-key
    userstream_id = db.Column(db.Integer, db.ForeignKey('user_stream.id'), primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), primary_key=True)
    privacy = db.Column(db.SmallInteger)
    project = db.relationship('Project', backref='userstream')

    def __init__(self, project, privacy):
        self.project = project
        self.privacy = privacy

    def __repr__(self):
        return '<UserStreamProject %r>' % self.privacy

# Association table
roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'))
)

# Association table
streams_projects = db.Table(
    'streams_projects',
    db.Column('stream_id', db.Integer, db.ForeignKey('stream.id')),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'))
)


class UserRepository(object):
    def __init__(self):
        self.ud = SQLAlchemyUserDatastore(db, User, Role)

    def get(self, email):
        return self.ud.get_user(email)

    def create(self, username, email, pwd):
        user = self.ud.create_user(
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


class StreamRepository(object):
    @staticmethod
    def streams_to_json():
        res = []
        for s in Stream.query.all():
            res.append(dict(
                key=s.id,
                name=s.name,
                url=s.url,
                icon=s.icon,
                keywords=s.keywords.split(','),
                connect_type=s.connection_type
            ))
        return json.dumps(res)


class ProjectRepository(object):
    @staticmethod
    def projects_to_json():
        res = []
        for p in Project.query.all():
            res.append(dict(
                key=p.id,
                name=p.name,
                url=p.url,
                description=p.description
            ))
        return json.dumps(res)
