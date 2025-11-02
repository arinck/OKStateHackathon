from flask import render_template
def register_routes(app):
    """
    This function registers all the routes with the Flask app instance.
    """

    # Route for the homepage (index)
    @app.route('/')
    def index():
        return render_template('index.html')
    
    
    #Will need to build dynamic builder that creates new rooms with their ids appended
    @app.route('/room')
    def room(room_id):
        return render_template('room.html')