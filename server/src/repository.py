from flask.ext.login import UserMixin
from flask.ext.security import RoleMixin, SQLAlchemyUserDatastore, login_user
from db import db

roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    privacy_setting = db.Column(db.String(80))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))


class UserRepository(object):
    def __init__(self):
        self.user_datastore = SQLAlchemyUserDatastore(db, User, Role)

    def login(self, email, pwd):
        user = self.user_datastore.get_user(email)
        if user:
            if user.password == pwd:
                return login_user(user)
        return False

    def register(self, username, email, pwd):
        user = self.user_datastore.get_user(email)
        if not user:
            user_obj = self.user_datastore.create_user(
                email=email,
                username=username,
                password=pwd
            )
            self.user_datastore.commit()
            return login_user(user_obj)
        else:
            return False