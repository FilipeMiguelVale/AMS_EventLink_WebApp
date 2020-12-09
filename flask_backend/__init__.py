from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_login import LoginManager, UserMixin

import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
bddir = os.path.join(basedir, 'database')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(bddir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

updir = os.path.join(bddir, 'media')

app.config['UPLOAD_FOLDER'] = updir
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.secret_key = "secret key"

# init db

db = SQLAlchemy(app)


# init ma

ma = Marshmallow(app)

#Login stuff
login_manager = LoginManager()
login_manager.init_app(app)


from flask_backend import routes
