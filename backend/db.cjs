
/** @format */

const pgPromise = require("pg-promise")({
    error(error, event) {
        console.error(error);

        if (event?.query) {
            let errorContext = `Error with query: "${event.query}"`;

            if (event.params) {
                errorContext += `, using parameters (${event.params})`;
            }

            console.warn(errorContext);
        }
    },
});

// Käytetään yhteysosoitetta, jos se on määritelty.
// Muuten luetaan erilliset PGUSER-, PGHOST- ja muut asetukset.
const connectionOptions = process.env.PG_CONNECTION_STRING
    ? {
        connectionString: process.env.PG_CONNECTION_STRING,
    }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT || 5432),
    };

// Tarkistetaan, että yhteysasetukset ovat olemassa.
if (
    !connectionOptions.connectionString &&
    (
        !connectionOptions.user ||
        !connectionOptions.host ||
        !connectionOptions.database ||
        !connectionOptions.password
    )
) {
    throw new Error(
        "Tietokantayhteyden asetuksia puuttuu backend/.env-tiedostosta."
    );
}

// Neon tarvitsee SSL:n. Dockerin paikallinen PostgreSQL ei.
if (process.env.PGSSL !== "false") {
    connectionOptions.ssl = {
        rejectUnauthorized: false,
    };
}

const connection = pgPromise(connectionOptions);

module.exports = {
    connection,
    pgPromise,
};
