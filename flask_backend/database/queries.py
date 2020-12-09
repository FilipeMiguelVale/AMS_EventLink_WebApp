
from flask_backend.database.db_schemas import *
from flask_backend.database.db_models import *
from flask import jsonify
from flask_backend.data_processing import isClose, same_timestamp
from flask_backend import db, login_manager
import datetime


def change_event_status(id,status):
    event = get_event_by(id, filter="id_only_event")
    event.status = status
    db.session.commit()
    return event_schema.jsonify(event)

def change_event_injured(id,injured):
    event = get_event_by(id, filter="id_only_event")
    event.n_people_injured = injured
    db.session.commit()
    return event_schema.jsonify(event)

def add_video_to_database(id):

    event = get_event_by(id,filter="video_id")
       
    event.video_total += 1

    db.session.commit()

    return event_schema.jsonify(event)

def add_event_to_database(event,car):

    db.session.add(event)
    db.session.commit()
    car.event_id = event.id
    db.session.add(car)
    db.session.commit()

def delete_event_from_database(id):

    event = event.query.get(id)
    print(event_schema.dump(event))
    for car in event.cars:
        db.session.delete(car)
    db.session.delete(event)
    db.session.commit()



def register_user_to_database(username,email,password):
    user = User.query.filter_by(email=email).first()
    user.Username = username
    user.password = password
    db.session.commit()
    return user_schema.jsonify(user)

def get_all_users():
    users = User.query.all()
    result = users_schema.dump(users)
    return jsonify(result)


def get_user_by(**options):
    if options.get("email"):
        return User.query.filter_by(email=options.get("email")).first()
    if options.get("username"):
        return User.query.filter_by(email=options.get("username")).first()
    if options.get("password"):
        return User.query.filter_by(email=options.get("password")).first()
    if options.get("first_name"):
        return User.query.filter_by(email=options.get("first_name")).first()
    if options.get("last_name"):
        return User.query.filter_by(email=options.get("last_name")).first()
    if options.get("birth_date"):
        return User.query.filter_by(email=options.get("birth_date")).first()
    if options.get("address"):
        return User.query.filter_by(email=options.get("address")).first()
    if options.get("city"):
        return User.query.filter_by(email=options.get("city")).first()
    if options.get("country"):
        return User.query.filter_by(email=options.get("country")).first()
    if options.get("postal_code"):
        return User.query.filter_by(email=options.get("postal_code")).first()
    if options.get("telephone"):
        return User.query.filter_by(email=options.get("telephone")).first()
    if options.get("work_institution"):
        return User.query.filter_by(email=options.get("work_institution")).first()
    if options.get("profession"):
        return User.query.filter_by(email=options.get("profession")).first()
    if options.get("about"):
        return User.query.filter_by(email=options.get("about")).first()

    #db.session.commit()
    #return user_schema.jsonify(user)


def delete_user_from_database(mail):

    user = get_user_by(email=mail)
    db.session.delete(user)
    db.session.commit()

def add_user_to_database(user):

    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user)

def can_login(email,password):
    return User.query.filter_by(email=email, password=password).first()

def get_num_events(quantity,city=None):
    current_time = datetime.datetime.now()
    if city is None:
        event = event.query.all()
    else:
        event = event.query.filter_by(city=city)
    result = events_schema.dump(event)
    if quantity == "Today":
        result = [event for event in result if
                  datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                      .date() == current_time.date()]
    elif quantity == "Yesterday":
        result = [event for event in result if
                  datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                      .date() == (current_time - datetime.timedelta(1)).date()]
    elif quantity == "Last Month":
        result = [event for event in result if
                  datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                      .date() >= (current_time - datetime.timedelta(30)).date()]

    return len(result)

def get_event_by(value, filter="all",quantity="All",order="Ascending",city=None):

    if filter == "belongs":
        location = (float(value["lat"]),float(value["lng"]))
        events = event.query.all()
        result = events_schema.dump(events)
        for event in list(events):
            lat = float(event.location["lat"])
            lng = float(event.location["lng"])
            timestamp = event.date
            loc = isClose(location,(lat,lng))
            tim = same_timestamp(timestamp)
            if loc and tim:
                return event
        return None

    if filter == "video_id":
        event = event.query.filter_by(video_id=value).first()
        if not event:
            return None
        return event

    if filter == "all":
        if city==None:
            all_events = event.query.all()
        else:
            all_events = event.query.filter_by(city=city)
        result = events_schema.dump(all_events)
        return jsonify(result)
        
    if filter == "id":
        event = event.query.get(value)
        return event_schema.jsonify(event)

    if filter == "id_only_event":
        event = event.query.get(value)
        return event

    current_time = datetime.datetime.now()
    if filter == "between":
        if city is None:
            event = event.query.all()
        else:
            event = event.query.filter_by(city=city)
        result = events_schema.dump(event)

        if quantity == "Today":
            result=[event for event in result if datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                .date() == current_time.date()]
        elif quantity == "Yesterday":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == (current_time - datetime.timedelta(1)).date()]
        elif quantity == "Last Month":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() >= (current_time - datetime.timedelta(30)).date()]
        v = result[-value[1]:len(result)-value[0]]
        if order != "Ascending":
            return jsonify(v[::-1])
        else:
            return jsonify(v)

    if filter == "cars":

        if city == None:
            event = event.query.all()
        else:
            event = event.query.filter_by(city=city)
        result = events_schema.dump(event)
        result.sort(key=lambda x: x.get('n_cars_involved'),reverse=(order!="Ascending"))
        if quantity == "Today":
            result=[event for event in result if datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                .date() == current_time.date()]
        elif quantity == "Yesterday":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == (current_time - datetime.timedelta(1)).date()]
        elif quantity == "Last Month":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() >= (current_time - datetime.timedelta(30)).date()]
        v = result[-value[1]:len(result)-value[0]]
        return jsonify(v[::-1])


    if filter == "people":
        if city == None:
            event = event.query.all()
        else:
            event = event.query.filter_by(city=city)
        result = events_schema.dump(event)
        result.sort(key=lambda x: x.get('n_people'),reverse=(order=="Ascending"))
        if quantity == "Today":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == current_time.date()]
        elif quantity == "Yesterday":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == (current_time - datetime.timedelta(1)).date()]
        elif quantity == "Last Month":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() >= (current_time - datetime.timedelta(30)).date()]
        v = result[-value[1]:len(result) - value[0]]
        return jsonify(v[::-1])

    if filter == "injured":
        if city == None:
            event = event.query.all()
        else:
            event = event.query.filter_by(city=city)
        result = events_schema.dump(event)
        result.sort(key=lambda x: x.get('n_people_injured'),reverse=(order=="Ascending"))
        if quantity == "Today":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == current_time.date()]
        elif quantity == "Yesterday":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == (current_time - datetime.timedelta(1)).date()]
        elif quantity == "Last Month":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() >= (current_time - datetime.timedelta(30)).date()]
        v = result[-value[1]:len(result) - value[0]]
        return jsonify(v[::-1])

    if filter == "severity":
        if city == None:
            event = event.query.all()
        else:
            event = event.query.filter_by(city=city)
        result = events_schema.dump(event)
        result.sort(key=lambda x: x.get('damage'),reverse=(order=="Ascending"))
        if quantity == "Today":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == current_time.date()]
        elif quantity == "Yesterday":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == (current_time - datetime.timedelta(1)).date()]
        elif quantity == "Last Month":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() >= (current_time - datetime.timedelta(30)).date()]
        v = result[-value[1]:len(result) - value[0]]
        return jsonify(v[::-1])

    if filter == "status":
        if city == None:
            event = event.query.all()
        else:
            event = event.query.filter_by(city=city)
        result = events_schema.dump(event)
        result.sort(key=lambda x: x.get('status'),reverse=(order=="Ascending"))
        if quantity == "Today":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == current_time.date()]
        elif quantity == "Yesterday":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() == (current_time - datetime.timedelta(1)).date()]
        elif quantity == "Last Month":
            result = [event for event in result if
                      datetime.datetime.strptime(event['date'].replace('T', " "), '%Y-%m-%d %H:%M:%S.%f')
                          .date() >= (current_time - datetime.timedelta(30)).date()]
        v = result[-value[1]:len(result) - value[0]]
        return jsonify(v[::-1])
#Login queries

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

