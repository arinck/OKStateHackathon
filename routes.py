from flask import render_template, Flask, redirect, request, session, url_for
from requests_oauthlib import OAuth2Session
import os
import requests
from util import  client_id, client_secret, redirect_uri, scope, authorization_base_url, token_url

#Variables to paste into 'secretVars.py'
# secretKey = 'your-secret-key' 
# client_id = '8653jhwbrdmfzw'
# client_secret = 'WPL_AP1.eOHOob6wXHNOn5oc.P6Wnpg=='

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
    
    @app.route('/login_linked')
    def login():
        linkedin = OAuth2Session(client_id, redirect_uri=redirect_uri, scope=scope)
        authorization_url, state = linkedin.authorization_url(authorization_base_url)
        session['oauth_state'] = state
        return redirect(authorization_url)

    @app.route('/login_reach')
    def login_reach():
        return render_template('login_page_reach.html')

    @app.route('/signup_reach')
    def signup_reach():
        return render_template('signup_page_reach.html')

    @app.route('/callback')
    def callback():
        # Extract the authorization code from the query string
        code = request.args.get('code')
        print(code)
        
        # Exchange the code for an access token manually
        token_response = requests.post(
            token_url,
            data={
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri, 
                'client_id': client_id,
                'client_secret': client_secret
            }
        )

        token_json = token_response.json()
        session['oauth_token'] = token_json

        linkedin = OAuth2Session(client_id, token=token_json)
        r = linkedin.get('https://api.linkedin.com/v2/userinfo')
        user_info = r.json()

        print(user_info.get('email'))
        return render_template('room.html')
    
    