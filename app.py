from flask import Flask
from routes import register_routes  # Import the register_routes function from routes.py

app = Flask(__name__)
#required for linkedin APi
app.secret_key = 'your-secret-key'

# Register the routes with the Flask app
register_routes(app)

if __name__ == '__main__':
    # Run the app in debug mode for easier development
    app.run(debug=True)
