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

app = Flask(__name__)

CORS(app)

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
                awards TEXT,
                FOREIGN KEY (applicant_id) REFERENCES af_basic_info(applicant_id)
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
                applicant_id VARCHAR(10),
                last_name VARCHAR(100),
                birth_cert_path VARCHAR(255),
                report_card_path VARCHAR(255),
                good_moral_path VARCHAR(255),
                pdao_path VARCHAR(255),
                reg_form_path VARCHAR(255),
                indigent_family_path VARCHAR(255),
                no_scholarship_path VARCHAR(255),
                FOREIGN KEY (applicant_id) REFERENCES af_basic_info(applicant_id)
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


def save_file_to_folder(file, last_name, file_type):
    base_path = "C:/LGU Daet Scholarship"
    year_folder = str(datetime.now().year)
    year_path = os.path.join(base_path, year_folder)

    # Subfolders based on alphabetical ranges
    subfolders = {
        "A-C": "ABC",
        "D-F": "DEF",
        "G-I": "GHI",
        "J-L": "JKL",
        "M-O": "MNO",
        "P-R": "PQR",
        "S-U": "STU",
        "V-X": "VWX",
        "Y-Z": "YZ"
    }

    # Determine target subfolder based on last name's first letter
    last_name_initial = last_name[0].upper()
    target_subfolder = None

    for subfolder, letters in subfolders.items():
        if last_name_initial in letters:
            target_subfolder = subfolder
            break

    if target_subfolder is None:
        raise ValueError("Invalid last name initial.")

    # Create the directory structure
    target_folder_path = os.path.join(year_path, target_subfolder, last_name, "Final Requirements")
    os.makedirs(target_folder_path, exist_ok=True)

    # Save the file in the "Final Requirements" folder
    file_name = f"{file_type}_{secure_filename(file.filename)}"  # Prefix filename with its type
    file_path = os.path.join(target_folder_path, file_name)
    file.save(file_path)

    return file_path

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
            INSERT INTO applicants (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (application_id, surname, first_name, middle_name, suffix_name, birthdate, email_address, "applicant"))
        conn.commit()

        cursor.close()
        conn.close()

        # Send the application ID to the applicant's email
        send_email(email_address, application_id, first_name, surname)

        return jsonify({"message": "User registered successfully!", "application_id": application_id}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email address already exists!"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/submit_initial_requirements', methods=['POST'])
def submit_initial_requirements():
    try:
        # Get JSON data from the request
        data = request.get_json()

        #Basic Info
        applicant_id = data.get("applicant_id")
        name = data.get("name", {})
        last_name = name.get("lastName", "")
        first_name = name.get("firstName", "")
        middle_name = name.get("middleName", "") or None
        suffix = name.get("suffix", "") or None
        age = data.get("age")
        religion = data.get("religion")
        sex = data.get("sexValue")
        civil_status = data.get("civilStatus")
        birthdate = data.get("birthdate")
        place_of_birth = data.get("place_of_birth")
        permanent_address = data.get("permanent_address", {})
        barangay = permanent_address.get("barangay", "")
        purok = permanent_address.get("purok", "")
        street = permanent_address.get("street", "") or None
        municipality = permanent_address.get("municipality", "")
        contact_number = data.get("contact_number")
        email_address = data.get("email_address")

        #Educ Info
        grant_type = data.get("grant_type")
        educ_attainment = data.get("educ_attainment")
        highest_grade_year = data.get("highest_grade_year")
        gwa = data.get("gwa")
        school_name = data.get("school_name")
        school_type = data.get("school_type")
        awards = data.get("awards", [])

        awards_string = ', '.join([f"{award['description']} - {award['school']} - {award['date']}" for award in awards])

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        #Family Info
        father_status = data.get("father_status")
        father_name = data.get("father_name")
        father_address = data.get("father_address")
        father_occupation = data.get("father_occupation")
        mother_status = data.get("mother_status")
        mother_name = data.get("mother_name")
        mother_address = data.get("mother_address")
        mother_occupation = data.get("mother_occupation")
        gross_income = data.get("gross_income")
        number_of_siblings = data.get("number_of_siblings")
        number_of_brothers = data.get("number_of_brothers")
        number_of_sisters = data.get("number_of_sisters")
        partner_name = data.get("partner_name") or None
        number_of_children = data.get("number_of_children") or None
        partner_occupation = data.get("partner_occupation") or None
        partner_course = data.get("partner_course") or None

        #File Initial
        profile_image = request.files.get('profile_image')
        itr = request.files.get('itr')
        e_signature = request.files.get('e_signature')

        photo_path = None
        itr_path = None
        e_signature_path = None

        # Save each file and get the file paths
        if profile_image:
            photo_path = save_file_to_folder(profile_image, last_name, "ProfileImage")
            print(f"Profile Image Path: {photo_path}")
        if itr:
            itr_path = save_file_to_folder(itr, last_name, "ITR")
            print(f"ITR Path: {itr_path}")
        if e_signature:
            e_signature_path = save_file_to_folder(e_signature, last_name, "ESignature")
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
                school_type,
                awards
            ) VALUES (
                %(applicant_id)s,
                %(grant_type)s,
                %(educ_attainment)s,
                %(highest_grade_year)s,
                %(gwa)s,
                %(school_name)s,
                %(school_type)s,
                %(awards)s
            )
        """

        educ_info_params = {
            "applicant_id": applicant_id,
            "grant_type": grant_type,
            'educ_attainment': educ_attainment,
            'highest_grade_year': highest_grade_year,
            'gwa': gwa,
            'school_name': school_name,
            'school_type': school_type,
            'awards': awards_string
        }
        
        cursor.execute(educ_info_query, educ_info_params)

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
        applicant_id = request.form.get("applicant_id")
        saved_files = []

        # Save each file to the appropriate folder and store the file paths
        file_paths = {}
        for file_type, file in request.files.items():
            file_path = save_file_to_folder(file, last_name, file_type)
            saved_files.append(file_path)
            file_paths[file_type] = file_path
        print(file_paths)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        # Insert the file paths into the database
        insert_query = """
            INSERT INTO final_requirements (applicant_id, last_name, birth_cert_path, report_card_path, 
            good_moral_path, pdao_path, reg_form_path, indigent_family_path, no_scholarship_path) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(insert_query, (
            applicant_id, last_name,
            file_paths.get('birth_cert', ''),
            file_paths.get('report_card', ''),
            file_paths.get('good_moral', ''),
            file_paths.get('pdao', ''),
            file_paths.get('reg_form', ''),
            file_paths.get('indigent_family', ''),
            file_paths.get('no_scholarship', '')
        ))
        
        # Commit the transaction
        conn.commit()
        cursor.close()
        conn.close()


        return jsonify({"message": "Files uploaded and data saved successfully", "files": saved_files}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Internal server error", "error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
