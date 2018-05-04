import os
import json
from flask import Flask, render_template, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

print ("Generating Amazingness. Please Hold.")

moduleSections = []
modulesRoot ='static'
modulesLocation = os.listdir(modulesRoot)

if os.path.isfile('config.json'):
    data = json.load(open('config.json'))
    for moduleSection in data["groups"]:
        moduleSections.append(moduleSection)

for module in modulesLocation:
    if os.path.isfile(modulesRoot + '/' + module +'/config.json'):
        data = json.load(open(modulesRoot + "/" + module +'/config.json'))
        data["icon_src"] = modulesRoot + "/" + module + "/" + data["icon_src"]
        data["page_src"] = modulesRoot + "/" + module + "/" + data["page_src"]
        moduleSections[data["section"]]["modules"].append(data)


for moduleSection in moduleSections:
    moduleSection["modules"] = sorted(moduleSection["modules"],key=lambda l:l["order"], reverse=False)

moduleSections = sorted(moduleSections,key=lambda l:l["order"], reverse=False)

@socketio.on('my event')
def handle_my_custom_event(json):
    #print('received json: ' + str(json))
    emit('update IMG', json, broadcast=True)

@app.errorhandler(500)
def page_not_found(e):
    return render_template('500.html'), 500

@app.route("/", methods=['GET', 'POST'])
def main():
    return render_template('index.html', moduleSections = moduleSections)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    #socketio.run(app, host='0.0.0.0', port=os.environ.get("PORT", 5000))
    socketio.run(app, host='0.0.0.0');
    #app.run(host='0.0.0.0', port=8080)
