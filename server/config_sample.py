DEBUG = True
SECRET_KEY = 'super-secret'
SQLALCHEMY_DATABASE_URI = 'mysql://root:root@localhost/apollo'
SECURITY_CONFIRMABLE = True
SECURITY_REGISTERABLE = True
SECURITY_RECOVERABLE = True
MAIL_SERVER = 'smtp.gmail.com'
MAIL_PORT = 587
MAIL_USE_SSL = False
MAIL_USE_TLS = True
#MAIL_USERNAME = 'your_gmail_username'
#MAIL_PASSWORD = 'your_gmail_password'
SOCIAL_FACEBOOK = {
    'consumer_key': '',
    'consumer_secret': ''
}
SOCIAL_GOOGLE = {
    'consumer_key': '',
    'consumer_secret': ''
}
