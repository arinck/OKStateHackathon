from flask import render_template, redirect, request, session, url_for, jsonify
from requests_oauthlib import OAuth2Session
import requests
from util import client_id, client_secret, redirect_uri, scope, authorization_base_url, token_url
from db_accessor import get_roomname , get_connection,get_entries_by_room, insert_user, validate_user, insert_room, room_exists # your existing accessors

def register_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    #Will need to build dynamic builder that creates new rooms with their ids appended
    @app.route('/room')
    def room():
        room_id = request.args.get('room_id')
        viewer = request.args.get('viewer')
        users = get_entries_by_room(room_id)
        room_name = get_roomname(room_id)
        return render_template('room.html', room_id=room_id, viewer=viewer, users = users, room_name = room_name)


    @app.route('/login_linked')
    def login():
        room_id = request.args.get('roomId')  # e.g., /login_linked?roomId=123
        if room_id:
            session['room_id'] = room_id
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
        code = request.args.get('code')
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

        room_id = session.get('room_id')  # Retrieve roomId here
        print("Room ID:", room_id)
        print(user_info.get('email'))
        return redirect(url_for('room', room_id=room_id, viewer='scanner'))

    @app.post('/api/signup')
    def api_signup():
        data = request.get_json(silent=True) or request.form or {}
        fname = (data.get('fname') or '').strip()
        lname = (data.get('lname') or '').strip()
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''

        if not (fname and lname and email and len(password) >= 6):
            return jsonify({"ok": False, "error": "Invalid payload"}), 400

        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM users WHERE email = ?", (email,))
        exists = cur.fetchone()
        conn.close()
        if exists:
            return jsonify({"ok": False, "error": "Email already exists"}), 409

        insert_user(fname, lname, password, email)

        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT user_id FROM users WHERE email = ?", (email,))
        row = cur.fetchone()
        conn.close()

        if not row:
            return jsonify({"ok": False, "error": "Insert failed"}), 500

        return jsonify({"ok": True, "user_id": row[0]}), 201

    @app.post('/api/login')
    def api_login():
        data = request.get_json(silent=True) or request.form or {}
        email = (data.get('email') or '').strip().lower()
        password = data.get('password') or ''
        if not (email and password):
            return jsonify({"ok": False, "error": "Invalid payload"}), 400

        user_id = validate_user(email, password)
        if user_id == -1:
            return jsonify({"ok": False, "error": "Invalid credentials"}), 401

        session['user_id'] = user_id
        return jsonify({"ok": True, "user_id": user_id}), 200

    @app.route('/api/rooms/<int:room_id>/exists', methods=['GET'])
    def api_room_exists(room_id):
        exists = room_exists(room_id)  # call your db_accessor function
        return jsonify({'exists': exists}), 200

    @app.route('/api/room_create', methods=['POST'])
    def api_room_create():
        data = request.get_json(force=True)
        room_name = data.get("roomName")
        owner_id = data.get("ownerID")
        room_id = data.get("roomID")

        try:
            insert_room(room_name, owner_id, room_id)  # call your Python DB function
            return jsonify({"ok": True, "message": "Room created successfully"}), 201
        except Exception as e:
            print("Error inserting room:", e)
            return jsonify({"ok": False, "error": str(e)}), 500

