from flask_backend import ma
from flask_backend.database.db_models import event, Car, User

class CarSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Car
    
    velocity = ma.auto_field()
    n_people = ma.auto_field()
    temperature = ma.auto_field()
    airbag = ma.auto_field()
    ABS = ma.auto_field()
    hazard_ligths = ma.auto_field()
    overturned = ma.auto_field()
    damage = ma.auto_field()

class eventSchema(ma.SQLAlchemySchema):
    class Meta:
        model = event

    id = ma.auto_field()
    video_id = ma.auto_field()
    location = ma.auto_field()
    n_cars_involved = ma.auto_field()
    n_people = ma.auto_field()
    n_people_injured = ma.auto_field()
    damage = ma.auto_field()
    video_total = ma.auto_field()
    date = ma.auto_field()
    status = ma.auto_field()
    city= ma.auto_field()
    
    cars = ma.Nested(CarSchema, many=True)

class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User

    id = ma.auto_field()
    Username = ma.auto_field()
    email = ma.auto_field()
    password = ma.auto_field()
    first_name = ma.auto_field()
    last_name = ma.auto_field()
    birth_date = ma.auto_field()
    address = ma.auto_field()
    city = ma.auto_field()
    country = ma.auto_field()
    postal_code = ma.auto_field()
    telephone = ma.auto_field()
    work_institution = ma.auto_field()
    profession = ma.auto_field()
    about = ma.auto_field()
    role = ma.auto_field()
    role_type = ma.auto_field()
    last_login = ma.auto_field()

# init schema
event_schema = eventSchema()
events_schema = eventSchema(many=True)

car_schema = CarSchema()
car_schemas = CarSchema(many=True)

user_schema = UserSchema()
users_schema = UserSchema(many=True)