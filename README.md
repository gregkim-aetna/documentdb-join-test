# documentdb-join-test

This project can both create test data and run timed read tests using different techniques against the test data. By default, test data creation is commented out.

## Configuration

### Download Certificate Authority (CA) PEM file

The Certificate Authority (CA) PEM file is used to establish an SSL/TLS connection to the database.

For the Pharmville prescription-management dev DocumentDB cluster, the CA PEM file may be downloaded with the following command:

```bash
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

### Create .env file

Create a `.env` file in the root of the project with the following content:

```
MONGODB_DATABASE="joinTest"
MONGODB_HOST="dev-prescription-management-docdb-cluster.cluster-chhnapqdytoy.us-east-1.docdb.amazonaws.com"
MONGODB_PASSWORD="password-goes-here"
MONGODB_TLS_CA_FILE="global-bundle.pem"
MONGODB_USERNAME="appAdmin"
MONGODB_USE_SSH_TUNNEL=false
```

The .env file is used to set environment variables for the project. The environment variables are used to connect to the DocumentDB cluster.

Replace `password-goes-here` with the password.

Adjust `MONGODB_TLS_CA_FILE` to point to the location of your downloaded `global-bundle.pem` file.

## Running

The test script can be run with the following commands:

```bash
npm run build
npm start
```
