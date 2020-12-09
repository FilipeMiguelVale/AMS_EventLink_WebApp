from flask_backend import db
from datetime import datetime
from flask_login import UserMixin


class event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.JSON, nullable=False)
    n_people = db.Column(db.Integer, nullable=False, default=0)
    n_cars_involved = db.Column(db.Integer, nullable=False, default=0)
    damage = db.Column(db.Float, default=0.0)
    n_people_injured = db.Column(db.Integer, default=0)
    video_total = db.Column(db.Integer, default=0)
    video_id = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)
    status = db.Column(db.Integer, nullable=False, default=0)
    cars = db.relationship('Car', backref='car', lazy=True)
    city= db.Column(db.String)

    def __init__(self, location,city,video_id,n_people=0,n_cars_involved=0,n_people_injured=0,damage=0.0):
        self.location = location
        self.city = city
        self.video_id = video_id
        self.n_people = n_people
        self.n_cars_involved = n_cars_involved
        self.n_people_injured = n_people_injured
        self.damage = damage

class Car(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    velocity = db.Column(db.Float, default=0.0)
    n_people = db.Column(db.Integer, default=0)
    temperature = db.Column(db.Float, default=0.0)
    airbag = db.Column(db.Integer)
    ABS = db.Column(db.Boolean)
    hazard_ligths = db.Column(db.Boolean)
    overturned = db.Column(db.Boolean)
    damage = db.Column(db.Float, default=0.0)

    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

    def __init__(self, velocity, n_people, temperature,airbag, ABS, hazard_lights, overturned, damage):
        self.velocity = velocity
        self.n_people = n_people
        self.temperature = temperature
        self.airbag = airbag
        self.ABS = ABS
        self.hazard_ligths = hazard_lights
        self.overturned = overturned
        self.damage = damage

class User(UserMixin,db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(30))
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    birth_date = db.Column(db.Date)
    address = db.Column(db.String)
    city = db.Column(db.String)
    country = db.Column(db.String)
    postal_code = db.Column(db.String)
    telephone = db.Column(db.String)
    work_institution = db.Column(db.String)
    profession = db.Column(db.String)
    about = db.Column(db.String)
    role = db.Column(db.Integer, nullable=False)
    role_type = db.Column(db.String, nullable=False)
    last_login = db.Column(db.String)

    def __init__(self,email,role,role_type,city):
        self.email = email
        self.role = role
        self.role_type = role_type
        self.city=city
