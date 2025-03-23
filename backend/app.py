from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS  # Add this import

app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app)  # Allow all domains to access the backend

# MySQL configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'  # replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'Sreenija24'  # replace with your MySQL password if any
app.config['MYSQL_DB'] = 'air_assist'

mysql = MySQL(app)

@app.route('/trips', methods=['POST'])
def create_trip():
    data = request.get_json()
    
    # Check if all required data is present
    if not all(key in data for key in ['user_id', 'trip_type', 'role', 'destination', 'departure_date']):
        return jsonify({'error': 'Missing required fields'}), 400

    user_id = data['user_id']
    trip_type = data['trip_type']
    role = data['role']
    destination = data['destination']
    departure_date = data['departure_date']
    return_date = data.get('return_date', None)
    assistance_needed = data.get('assistance_needed', None)
    services_offered = data.get('services_offered', None)

    cur = mysql.connection.cursor()

    try:
        # Insert trip data based on role
        if role == 'requester':
            cur.execute("""
                INSERT INTO trips (user_id, trip_type, role, destination, departure_date, return_date, assistance_needed)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, trip_type, role, destination, departure_date, return_date, assistance_needed))
        elif role == 'helper':
            cur.execute("""
                INSERT INTO trips (user_id, trip_type, role, destination, departure_date, return_date, services_offered)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (user_id, trip_type, role, destination, departure_date, return_date, services_offered))
        else:
            return jsonify({'error': 'Invalid role specified'}), 400
        
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Trip created successfully'}), 201
    except Exception as e:
        cur.close()
        return jsonify({'error': str(e)}), 500
    
@app.route('/trips/<int:user_id>', methods=['GET'])
def get_trips(user_id):
    cur = mysql.connection.cursor()
    
    try:
        # Fetch trips for a specific user
        cur.execute("SELECT * FROM trips WHERE user_id = %s", (user_id,))
        trips = cur.fetchall()
        
        if not trips:
            return jsonify({'message': 'No trips found for this user'}), 404
        
        return jsonify(trips), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

if __name__ == '__main__':
    app.run(debug=True)
