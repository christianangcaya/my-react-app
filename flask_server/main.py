import re
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from datetime import datetime

app = Flask(__name__)

CORS(app)

# MySQL Configuration
db_config = {
    'host': 'localhost',       # XAMPP MySQL server
    'user': 'root',            # Default XAMPP MySQL user
    'password': '',            # Default password is blank
}

@app.route('/')
def home():
    return render_template('index.html')

# Ensure the database and tables exist
def initialize_database():
    try:
        # Connect to MySQL server (not to a specific database yet)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Create the database if it doesn't exist
        cursor.execute("CREATE DATABASE IF NOT EXISTS scholarship_db")
        cursor.execute("USE scholarship_db")  # Switch to the database

        # Create the `registration` table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registration (
                application_id VARCHAR(10) PRIMARY KEY,
                surname VARCHAR(100),
                first_name VARCHAR(100),
                middle_name VARCHAR(100),
                suffix_name VARCHAR(50),
                birthdate DATE,
                email_address VARCHAR(150) UNIQUE
            )
        """)

        # Commit and close connection
        conn.commit()
        cursor.close()
        conn.close()
        print("Database and tables are ready.")
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")

# Call the function to initialize the database
initialize_database()

# Update `db_config` to include the specific database
db_config['database'] = 'scholarship_db'

# Function to generate application_id
def generate_application_id():
    current_year = datetime.now().year
    try:
        # Connect to MySQL
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Get the most recent registration from the current year
        cursor.execute("""
            SELECT application_id FROM registration WHERE application_id LIKE %s ORDER BY application_id DESC LIMIT 1
        """, (f"{current_year}%",))
        result = cursor.fetchone()

        # If no records found, start from 1
        if result is None:
            sequential_number = 1
        else:
            last_application_id = result[0]
            sequential_number = int(last_application_id[-4:]) + 1

        # Format the application_id as YYYYNNNN
        application_id = f"{current_year}{sequential_number:04d}"

        # Close the connection
        cursor.close()
        conn.close()

        return application_id
    except Exception as e:
        print(f"Error generating application_id: {str(e)}")
        return None

# Helper function to validate names (only alphabets and spaces allowed)
def validate_name(name):
    if not re.match("^[A-Za-z\s]+$", name):
        return False
    return True

@app.route('/register', methods=['POST'])
def register_user():
    try:
        # Get data from the request
        data = request.json
        print(f"Received data: {data}")
        surname = data.get('surname')
        first_name = data.get('firstName')
        middle_name = data.get('middleName')
        suffix_name = data['suffix_name'] if 'suffix_name' in data else None
        birthdate_str = data.get('birthday')  # Birthdate is a string in 'YYYY-MM-DD' format
        email_address = data.get('email')

        # Validate the name fields
        if not validate_name(surname):
            return jsonify({"error": "Surname must contain only alphabets and spaces"}), 400
        if not validate_name(first_name):
            return jsonify({"error": "First name must contain only alphabets and spaces"}), 400
        if not validate_name(middle_name):
            return jsonify({"error": "Middle name must contain only alphabets and spaces"}), 400

        # Convert the birthdate string to a datetime.date object
        birthdate = None
        if birthdate_str:
            try:
                birthdate = datetime.strptime(birthdate_str, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid birthdate format. Expected format: YYYY-MM-DD"}), 400

        # Generate a unique application_id
        application_id = generate_application_id()
        if not application_id:
            return jsonify({"error": "Failed to generate application_id"}), 500

        # Connect to MySQL
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insert data into the registration table
        query = """
            INSERT INTO registration (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address))
        conn.commit()

        # Close the connection
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully!", "application_id": application_id}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email address already exists!"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to retrieve all registrations
@app.route('/registrations', methods=['GET'])
def get_registrations():
    try:
        # Connect to MySQL
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        # Fetch all registrations
        cursor.execute("SELECT * FROM registration")
        registrations = cursor.fetchall()

        # Close the connection
        cursor.close()
        conn.close()

        return jsonify(registrations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
