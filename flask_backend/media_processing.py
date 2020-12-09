import os, wget
from flask_backend import app
import shutil

#create media subfolders
def init_media(id,loc):

    path= os.path.join(app.config['UPLOAD_FOLDER'] ,str(id))
    #create id subfolders
    try:
        os.mkdir(path)
    except OSError:
        print("Creation of the directory %s failed" % path)
    else:
        print("Successfully created the directory %s " % path)
    try:
        os.mkdir(path + "/video")
    except OSError:
        print("Creation of the directory %s failed" % path + "/video")
    else:
        print("Successfully created the directory %s " % path + "/video")
    try:
        os.mkdir(path + "/photos")
    except OSError:
        print("Creation of the directory %s failed" % path + "/photos")
    else:
        print("Successfully created the directory %s " % path + "/photos")
    #create photos
    print("getting photos of event "+str(id))
    size="640x640"
    location=str(loc[0])+","+str(loc[1])
    fov="90"
    pitch="0"
    key="AIzaSyDcLG_2KgktdQJXLaeyQZHJzmvcSjNwoPM"
    for i in range(0,4):
        heading = str(i*90)
        url = "https://maps.googleapis.com/maps/api/streetview?size="+size+"&location="+location+"&fov="+fov+"&heading="+heading+"&pitch="+pitch+\
        "&key="+key
        print(url)
        wget.download(url, path + "/photos/"+str(i)+".jpeg")

def convert_avi_to_mp4(avi_file_path):
    print(avi_file_path)
    os.popen("ffmpeg -i '{input}'.avi -ac 2 -b:v 2000k -c:a aac -c:v libx264 -b:a 160k -vprofile high -bf 0 -strict experimental -f mp4 '{input}.mp4' && rm {input}.avi && ffmpeg -ss 00:00:00 -i {input}.mp4 -vframes 1 -q:v 2 {input}T.jpg".format(input = avi_file_path))
    return True

def getThumbnail(mp4_file_path):
    print(mp4_file_path)
    os.popen(
        "ffmpeg -ss 00:00:00 -i {input}.mp4 -vframes 1 -q:v 2 {input}T.jpg".format(input=mp4_file_path))
    return True

def rmMedia(id):
    path = os.path.join(app.config['UPLOAD_FOLDER'], str(id))
    # removing id subfolders
    try:
        shutil.rmtree(path)
    except OSError as e:
        print("Error: %s : %s" % (path, e.strerror))