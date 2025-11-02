from flask import Flask
from routes import register_routes  # Import the register_routes function from routes.py
from schema import run_shchema
from db_accessor import insert_user, get_roomname, get_user , validate_user , room_exists , insert_room , insert_entry , get_entries_by_room
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

insert_entry("eli" , "payton" ,"image" , "linkedin" , "1" )
insert_entry("John", "Doe", "image_john.jpg", "https://linkedin.com/in/john-doe", "1")
insert_entry("Jane", "Smith", "image_jane.jpg", "https://linkedin.com/in/jane-smith", "2")
insert_entry("Alice", "Brown", "image_alice.jpg", "https://linkedin.com/in/alice-brown", "3")

print(get_entries_by_room(1))
print(str(get_roomname(1)))



if __name__ == '__main__':
    # Run the app in debug mode for easier development
    app.run(debug=True)
