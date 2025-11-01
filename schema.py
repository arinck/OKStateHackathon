import sqlite3

# Connect to SQLite (creates a new file if it doesn't exist)
conn = sqlite3.connect('my_database.db')
cursor = conn.cursor()

# Enable foreign key support in SQLite
cursor.execute("PRAGMA foreign_keys = ON;")

# Create tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    password TEXT,
    email TEXT UNIQUE
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS rooms (
    room_id INTEGER PRIMARY KEY,
    room_name TEXT,
    owner_id INTEGER NOT NULL,
    room_password TEXT UNIQUE,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS entries (
    entry_id INTEGER PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    url TEXT,
    room_id INTEGER,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);
''')
conn.commit()
conn.close()