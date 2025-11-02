from flask import render_template
def register_routes(app):
    """
    This function registers all the routes with the Flask app instance.
    """

    # Route for the homepage (index)
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/landing')
    def landing():
        return render_template('landing.html')
    
    #Will need to build dynamic builder that creates new rooms with their ids appended
    @app.route('/room')
    def room(room_id):
        return render_template('room.html')

    @app.route('/login_page')
    def login_page():
        return render_template('login_page_reach.html')
    
    @app.route('/signup_page')
    def signup_page():
        return render_template('signup_page_reach.html')