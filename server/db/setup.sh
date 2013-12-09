#!/bin/bash

CURRENT_DIR="$( cd -P "$( dirname "${BASH_SOURCE}" )" && pwd )"

DB_USER="apollo"
DB_PWD="apollo"
DB_HOST="127.0.0.1"
DB_NAME="apollo"

echo ""
echo "Creating the DB ..."

read -p "Which is the root user? " -e DB_ROOT_USER
echo "Which is the root user pwd? "
mysql -u ${DB_ROOT_USER} -p -h ${DB_HOST} << SCRIPT
    CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;

    GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PWD}' WITH GRANT OPTION;
    GRANT SUPER ON *.* TO '${DB_USER}'@'localhost';
    GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'%' IDENTIFIED BY '${DB_PWD}' WITH GRANT OPTION;
    GRANT SUPER ON *.* TO '${DB_USER}'@'%';

    FLUSH PRIVILEGES;
SCRIPT

echo ""

echo "Creating the schema ..."
mysql -u ${DB_USER} -p${DB_PWD} -h ${DB_HOST} ${DB_NAME} < ${CURRENT_DIR}/schema.sql