from flask import Flask
from routes import register_routes  # Import the register_routes function from routes.py
from schema import run_shchema
from db_accessor import insert_user , get_user , validate_user , room_exists , insert_room
app = Flask(__name__)
#required for linkedin APi
app.secret_key = 'your-secret-key'

# Register the routes with the Flask app
register_routes(app)
run_shchema()
insert_user("eli" , "payton" , "daddychill" , "hillarysspamfolder@gmail.com" )
print (get_user("1"))
print(validate_user("hillarysspamfolder@gmail.com" , "daddychill"))

insert_room("myroom","1","daddychill")
print(room_exists("1"))


if __name__ == '__main__':
    # Run the app in debug mode for easier development
    app.run(debug=True)
