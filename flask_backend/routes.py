from flask import request, jsonify, render_template, flash, redirect, send_from_directory # flask
from flask_login import login_user, login_required, logout_user, current_user
from flask_backend import app, db   # app and database

# database objects and queries
from flask_backend.database.db_schemas import event_schema, events_schema
from flask_backend.database.db_models import event, Car
from flask_backend.database.queries import *
from flask_backend.erros import *
from datetime import datetime

# data processing
from flask_backend.data_processing import get_location_address, severity_calc
import random

#media
from flask_backend.media_processing import init_media,convert_avi_to_mp4,rmMedia

# video adding 
import os,re

ALLOWED_EXTENSIONS = set(['avi','mp4'])

inventory = [{"name":"Case beams","in_house":2,"out_house":8,"last_mod":"2020-12-07 18:47","price_each":150},
                    {"name":"beams","in_house":4,"out_house":16,"last_mod":"2020-12-07 18:47","price_each":450},
                    {"name":"behringer x32","in_house":2,"out_house":4,"last_mod":"2020-12-07 18:47","price_each":2250},
                    {"name":"dmx cable 15m","in_house":5,"out_house":10,"last_mod":"2020-12-07 18:47","price_each":12},
                    {"name":"mic shure sm58 beta A","in_house":10,"out_house":5,"last_mod":"2020-12-07 18:47","price_each":255}]

events = [{"name":"Evento1","date":"2020-12-07 18:00","location":"University of Aveiro","staff":"Filipe","services":"Space, sound, light",
           "material":" 10 Beams 7r, 20 wash","budget":"4500","ticketline":"98","status":"ready"}]

@app.route('/login/request', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['passwd']
    print(email)
    print(password)
    if can_login(email,password):
        login_user(can_login(email,password))
        user = get_user_by(email=email)
        user.last_login=f"{datetime.now():%Y-%m-%d %H:%M}"
        print(user_schema.dump(user))
        add_user_to_database(user)
        return jsonify({"response":"Done"})
    else:
        return jsonify({"error":"Invalid username or password"})

@app.route('/#admin')
@login_required
def web():
    return render_template("index.html")

@app.route('/')
def index():

    return render_template("index.html")

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return "you are logged out"

@app.route('/home')
@login_required
def home():
    return user_schema.dump(current_user)


# Create a event
@app.route('/add_event', methods=['POST'])
def add_event():
    location = request.json['location']
    video_id = int(request.json['video_id'])

    event = get_event_by(location, filter="belongs")

    if not event:
        location["address"],city = get_location_address(location["lat"],location["lng"])
        event = event(location,city,video_id)
 
    event.n_cars_involved += 1
    n_people = request.json["n_people"]
    event.n_people += request.json["n_people"]

    velocity = request.json["velocity"]
    ABS = request.json["ABS"]
    temperature = request.json["temperature"]
    airbag = True #request.json["airbag"]
    overturned = request.json["overturned"]
    hazard_ligths = request.json["hazard_lights"]
    num_seatbelts = request.json["all_seatbelts"]

    severity = severity_calc(n_people,velocity, ABS, airbag, overturned, num_seatbelts)    

    if event.n_cars_involved > 1:
        event.damage = (((event.damage) * (event.n_cars_involved - 1)) + severity) / event.n_cars_involved
    else :
        event.damage = severity
    
    car = Car(velocity,n_people,temperature,airbag,ABS,hazard_ligths,overturned,severity)

    add_event_to_database(event,car)
    init_media(event.id, (location["lat"], location["lng"]))
    return event_schema.jsonify(event)


@app.route('/add_user', methods=['POST'])
def add_user():
    email = request.json['email']
    role = int(request.json['role'])
    role_type = request.json['role_type']
    city= request.json['city']
    user = User(email,role,role_type,city)
    if add_user_to_database(user):
        return jsonify({"response":"Done"})
    

@app.route('/delete_user/<mail>', methods=['POST'])
def delete_user(mail):
    delete_user_from_database(mail)
    if not get_user_by(email=mail):
        return jsonify(
            {"succes": True }
        )
    return jsonify(
            {"succes": False }
    )

@app.route('/register_user', methods=['POST'])
def register_user():

    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    if register_user_to_database(username,email,password):
        login_user(can_login(email, password))
        user = get_user_by(email=email)
        user.last_login = f"{datetime.now():%Y-%m-%d %H:%M}"
        print(user_schema.dump(user))
        add_user_to_database(user)
        return jsonify({"response": "Done"})
    else:
        return jsonify({"error": "Invalid user or email. Please contact the Administrator"})


@app.route('/all_users', methods=['GET'])
def get_users():
    return get_all_users()

@app.route('/all_inventory', methods=['GET'])
def get_all_inventory():
    return jsonify(inventory)


@app.route('/add_material', methods=['POST'])
def add_material():
    print(request.json)
    name = request.json['name']
    in_house = int(request.json['in_house'])
    out_house = int(request.json['out_house'])
    price_each = int(request.json['price_each'])
    last_mod = f"{datetime.now():%Y-%m-%d %H:%M}"
    inventory.append({"name": name, "in_house": in_house, "out_house": out_house, "last_mod": last_mod, "price_each": price_each})
    return jsonify({"response": "Done"})

@app.route('/update_material/<id>', methods=['POST'])
def update_material(id):
    print(request.json)
    name = request.json['name']
    in_house = int(request.json['in_house'])
    out_house = int(request.json['out_house'])
    price_each = int(request.json['price_each'])
    last_mod = f"{datetime.now():%Y-%m-%d %H:%M}"
    inventory[int(id)]={"name": name, "in_house": in_house, "out_house": out_house, "last_mod": last_mod, "price_each": price_each}
    return jsonify({"response": "Done"})

@app.route('/delete_material/<number>', methods=['POST'])
def delete_material(number):
    if(inventory.pop(int(number))):
        return jsonify(
            {"succes": True }
        )
    return jsonify(
            {"succes": False }
    )

@app.route('/update_user', methods=['POST'])
def update_user():
    user = get_user_by(email=request.json["last_email"])
    print(request.json)
    if "Username" in request.json:
        user.Username = request.json["Username"]
    if "password" in request.json:
        user.password = request.json["password"]
    if "first_name" in request.json:
        user.first_name = request.json["first_name"]
    if "last_name" in request.json:
        user.last_name = request.json["last_name"]
   # if "birth_date" in request.json:
    #    user.birth_date = request.json["birth_date"]
    if "address" in request.json:
        user.address = request.json["address"]
    if "city" in request.json:
         user.city = request.json["city"]
    if "country" in request.json:
        user.country = request.json["country"]
    if "postal_code" in request.json:
        user.postal_code = request.json["postal_code"]
    if "telephone" in request.json:
        user.telephone = request.json["telephone"]
    if "work_institution" in request.json:
        user.work_institution = request.json["work_institution"]
    if "profession" in request.json:
        user.profession = request.json["profession"]
    if "about" in request.json:
        user.about = request.json["about"]
    if "role" in request.json:
        user.role = request.json["role"]
    if "role_type" in request.json:
        user.role_type = request.json["role_type"]
    if "email" in request.json:
        user.email = request.json["email"]

    print(user_schema.dump(user))
    add_user_to_database(user)
    return jsonify(
        {"succes": True }
    )

@app.route('/delete_event/<id>', methods=['POST'])
def delete_event(id):
    print("delete evnt:"+id)
    delete_event_from_database(id)
    rmMedia(id)
    return jsonify(
        {"succes": True }
    )

# See event
@app.route('/event/<id>', methods=['GET'])
def get_event(id):
    return get_event_by(id, filter="id")

@app.route('/event_status/<id>',methods=['GET'])
def get_event_status(id):
    return jsonify(get_event_by(id, filter="id_only_event").status)

@app.route('/set_event_status/<id>',methods=['POST'])
def set_event_status(id):
    status = int(request.json['status'])
    return change_event_status(id,status)

@app.route('/set_event_injured/<id>',methods=['POST'])
def set_event_injured(id):
    status = int(request.json['injured'])
    print(status)
    return change_event_injured(id,status)

@app.route('/event_icon/<status>',methods=['GET'])
def get_event_icon(status):
    if (int(status) == 1):
        return send_from_directory(app.config['UPLOAD_FOLDER'],"icon_map_yellow.png" , as_attachment=True)
    if(int(status) == 2):
        return send_from_directory(app.config['UPLOAD_FOLDER'],"icon_map_green.png" , as_attachment=True)
    else:
        return send_from_directory(app.config['UPLOAD_FOLDER'],"icon_map_red.png" , as_attachment=True)


@app.route('/list_events', methods=['GET'])
def get_events():
    if int(current_user.role) == 0:
        return jsonify(events)
    else:
        return jsonify(events)#return get_event_by(None, filter="all",city=current_user.city)

#Available filters:
# default = between -> show events by date
#cars,people,injured,severity,status
#usage "range_events?id=x&filter=X"
#
@app.route('/range_events', methods=['GET'])
def get_range_events():
    id = request.args.get('id', 1, type=int)
    filter = request.args.get('filter', "between", type=str)
    quantity=request.args.get('quantity',"All",type=str)
    order=request.args.get('order',"Ascending",type=str)
    if int(current_user.role) == 0:
        return jsonify(events)#return get_event_by(((id - 1) * 10, id * 10), filter=filter,quantity=quantity,order=order)
    else:
        return jsonify(events)#return get_event_by(((id - 1) * 10, id * 10), filter=filter,quantity=quantity,order=order,city=current_user.city)



@app.route('/num_events', methods=['GET'])
def get_number_events():
    quantity = request.args.get('quantity', "All", type=str)
    if int(current_user.role) == 0:
        return str(len(events))
    else:
        return str(len(events))

#event media
@app.route('/media/<path:path_to_file>', methods=['GET'])
def get_media_photos_id(path_to_file):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename=path_to_file, as_attachment=True)

@app.route('/Nmedia/<path:path_to_file>')
def get_num_photos(path_to_file):
    txt_or_csv = [f for f in os.listdir(os.path.join(app.config['UPLOAD_FOLDER'],path_to_file)) if re.search(r'.*\.(jpeg)$', f)]
    return str(len(txt_or_csv))

