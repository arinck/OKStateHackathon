from flask import render_template, redirect, request, session, url_for, jsonify, abort
from requests_oauthlib import OAuth2Session
import requests
from util import client_id, client_secret, redirect_uri, scope, authorization_base_url, token_url
from db_accessor import (
    get_roomname,
    get_connection,
    get_entries_by_room,
    insert_user,
    validate_user,
    insert_room,
    room_exists,
)

def register_routes(app):

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/room')
    def room():
        room_id = (request.args.get('room_id') or '').strip()
        viewer = (request.args.get('viewer') or '').strip()

        # no validation filter here anymore
        room_name = get_roomname(room_id)
        if not room_name:
            return render_template('room_not_found.html', room_id=room_id), 404

        users = get_entries_by_room(room_id) or []
        return render_template(
            'room.html',
            room_id=room_id,
            viewer=viewer,
            users=users,
            room_name=room_name
        )

    @app.route('/login_linked')
    def login():
        room_id = request.args.get('roomId')
        if not room_exists(room_id):
            abort(404, description="Room not found")

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
        print("Hello", user_info.get('email'))
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

    @app.get('/api/user_id')
    def api_user_id():
        uid = session.get('user_id')
        if not uid:
            return jsonify({"ok": False, "error": "Not authenticated"}), 401
        return jsonify({"ok": True, "user_id": uid}), 200

    @app.post('/api/room_exists')
    def api_room_exists():
        data = request.get_json(silent=True) or {}
        roomID = (data.get("roomID") or "").strip()
        exists = bool(room_exists(roomID))
        return jsonify({"exists": exists}), 200

    @app.post('/api/room_create')
    def api_room_create():
        data = request.get_json(silent=True) or {}
        room_name = (data.get("roomName") or "").strip()
        owner_id  = data.get("ownerID")
        room_id   = (data.get("roomID") or "").strip()

        if not room_name or not owner_id or not room_id:
            return jsonify({"ok": False, "error": "roomName, ownerID, roomID required"}), 400
        if session.get("user_id") != owner_id:
            return jsonify({"ok": False, "error": "owner mismatch"}), 403
        if room_exists(room_id):
            return jsonify({"ok": False, "error": "room already exists"}), 409

        insert_room(room_name, owner_id, room_id)
        return jsonify({"ok": True, "room_id": room_id}), 201
