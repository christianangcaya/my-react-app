import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re 
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime, date
import os
from werkzeug.utils import secure_filename
import json

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

db_config = {
    'host': 'localhost',       # XAMPP MySQL server
    'user': 'root',            # Default XAMPP MySQL user
    'password': '',            # Default password is blank
}

def initialize_database():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute("CREATE DATABASE IF NOT EXISTS scholarship_db")
        cursor.execute("USE scholarship_db")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS applicants (
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

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS af_basic_info (
                applicant_id VARCHAR(10) PRIMARY KEY,
                last_name VARCHAR(100) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                middle_name VARCHAR(100),
                suffix VARCHAR(50),
                age INT NOT NULL,
                religion VARCHAR(100) NOT NULL,
                sex ENUM('Male', 'Female', 'Other') NOT NULL,
                civil_status ENUM('Single', 'Married', 'Divorced', 'Widowed') NOT NULL,
                birthdate DATE NOT NULL,
                place_of_birth VARCHAR(150) NOT NULL,
                street VARCHAR(100),
                purok VARCHAR(100),
                barangay VARCHAR(100),
                municipality VARCHAR(100) NOT NULL,
                contact_number VARCHAR(15) NOT NULL,
                email_address VARCHAR(150) UNIQUE NOT NULL
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS af_educ_info (
                educ_info_id INT AUTO_INCREMENT PRIMARY KEY,
                applicant_id VARCHAR(10),
                grant_type ENUM ('Degree Course', 'Non-Degree Course'),
                educ_attainment VARCHAR(150) NOT NULL,
                highest_grade_year VARCHAR(50) NOT NULL,
                gwa DECIMAL(5, 2) NOT NULL,
                school_name VARCHAR(150) NOT NULL,
                school_type ENUM('Public', 'Private') NOT NULL,
                FOREIGN KEY (applicant_id) REFERENCES af_basic_info(applicant_id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS af_educ_info_awards (
                awards_id INT AUTO_INCREMENT PRIMARY KEY,
                educ_info_id INT,
                awards_description VARCHAR(255),
                award_from VARCHAR(150),
                award_date DATE,
                FOREIGN KEY (educ_info_id) REFERENCES af_educ_info(educ_info_id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS af_family_info (
                family_info_id INT AUTO_INCREMENT PRIMARY KEY,
                applicant_id VARCHAR(10),
                father_status ENUM('Living', 'Deceased') NOT NULL,
                father_name VARCHAR(150),
                father_address VARCHAR(255),
                father_occupation VARCHAR(150),
                mother_status ENUM('Living', 'Deceased') NOT NULL,
                mother_name VARCHAR(150),
                mother_address VARCHAR(255),
                mother_occupation VARCHAR(150),
                gross_income DECIMAL(15, 2),
                number_of_siblings INT NOT NULL,
                number_of_brothers INT NOT NULL,
                number_of_sisters INT NOT NULL,
                partner_name VARCHAR(150),
                number_of_children INT,
                partner_occupation VARCHAR(150),
                partner_course ENUM ('Degree Course', 'Non-Degree Course'),
                FOREIGN KEY (applicant_id) REFERENCES af_basic_info(applicant_id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS af_file_initial (
                file_initial_id INT AUTO_INCREMENT PRIMARY KEY,
                applicant_id VARCHAR(10),
                photo_path VARCHAR(255),
                income_tax_return_path VARCHAR(255),
                e_signature_path VARCHAR(255),
                FOREIGN KEY (applicant_id) REFERENCES af_basic_info(applicant_id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS final_requirements (
                final_requirements_id INT AUTO_INCREMENT PRIMARY KEY,
                application_id VARCHAR(10),
                last_name VARCHAR(100),
                final_req_folder_path VARCHAR(255),
                FOREIGN KEY (application_id) REFERENCES applicants(application_id)
            )
        """)

        conn.commit()
        cursor.close()
        conn.close()
        print("Database and tables are ready.")
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")

def create_directory_structure():
    base_path = "C:/LGU Daet Scholarship"
    year_folder = str(datetime.now().year)
    year_path = os.path.join(base_path, year_folder)
    
    # Subfolders based on alphabetical ranges
    subfolders = ["A-C", "D-F", "G-I", "J-L", "M-O", "P-R", "S-U", "V-X", "Y-Z"]

    try:
        # Create the base folder if it doesn't exist
        if not os.path.exists(base_path):
            os.makedirs(base_path)

        # Create the year folder if it doesn't exist
        if not os.path.exists(year_path):
            os.makedirs(year_path)

        # Create each subfolder inside the year folder
        for folder in subfolders:
            folder_path = os.path.join(year_path, folder)
            os.makedirs(folder_path, exist_ok=True)

    except Exception as e:
        print(f"Error creating folder structure: {e}")


initialize_database()
create_directory_structure()


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

# Function to send email
def send_email(receiver_email, application_id, first_name, surname):
    sender_email = "lgudaetscholarship8@gmail.com"  # Replace with your email
    app_password = "jbmobjxodiyckvch"  # Replace with your app-specific password

    subject = "Your Scholarship Application ID"
    body = f"""
        Dear {first_name} {surname},

        Thank you for applying for the scholarship program. Your application has been successfully received.

        Your Application ID is: {application_id}

        Please keep this ID safe, as it will be required for future communications.

        Best regards,
        LGU Daet Scholarship Team
        """

    try:
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = receiver_email
        message['Subject'] = subject

        message.attach(MIMEText(body, 'plain'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, receiver_email, message.as_string())

        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json

        surname = data.get('surname')
        first_name = data.get('firstName')
        middle_name = data.get('middleName') or None
        suffix_name = data.get('suffix') or None
        birthdate_str = data.get('birthday')  # Birthdate is a string in 'YYYY-MM-DD' format
        email_address = data.get('email')

        if not birthdate_str:
            return jsonify({"error": "Birthdate is required"}), 400

        if not validate_name(surname):
            return jsonify({"error": "Surname must contain only alphabets"}), 400
        if not validate_name(first_name):
            return jsonify({"error": "First name must contain only alphabets"}), 400
        if middle_name and not validate_name(middle_name):
            return jsonify({"error": "Middle name must contain only alphabets"}), 400

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
            INSERT INTO applicants (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address, "applicant"))
        conn.commit()

        cursor.close()
        conn.close()

        send_email(email_address, application_id, first_name, surname)

        return jsonify({
            "message": "User registered successfully!",
            "application_id": application_id,
            "surname": surname,
            "first_name": first_name,
            "middle_name": middle_name,
            "suffix_name": suffix_name,
            "birthdate": birthdate_str,
            "email_address": email_address
        }), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email address already exists!"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)  # Use dictionary cursor for easy JSON conversion
        # Fetch all applicant data
        cursor.execute("SELECT * FROM applicants")
        applicant_data = cursor.fetchall()
        cursor.close()
        conn.close()
        # Return the data as JSON
        print(applicant_data)
        return jsonify(applicant_data), 200
    except Exception as e:
        # Log the exception and return a server error
        print(f"Error fetching data: {e}")
        return jsonify({"error": "Failed to fetch data"}), 500
    


# SEAN PUTANGINAMO, OKAY NA. ITO ALTERNATIVE PATH LANG TO
# KASI DI KA PALA GUMAWA NG PATH PERO CINACALL MO NA AGAD
# NAG SASAVE NA PICS SA FOLDER PATI DATA SA DB
def save_file_to_folder(file, last_name, id, file_type):
    # Logic to save the file and return the file path
    filename = f"{file_type}.png"  # Example, customize as needed
    first_letter = last_name[0].upper() if last_name else "Other"

    if 'A' <= first_letter <= 'C':
        folder_range = "A-C"
    elif 'D' <= first_letter <= 'F':
        folder_range = "D-F"
    elif 'G' <= first_letter <= 'I':
        folder_range = "G-I"
    elif 'J' <= first_letter <= 'L':
        folder_range = "J-L"
    elif 'M' <= first_letter <= 'O':
        folder_range = "M-O"
    elif 'P' <= first_letter <= 'R':
        folder_range = "P-R"
    elif 'S' <= first_letter <= 'U':
        folder_range = "S-U"
    elif 'V' <= first_letter <= 'Z':
        folder_range = "V-Z"
    else:
        folder_range = "Other"

    current_year = str(datetime.now().year)

    file_path = os.path.join(
        f"C:/LGU Daet Scholarship/{current_year}/{folder_range}/{last_name + id}/Initial Requirements/"
    )

    os.makedirs(file_path, exist_ok=True)
    
    file_path = os.path.join(file_path, filename)
    file.save(file_path)
    return file_path

@app.route('/submit_initial_requirements', methods=['POST'])
def submit_initial_requirements():
    try:
        # print("Awards Data:")
        # for key, value in request.form.items():
        #     print(f"{key}: {value}")
        
        #Basic Info
        applicant_id = request.form.get("applicant_id")
        last_name = request.form.get("lastName", "")
        first_name = request.form.get("firstName", "")
        middle_name = request.form.get("middleName", "") or None
        suffix = request.form.get("suffix", "") or None
        age = request.form.get("age")
        religion = request.form.get("religion")
        sex = request.form.get("sex")
        civil_status = request.form.get("civilStatus")
        birthdate = request.form.get("birthdate")
        place_of_birth = request.form.get("place_of_birth")
        barangay = request.form.get("barangay", "")
        purok = request.form.get("purok", "")
        street = request.form.get("street", "") or None
        municipality = request.form.get("municipality", "")
        contact_number = request.form.get("contact_number")
        email_address = request.form.get("email_address")

        #Educ Info
        grant_type = request.form.get("grant_type")
        educ_attainment = request.form.get("educ_attainment")
        highest_grade_year = request.form.get("highest_grade_year")
        gwa = request.form.get("gwa")
        school_name = request.form.get("school_name")
        school_type = request.form.get("school_type")
        # Get awards data from request
        awards_json = request.form.get("awards", "[]")  # Default to an empty JSON array
        awards = json.loads(awards_json)  # Parse JSON string into Python list

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        #Family Info
        father_status = request.form.get("father_status")
        father_name = request.form.get("father_name")
        father_address = request.form.get("father_address")
        father_occupation = request.form.get("father_occupation")
        mother_status = request.form.get("mother_status")
        mother_name = request.form.get("mother_name")
        mother_address = request.form.get("mother_address")
        mother_occupation = request.form.get("mother_occupation")
        gross_income = request.form.get("gross_income")
        number_of_siblings = request.form.get("number_of_siblings")
        number_of_brothers = request.form.get("number_of_brothers")
        number_of_sisters = request.form.get("number_of_sisters")
        partner_name = request.form.get("partner_name") or None
        number_of_children = request.form.get("number_of_children") or None
        partner_occupation = request.form.get("partner_occupation") or None
        partner_course = request.form.get("partner_course") or None

        #File Initial
        profile_image = request.files.get('profile_image')
        itr = request.files.get('itr')
        e_signature = request.files.get('eSignature')

        photo_path = None
        itr_path = None
        e_signature_path = None

        # Save each file and get the file paths
        if profile_image:
            photo_path = save_file_to_folder(profile_image, last_name, applicant_id, "ProfileImage")
            print(f"Profile Image Path: {photo_path}")
        if itr:
            itr_path = save_file_to_folder(itr, last_name, applicant_id, "ITR")
            print(f"ITR Path: {itr_path}")
        if e_signature:
            e_signature_path = save_file_to_folder(e_signature, last_name, applicant_id, "ESignature")
            print(f"eSignature Path: {e_signature_path}")


        #Basic Info Query
        basic_info_query = """
            INSERT INTO af_basic_info (
                applicant_id,
                last_name,
                first_name,
                middle_name,
                suffix,
                age,
                religion,
                sex,
                civil_status,
                birthdate,
                place_of_birth,
                barangay,
                purok,
                street,
                municipality,
                contact_number,
                email_address
            ) VALUES (
                %(applicant_id)s,
                %(last_name)s,
                %(first_name)s,
                %(middle_name)s,
                %(suffix)s,
                %(age)s,
                %(religion)s,
                %(sex)s,
                %(civil_status)s,
                %(birthdate)s,
                %(place_of_birth)s,
                %(barangay)s,
                %(purok)s,
                %(street)s,
                %(municipality)s,
                %(contact_number)s,
                %(email_address)s
            )
        """

        basic_info_params = {
            "applicant_id": applicant_id,
            "last_name": last_name,
            "first_name": first_name,
            "middle_name": middle_name,
            "suffix": suffix,
            "age": age,
            "religion": religion,
            "sex": sex,
            "civil_status": civil_status,
            "birthdate": birthdate,
            "place_of_birth": place_of_birth,
            "barangay": barangay,
            "purok": purok,
            "street": street,
            "municipality": municipality,
            "contact_number": contact_number,
            "email_address": email_address
        }

        cursor.execute(basic_info_query, basic_info_params)

        #Educ Info Query
        educ_info_query = """
        INSERT INTO af_educ_info (
            applicant_id,
            grant_type,
            educ_attainment,
            highest_grade_year,
            gwa,
            school_name,
            school_type
            ) VALUES (
            %(applicant_id)s,
            %(grant_type)s,
            %(educ_attainment)s,
            %(highest_grade_year)s,
            %(gwa)s,
            %(school_name)s,
            %(school_type)s
            )
        """
        educ_info_params = {
            "applicant_id": applicant_id,
            "grant_type": grant_type,
            "educ_attainment": educ_attainment,
            "highest_grade_year": highest_grade_year,
            "gwa": gwa,
            "school_name": school_name,
            "school_type": school_type
        }
        cursor.execute(educ_info_query, educ_info_params)
        # Get the generated educ_info_id
        educ_info_id = cursor.lastrowid
            
        # Insert awards into af_educ_info_awards
        award_query = """
        INSERT INTO af_educ_info_awards (
        educ_info_id,
        awards_description,
        award_from,
        award_date
        ) VALUES (
        %(educ_info_id)s,
        %(awards_description)s,
        %(award_from)s,
        %(award_date)s
        )
        """
        # Check if awards list is not empty
        if awards:
            for award in awards:
                try:
                    # Parse the award date
                    award_date = datetime.strptime(award['date'], '%Y-%m-%d').date() if award.get('date') else None
                    # Prepare parameters
                    award_params = {
                        "educ_info_id": educ_info_id,  # Ensure educ_info_id is retrieved earlier
                        "awards_description": award.get('description'),
                        "award_from": award.get('school'),
                        "award_date": award_date
                    }
                    # Execute the SQL query
                    cursor.execute(award_query, award_params)
                except Exception as e:
                    print(f"Error inserting award: {e}")

        #Family Info Query
        family_info_query = """
            INSERT INTO af_family_info (
                applicant_id,
                father_status,
                father_name,
                father_address,
                father_occupation,
                mother_status,
                mother_name,
                mother_address,
                mother_occupation,
                gross_income,
                number_of_siblings,
                number_of_brothers,
                number_of_sisters,
                partner_name,
                number_of_children,
                partner_occupation,
                partner_course
            )
            VALUES (
                %(applicant_id)s,
                %(father_status)s,
                %(father_name)s,
                %(father_address)s,
                %(father_occupation)s,
                %(mother_status)s,
                %(mother_name)s,
                %(mother_address)s,
                %(mother_occupation)s,
                %(gross_income)s,
                %(number_of_siblings)s,
                %(number_of_brothers)s,
                %(number_of_sisters)s,
                %(partner_name)s,
                %(number_of_children)s,
                %(partner_occupation)s,
                %(partner_course)s
            )
        """
        family_info_params = {
            "applicant_id": applicant_id,
            "father_status": father_status,
            "father_name": father_name,
            "father_address": father_address,
            "father_occupation": father_occupation,
            "mother_status": mother_status,
            "mother_name": mother_name,
            "mother_address": mother_address,
            "mother_occupation": mother_occupation,
            "gross_income": gross_income,
            "number_of_siblings": number_of_siblings,
            "number_of_brothers": number_of_brothers,
            "number_of_sisters": number_of_sisters,
            "partner_name": partner_name,
            "number_of_children": number_of_children,
            "partner_occupation": partner_occupation,
            "partner_course": partner_course
        }

        cursor.execute(family_info_query, family_info_params)

        #File Initial Query
        cursor.execute("""
            INSERT INTO af_file_initial (applicant_id, photo_path, income_tax_return_path, e_signature_path)
            VALUES (%s, %s, %s, %s)
        """, (applicant_id, photo_path, itr_path, e_signature_path))

        conn.commit()
        cursor.close()
        conn.close()

        # Respond back with success
        return jsonify({"message": "Registration data received successfully!"}), 200
    except Exception as e:
        # Handle any exceptions
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing the data."}), 500


@app.route('/submit-all', methods=['POST'])
def submit_all():
    try:
        if not request.files or not request.form.get("last_name") or not request.form.get("applicant_id"):
            return jsonify({"message": "No files or last name provided"}), 400

        last_name = request.form.get("last_name")
        application_id = request.form.get("applicant_id")
        saved_files = []

        current_year = str(datetime.now().year)
        first_letter = last_name[0].upper()
        if 'A' <= first_letter <= 'C':
            folder_range = "A-C"
        elif 'D' <= first_letter <= 'F':
            folder_range = "D-F"
        elif 'G' <= first_letter <= 'I':
            folder_range = "G-I"
        elif 'J' <= first_letter <= 'L':
            folder_range = "J-L"
        elif 'M' <= first_letter <= 'O':
            folder_range = "M-O"
        elif 'P' <= first_letter <= 'R':
            folder_range = "P-R"
        elif 'S' <= first_letter <= 'U':
            folder_range = "S-U"
        elif 'V' <= first_letter <= 'Z':
            folder_range = "V-Z"
        else:
            folder_range = "Other"
        
        final_req_folder_path = f"C:/LGU Daet Scholarship\\{current_year}\\{folder_range}\\{last_name} {application_id}\\Final Requirements\\"
        os.makedirs(final_req_folder_path, exist_ok=True)

        file_paths = {}
        for file_type, file in request.files.items():
            file_path = os.path.join(final_req_folder_path, f"{file_type}_{file.filename}")
            file.save(file_path)
            saved_files.append(file_path)
            file_paths[file_type] = file_path

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO final_requirements (application_id, last_name, final_req_folder_path) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (application_id, last_name, final_req_folder_path))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Files uploaded and data saved successfully", "files": saved_files}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    applicant_id = data.get('applicantId')
    birthdate = data.get('birthdate')

    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Check if the credentials match and the status is 'scholar'
        query = """
        SELECT application_id, surname, first_name, birthdate, status
        FROM applicants
        WHERE email_address = %s AND application_id = %s AND birthdate = %s
        """
        cursor.execute(query, (email, applicant_id, birthdate))
        user_data = cursor.fetchone()

        if user_data:
            application_id, surname, first_name, birthdate, status = user_data

            if status == 'scholar':
                print(f"Login successful for {first_name} {surname} (Application ID: {application_id}) {birthdate}")

                return jsonify({
                    "success": True,
                    "message": "Login successful",
                    "data": {
                        "application_id": application_id,
                        "surname": surname,
                        "first_name": first_name,
                        "birthdate": birthdate,
                        "status": status
                    }
                })
            else:
                return jsonify({
                    "success": False,
                    "message": "Not a scholar. Login failed."
                })
        else:
            return jsonify({
                "success": False,
                "message": "Invalid credentials or account not found."
            })

    except mysql.connector.Error as err:
        return jsonify({"success": False, "message": f"Database error: {err}"})
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)