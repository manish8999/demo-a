import mysql.connector
import pandas as pd

# Database configuration
db_config = {
    "host": "localhost",
    "user": "sqluser",
    "password": "test123",
    "database": "prod_db"
}

# CSV file path
csv_file = 'States_and_UTs_India.csv'

# Table name in your database
table_name = 'stateuts'

try:
    # Create a connection
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Read data from CSV
    df = pd.read_csv(csv_file)

    for index, row in df.iterrows():
        # Update the MySQL database
        query = f"INSERT INTO {stateuts} (locationOfSuppler, locationOfBuyer, TypeBuyerLocation, CGST, SGST, UTGST, IGST) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (
            row['Location of Suppler'],
            row['Location of Buyer'],
            row['Type of Buyer Location'],
            row['Applicable CGST'],
            row['Applicable SGST'],
            row['Applicable UTGST'],
            row['Applicable IGST']
        )
        cursor.execute(query, values)

    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    print("Data successfully updated in MySQL.")
except Exception as e:
    print(f"An error occurred: {str(e)}")
