# documentdb-test

This repo provides examples of connecting to a DocumentDB database and doing CRUD operations using Mongo and Mongoose styles.

Note that the repo code is using a bastion server to connect to its example DocumentDB database. We are not doing this in our actual dev, QA and prod environments. Zscaler (or something else) is working some VPN magic to allow us to reach our DocumentDB database in its VPC directly. Thus, the connection examples in the code need to be considered in that light. Some of the connection settings are only needed when using a bastion server.

## Prepare Database

### Bastion Server

A DocumentDB database does not allow direct connections to it from outside the VPC in which in resides. The example code uses an SSH tunnel through a bastion server to connect to the database. Thus, in order to run the example code from your local computer, you need both a DocumentDB database and a bastion server in the same VPC to be available.

The bastion server can be pretty easy to set up. I started an Ubuntu server in the VPC. Then when creating the DocumentDB cluster, the creation wizard gives an option to connect a bastion server. The creation wizard took care of all the AWS security settings between the two. Once the wizard was done creating the DocumentDB cluster, I could SSH tunnel to the new DocumentDB cluster. I did not need to install any software on the bastion server or do any configuration for it.

### Prepare Collection

The example code expects the `prescriptions` collection to exist in the database.

The following example `prescriptions` collection code shows how to use DocumentDB JSON Schema validation. The code may be run with mongosh after selecting a database.

Before running the example code, create the `prescriptions` collection.

```
db.createCollection("prescriptions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "dosage", "dosageUnit", "deleteDate"],
      properties: {
        name: {
          bsonType: "string",
          description: "Drug name"
        },
        dosage: {
          bsonType: "int",
          minimum: 1,
          description: "Drug dosage"
        },
        dosageUnit: {
          bsonType: "string",
          enum: ["mg", "pill"],
          description: "Drug dosage unit"
        },
        deleteDate: {
          bsonType: "date",
          description: "Date record will be deleted"
        }
      }
    }
  }
})
```

### Prepare TTL Index

To support automatic document deletion when a date/time arrives, we set up a TTL index for the collection.

Before running the example code, create the TTL index.

```
db.prescriptions.createIndex(
  { "deleteDate": 1 },
  { expireAfterSeconds: 0 }
)
```

`expireAfterSeconds` configures a delay after the delete date/time arrives before the deletion will occur. For example, this could be used to allow a creation date to have a TTL index and have records be deleted an hour after creation.

The example code deletes the document shortly after creating it. To see automatic document deletion, comment out the deletion part of the example code. Note that DocumentDB's TTL process is not instantaneous and may take some time (usually within a minute) after the deletion date is reached to delete the document.

## Configure the Examples

Some configuration is needed before running the example code. The example code expects two files to exist in the project top level folder.

### .env File

The .env file should have the following fields:

```
MONGODB_DATABASE="your-database-name"
MONGODB_HOST="127.0.0.1"
MONGODB_PASSWORD="your-password"
MONGODB_TLS_CA_FILE="your-tls-cs-pem-file-name"
MONGODB_USERNAME="your-username"
MONGODB_USE_SSH_TUNNEL=true
```

Set the fields prefixed with `your-` to the appropriate values for your environment.

The `MONGODB_HOST` and `MONGODB_USE_SSH_TUNNEL` values are correct for connecting through an SSH tunnel from your local computer.

### SSL/TLS Certificate Authority (CA) File

Copy the SSL/TLS Certificate Authority (CA) file for your DocumentDB instance to the project top level folder. In AWS examples, this file is often shown as `global-bundle.pem`.

Use the file name of the file for the `.env` file `MONGODB_TLS_CA_FILE` field.

## Establish SSH Tunnel

Before running the example code, using mongosh or Compass, you need to establish an SSH tunnel to the DocumentDB instance. This may be done with a command like the following:

```
ssh -i bastion-server-pem-file-name -N -L 27017:documentdb-cluster-url:27017 bastion-server-url
```

Once you run the above command, the SSH tunnel will remain open until you CTRL-C or otherwise stop the command.

### bastion-server-pem-file-name

Tne file specification of the bastion server PEM file downloaded to your computer.

### documentdb-cluster-url

The DocumentDB cluster URL for the database. As an example, for my test database the URL was `aetna-test-docdb.cluster-cwmerlckvzbk.us-west-2.docdb.amazonaws.com`.

### bastion-server-url

The URL of the bastion server you wish to use to connect to the database. As an example, for my test bastion server the URL was `ubuntu@ec2-35-87-54-208.us-west-2.compute.amazonaws.com`.

## About the Examples

`index.js` runs both the Mongo and Mongoose examples.

### Mongo Examples

An `index.js` scoped client is created.

The client is passed to the CRUD examples.

CRUD methods are run against a collection.

### Mongoose Examples

A Mongoose global client is created.

CRUD methods are run against a Mongoose model.

## Run the Examples

The examples may be run with commands like the following:

```
npm i
npm run build
npm start
```

Hit CTRL-C to stop the application and see the termination example.

## Additional Information

### Client Tools

#### MongoDB shell

The MongoDB shell (mongosh) lets you interact with DocumentDB from the command line. Instructions on how to install and use the shell are at [Welcome to MongoDB Shell](https://www.mongodb.com/docs/mongodb-shell/).

You can connect mongosh to a DocumentDB database through an SSH tunnel with a command like the following:

```
./mongosh --ssl --sslAllowInvalidHostnames --sslCAFile your-tls-cs-pem-file-name --username your-username --password your-password
```

#### MongoDB GUI

Compass is MongoDB’s GUI for MongoDB. Instructions on how to install and use Compass are at [Compass. The GUI for MongoDB.](https://www.mongodb.com/products/tools/compass).

You can connect Compass to a DocumentDB database through an SSH tunnel with a connection string like the following:

```
mongodb://your-username:your-password@127.0.0.1:27017?ssl=true&directConnection=true
```

Then under `Advanced Connection Options`, `TLS/SSL` tab do the following:

- Set the `Certificate Authority (.pem)` file.

- Check `tlsAllowInvalidHostnames`.
