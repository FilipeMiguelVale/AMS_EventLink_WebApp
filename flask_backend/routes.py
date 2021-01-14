from flask import request, jsonify, render_template, flash, redirect, send_from_directory # flask
from flask_login import login_user, login_required, logout_user, current_user
from flask_backend import app, db   # app and database

# database objects and queries
from flask_backend.database.db_schemas import event_schema, events_schema
from flask_backend.database.db_models import event, Car
from flask_backend.database.queries import *
from flask_backend.erros import *
from datetime import datetime
import json

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

events = [
{'id':1,'name': 'Festival Aveiro é Nosso', 'last_promotor_name': 'AAUAv', 'about': 'UM festival Unico', 'address': 'UA',
 'start_date': '2020-10-12','start_time': '10:30', 'end_date': '2020-12-12', 'end_time': '06:00', 'country': 'Portugal',
 'postal_code': '', 'profession': 'Dev', 'telephone': '965717720', 'work_institution': 'AAUAv', 'city': 'Aveiro',
 'promotor_name': 'AAUAv', 'vat': '501618970', 'dropDown1Value': 'Festival', 'dropDown2Value': '-', 'dropDown3Value': '-',
 'services':['light', 'video', 'space', 'catering'], 'ticketline': True, 'ticket_price': '10', 'ticket_lotation': '500',
 'ticket_sold': '100','date': '2020-10-12 10:30', 'staff': 'No Staff Assigned', 'email': 'admin@admin.com',
 'services':['light', 'video', 'space', 'catering'],"budget":None},
{'id':2,'name': 'Festival Aveiro', 'last_promotor_name': 'AAUAv', 'about': 'UM festival unico', 'address': 'UA', 'start_date': '2020-12-12',
 'start_time': '22:30', 'end_date': '2020-12-12', 'end_time': '23:59', 'country': 'Portugal', 'postal_code': '6270', 'profession': '',
 'telephone': '965717720', 'work_institution': '', 'city': 'Aveiro', 'promotor_name': 'AAUAv', 'vat': '501618970', 'dropDown1Value': 'Festival',
 'dropDown2Value': '-', 'dropDown3Value': '-', 'ticketline': True,'ticket_price': '50', 'ticket_lotation': '500',
 'ticket_sold': '10', 'date': '2020-12-12 22:30', 'staff': 'No Staff Assigned', 'email': 'teste@teste.com',
 'services':['light', 'video', 'space'],"budget":"15000"}
]

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
@app.route('/create_event', methods=['POST'])
def add_event():
    print(request.json)
    request.json["date"]=request.json["start_date"] + " " + request.json["start_time"]
    request.json["staff"]="No Staff Assigned"
    request.json["email"]=current_user.email
    request.json["services"]=[]
    if bool(request.json["sound"]):
        request.json["services"]+=[" Sound"]
    if bool(request.json["light"]):
        request.json["services"]+=[" Light"]
    if bool(request.json["video"]):
        request.json["services"]+=[" Video"]
    if bool(request.json["space"]):
        request.json["services"]+=[" Space"]
    if bool(request.json["catering"]):
        request.json["services"] +=[" Catering "]
    if not bool(request.json["ticketline"]):
        request.json["ticketline"] = "None"
    request.json["id"]=len(events)+1
    request.json['ticket_sold']=0
    request.json['budget']=None
    print(request.json)
    events.append(request.json)
    return jsonify({"response":"Done"})


@app.route('/add_user', methods=['POST'])
def add_user():
    email = request.json['email']
    role = int(request.json['role'])
    role_type = request.json['role_type']
    user = User(email,role,role_type,"Aveiro")
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
    user = User(email, 1, "User", "Aveiro")
    add_user_to_database(user)
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

@app.route('/buy_ticket/<id>', methods=['POST'])
def buy_ticket(id):
    print(events[int(id) - 1])
    events[int(id)-1]["ticket_sold"]= int(events[int(id)-1]["ticket_sold"])+1
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
    events.pop(int(id)-1)
    # delete_event_from_database(id)
    # rmMedia(id)
    return jsonify(
        {"succes": True }
    )

# See event
@app.route('/event/<id>', methods=['GET'])
def get_event(id):
    return jsonify(events[int(id)-1])

@app.route('/set_budget/<id>',methods=['POST'])
def set_budget(id):
    budget = int(request.json['budget'])
    print(budget)
    events[int(id)-1]["budget"]=budget
    return {"response":"Done"}

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
    ret = []
    for event in events:
        print(event)
        print(type(event))
        if event["email"] == current_user.email or int(current_user.role)==0:
            ret.append(event)
    return jsonify(ret)#return get_event_by(None, filter="all",city=current_user.city)

#Available filters:
# default = between -> show events by date
#cars,people,injured,severity,status
#usage "range_events?id=x&filter=X"
#
@app.route('/range_events', methods=['GET'])
def get_range_events():
    ret = []
    for event in events:
        print(event)
        print(type(event))
        if event["email"] == current_user.email or int(current_user.role)==0:
            ret.append(event)
    return jsonify(ret)  # return get_event_by(None, filter="all",city=current_user.city)



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
    return "-1"
    txt_or_csv = [f for f in os.listdir(os.path.join(app.config['UPLOAD_FOLDER'],path_to_file)) if re.search(r'.*\.(jpeg)$', f)]
    return str(len(txt_or_csv))

