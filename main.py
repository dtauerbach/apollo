import logging
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Apollo!'

if __name__ == '__main__':
    app.config.update(DEBUG=True,PROPAGATE_EXCEPTIONS=True,TESTING=True)
    logging.basicConfig(level=logging.DEBUG)

    app.run()