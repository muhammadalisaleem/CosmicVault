-- =============================================
-- Clear and Populate Constellations Table
-- Author: CosmicVault Team
-- Date: December 2025
-- Description: Delete all data and insert 88 IAU constellations
-- =============================================

USE CosmicVault;
GO

-- Delete all records from Constellations table
DELETE FROM Constellations;
PRINT 'Existing constellation records deleted.';
GO

-- Insert all 88 IAU constellations with descriptions
INSERT INTO Constellations (Name, Abbreviation, Description) VALUES
('Andromeda', 'And', 'The Chained Maiden. Home to the Andromeda Galaxy (M31), the nearest major galaxy to the Milky Way.'),
('Antlia', 'Ant', 'The Air Pump. A small, faint constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Apus', 'Aps', 'The Bird of Paradise. Located near the south celestial pole, named after the exotic bird.'),
('Aquarius', 'Aqr', 'The Water Bearer. One of the zodiac constellations, associated with Ganymede from Greek mythology.'),
('Aquila', 'Aql', 'The Eagle. Contains the bright star Altair, one of the vertices of the Summer Triangle.'),
('Ara', 'Ara', 'The Altar. An ancient constellation representing the altar used by the gods to swear their allegiance before battling the Titans.'),
('Aries', 'Ari', 'The Ram. A zodiac constellation representing the golden ram of Greek mythology.'),
('Auriga', 'Aur', 'The Charioteer. Contains Capella, the sixth brightest star in the night sky.'),
('Boötes', 'Boo', 'The Herdsman. Home to Arcturus, the fourth brightest star in the night sky.'),
('Caelum', 'Cae', 'The Chisel. A faint constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Camelopardalis', 'Cam', 'The Giraffe. A large but faint constellation in the northern sky.'),
('Cancer', 'Cnc', 'The Crab. A zodiac constellation containing the star cluster Praesepe (M44), also known as the Beehive Cluster.'),
('Canes Venatici', 'CVn', 'The Hunting Dogs. Contains the Whirlpool Galaxy (M51), one of the most famous spiral galaxies.'),
('Canis Major', 'CMa', 'The Greater Dog. Home to Sirius, the brightest star in the night sky.'),
('Canis Minor', 'CMi', 'The Lesser Dog. Contains Procyon, the eighth brightest star in the night sky.'),
('Capricornus', 'Cap', 'The Sea Goat. A zodiac constellation with a distinctive triangular shape.'),
('Carina', 'Car', 'The Keel. Contains Canopus, the second brightest star in the night sky, and the Eta Carinae nebula.'),
('Cassiopeia', 'Cas', 'The Queen. Recognizable by its distinctive W shape, home to several star clusters.'),
('Centaurus', 'Cen', 'The Centaur. Contains Alpha Centauri, the closest star system to Earth, and Omega Centauri, the largest globular cluster.'),
('Cepheus', 'Cep', 'The King. Named after King Cepheus of Ethiopia in Greek mythology.'),
('Cetus', 'Cet', 'The Whale or Sea Monster. Contains the variable star Mira, one of the first variable stars discovered.'),
('Chamaeleon', 'Cha', 'The Chameleon. A small constellation near the south celestial pole.'),
('Circinus', 'Cir', 'The Compass. A small, faint constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Columba', 'Col', 'The Dove. Represents the dove that returned to Noah''s ark with an olive branch.'),
('Coma Berenices', 'Com', 'Berenice''s Hair. Named after the hair of Queen Berenice II of Egypt, contains the Coma Cluster of galaxies.'),
('Corona Australis', 'CrA', 'The Southern Crown. A small constellation representing a crown or wreath.'),
('Corona Borealis', 'CrB', 'The Northern Crown. A small but distinctive semicircular constellation.'),
('Corvus', 'Crv', 'The Crow. A small constellation representing Apollo''s sacred bird in Greek mythology.'),
('Crater', 'Crt', 'The Cup. Represents the cup of Apollo in Greek mythology.'),
('Crux', 'Cru', 'The Southern Cross. The smallest constellation but one of the most distinctive, used for navigation in the Southern Hemisphere.'),
('Cygnus', 'Cyg', 'The Swan. Contains Deneb, one of the vertices of the Summer Triangle, and the bright star Albireo.'),
('Delphinus', 'Del', 'The Dolphin. A small but easily recognizable constellation with a distinctive diamond shape.'),
('Dorado', 'Dor', 'The Dolphinfish. Contains the Large Magellanic Cloud, a satellite galaxy of the Milky Way.'),
('Draco', 'Dra', 'The Dragon. A large circumpolar constellation that winds around the north celestial pole.'),
('Equuleus', 'Equ', 'The Little Horse. The second smallest constellation in the night sky.'),
('Eridanus', 'Eri', 'The River. The longest constellation, stretching from the celestial equator to the deep southern sky.'),
('Fornax', 'For', 'The Furnace. Contains the Fornax Cluster of galaxies.'),
('Gemini', 'Gem', 'The Twins. A zodiac constellation representing Castor and Pollux from Greek mythology.'),
('Grus', 'Gru', 'The Crane. A constellation in the southern sky representing a water bird.'),
('Hercules', 'Her', 'The Hero. Named after the Roman hero Hercules, contains the great globular cluster M13.'),
('Horologium', 'Hor', 'The Pendulum Clock. A faint constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Hydra', 'Hya', 'The Water Snake. The largest constellation in the sky, stretching over 100 degrees.'),
('Hydrus', 'Hyi', 'The Lesser Water Snake. A small constellation near the south celestial pole.'),
('Indus', 'Ind', 'The Indian. Represents a Native American in the southern sky.'),
('Lacerta', 'Lac', 'The Lizard. A small, faint constellation in the northern sky.'),
('Leo', 'Leo', 'The Lion. A zodiac constellation representing the Nemean Lion slain by Hercules.'),
('Leo Minor', 'LMi', 'The Lesser Lion. A small, faint constellation between Leo and Ursa Major.'),
('Lepus', 'Lep', 'The Hare. Located under the feet of Orion, representing a hare being hunted.'),
('Libra', 'Lib', 'The Scales. A zodiac constellation representing the scales of justice.'),
('Lupus', 'Lup', 'The Wolf. An ancient constellation between Centaurus and Scorpius.'),
('Lynx', 'Lyn', 'The Lynx. A large but faint constellation requiring keen eyesight to observe.'),
('Lyra', 'Lyr', 'The Lyre. Contains Vega, one of the brightest stars and a vertex of the Summer Triangle.'),
('Mensa', 'Men', 'The Table Mountain. The only constellation named after a real geographic feature, Table Mountain in South Africa.'),
('Microscopium', 'Mic', 'The Microscope. A small, faint constellation in the southern sky.'),
('Monoceros', 'Mon', 'The Unicorn. Located on the celestial equator, contains the Rosette Nebula.'),
('Musca', 'Mus', 'The Fly. A small constellation in the southern sky near Crux.'),
('Norma', 'Nor', 'The Carpenter''s Square. A small constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Octans', 'Oct', 'The Octant. Contains the south celestial pole, the southern equivalent of Polaris.'),
('Ophiuchus', 'Oph', 'The Serpent Bearer. The 13th zodiac constellation, represents Asclepius, the god of medicine.'),
('Orion', 'Ori', 'The Hunter. One of the most recognizable constellations, home to Betelgeuse, Rigel, and the Orion Nebula.'),
('Pavo', 'Pav', 'The Peacock. A constellation in the southern sky representing the bird.'),
('Pegasus', 'Peg', 'The Winged Horse. Features the Great Square of Pegasus, a prominent asterism.'),
('Perseus', 'Per', 'The Hero. Named after the Greek hero who slayed Medusa, contains the Double Cluster.'),
('Phoenix', 'Phe', 'The Phoenix. Represents the mythical bird that rises from its own ashes.'),
('Pictor', 'Pic', 'The Painter''s Easel. A small constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Pisces', 'Psc', 'The Fishes. A zodiac constellation representing two fish tied together.'),
('Piscis Austrinus', 'PsA', 'The Southern Fish. Contains Fomalhaut, the 18th brightest star in the night sky.'),
('Puppis', 'Pup', 'The Stern. Part of the ancient constellation Argo Navis, contains several star clusters.'),
('Pyxis', 'Pyx', 'The Compass. Part of the ancient constellation Argo Navis.'),
('Reticulum', 'Ret', 'The Reticle. A small constellation in the southern sky representing a reticle or grid.'),
('Sagitta', 'Sge', 'The Arrow. The third smallest constellation in the sky.'),
('Sagittarius', 'Sgr', 'The Archer. A zodiac constellation, the galactic center of the Milky Way lies in this direction.'),
('Scorpius', 'Sco', 'The Scorpion. A zodiac constellation containing Antares, one of the brightest stars.'),
('Sculptor', 'Scl', 'The Sculptor. Contains the Sculptor Galaxy (NGC 253) and the south galactic pole.'),
('Scutum', 'Sct', 'The Shield. Contains the Wild Duck Cluster (M11), one of the richest open clusters.'),
('Serpens', 'Ser', 'The Serpent. The only constellation divided into two parts: Serpens Caput (head) and Serpens Cauda (tail).'),
('Sextans', 'Sex', 'The Sextant. A faint constellation on the celestial equator.'),
('Taurus', 'Tau', 'The Bull. A zodiac constellation containing the Pleiades and Hyades star clusters, and the bright star Aldebaran.'),
('Telescopium', 'Tel', 'The Telescope. A small constellation in the southern sky introduced by Nicolas Louis de Lacaille.'),
('Triangulum', 'Tri', 'The Triangle. A small constellation home to the Triangulum Galaxy (M33), a member of the Local Group.'),
('Triangulum Australe', 'TrA', 'The Southern Triangle. A small but bright constellation in the southern sky.'),
('Tucana', 'Tuc', 'The Toucan. Contains the Small Magellanic Cloud and the globular cluster 47 Tucanae.'),
('Ursa Major', 'UMa', 'The Great Bear. Contains the Big Dipper asterism and several galaxies including M81 and M82.'),
('Ursa Minor', 'UMi', 'The Little Bear. Contains Polaris, the North Star, which marks the north celestial pole.'),
('Vela', 'Vel', 'The Sails. Part of the ancient constellation Argo Navis, contains the Vela Supernova Remnant.'),
('Virgo', 'Vir', 'The Virgin. A zodiac constellation, home to the Virgo Cluster of galaxies and the bright star Spica.'),
('Volans', 'Vol', 'The Flying Fish. A small constellation in the southern sky.'),
('Vulpecula', 'Vul', 'The Fox. Contains the Dumbbell Nebula (M27), a famous planetary nebula.');

-- Check the result
SELECT COUNT(*) AS TotalConstellations FROM Constellations;

PRINT '';
PRINT '==============================================';
PRINT 'Successfully inserted all 88 IAU constellations!';
PRINT '==============================================';
GO
