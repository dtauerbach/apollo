import logging
from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def main_page():
    return render_template('main_page.html')

if __name__ == '__main__':
    app.config.update(DEBUG=True,PROPAGATE_EXCEPTIONS=True,TESTING=True)
    logging.basicConfig(level=logging.DEBUG)

    app.run()