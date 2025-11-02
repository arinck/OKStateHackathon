import sqlite3

db_name = "database.db"

def get_connection():
    conn = sqlite3.connect(db_name)
    return conn

def insert_user(first_name, last_name, password, email):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT OR IGNORE INTO users (firstname, lastname, password, email)
        VALUES (?, ?, ?, ?);
    """, (first_name, last_name, password, email))
    conn.commit()
    conn.close()

def get_user(user_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT user_id, firstname, lastname, email FROM users WHERE user_id = ?", (user_id,))
    user = cur.fetchone()  # Fetch the first matching user
    conn.close()
    
    if user:
        # Return the user data as a dictionary
        return {
            'user_id': user[0],
            'firstname': user[1],
            'lastname': user[2],
            'email': user[3]
        }
    else:
        # If no user was found, return None
        return None

# Need a validate_user function that will take in an email and password combination and return the valid user ID or -1

def validate_user(email, password):
    # Establish database connection
    conn = get_connection()
    cur = conn.cursor()
    
    # Query to fetch user by email
    cur.execute("SELECT user_id, password FROM users WHERE email = ?", (email,))
    user = cur.fetchone()  # Fetch the user with the matching email
    
    conn.close()
    
    if user:
        stored_user_id = user[0]  # Extract user_id
        stored_password = user[1]  # Extract stored hashed password
        
        # Compare the provided password with the stored hashed password
        if stored_password == password:
            # If the password is correct, return the user_id
            return stored_user_id
        else:
            # Password doesn't match, return -1
            return -1
    else:
        # No user with the given email exists, return -1
        return -1
    
def insert_room(room_name, owner_id, room_password):
    # Establish database connection
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT OR IGNORE INTO rooms (room_name, owner_id , room_password)
        VALUES (?, ?, ?);
    """, (room_name, owner_id , room_password))

    conn.commit()
    conn.close()



# Need an accessor for rooms that returns true if the room_id exists, false if not
def room_exists(room_id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT room_id FROM rooms WHERE room_id = ?", (room_id,))
    room = cur.fetchone()
    conn.close()
    if room:
        return True
    else:
        return False
    
def insert_entry(firstname, lastname, url_image, url_linkedin, room_id):
    conn = get_connection()
    cur = conn.cursor()
    
    # Insert the new entry into the 'entries' table
    cur.execute('''
    INSERT INTO entries (firstname, lastname, url_image, url_linkedin, room_id)
    VALUES (?, ?, ?, ?, ?);
    ''', (firstname, lastname, url_image, url_linkedin, room_id))
    
    # Commit the transaction
    conn.commit()
    
    # Close the connection
    conn.close()


def get_entries_by_room(room_id):
    conn = get_connection()
    cur = conn.cursor()
    
    # Query to get firstname, lastname, url_image, url_linkedin for entries with a specific room_id
    cur.execute('''
    SELECT firstname, lastname, url_image, url_linkedin
    FROM entries
    WHERE room_id = ?;
    ''', (room_id,))
    
    # Fetch all rows (results)
    entries = cur.fetchall()
    
    conn.close()
    
    # Convert to a 2D array
    result = [[entry[0], entry[1], entry[2], entry[3]] for entry in entries]
    
    return result
