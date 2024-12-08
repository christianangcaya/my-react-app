import re
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
from datetime import datetime, date

app = Flask(__name__)

CORS(app)

db_config = {
    'host': 'localhost',       # XAMPP MySQL server
    'user': 'root',            # Default XAMPP MySQL user
    'password': '',            # Default password is blank
}

# Ensure the database and tables exist
def initialize_database():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("CREATE DATABASE IF NOT EXISTS scholarship_db")
        cursor.execute("USE scholarship_db")  # Switch to the database

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Applicants (
                application_id VARCHAR(10) PRIMARY KEY,
                surname VARCHAR(100),
                first_name VARCHAR(100),
                middle_name VARCHAR(100) DEFAULT NULL,
                suffix_name VARCHAR(50) DEFAULT NULL,
                birthdate DATE,
                email_address VARCHAR(150) UNIQUE,
                status VARCHAR(50) DEFAULT 'applicant'
            )
        """)

        conn.commit()
        cursor.close()
        conn.close()
        print("Database and tables are ready.")
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")

initialize_database()

db_config['database'] = 'scholarship_db'

# Function to generate application_id
def generate_application_id():
    current_year = datetime.now().year
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT application_id FROM Applicants WHERE application_id LIKE %s ORDER BY application_id DESC LIMIT 1
        """, (f"{current_year}%",))
        result = cursor.fetchone()

        if result is None:
            sequential_number = 1
        else:
            last_application_id = result[0]
            sequential_number = int(last_application_id[-4:]) + 1

        application_id = f"{current_year}{sequential_number:04d}"

        cursor.close()
        conn.close()

        return application_id
    except Exception as e:
        print(f"Error generating application_id: {str(e)}")
        return None

def validate_name(name):
    if not re.match("^[A-Za-zÑñ\s]+$", name):
        return False
    return True

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json

        surname = data.get('surname')
        first_name = data.get('firstName')
        middle_name = data.get('middleName') if 'middle_name' in data else None
        suffix_name = data['suffix_name'] if 'suffix_name' in data else None
        birthdate_str = data.get('birthday')  # Birthdate is a string in 'YYYY-MM-DD' format
        email_address = data.get('email')

        # Check if birthdate is provided
        if not birthdate_str:
            return jsonify({"error": "Birthdate is required"}), 400

        # Validate names
        if not validate_name(surname):
            return jsonify({"error": "Surname must contain only alphabets"}), 400
        if not validate_name(first_name):
            return jsonify({"error": "First name must contain only alphabets"}), 400
        if middle_name and not validate_name(middle_name):
            return jsonify({"error": "Middle name must contain only alphabets"}), 400

        # Validate birthdate format and age
        birthdate = None
        try:
            birthdate = datetime.strptime(birthdate_str, '%Y-%m-%d').date()
            today = date.today()
            age = today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))
            
            if age < 18:
                return jsonify({"error": "Applicants must be at least 18 years old"}), 400
        except ValueError:
            return jsonify({"error": "Invalid birthdate format. Expected format: YYYY-MM-DD"}), 400

        application_id = generate_application_id()
        if not application_id:
            return jsonify({"error": "Failed to generate application_id"}), 500

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        query = """
            INSERT INTO Applicants (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address, "applicant"))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully!", "application_id": application_id}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email address already exists!"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/registrations', methods=['GET'])
def get_registrations():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Applicants")
        registrations = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(registrations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
