DROP TABLE IF EXISTS adoptions CASCADE;
DROP TABLE IF EXISTS animal CASCADE;
DROP TABLE IF EXISTS category CASCADE;

CREATE TABLE category (
	id TEXT UNIQUE PRIMARY KEY,
	name VARCHAR(64),
	description TEXT,
	image_url TEXT
);
CREATE TABLE animal (
	id SERIAL PRIMARY KEY,
	name VARCHAR(64) NOT NULL,
	description TEXT,
	category_text_id TEXT REFERENCES category(id) ON DELETE SET NULL,
	breed VARCHAR(64),
    born_date TIMESTAMP,
	shelter_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	image_url TEXT NOT NULL,
	status VARCHAR(64) DEFAULT 'available'
);
CREATE TABLE adoptions (
    id BIGSERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL
        REFERENCES animal(id) ON DELETE RESTRICT,
    applicant_name VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO category (name, id, description, image_url) VALUES 
('Kissat', 'kissat', 'Etsitkö uskollista kumppania ja pehmeää lohtua? Suojamme kissat etsivät lämminhenkistä kotia, jossa päästä kehrätä rauhassa. Tee hyvä teko ja adoptoi kissa ja saat vastineeksi rakkautta ja seuraa vuosiksi!', 'cats.png'),
('Koirat', 'koirat', 'Etsitkö uskollista kumppania, joka on aina iloinen nähdessään sinut? Suojamme koirat etsivät rakastavaa kotia ja ihmistä, jonka rinnalle päästä lähteä lenkille.', 'dogs.png'),
('Muut', 'muut', 'Haluatko kokeilla jotakin uutta? Suojassamme on myös muitakin eläimiä, jotka kaikki odottavat kotia. Löydät meiltä myös esimerkiksi kaneja, marsuja ja hamstereita.', 'other.png');

INSERT INTO animal (name, description, category_text_id, breed, shelter_date, born_date, image_url) VALUES 
('Killi', 'Kiva ja hellyyden haluinen kissa, mutta näykkii kuin piraija.', 'kissat', 'Sekarotu', '2011-07-05', '2011-06-02', 'killi.jpg'),
('Luna', '"How dare thou speak of me" - asenne', 'kissat', 'Maine Coon', '2018-03-12', '2014-12-23', 'luna.jpg'),
('Julien', 'Energinen kissa, joka tykkää tanssia.', 'kissat', 'Sekarotu', '2014-01-28', '2013-09-12', 'julien.jpg'),
('Simba', 'Ylpeä ja äänekäs kaveri, joka luulee olevansa oikea leijona.', 'kissat', 'Abessinialainen', '2015-01-05', '2013-06-01', 'no_image.png'),
('Misu', 'Hieman ujo aluksi, mutta sulaa herkkujen myötä erittäin nopeasti.', 'kissat', 'Siamilainen', '2022-08-15', '2020-04-02', 'misu.jpg'),
('Nöpö', 'Utelias pieni kissa, joka tykkää tutkia kaappien sisällöstä.', 'kissat', 'Britannian lyhytkarvainen', '2019-10-02', '2019-10-01', 'no_image.png'),
('Bertha', 'Lempeä koira jonka kanssa sinulla tulee varmasti olemaan kultaisia hetkiä.', 'koirat', 'Kultainennoutaja', '2021-02-25', '2019-06-26', 'bertha.jpg'),
('Gambit', 'Koira joka aina löytää odottamattomia tapoja herättää tunteitasi.', 'koirat', 'Jack Russell', '2020-01-12', '2018-07-09', 'gambit.jpg'),
('Scrummy', 'Gaselli joka tykkää organisoiduista projekteista', 'muut', 'Gaselli', '2026-07-12', '2025-07-24', 'scrummy.jpg');