DROP TABLE IF EXISTS animal;
DROP TABLE IF EXISTS animaltype;

CREATE TABLE animaltype (
	id SERIAL PRIMARY KEY,
	endpoint TEXT UNIQUE,
	name VARCHAR(64),
	description TEXT,
	image_url TEXT
);
CREATE TABLE animal (
	id SERIAL PRIMARY KEY,
	name VARCHAR(64) NOT NULL,
	description TEXT,
	type_id INT REFERENCES animaltype(id) ON DELETE SET NULL,
	breed VARCHAR(64),
	shelter_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	image_url TEXT
);

INSERT INTO animaltype (name, endpoint, description, image_url) VALUES 
('Kissat', 'kissat', 'Etsitkö uskollista kumppania ja pehmeää lohtua? Suojamme kissat etsivät lämminhenkistä kotia, jossa päästä kehrätä rauhassa. Tee hyvä teko ja adoptoi kissa ja saat vastineeksi rakkautta ja seuraa vuosiksi!', 'cats.png'),
('Koirat', 'koirat', 'Etsitkö uskollista kumppania, joka on aina iloinen nähdessään sinut? Suojamme koirat etsivät rakastavaa kotia ja ihmistä, jonka rinnalle päästä lähteä lenkille.', 'dogs.png'),
('Muut', 'muut', 'Haluatko kokeilla jotakin uutta? Suojassamme on myös muitakin eläimiä, jotka kaikki odottavat kotia. Löydät meiltä myös esimerkiksi kaneja, marsuja ja hamstereita.', 'other.png');

INSERT INTO animal (name, description, type_id, breed, shelter_date, image_url) VALUES 
('Killi', 'Kiva ja hellyyden haluinen kissa, mutta näykkii kuin piraija.', 1, 'Sekarotu', '2011-07-05', 'killi.jpg'),
('Luna', '"How dare thou speak of me" - asenne', 1, 'Maine Coon', '2018-03-12', 'luna.jpg'),
('Julien', 'Energinen kissa, joka tykkää tanssia.', 1, 'Sekarotu', '2010-01-28', 'julien.jpg'),
('Simba', 'Ylpeä ja äänekäs kaveri, joka luulee olevansa oikea leijona.', 1, 'Abessinialainen', '2015-01-05', NULL),
('Misu', 'Hieman ujo aluksi, mutta sulaa herkkujen myötä erittäin nopeasti.', 1, 'Siamilainen', '2022-08-15', 'misu.jpg'),
('Nöpö', 'Utelias pieni kissa, joka tykkää tutkia kaappien sisällöstä.', 1, 'Britannian lyhytkarvainen', '2019-10-02', NULL);
('Bertha', 'Lempeä koira jonka kanssa sinulla tulee varmasti olemaan kultaisia hetkiä.', 2, 'Kultainennoutaja', '2021-02-25', 'bertha.jpg');
('Gambit', 'Koira joka aina löytää odottamattomia tapoja herättää tunteitasi.', 2, 'Jack Russell', '2020-01-12', 'gambit.jpg');
('Scrummy', 'Gaselli joka tykkää organisoiduista projekteista', 3, 'Gaselli', '2026-07-12', 'scrummy.jpg');