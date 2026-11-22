import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// ============================================================================
// 1. BASES DE DONNÉES : 510 CARTES (MASTER SET 2 250), 380 CRÉATURES, 30 INVITÉS
// ============================================================================
const MASCOTS = [
  { id: 'chocobo', name: 'Chocobo Doré', icon: '🐤', dmg: 6, heal: 2, desc: 'Charge Plume & +2 PV escouade' },
  { id: 'yoshi', name: 'Yoshi Vert', icon: '🦖', dmg: 7, heal: 1, desc: 'Gobe l’ennemi & +2 Armure' },
  { id: 'rush', name: 'Chien Rush', icon: '🐕', dmg: 7, heal: 0, desc: 'Morsure Laser Mega Buster' },
  { id: 'navi', name: 'Fée Navi', icon: '🧚', dmg: 2, heal: 5, desc: 'Éclat Féérique & +5 PV' },
  { id: 'mog', name: 'Mog Kupo', icon: '🐻', dmg: 5, heal: 3, desc: 'Danse Kupo & +3 PV' },
  { id: 'metroid', name: 'Bébé Métroïde', icon: '👾', dmg: 8, heal: 2, desc: 'Drain d’énergie cosmique' },
  { id: 'tails', name: 'Miles « Tails »', icon: '🦊', dmg: 6, heal: 0, desc: 'Double Queue Tornade' },
  { id: 'carbuncle', name: 'Carbuncle Rubis', icon: '💎', dmg: 4, heal: 3, desc: 'Reflet Rubis & +4 Armure' },
  { id: 'phoenix', name: 'Phénix Flamboyant', icon: '🦅', dmg: 8, heal: 4, desc: 'Flammes de Renaissance & +4 PV' },
  { id: 'leviathan', name: 'Léviathan Glacial', icon: '🌊', dmg: 9, heal: 2, desc: 'Raz-de-marée & +2 PV escouade' },
  { id: 'odin', name: 'Odin Zantetsuken', icon: '🐎', dmg: 11, heal: 0, desc: 'Tranchant céleste dévastateur' },
  { id: 'pikachu', name: 'Pikachu Étincelle', icon: '⚡', dmg: 8, heal: 2, desc: 'Tonnerre 8-Bit & +2 PV' }
];

const MINI_SETS = [
  { id: 'ms_hyrule', name: 'Légende d’Hyrule', icon: '🔺', cardIds: ['c002', 'c031', 'c032', 'c033', 'c034', 'c035'], bonusDesc: '+2 Puissance sur les cartes Sacrées (x2 en Doré)', rewardGold: 120 },
  { id: 'ms_mushroom', name: 'Royaume Champignon', icon: '🍄', cardIds: ['c001', 'c036', 'c037', 'c038', 'c039', 'c040'], bonusDesc: '+2 Feu & +3 Soin escouade (x2 en Doré)', rewardGold: 120 },
  { id: 'ms_mobius', name: 'Zone Green Hill', icon: '💨', cardIds: ['c003', 'c041', 'c042', 'c043', 'c044', 'c045'], bonusDesc: '+1 PA Tour 1 & +2 Foudre (x2 en Doré)', rewardGold: 120 },
  { id: 'ms_zebes', name: 'Planète Zebes', icon: '🚀', cardIds: ['c004', 'c046', 'c047', 'c048', 'c049', 'c050'], bonusDesc: '+3 Dégâts de zone & +2 Armure initiale (x2 en Doré)', rewardGold: 130 },
  { id: 'ms_wily', name: 'Forteresse du Dr. Wily', icon: '🤖', cardIds: ['c005', 'c051', 'c052', 'c053', 'c054', 'c055'], bonusDesc: '+3 Puissance Technomancien (x2 en Doré)', rewardGold: 130 },
  { id: 'ms_belmont', name: 'Clan Belmont', icon: '✝️', cardIds: ['c006', 'c056', 'c057', 'c058', 'c059', 'c060'], bonusDesc: '+3 Puissance Sacrée & Arcane (x2 en Doré)', rewardGold: 130 },
  { id: 'ms_dreamland', name: 'Étoiles de Dream Land', icon: '⭐', cardIds: ['c008', 'c061', 'c062', 'c063', 'c064', 'c065'], bonusDesc: '+2 Puissance globale & +4 Soin (x2 en Doré)', rewardGold: 130 },
  { id: 'ms_square', name: 'Cristaux 16-Bits', icon: '🔮', cardIds: ['c009', 'c010', 'c066', 'c067', 'c068', 'c069'], bonusDesc: '+3 Sorts Élémentaires (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_summons', name: 'Pacte des Familiers', icon: '🐾', cardIds: ['c007', 'c019', 'c020', 'c021', 'c022', 'c023', 'c024', 'c025'], bonusDesc: '+4 Dégâts par tour des Familiers (x2 en Doré)', rewardGold: 150 },
  { id: 'ms_neogeo', name: 'Arcade Neo-Geo', icon: '🕹️', cardIds: ['c070', 'c071', 'c072', 'c073', 'c074', 'c075'], bonusDesc: '+3 Puissance sur toutes les Attaques (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_pce', name: 'Légendes PC Engine', icon: '💿', cardIds: ['c076', 'c077', 'c078', 'c079', 'c080', 'c081'], bonusDesc: '+2 Puissance sur les cartes Cameo (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_opera', name: 'Opéra Magitek', icon: '🎭', cardIds: ['c082', 'c083', 'c084', 'c085', 'c086', 'c087'], bonusDesc: '+3 Zone & +3 Soin escouade (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_worldwarrior', name: 'Tournoi World Warrior', icon: '🥋', cardIds: ['c088', 'c089', 'c090', 'c091', 'c092', 'c093'], bonusDesc: '+3 Physique & Feu (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_marines', name: 'Escadron Space Marines', icon: '💥', cardIds: ['c094', 'c095', 'c096', 'c097', 'c098', 'c099'], bonusDesc: '+3 Explosifs & Zone (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_arsenal', name: 'Arsenal Légendaire', icon: '⚔️', cardIds: ['c100', 'c101', 'c102', 'c103', 'c104', 'c105'], bonusDesc: '+3 Guerrier & Rôdeur (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_paladins', name: 'Ordre de la Lumière', icon: '🛡️', cardIds: ['c106', 'c107', 'c108', 'c109', 'c110', 'c111'], bonusDesc: '+4 Armure au début du combat (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_shadow', name: 'Guilde des Ombres', icon: '🗡️', cardIds: ['c112', 'c113', 'c114', 'c115', 'c116', 'c117'], bonusDesc: '+3 Puissance Poison (x2 en Doré)', rewardGold: 140 },
  { id: 'ms_secrets', name: 'Archives Secrètes', icon: '👑', cardIds: ['c151', 'c152', 'c153', 'c154', 'c155', 'c156'], bonusDesc: '+3 Puissance sur toutes les cartes (x2 en Doré)', rewardGold: 220 }
];

const RAW_CARDS = [
  ['c001', 'Boule de Feu Mario', 1, 'ATTACK', 9, 'SINGLE', 'FIRE', 'MAGE', 'NES', 0, 'Projette une flamme rebondissante du Royaume Champignon.'],
  ['c002', 'Épée de Légende Link', 2, 'ATTACK', 14, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 0, 'Rayon sacré d’Hyrule à pleine santé !'],
  ['c003', 'Spin Dash Sonic', 1, 'ATTACK', 9, 'SINGLE', 'LIGHTNING', 'NINJA', 'MD', 0, 'Accélération supersonique de Green Hill.'],
  ['c004', 'Super Missile Samus', 2, 'ATTACK', 13, 'ALL', 'FIRE', 'TECHNOMANCER', 'SNES', 0, 'Explosion plasma de la planète Zebes.'],
  ['c005', 'Mega Buster Chargé', 2, 'ATTACK', 14, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'NES', 0, 'Tir solaire calibré contre les robots de Wily.'],
  ['c006', 'Fouet Tueur de Vampires', 2, 'ATTACK', 13, 'SINGLE', 'HOLY', 'PALADIN', 'NES', 0, 'Frappe sacrée du clan Belmont.'],
  ['c007', 'Appel du Chocobo', 1, 'SUMMON', 6, 'SINGLE', 'PHYS', 'SUMMONER', 'SNES', 0, 'Invoque Chocobo Doré sur le terrain (3 tours).'],
  ['c008', 'Aspiration Étoile Kirby', 1, 'SKILL', 7, 'SELF', 'ARCANE', 'BARD', 'GB', 0, '+7 Armure & pioche 1 carte étoilée.'],
  ['c009', 'Lame Luminaire Crono', 3, 'ATTACK', 20, 'ALL', 'LIGHTNING', 'WARRIOR', 'SNES', 0, 'Jugement céleste de 1000 AD sur tous les ennemis !'],
  ['c010', 'Brasier Magitek Terra', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'MAGE', 'SNES', 0, 'Onde d’énergie Esper sur toute l’arène.'],
  ['c011', 'Frappe d’Épée Fer', 1, 'ATTACK', 8, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Taille nette d’acier trempé.'],
  ['c012', 'Bouclier de Bois', 1, 'SHIELD', 8, 'SELF', 'PHYS', 'PALADIN', null, 0, 'Confère +8 Armure protectrice.'],
  ['c013', 'Potion de Soin', 1, 'HEAL', 8, 'SELF', 'HOLY', 'ALL', null, 0, 'Restaure 8 PV à toute l’escouade.'],
  ['c014', 'Éclair Arcanique', 1, 'ATTACK', 8, 'SINGLE', 'LIGHTNING', 'MAGE', null, 0, 'Décharge électrique ciblée.'],
  ['c015', 'Flèche Sylvestre', 1, 'ATTACK', 8, 'SINGLE', 'PHYS', 'RANGER', null, 0, 'Tir précis depuis la ligne arrière.'],
  ['c016', 'Dague Empoisonnée', 1, 'ATTACK', 6, 'SINGLE', 'POISON', 'NINJA', null, 0, '6 dégâts + 4 Poison persistant.'],
  ['c017', 'Chant du Barde', 1, 'HEAL', 6, 'SELF', 'HOLY', 'BARD', null, 0, '+6 PV escouade & +3 Armure.'],
  ['c018', 'Posture Défensive', 0, 'SHIELD', 5, 'SELF', 'PHYS', 'ALL', null, 0, '+5 Armure rapide à 0 PA.'],
  ['c019', 'Œuf de Yoshi', 1, 'SUMMON', 7, 'SINGLE', 'PHYS', 'SUMMONER', 'SNES', 0, 'Invoque Yoshi Vert (3 tours).'],
  ['c020', 'Sifflet Chien Rush', 1, 'SUMMON', 7, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'NES', 0, 'Invoque Chien Rush (3 tours).'],
  ['c021', 'Éclat Fée Navi', 1, 'SUMMON', 5, 'SELF', 'HOLY', 'RANGER', 'N64', 0, 'Invoque Fée Navi (3 tours).'],
  ['c022', 'Pompon Mog Kupo', 1, 'SUMMON', 5, 'SINGLE', 'ARCANE', 'BARD', 'SNES', 0, 'Invoque Mog Kupo (3 tours).'],
  ['c023', 'Capsule Bébé Métroïde', 2, 'SUMMON', 8, 'SINGLE', 'ARCANE', 'TECHNOMANCER', 'SNES', 0, 'Invoque Bébé Métroïde (3 tours).'],
  ['c024', 'Queue Tornade Tails', 1, 'SUMMON', 6, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'MD', 0, 'Invoque Miles « Tails » (3 tours).'],
  ['c025', 'Rubis de Carbuncle', 1, 'SUMMON', 4, 'SELF', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Invoque Carbuncle Rubis (3 tours).'],
  ['c026', 'Coup de Bouclier', 1, 'ATTACK', 7, 'SINGLE', 'PHYS', 'PALADIN', null, 0, '7 dégâts & +4 Armure.'],
  ['c027', 'Javelot de Glace', 1, 'ATTACK', 8, 'SINGLE', 'ICE', 'MAGE', null, 0, 'Pointe givrée transperçante.'],
  ['c028', 'Parchemin de Hâte', 0, 'SKILL', 4, 'SELF', 'ARCANE', 'MAGE', null, 0, '+4 Armure & pioche 1 carte.'],
  ['c029', 'Entaille Tourbillon', 2, 'ATTACK', 11, 'ALL', 'PHYS', 'WARRIOR', null, 0, 'Frappe circulaire sur tous les ennemis.'],
  ['c030', 'Baume Régénérant', 1, 'HEAL', 9, 'SELF', 'HOLY', 'PALADIN', null, 0, 'Restaure 9 PV bénis.'],
  ['c031', 'Boomerang d’Hyrule', 1, 'ATTACK', 8, 'ALL', 'PHYS', 'RANGER', 'SNES', 0, 'Traverse toute la ligne ennemie.'],
  ['c032', 'Bouclier Hylien', 2, 'SHIELD', 14, 'SELF', 'HOLY', 'PALADIN', 'SNES', 0, '+14 Armure sacrée d’Hyrule.'],
  ['c033', 'Bombe Bleue Link', 1, 'ATTACK', 10, 'ALL', 'FIRE', 'RANGER', 'NES', 0, 'Déflagration sur tous les monstres.'],
  ['c034', 'Médaillon d’Éther', 2, 'ATTACK', 14, 'ALL', 'ICE', 'MAGE', 'SNES', 0, 'Tempête glaciale d’Hyrule.'],
  ['c035', 'Triforce du Courage', 2, 'HEAL', 13, 'SELF', 'HOLY', 'WARRIOR', 'SNES', 0, '+13 PV & +5 Armure sacrée.'],
  ['c036', 'Super Champignon', 1, 'HEAL', 10, 'SELF', 'HOLY', 'ALL', 'NES', 0, 'Double la vitalité (+10 PV).'],
  ['c037', 'Plume Cape Mario', 1, 'SHIELD', 10, 'SELF', 'PHYS', 'NINJA', 'SNES', 0, 'Esquive aérienne (+10 Armure).'],
  ['c038', 'Étoile Invincible', 2, 'ATTACK', 15, 'ALL', 'HOLY', 'ALL', 'NES', 0, 'Charge musicale lumineuse sur tous !'],
  ['c039', 'Marteau Frère Marto', 1, 'ATTACK', 9, 'SINGLE', 'PHYS', 'WARRIOR', 'NES', 0, 'Lancer parabolique percutant.'],
  ['c040', 'Fleur de Feu Dorée', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'MAGE', 'SNES', 0, 'Salve ardente sur l’arène.'],
  ['c041', 'Anneau Doré Sonic', 0, 'HEAL', 6, 'SELF', 'HOLY', 'ALL', 'MD', 0, '+6 PV instantanés à 0 PA.'],
  ['c042', 'Chaos Emerald Bleue', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'MAGE', 'MD', 0, 'Rayon d’énergie Chaos concentré.'],
  ['c043', 'Bouclier Bulle Sonic', 1, 'SHIELD', 10, 'SELF', 'ICE', 'TECHNOMANCER', 'MD', 0, '+10 Armure aquatique rebondissante.'],
  ['c044', 'Super Peel-Out CD', 1, 'SKILL', 7, 'SELF', 'LIGHTNING', 'NINJA', 'MD', 0, '+7 Armure & pioche 1 carte.'],
  ['c045', 'Super Sonic Doré', 3, 'ATTACK', 20, 'ALL', 'LIGHTNING', 'WARRIOR', 'MD', 0, 'Fureur dorée des 7 Émeraudes !'],
  ['c046', 'Boule Morphing', 1, 'SHIELD', 10, 'SELF', 'ARCANE', 'TECHNOMANCER', 'NES', 0, '+10 Armure & esquive compacte.'],
  ['c047', 'Rayon Gel Metroid', 1, 'ATTACK', 9, 'SINGLE', 'ICE', 'TECHNOMANCER', 'SNES', 0, 'Faisceau cryogénique de Chozo.'],
  ['c048', 'Bombe de Puissance', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'TECHNOMANCER', 'SNES', 0, 'Onde thermique totale de Zebes !'],
  ['c049', 'Attaque en Vrille', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'NINJA', 'SNES', 0, 'Saut électrique tournoyant.'],
  ['c050', 'Réserve Énergie Chozo', 2, 'HEAL', 14, 'SELF', 'HOLY', 'TECHNOMANCER', 'SNES', 0, 'Restaure 14 PV de combinaison.'],
  ['c051', 'Lame Métal Cutman', 1, 'ATTACK', 9, 'ALL', 'PHYS', 'NINJA', 'NES', 0, 'Ciseaux rotatifs tranchants.'],
  ['c052', 'Bouclier Feuille Wood', 1, 'SHIELD', 11, 'SELF', 'PHYS', 'PALADIN', 'NES', 0, 'Barrière de feuilles tournoyantes.'],
  ['c053', 'Canon Crash Bomber', 2, 'ATTACK', 14, 'SINGLE', 'FIRE', 'TECHNOMANCER', 'NES', 0, 'Mine à retardement explosive.'],
  ['c054', 'Réservoir E-Tank', 2, 'HEAL', 15, 'SELF', 'HOLY', 'ALL', 'NES', 0, 'Restaure 15 PV d’urgence !'],
  ['c055', 'Armure Rush Adaptor', 2, 'SHIELD', 15, 'SELF', 'LIGHTNING', 'TECHNOMANCER', 'NES', 0, '+15 Armure fusée cybernétique.'],
  ['c056', 'Eau Bénite Belmont', 1, 'ATTACK', 9, 'ALL', 'FIRE', 'PALADIN', 'NES', 0, 'Flammes bleues purificatrices.'],
  ['c057', 'Croix Boomerang', 2, 'ATTACK', 14, 'ALL', 'HOLY', 'PALADIN', 'SNES', 0, 'Aller-retour sacré sur tous !'],
  ['c058', 'Hache de Guerre Simon', 1, 'ATTACK', 10, 'SINGLE', 'PHYS', 'WARRIOR', 'NES', 0, 'Lancer en arc lourd.'],
  ['c059', 'Montre du Temps', 1, 'SHIELD', 10, 'SELF', 'ARCANE', 'MAGE', 'NES', 0, 'Ralentit l’ennemi (+10 Armure).'],
  ['c060', 'Grand Croix Céleste', 3, 'ATTACK', 20, 'ALL', 'HOLY', 'PALADIN', 'PCE', 0, 'Pilier de lumière divine absolu !'],
  ['c061', 'Épée Ultra Kirby', 2, 'ATTACK', 16, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 0, 'Lame géante étoilée !'],
  ['c062', 'Marteau Roi Dadidou', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'GB', 0, 'Impact massif du roi de Dream Land.'],
  ['c063', 'Maxi-Tomate Dorée', 1, 'HEAL', 12, 'SELF', 'HOLY', 'ALL', 'GB', 0, 'Restaure 12 PV instantanés !'],
  ['c064', 'Étoile Warp Express', 1, 'SKILL', 8, 'SELF', 'ARCANE', 'RANGER', 'SNES', 0, '+8 Armure & pioche 1 carte.'],
  ['c065', 'Lame Galaxia Meta Knight', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'NINJA', 'SNES', 0, 'Tornade d’épée ultra-rapide.'],
  ['c066', 'Invocation Bahamut', 3, 'ATTACK', 20, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Méga-Fission du Roi des Dragons !'],
  ['c067', 'Invocation Shiva', 2, 'ATTACK', 14, 'ALL', 'ICE', 'SUMMONER', 'SNES', 0, 'Poussière de Diamant glaciale.'],
  ['c068', 'Invocation Ifrit', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'SUMMONER', 'SNES', 0, 'Flammes de l’Enfer ardentes.'],
  ['c069', 'Soin Max Curaga', 2, 'HEAL', 15, 'SELF', 'HOLY', 'MAGE', 'SNES', 0, 'Lumière curative majeure (+15 PV).'],
  ['c070', 'Haoh Shokoken Ryo', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Vague d’énergie Kyokugen !'],
  ['c071', 'Heavy Machine Gun', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'TECHNOMANCER', 'ARC', 0, 'Rafale arcade Metal Slug !'],
  ['c072', 'Buster Wolf Terry', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Are you OK? Explosion d’énergie !'],
  ['c073', 'Sabre Haohmaru', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'ARC', 0, 'Entaille de samouraï Neo-Geo.'],
  ['c074', 'Ravitaillement Prisonnier', 1, 'HEAL', 10, 'SELF', 'HOLY', 'ALL', 'ARC', 0, 'Thank you! +10 PV & +3 Armure.'],
  ['c075', 'Flammes Kyo Kusanagi', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'MAGE', 'ARC', 0, '108 Shiki Yamibarai ardent !'],
  ['c076', 'Coup de Crâne Bonk', 1, 'ATTACK', 10, 'SINGLE', 'PHYS', 'WARRIOR', 'PCE', 0, 'Plongeon crânien préhistorique !'],
  ['c077', 'Laser Vic Viper', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'PCE', 0, 'Tir double Gradius en formation.'],
  ['c078', 'Hache Wonder Boy', 1, 'ATTACK', 9, 'SINGLE', 'PHYS', 'RANGER', 'PCE', 0, 'Lancer agile de Monster Land.'],
  ['c079', 'Feu de Bomberman', 2, 'ATTACK', 13, 'ALL', 'FIRE', 'TECHNOMANCER', 'PCE', 0, 'Explosion en croix sur tout le plateau.'],
  ['c080', 'Épée Zonk Cyber', 2, 'ATTACK', 14, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'PCE', 0, 'Frappe cosmique PC Engine.'],
  ['c081', 'Élixir Fruité Bonk', 1, 'HEAL', 11, 'SELF', 'HOLY', 'ALL', 'PCE', 0, 'Restaure 11 PV tropicaux.'],
  ['c082', 'Aria de Celes Chere', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', 'SNES', 0, 'Chant d’opéra (+14 PV & +5 Armure).'],
  ['c083', 'Lame Runique Celes', 2, 'SHIELD', 14, 'SELF', 'ARCANE', 'PALADIN', 'SNES', 0, 'Absorbe la magie (+14 Armure).'],
  ['c084', 'Suplex Train Fantôme', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Prise légendaire de Sabin Figaro !'],
  ['c085', 'Outil Auto-Arbalète', 1, 'ATTACK', 10, 'ALL', 'PHYS', 'TECHNOMANCER', 'SNES', 0, 'Salve mécanique d’Edgar Figaro.'],
  ['c086', 'Dés Pipés Setzer', 2, 'ATTACK', 14, 'ALL', 'ARCANE', 'BARD', 'SNES', 0, 'Lancer chanceux du Blackjack !'],
  ['c087', 'Ultima Magitek', 3, 'ATTACK', 21, 'ALL', 'ARCANE', 'MAGE', 'SNES', 0, 'Déflagration suprême 16-bits !'],
  ['c088', 'Hadoken Ryu', 1, 'ATTACK', 10, 'SINGLE', 'ARCANE', 'WARRIOR', 'ARC', 0, 'Vague d’énergie bleue classique !'],
  ['c089', 'Shoryuken Dragon', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Uppercut enflammé du dragon !'],
  ['c090', 'Sonic Boom Guile', 1, 'ATTACK', 9, 'SINGLE', 'LIGHTNING', 'RANGER', 'ARC', 0, 'Lame d’air tranchante.'],
  ['c091', 'Lightning Kick Chun-Li', 2, 'ATTACK', 14, 'SINGLE', 'PHYS', 'NINJA', 'ARC', 0, 'Cent coups de pied fulgurants !'],
  ['c092', 'Yoga Fire Dhalsim', 1, 'ATTACK', 9, 'ALL', 'FIRE', 'MAGE', 'ARC', 0, 'Souffle enflammé à longue portée.'],
  ['c093', 'Parry Arcade Daigo', 1, 'SHIELD', 12, 'SELF', 'PHYS', 'PALADIN', 'ARC', 0, 'Garde parfaite frame-exact (+12 Armure).'],
  ['c094', 'Lame Plasma Marine', 2, 'ATTACK', 14, 'SINGLE', 'FIRE', 'WARRIOR', 'MD', 0, 'Tronçonneuse énergétique ardente.'],
  ['c095', 'Lance-Flammes Lourd', 2, 'ATTACK', 13, 'ALL', 'FIRE', 'TECHNOMANCER', 'ARC', 0, 'Purge thermique de couloir.'],
  ['c096', 'Armure Céramite', 2, 'SHIELD', 14, 'SELF', 'PHYS', 'PALADIN', 'MD', 0, '+14 Armure blindée lourde.'],
  ['c097', 'Grenade Frag Arcade', 1, 'ATTACK', 10, 'ALL', 'FIRE', 'RANGER', 'ARC', 0, 'Explosion de shrapnels sur tous.'],
  ['c098', 'Tir Fusil Contra', 1, 'ATTACK', 10, 'ALL', 'FIRE', 'RANGER', 'NES', 0, 'Spread Gun légendaire en éventail !'],
  ['c099', 'Médipack Escouade', 1, 'HEAL', 11, 'SELF', 'HOLY', 'ALL', 'ARC', 0, '+11 PV & +3 Armure tactique.'],
  ['c100', 'Excalibur Royale', 2, 'ATTACK', 16, 'SINGLE', 'HOLY', 'WARRIOR', null, 0, 'Lame des rois de légende.'],
  ['c101', 'Arc d’Apollon', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'RANGER', null, 0, 'Flèche solaire infaillible.'],
  ['c102', 'Hache du Berserker', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Frappe brutale à deux mains.'],
  ['c103', 'Pluie de Flèches', 2, 'ATTACK', 13, 'ALL', 'PHYS', 'RANGER', null, 0, 'Volée sur tout le champ de bataille.'],
  ['c104', 'Lance Dragon', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'WARRIOR', null, 0, 'Saut de chevalier dragon.'],
  ['c105', 'Tir Critique Sniper', 1, 'ATTACK', 11, 'SINGLE', 'PHYS', 'RANGER', null, 0, 'Visée précise au point faible.'],
  ['c106', 'Égide Sacrée', 2, 'SHIELD', 15, 'SELF', 'HOLY', 'PALADIN', null, 0, '+15 Armure bénie des cieux.'],
  ['c107', 'Lumière Purificatrice', 2, 'HEAL', 14, 'SELF', 'HOLY', 'PALADIN', null, 0, '+14 PV & +4 Armure sacrée.'],
  ['c108', 'Marteau de Justice', 2, 'ATTACK', 14, 'SINGLE', 'HOLY', 'PALADIN', null, 0, 'Châtiment lumineux.'],
  ['c109', 'Aura de Dévotion', 1, 'SHIELD', 10, 'SELF', 'HOLY', 'PALADIN', null, 0, '+10 Armure pour toute l’équipe.'],
  ['c110', 'Intervention Divine', 3, 'HEAL', 18, 'SELF', 'HOLY', 'PALADIN', null, 0, '+18 PV & +8 Armure miraculeuse !'],
  ['c111', 'Bouclier Miroir', 1, 'SHIELD', 11, 'SELF', 'ARCANE', 'PALADIN', null, 0, '+11 Armure réfléchissante.'],
  ['c112', 'Lame de l’Ombre', 1, 'ATTACK', 9, 'SINGLE', 'POISON', 'NINJA', null, 0, '9 dégâts + 5 Poison mortel.'],
  ['c113', 'Bombe Fumigène', 1, 'SHIELD', 10, 'SELF', 'PHYS', 'NINJA', null, 0, '+10 Armure & pioche 1 carte.'],
  ['c114', 'Pluie de Kunais', 2, 'ATTACK', 12, 'ALL', 'POISON', 'NINJA', null, 0, '12 dégâts + 4 Poison à tous.'],
  ['c115', 'Venin de Basilic', 2, 'ATTACK', 11, 'SINGLE', 'POISON', 'NINJA', null, 0, '11 dégâts + 8 Poison corrosif.'],
  ['c116', 'Assaut Furtif', 0, 'ATTACK', 6, 'SINGLE', 'PHYS', 'NINJA', null, 0, 'Frappe rapide gratuite (0 PA).'],
  ['c117', 'Manteau de Nuit', 1, 'SHIELD', 11, 'SELF', 'ARCANE', 'NINJA', null, 0, '+11 Armure furtive.'],
  ['c118', 'Météore Arcanique', 3, 'ATTACK', 19, 'ALL', 'ARCANE', 'MAGE', null, 0, 'Chute de météores sur tous !'],
  ['c119', 'Blizzard Absolu', 2, 'ATTACK', 13, 'ALL', 'ICE', 'MAGE', null, 0, 'Vague de froid glaciale.'],
  ['c120', 'Chaîne d’Éclairs', 2, 'ATTACK', 13, 'ALL', 'LIGHTNING', 'MAGE', null, 0, 'Arcs électriques rebondissants.'],
  ['c121', 'Colonne de Feu', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'MAGE', null, 0, 'Geyser incandescent ciblé.'],
  ['c122', 'Barrière de Mana', 1, 'SHIELD', 11, 'SELF', 'ARCANE', 'MAGE', null, 0, '+11 Armure magique.'],
  ['c123', 'Méditation Profonde', 0, 'SKILL', 5, 'SELF', 'ARCANE', 'MAGE', null, 0, '+5 Armure & pioche 1 carte (0 PA).'],
  ['c124', 'Hymne de Bravoure', 1, 'SKILL', 7, 'SELF', 'HOLY', 'BARD', null, 0, '+7 Armure & pioche 1 carte.'],
  ['c125', 'Sérénade Lunaire', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', null, 0, '+14 PV apaisants.'],
  ['c126', 'Accord Dissonant', 1, 'ATTACK', 9, 'ALL', 'ARCANE', 'BARD', null, 0, 'Onde sonore perçante sur tous.'],
  ['c127', 'Ballade Héroïque', 2, 'HEAL', 12, 'SELF', 'HOLY', 'BARD', null, 0, '+12 PV & +6 Armure escouade.'],
  ['c128', 'Tourelle Auto-Défense', 1, 'SHIELD', 11, 'SELF', 'LIGHTNING', 'TECHNOMANCER', null, 0, '+11 Armure & couvre l’escouade.'],
  ['c129', 'Rayon Tesla', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', null, 0, 'Décharge haute tension.'],
  ['c130', 'Nano-Réparation', 1, 'HEAL', 10, 'SELF', 'HOLY', 'TECHNOMANCER', null, 0, '+10 PV & +3 Armure.'],
  ['c131', 'Pacte Élémentaire', 2, 'ATTACK', 14, 'ALL', 'ARCANE', 'SUMMONER', null, 0, 'Déferlante des esprits.'],
  ['c132', 'Lien Spirituel', 1, 'HEAL', 10, 'SELF', 'HOLY', 'SUMMONER', null, 0, '+10 PV partagés.'],
  ['c133', 'Bouclier Astral', 1, 'SHIELD', 11, 'SELF', 'ARCANE', 'SUMMONER', null, 0, '+11 Armure éthérée.'],
  ['c134', 'Frappe Vétéran', 1, 'ATTACK', 9, 'SINGLE', 'PHYS', 'ALL', null, 0, 'Attaque fiable éprouvée.'],
  ['c135', 'Second Souffle', 1, 'HEAL', 9, 'SELF', 'HOLY', 'ALL', null, 0, '+9 PV récupérés.'],
  ['c136', 'Mur de Boucliers', 2, 'SHIELD', 14, 'SELF', 'PHYS', 'ALL', null, 0, '+14 Armure collective.'],
  ['c137', 'Coup d’Éclat', 0, 'ATTACK', 6, 'SINGLE', 'HOLY', 'ALL', null, 0, 'Frappe lumineuse gratuite (0 PA).'],
  ['c138', 'Tactique de Flanc', 1, 'SKILL', 7, 'SELF', 'PHYS', 'ALL', null, 0, '+7 Armure & pioche 1 carte.'],
  ['c139', 'Explosion Arcanique', 2, 'ATTACK', 13, 'ALL', 'ARCANE', 'ALL', null, 0, 'Onde magique sur tous.'],
  ['c140', 'Élixir de Vie', 2, 'HEAL', 14, 'SELF', 'HOLY', 'ALL', null, 0, 'Restaure 14 PV à l’escouade.'],
  ['c141', 'Tonneau Donkey Kong', 1, 'ATTACK', 10, 'ALL', 'PHYS', 'WARRIOR', 'SNES', 0, 'Tonneau roulant écrasant tous !'],
  ['c142', 'Jetpack Diddy Kong', 1, 'ATTACK', 9, 'SINGLE', 'FIRE', 'RANGER', 'SNES', 0, 'Tir cacahuète aérien !'],
  ['c143', 'Pinceau Mickey Mania', 1, 'SKILL', 8, 'SELF', 'ARCANE', 'MAGE', 'MD', 0, '+8 Armure & pioche 1 carte enchantée.'],
  ['c144', 'Poing Géant Alex Kidd', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'SMS', 0, 'Janken Punch dévastateur !'],
  ['c145', 'Arwing Laser Fox', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Do a barrel roll! Salve laser.'],
  ['c146', 'Lance Dorée Sir Arthur', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'PALADIN', 'SNES', 0, 'Lancer héroïque de Ghosts’n Goblins.'],
  ['c147', 'Fouet Plasma Earthworm', 2, 'ATTACK', 14, 'SINGLE', 'LIGHTNING', 'RANGER', 'MD', 0, 'Groovy! Fouet cyber-lombric.'],
  ['c148', 'Shuriken Joe Musashi', 1, 'ATTACK', 10, 'ALL', 'PHYS', 'NINJA', 'MD', 0, 'Pluie d’étoiles Shinobi III.'],
  ['c149', 'Arc Palutena Pit', 2, 'ATTACK', 14, 'SINGLE', 'HOLY', 'RANGER', 'NES', 0, 'Flèche céleste d’Angel Land.'],
  ['c150', 'Aile de Phénix', 2, 'HEAL', 15, 'SELF', 'FIRE', 'ALL', 'SNES', 0, 'Flamme renaissante (+15 PV).'],
  ['c151', 'Master Sword Dorée 24K', 2, 'ATTACK', 24, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 1, 'Lame légendaire purificatrice absolue !'],
  ['c152', 'Baguette Étoile Kirby 24K', 2, 'ATTACK', 23, 'ALL', 'ARCANE', 'MAGE', 'NES', 1, 'Pluie d’étoiles cosmiques sur tous !'],
  ['c153', 'Canon Varia Samus 24K', 3, 'ATTACK', 27, 'ALL', 'FIRE', 'TECHNOMANCER', 'SNES', 1, 'Hyper-Rayon arc-en-ciel de Zebes !'],
  ['c154', 'Chaos Control Ultime 24K', 2, 'ATTACK', 24, 'ALL', 'LIGHTNING', 'NINJA', 'MD', 1, 'Distorsion temporelle des Émeraudes !'],
  ['c155', 'Z-Saber X & Zero 24K', 2, 'ATTACK', 25, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 1, 'Double entaille Maverick légendaire !'],
  ['c156', 'Épée Masamune 16-Bits 24K', 3, 'ATTACK', 28, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 1, 'Tranchant absolu des anciens !'],
  ['c157', 'Sceptre de Zeal 24K', 2, 'HEAL', 22, 'SELF', 'HOLY', 'MAGE', 'SNES', 1, '+22 PV & +10 Armure céleste !'],
  ['c158', 'Bouclier d’Or Belmont 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+22 Armure sacrée indestructible !'],
  ['c159', 'Symbiose Esper 24K', 3, 'ATTACK', 26, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 1, 'Cataclysme magique des Espers !'],
  ['c160', 'Couronne 16-Bits 24K', 3, 'ATTACK', 29, 'SINGLE', 'HOLY', 'ALL', 'SNES', 1, 'Relique suprême des 160 premières cartes !'],
  ['c161', 'Flamme Bleue Hadoken', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Shakunetsu Hadoken ardent !'],
  ['c162', 'Kamehameha 16-Bits', 3, 'ATTACK', 20, 'ALL', 'LIGHTNING', 'MAGE', 'SNES', 0, 'Vague déferlante Super Butoden !'],
  ['c163', 'Fouet Alucard', 2, 'ATTACK', 14, 'SINGLE', 'ARCANE', 'PALADIN', 'SNES', 0, 'Frappe vampirique noble.'],
  ['c164', 'Écu du Dragon', 2, 'SHIELD', 15, 'SELF', 'FIRE', 'PALADIN', null, 0, '+15 Armure d’écailles ignées.'],
  ['c165', 'Tempête de Sable', 2, 'ATTACK', 12, 'ALL', 'PHYS', 'RANGER', null, 0, '12 dégâts + aveugle les ennemis.'],
  ['c166', 'Chant des Sirènes', 2, 'HEAL', 13, 'SELF', 'ICE', 'BARD', null, 0, '+13 PV & +4 Armure marine.'],
  ['c167', 'Poing Métal Golem', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Impact sismique lourd.'],
  ['c168', 'Dard Venimeux', 1, 'ATTACK', 7, 'SINGLE', 'POISON', 'RANGER', null, 0, '7 dégâts + 5 Poison rapide.'],
  ['c169', 'Éclair de Génie', 0, 'SKILL', 5, 'SELF', 'LIGHTNING', 'TECHNOMANCER', null, 0, '+5 Armure & pioche 1 carte (0 PA).'],
  ['c170', 'Rayon Solaire', 2, 'ATTACK', 15, 'ALL', 'HOLY', 'MAGE', null, 0, 'Lumière ardente sur tout l’écran.'],
  ['c171', 'Carapace Verte Koopa', 1, 'ATTACK', 9, 'SINGLE', 'PHYS', 'ALL', 'SNES', 0, 'Rebond rapide sur la cible.'],
  ['c172', 'Carapace Bleue Ailée', 3, 'ATTACK', 20, 'SINGLE', 'LIGHTNING', 'RANGER', 'N64', 0, 'Traque implacable du leader !'],
  ['c173', 'Ocarina des Tempêtes', 2, 'ATTACK', 13, 'ALL', 'LIGHTNING', 'BARD', 'N64', 0, 'Orage mélodique d’Hyrule.'],
  ['c174', 'Botte Pégase Link', 0, 'SKILL', 6, 'SELF', 'PHYS', 'WARRIOR', 'SNES', 0, 'Charge éclair (+6 Armure & pioche).'],
  ['c175', 'Tornade Tails', 1, 'ATTACK', 9, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'MD', 0, 'Tourbillon aérien sur tous.'],
  ['c176', 'Poing Météore Knuckles', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'MD', 0, 'Uppercut volcanique d’Angel Island.'],
  ['c177', 'X-Buster Plasma', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Tir chargé rose de Mega Man X.'],
  ['c178', 'Sabre Zéro Écarlate', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'NINJA', 'SNES', 0, 'Combo triple Ryuenjin !'],
  ['c179', 'Invocation Valefor', 2, 'ATTACK', 14, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Souffle ailé céleste.'],
  ['c180', 'Élixir Mégalixir', 3, 'HEAL', 20, 'SELF', 'HOLY', 'ALL', 'SNES', 0, 'Soin intégral (+20 PV escouade) !'],
  ['c181', 'Griffe de Tigre', 1, 'ATTACK', 9, 'SINGLE', 'PHYS', 'NINJA', null, 0, 'Lacération éclair.'],
  ['c182', 'Bouclier de Givre', 1, 'SHIELD', 11, 'SELF', 'ICE', 'MAGE', null, 0, '+11 Armure cristalline.'],
  ['c183', 'Salve de Mortier', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'TECHNOMANCER', null, 0, 'Bombardement de zone.'],
  ['c184', 'Prière de l’Aube', 1, 'HEAL', 10, 'SELF', 'HOLY', 'PALADIN', null, 0, '+10 PV matinaux.'],
  ['c185', 'Lame Runique', 2, 'ATTACK', 15, 'SINGLE', 'ARCANE', 'WARRIOR', null, 0, 'Acier gravé de runes anciennes.'],
  ['c186', 'Piège à Pointes', 1, 'ATTACK', 8, 'ALL', 'POISON', 'RANGER', null, 0, '8 dégâts + 3 Poison à tous.'],
  ['c187', 'Mur d’Énergie', 2, 'SHIELD', 15, 'SELF', 'LIGHTNING', 'TECHNOMANCER', null, 0, '+15 Armure magnétique.'],
  ['c188', 'Symphonie Étoilée', 2, 'HEAL', 14, 'SELF', 'ARCANE', 'BARD', null, 0, '+14 PV & +4 Armure.'],
  ['c189', 'Fureur Élémentaire', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'MAGE', null, 0, 'Cataclysme de feu et d’éclairs.'],
  ['c190', 'Garde Royale', 1, 'SHIELD', 11, 'SELF', 'PHYS', 'WARRIOR', null, 0, '+11 Armure disciplinée.'],
  ['c191', 'Lance-Roquettes Slug', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'TECHNOMANCER', 'ARC', 0, 'Rocket Launcher! Impact massif.'],
  ['c192', 'Épée Dragon Ryu Hayabusa', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'NINJA', 'NES', 0, 'Art du feu ninja légendaire !'],
  ['c193', 'Marteau Thor Golden Axe', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'WARRIOR', 'MD', 0, 'Foudre des dieux sur tout l’écran.'],
  ['c194', 'Baguette Glace Zelda', 2, 'ATTACK', 14, 'ALL', 'ICE', 'MAGE', 'SNES', 0, 'Gèle toute la salle !'],
  ['c195', 'Soin Féérique Grand', 2, 'HEAL', 15, 'SELF', 'HOLY', 'RANGER', 'SNES', 0, '+15 PV bénis des fées.'],
  ['c196', 'Épée Ultima FFVI 24K', 3, 'ATTACK', 27, 'SINGLE', 'ARCANE', 'WARRIOR', 'SNES', 1, 'Lame bleue brillante de puissance pure !'],
  ['c197', 'Canon Hyper Metroid 24K', 3, 'ATTACK', 26, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 1, 'Faisceau arc-en-ciel destructeur !'],
  ['c198', 'Égide d’Athena 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'ARC', 1, '+22 Armure divine réfléchissante !'],
  ['c199', 'Larme de Phénix 24K', 2, 'HEAL', 23, 'SELF', 'FIRE', 'ALL', 'SNES', 1, '+23 PV & +10 Armure ardente !'],
  ['c200', 'Trophée Bicentenaire 24K', 3, 'ATTACK', 28, 'ALL', 'HOLY', 'ALL', 'SNES', 1, 'Carte Secrète #200 légendaire !'],
  ['c201', 'Coup de Pied Tornado', 1, 'ATTACK', 9, 'ALL', 'PHYS', 'NINJA', null, 0, 'Balayage circulaire rapide.'],
  ['c202', 'Bouclier Runique', 2, 'SHIELD', 14, 'SELF', 'ARCANE', 'PALADIN', null, 0, '+14 Armure runique.'],
  ['c203', 'Flèche Explosive', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'RANGER', null, 0, 'Détonation à l’impact.'],
  ['c204', 'Source de Jouvence', 2, 'HEAL', 14, 'SELF', 'HOLY', 'ALL', null, 0, '+14 PV cristallins.'],
  ['c205', 'Épée de Givrefeu', 2, 'ATTACK', 15, 'SINGLE', 'ICE', 'WARRIOR', null, 0, 'Lame glaciale tranchante.'],
  ['c206', 'Nuée de Frelons', 1, 'ATTACK', 7, 'ALL', 'POISON', 'RANGER', null, 0, '7 dégâts + 4 Poison à tous.'],
  ['c207', 'Condensateur Électrique', 1, 'SKILL', 8, 'SELF', 'LIGHTNING', 'TECHNOMANCER', null, 0, '+8 Armure & pioche 1 carte.'],
  ['c208', 'Mélodie de Victoire', 1, 'HEAL', 10, 'SELF', 'HOLY', 'BARD', null, 0, '+10 PV fanfare 16-bits !'],
  ['c209', 'Invocation Ramuh', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'SUMMONER', 'SNES', 0, 'Jugement de foudre du patriarche.'],
  ['c210', 'Forteresse de Pierre', 2, 'SHIELD', 15, 'SELF', 'PHYS', 'PALADIN', null, 0, '+15 Armure monolithique.'],
  ['c211', 'Poing Dragon Ken', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Shoryuken enflammé !'],
  ['c212', 'Anneau Étoile Kirby', 1, 'ATTACK', 10, 'SINGLE', 'ARCANE', 'BARD', 'GB', 0, 'Projectile étoilé rapide.'],
  ['c213', 'Missile Diffusion Samus', 2, 'ATTACK', 14, 'ALL', 'ICE', 'TECHNOMANCER', 'SNES', 0, 'Explosion glaciale de zone.'],
  ['c214', 'Épée Kokiri Link', 1, 'ATTACK', 9, 'SINGLE', 'PHYS', 'WARRIOR', 'N64', 0, 'Lame courageuse de la forêt.'],
  ['c215', 'Chaîne Sonic Spin', 1, 'ATTACK', 10, 'SINGLE', 'LIGHTNING', 'NINJA', 'MD', 0, 'Enchaînement ultra-rapide.'],
  ['c216', 'Sabre Laser Zero', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'NINJA', 'SNES', 0, 'Coupe énergétique nette.'],
  ['c217', 'Marteau Forgeron', 1, 'SHIELD', 10, 'SELF', 'FIRE', 'WARRIOR', null, 0, 'Renforce l’équipement (+10 Armure).'],
  ['c218', 'Vague de Soin', 2, 'HEAL', 13, 'SELF', 'HOLY', 'MAGE', null, 0, '+13 PV lumineux.'],
  ['c219', 'Orbe du Chaos', 2, 'ATTACK', 15, 'SINGLE', 'ARCANE', 'MAGE', null, 0, 'Sphère d’énergie instable.'],
  ['c220', 'Garde Impériale', 2, 'SHIELD', 14, 'SELF', 'PHYS', 'PALADIN', null, 0, '+14 Armure d’élite.'],
  ['c221', 'Lame Vampirique', 2, 'ATTACK', 13, 'SINGLE', 'POISON', 'NINJA', null, 0, '13 dégâts + 4 Poison drainant.'],
  ['c222', 'Tir de Barrage', 2, 'ATTACK', 13, 'ALL', 'PHYS', 'RANGER', null, 0, 'Pluie de traits sur tous.'],
  ['c223', 'Armure Titan', 3, 'SHIELD', 20, 'SELF', 'PHYS', 'PALADIN', null, 0, '+20 Armure colossale !'],
  ['c224', 'Nova Solaire', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'MAGE', null, 0, 'Explosion stellaire ardente !'],
  ['c225', 'Soin Céleste', 2, 'HEAL', 15, 'SELF', 'HOLY', 'PALADIN', null, 0, '+15 PV divins.'],
  ['c226', 'Impulsion IEM', 2, 'ATTACK', 13, 'ALL', 'LIGHTNING', 'TECHNOMANCER', null, 0, 'Décharge magnétique sur tous.'],
  ['c227', 'Danse des Lames', 1, 'ATTACK', 10, 'SINGLE', 'PHYS', 'NINJA', null, 0, 'Enchaînement agile.'],
  ['c228', 'Chant d’Espoir', 1, 'HEAL', 10, 'SELF', 'HOLY', 'BARD', null, 0, '+10 PV & +3 Armure.'],
  ['c229', 'Esprit de la Forêt', 2, 'HEAL', 14, 'SELF', 'HOLY', 'SUMMONER', null, 0, '+14 PV naturels.'],
  ['c230', 'Frappe Tonnerre', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'WARRIOR', null, 0, 'Lame chargée d’éclairs.'],
  ['c231', 'Tonneau TNT Donkey', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'WARRIOR', 'SNES', 0, 'Explosion massive de la jungle !'],
  ['c232', 'Rayon Plasma Samus', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'TECHNOMANCER', 'SNES', 0, 'Perce les blindages ennemis.'],
  ['c233', 'Flèche de Feu Hyrule', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'RANGER', 'N64', 0, 'Trait enflammé sacré.'],
  ['c234', 'Émeraude Verte Chaos', 1, 'SKILL', 8, 'SELF', 'LIGHTNING', 'ALL', 'MD', 0, '+8 Armure & pioche 1 carte.'],
  ['c235', 'Mega Ball Rebonds', 1, 'ATTACK', 10, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'NES', 0, 'Sphère énergétique bondissante.'],
  ['c236', 'Lame Excalibur II 24K', 3, 'ATTACK', 27, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 1, 'Épée légendaire du speedrun ultime !'],
  ['c237', 'Surcharge Chaos 24K', 3, 'ATTACK', 26, 'ALL', 'LIGHTNING', 'MAGE', 'MD', 1, 'Tempête d’émeraudes dorées !'],
  ['c238', 'Bastion Divin 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+22 Armure d’or pur !'],
  ['c239', 'Nectar des Dieux 24K', 2, 'HEAL', 22, 'SELF', 'HOLY', 'ALL', 'SNES', 1, '+22 PV & +10 Armure !'],
  ['c240', 'Relique Éternelle 24K', 3, 'ATTACK', 28, 'SINGLE', 'ARCANE', 'ALL', 'SNES', 1, 'Carte Secrète #240 mythique !'],
  ['c241', 'Frappe Foudroyante', 1, 'ATTACK', 9, 'SINGLE', 'LIGHTNING', 'WARRIOR', null, 0, 'Coup d’épée électrifié.'],
  ['c242', 'Garde de Fer', 1, 'SHIELD', 10, 'SELF', 'PHYS', 'PALADIN', null, 0, '+10 Armure solide.'],
  ['c243', 'Flèche de Glace', 1, 'ATTACK', 9, 'SINGLE', 'ICE', 'RANGER', null, 0, 'Trait givré précis.'],
  ['c244', 'Baume Sylvestre', 1, 'HEAL', 10, 'SELF', 'HOLY', 'RANGER', null, 0, '+10 PV régénérants.'],
  ['c245', 'Boule de Magma', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'MAGE', null, 0, 'Projectile volcanique.'],
  ['c246', 'Poison Mortel', 2, 'ATTACK', 10, 'SINGLE', 'POISON', 'NINJA', null, 0, '10 dégâts + 8 Poison.'],
  ['c247', 'Champ de Force', 2, 'SHIELD', 15, 'SELF', 'ARCANE', 'TECHNOMANCER', null, 0, '+15 Armure énergétique.'],
  ['c248', 'Hymne de Gloire', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', null, 0, '+14 PV & +5 Armure.'],
  ['c249', 'Invocation Titan', 2, 'ATTACK', 14, 'ALL', 'PHYS', 'SUMMONER', 'SNES', 0, 'Fureur tellurique sur tous !'],
  ['c250', 'Coup Critique', 1, 'ATTACK', 11, 'SINGLE', 'PHYS', 'ALL', null, 0, 'Frappe précise puissante.'],
  ['c251', 'Triple Slash Cloud', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Trois coups d’épée broyeuse !'],
  ['c252', 'Foudre X Crono', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'MAGE', 'SNES', 0, 'Orage temporel de 1000 AD.'],
  ['c253', 'Marteau Ultra Mario', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Super Mario RPG Timed Hit !'],
  ['c254', 'Rayon Annihilateur', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'TECHNOMANCER', 'SNES', 0, 'Déflagration totale.'],
  ['c255', 'Bouclier Étoile', 1, 'SHIELD', 11, 'SELF', 'HOLY', 'ALL', 'GB', 0, '+11 Armure étoilée.'],
  ['c256', 'Lame de Vent', 1, 'ATTACK', 9, 'ALL', 'PHYS', 'NINJA', null, 0, 'Rafale tranchante sur tous.'],
  ['c257', 'Soin Sacré Majeur', 2, 'HEAL', 15, 'SELF', 'HOLY', 'PALADIN', null, 0, '+15 PV bénis.'],
  ['c258', 'Éclat de Cristal', 1, 'SKILL', 8, 'SELF', 'ARCANE', 'MAGE', null, 0, '+8 Armure & pioche 1 carte.'],
  ['c259', 'Charge Héroïque', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Percée blindée.'],
  ['c260', 'Aura Protectrice', 2, 'SHIELD', 14, 'SELF', 'HOLY', 'PALADIN', null, 0, '+14 Armure de groupe.'],
  ['c261', 'Tir Sniper Plasma', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'RANGER', null, 0, 'Rayon perforant longue portée.'],
  ['c262', 'Brume Toxique', 2, 'ATTACK', 10, 'ALL', 'POISON', 'NINJA', null, 0, '10 dégâts + 6 Poison à tous.'],
  ['c263', 'Overdrive Mécanique', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'TECHNOMANCER', null, 0, 'Surchauffe contrôlée.'],
  ['c264', 'Rhapsodie Céleste', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', null, 0, '+14 PV mélodiques.'],
  ['c265', 'Fureur de Léviathan', 2, 'ATTACK', 14, 'ALL', 'ICE', 'SUMMONER', 'SNES', 0, 'Raz-de-marée colossal.'],
  ['c266', 'Estocade Éclair', 0, 'ATTACK', 6, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Coup rapide à 0 PA.'],
  ['c267', 'Rempart d’Acier', 2, 'SHIELD', 15, 'SELF', 'PHYS', 'PALADIN', null, 0, '+15 Armure impénétrable.'],
  ['c268', 'Comète Glacée', 2, 'ATTACK', 15, 'SINGLE', 'ICE', 'MAGE', null, 0, 'Bloc astral gelé.'],
  ['c269', 'Flèche Lumineuse', 1, 'ATTACK', 9, 'SINGLE', 'HOLY', 'RANGER', null, 0, 'Trait sacré rapide.'],
  ['c270', 'Élixir Pur', 1, 'HEAL', 11, 'SELF', 'HOLY', 'ALL', null, 0, '+11 PV revitalisants.'],
  ['c271', 'Sabre Dragon Ryu', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Flamme du dragon combattant.'],
  ['c272', 'Fouet Sacré Richter', 2, 'ATTACK', 14, 'ALL', 'HOLY', 'PALADIN', 'PCE', 0, 'Item Crash lumineux !'],
  ['c273', 'Spin Tornado Sonic', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'NINJA', 'MD', 0, 'Vitesse suprême sur tous.'],
  ['c274', 'Bombe Méga Bomberman', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'TECHNOMANCER', 'PCE', 0, 'Explosion géante !'],
  ['c275', 'Arc des Cieux Pit', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'RANGER', 'NES', 0, 'Flèche divine d’Icarus.'],
  ['c276', 'Lame Ragnarok 24K', 3, 'ATTACK', 27, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 1, 'Épée mythique des dieux 16-bits !'],
  ['c277', 'Jugement Dernier 24K', 3, 'ATTACK', 26, 'ALL', 'ARCANE', 'MAGE', 'SNES', 1, 'Apocalypse arcanique dorée !'],
  ['c278', 'Forteresse Or 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+22 Armure royale !'],
  ['c279', 'Grâce Divine 24K', 2, 'HEAL', 23, 'SELF', 'HOLY', 'ALL', 'SNES', 1, '+23 PV & +10 Armure !'],
  ['c280', 'Couronne 280 24K', 3, 'ATTACK', 28, 'SINGLE', 'HOLY', 'ALL', 'SNES', 1, 'Carte Secrète #280 absolue !'],
  ['c281', 'Gantelet d’Or Arcade', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'ARC', 0, 'Frappe légendaire de Gauntlet !'],
  ['c282', 'Lame Dragon Hayabusa', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'NINJA', 'NES', 0, 'Art secret du clan Dragon.'],
  ['c283', 'Rayon Hyper Metroid', 3, 'ATTACK', 20, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Faisceau arc-en-ciel de Mother Brain !'],
  ['c284', 'Knights of the Round', 3, 'ATTACK', 21, 'ALL', 'HOLY', 'SUMMONER', 'SNES', 0, 'Les 13 chevaliers légendaires !'],
  ['c285', 'Bouclier Miroir Hyrule', 2, 'SHIELD', 15, 'SELF', 'HOLY', 'PALADIN', 'SNES', 0, '+15 Armure réfléchissante.'],
  ['c286', 'Feu Follet Magitek', 1, 'ATTACK', 9, 'ALL', 'FIRE', 'MAGE', 'SNES', 0, 'Flammes dansantes sur tous.'],
  ['c287', 'Flèche Étoile Kirby', 1, 'ATTACK', 10, 'SINGLE', 'ARCANE', 'RANGER', 'SNES', 0, 'Tir étoilé précis.'],
  ['c288', 'Chant de Zeal', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', 'SNES', 0, '+14 PV & +4 Armure céleste.'],
  ['c289', 'Poing Sonic Boom', 1, 'ATTACK', 10, 'SINGLE', 'LIGHTNING', 'WARRIOR', 'ARC', 0, 'Onde de choc tranchante.'],
  ['c290', 'Venin d’Hydre', 2, 'ATTACK', 11, 'SINGLE', 'POISON', 'NINJA', null, 0, '11 dégâts + 7 Poison.'],
  ['c291', 'Rempart Glaciaire', 2, 'SHIELD', 15, 'SELF', 'ICE', 'MAGE', null, 0, '+15 Armure de givre.'],
  ['c292', 'Salve Orbital', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'TECHNOMANCER', null, 0, 'Frappe satellite ciblée.'],
  ['c293', 'Soin Lumière', 1, 'HEAL', 11, 'SELF', 'HOLY', 'PALADIN', null, 0, '+11 PV purs.'],
  ['c294', 'Estocade Critique', 1, 'ATTACK', 10, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Frappe rapide précise.'],
  ['c295', 'Souffle de Bahamut', 2, 'ATTACK', 15, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Explosion draconique.'],
  ['c296', 'Culex Cristal 24K', 3, 'ATTACK', 27, 'ALL', 'ARCANE', 'MAGE', 'SNES', 1, 'Maître secret des 4 cristaux !'],
  ['c297', 'Lame Alucard 24K', 2, 'ATTACK', 25, 'SINGLE', 'HOLY', 'PALADIN', 'SNES', 1, 'Épée héritière de Castlevania !'],
  ['c298', 'Égide Chronos 24K', 2, 'SHIELD', 22, 'SELF', 'ARCANE', 'PALADIN', 'SNES', 1, '+22 Armure temporelle !'],
  ['c299', 'Élixir Mana 24K', 2, 'HEAL', 23, 'SELF', 'HOLY', 'ALL', 'SNES', 1, '+23 PV & +10 Armure !'],
  ['c300', 'Trophée 300 24K', 3, 'ATTACK', 29, 'ALL', 'HOLY', 'ALL', 'SNES', 1, 'Carte Secrète #300 suprême !'],
  ['c301', 'Braver Cloud Strife', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Saut vertical fendant l’ennemi !'],
  ['c302', 'Loups d’Alucard', 2, 'ATTACK', 14, 'ALL', 'ARCANE', 'NINJA', 'SNES', 0, 'Charge spectrale de Symphonie.'],
  ['c303', 'Kikoken Chun-Li', 1, 'ATTACK', 10, 'SINGLE', 'ARCANE', 'MAGE', 'ARC', 0, 'Sphère d’énergie concentrée.'],
  ['c304', 'Ryuenjin Zero', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'SNES', 0, 'Sabre ascendant enflammé !'],
  ['c305', 'Croix de Lumière Zelda', 2, 'HEAL', 14, 'SELF', 'HOLY', 'PALADIN', 'SNES', 0, '+14 PV & +5 Armure d’Hyrule.'],
  ['c306', 'Émeraude Maîtresse', 2, 'SHIELD', 16, 'SELF', 'LIGHTNING', 'ALL', 'MD', 0, '+16 Armure d’Angel Island !'],
  ['c307', 'Masamune de Frog', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 0, 'Fend la montagne en deux !'],
  ['c308', 'Fureur d’Ayla 65M BC', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Triple Kick préhistorique !'],
  ['c309', 'Canon Nova Fox', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'TECHNOMANCER', 'SNES', 0, 'Tir chargé de l’Arwing.'],
  ['c310', 'Danse Mog Kupo', 1, 'HEAL', 11, 'SELF', 'HOLY', 'BARD', 'SNES', 0, '+11 PV & joie 16-bits !'],
  ['c311', 'Lame Glaciale', 1, 'ATTACK', 9, 'SINGLE', 'ICE', 'WARRIOR', null, 0, 'Coup d’épée gelé.'],
  ['c312', 'Bouclier Tempête', 2, 'SHIELD', 14, 'SELF', 'LIGHTNING', 'PALADIN', null, 0, '+14 Armure électrique.'],
  ['c313', 'Flèche Venimeuse', 1, 'ATTACK', 7, 'SINGLE', 'POISON', 'RANGER', null, 0, '7 dégâts + 5 Poison.'],
  ['c314', 'Chant Éthéré', 2, 'HEAL', 14, 'SELF', 'ARCANE', 'BARD', null, 0, '+14 PV & +4 Armure.'],
  ['c315', 'Explosion Solaire', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'MAGE', null, 0, 'Vague ardente sur tous.'],
  ['c316', 'Assaut Éclair', 0, 'ATTACK', 6, 'SINGLE', 'LIGHTNING', 'NINJA', null, 0, 'Frappe gratuite à 0 PA.'],
  ['c317', 'Barrière Cristalline', 2, 'SHIELD', 15, 'SELF', 'ICE', 'MAGE', null, 0, '+15 Armure de cristal.'],
  ['c318', 'Tir Perforant', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'RANGER', null, 0, 'Flèche haute vélocité.'],
  ['c319', 'Bénédiction Royale', 2, 'HEAL', 15, 'SELF', 'HOLY', 'PALADIN', null, 0, '+15 PV sacrés.'],
  ['c320', 'Pacte Ifrit & Shiva', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'SUMMONER', 'SNES', 0, 'Choc thermique élémentaire !'],
  ['c321', 'Super Étoile Mario 64', 2, 'ATTACK', 15, 'ALL', 'HOLY', 'ALL', 'N64', 0, 'Énergie des 120 étoiles !'],
  ['c322', 'Rayon Phazon Samus', 2, 'ATTACK', 16, 'SINGLE', 'ARCANE', 'TECHNOMANCER', 'SNES', 0, 'Décharge énergétique pure.'],
  ['c323', 'Shoryureppa Ken', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Double dragon enflammé !'],
  ['c324', 'Marteau Triforce', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'PALADIN', 'SNES', 0, 'Impact sacré d’or.'],
  ['c325', 'Invocation Anima', 3, 'ATTACK', 20, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Chaînes dimensionnelles !'],
  ['c326', 'Crissaegrim 24K', 2, 'ATTACK', 25, 'SINGLE', 'PHYS', 'NINJA', 'SNES', 1, 'Lame aux mille entailles instantanées !'],
  ['c327', 'Luminaire Or 24K', 3, 'ATTACK', 27, 'ALL', 'LIGHTNING', 'MAGE', 'SNES', 1, 'Jugement céleste absolu !'],
  ['c328', 'Bouclier Divin 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+22 Armure sacrée !'],
  ['c329', 'Grâce Éternelle 24K', 2, 'HEAL', 23, 'SELF', 'HOLY', 'ALL', 'SNES', 1, '+23 PV & +10 Armure !'],
  ['c330', 'Couronne 330 24K', 3, 'ATTACK', 29, 'SINGLE', 'HOLY', 'ALL', 'SNES', 1, 'Carte Secrète #330 légendaire !'],
  ['c331', 'Crissaegrim d’Alucard', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'NINJA', 'SNES', 0, 'Rafale de lames spectrales !'],
  ['c332', 'Double Tech Crono & Marle', 2, 'ATTACK', 15, 'ALL', 'ICE', 'MAGE', 'SNES', 0, 'Épée de glace combinée 1000 AD !'],
  ['c333', 'Super Étoile N64', 2, 'HEAL', 14, 'SELF', 'HOLY', 'ALL', 'N64', 0, '+14 PV & +5 Armure étoilée.'],
  ['c334', 'Rayon Plasma Chozo', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'TECHNOMANCER', 'SNES', 0, 'Faisceau traversant de Zebes.'],
  ['c335', 'Shinryuken Ken', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Tornade enflammée ascendante !'],
  ['c336', 'Grand Cross Masamune', 2, 'ATTACK', 15, 'ALL', 'HOLY', 'WARRIOR', 'SNES', 0, 'Onde sacrée de Frog & Crono !'],
  ['c337', 'Chaos Démoniaque Anima', 3, 'ATTACK', 20, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Explosion d’énergie abyssale !'],
  ['c338', 'Marteau d’Or Triforce', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'PALADIN', 'SNES', 0, 'Frappe bénie des Trois Déesses.'],
  ['c339', 'Dino Tail Ayla', 2, 'ATTACK', 15, 'ALL', 'FIRE', 'WARRIOR', 'SNES', 0, 'Tornade préhistorique ardente !'],
  ['c340', 'Twin Blaster Star Fox 2', 2, 'ATTACK', 14, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Salve laser jumelée de Corneria.'],
  ['c341', 'Épée Solaires', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'WARRIOR', null, 0, 'Lame rayonnante.'],
  ['c342', 'Bouclier d’Obsidienne', 2, 'SHIELD', 15, 'SELF', 'FIRE', 'PALADIN', null, 0, '+15 Armure volcanique.'],
  ['c343', 'Flèche de Foudre', 1, 'ATTACK', 10, 'SINGLE', 'LIGHTNING', 'RANGER', null, 0, 'Trait électrique fulgurant.'],
  ['c344', 'Chant de Régénération', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', null, 0, '+14 PV harmonieux.'],
  ['c345', 'Dague de Cobra', 1, 'ATTACK', 7, 'SINGLE', 'POISON', 'NINJA', null, 0, '7 dégâts + 6 Poison.'],
  ['c346', 'Nova Glaciale', 3, 'ATTACK', 19, 'ALL', 'ICE', 'MAGE', null, 0, 'Tempête polaire absolue.'],
  ['c347', 'Surcharge Énergétique', 0, 'SKILL', 6, 'SELF', 'LIGHTNING', 'TECHNOMANCER', null, 0, '+6 Armure & pioche 1 carte (0 PA).'],
  ['c348', 'Pacte Léviathan & Bahamut', 3, 'ATTACK', 20, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 0, 'Double invocation légendaire !'],
  ['c349', 'Garde Inébranlable', 2, 'SHIELD', 15, 'SELF', 'PHYS', 'WARRIOR', null, 0, '+15 Armure de bastion.'],
  ['c350', 'Miracle Sacré', 2, 'HEAL', 15, 'SELF', 'HOLY', 'PALADIN', null, 0, '+15 PV divins.'],
  ['c351', 'Lame Sabin Blitz', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'WARRIOR', 'SNES', 0, 'Bum Rush ! Enchaînement martial !'],
  ['c352', 'Magie Ultima Terra', 3, 'ATTACK', 20, 'ALL', 'ARCANE', 'MAGE', 'SNES', 0, 'Sort suprême de FFVI !'],
  ['c353', 'Rayon Glace Samus', 1, 'ATTACK', 10, 'SINGLE', 'ICE', 'TECHNOMANCER', 'SNES', 0, 'Gèle la cible sur place.'],
  ['c354', 'Épée Biggoron', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'WARRIOR', 'N64', 0, 'Lame géante forgée par les Gorons !'],
  ['c355', 'Hyper Sonic Flash', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'NINJA', 'MD', 0, 'Éclair aveuglant sur tous !'],
  ['c356', 'Giga Attack Mega Man X', 3, 'ATTACK', 20, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Décharge totale de l’armure dorée !'],
  ['c357', 'Hydro Storm Richter', 3, 'ATTACK', 19, 'ALL', 'HOLY', 'PALADIN', 'PCE', 0, 'Pluie bénite dévastatrice !'],
  ['c358', 'Matière Noire Magus', 3, 'ATTACK', 20, 'ALL', 'ARCANE', 'MAGE', 'SNES', 0, 'Trou noir magique de 600 AD !'],
  ['c359', 'Nuage Étoile Yoshi', 1, 'HEAL', 12, 'SELF', 'HOLY', 'ALL', 'SNES', 0, '+12 PV & +4 Armure douce.'],
  ['c360', 'Flèche d’Or Zelda', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'RANGER', 'SNES', 0, 'Trait sacré de la Princesse.'],
  ['c361', 'Tranchant du Dragon', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', null, 0, 'Lame ardente.'],
  ['c362', 'Bouclier d’Éther', 2, 'SHIELD', 15, 'SELF', 'ARCANE', 'MAGE', null, 0, '+15 Armure astrale.'],
  ['c363', 'Salve Toxique', 2, 'ATTACK', 10, 'ALL', 'POISON', 'NINJA', null, 0, '10 dégâts + 6 Poison à tous.'],
  ['c364', 'Hymne des Anciens', 2, 'HEAL', 14, 'SELF', 'HOLY', 'BARD', null, 0, '+14 PV & +4 Armure.'],
  ['c365', 'Canon Ionique', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', null, 0, 'Faisceau ionisé haute énergie.'],
  ['c366', 'Frappe Céleste', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'PALADIN', null, 0, 'Coup béni des cieux.'],
  ['c367', 'Éclair Silencieux', 0, 'ATTACK', 6, 'SINGLE', 'PHYS', 'NINJA', null, 0, 'Attaque furtive gratuite (0 PA).'],
  ['c368', 'Barrière Solaire', 2, 'SHIELD', 15, 'SELF', 'HOLY', 'PALADIN', null, 0, '+15 Armure radieuse.'],
  ['c369', 'Tempête Arcanique', 3, 'ATTACK', 19, 'ALL', 'ARCANE', 'MAGE', null, 0, 'Déferlante magique totale.'],
  ['c370', 'Source Sacrée', 2, 'HEAL', 15, 'SELF', 'HOLY', 'ALL', null, 0, '+15 PV régénérants.'],
  ['c371', 'Poing Spirale Knuckles', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', 'MD', 0, 'Foreuse de poing d’Angel Island !'],
  ['c372', 'Tatsumaki Ryu & Ken', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'WARRIOR', 'ARC', 0, 'Coup de pied ouragan enflammé !'],
  ['c373', 'Sabre Zéro Noir', 2, 'ATTACK', 16, 'SINGLE', 'ARCANE', 'NINJA', 'SNES', 0, 'Coupe dimensionnelle obscure !'],
  ['c374', 'Invocation Alexandre', 3, 'ATTACK', 20, 'ALL', 'HOLY', 'SUMMONER', 'SNES', 0, 'Jugement Divin de la forteresse !'],
  ['c375', 'Fleur d’Or Mario', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'MAGE', 'SNES', 0, 'Boules de feu dorées !'],
  ['c376', 'Bouclier Triforce', 2, 'SHIELD', 16, 'SELF', 'HOLY', 'PALADIN', 'SNES', 0, '+16 Armure des Sages !'],
  ['c377', 'Flèche Étoile Pit', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'RANGER', 'NES', 0, 'Trait lumineux céleste.'],
  ['c378', 'Buster Shot Mega Man', 1, 'ATTACK', 10, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'NES', 0, 'Tir rapide énergétique.'],
  ['c379', 'Chant Chocobo', 1, 'HEAL', 11, 'SELF', 'HOLY', 'BARD', 'SNES', 0, 'Kweh ! +11 PV & bonne humeur !'],
  ['c380', 'Lame Sombre Cecil', 2, 'ATTACK', 15, 'ALL', 'ARCANE', 'WARRIOR', 'SNES', 0, 'Onde ténébreuse de FFIV !'],
  ['c381', 'Estocade Royale', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Coup d’épée noble.'],
  ['c382', 'Rempart Mystique', 2, 'SHIELD', 15, 'SELF', 'ARCANE', 'PALADIN', null, 0, '+15 Armure enchantée.'],
  ['c383', 'Pluie de Flèches Givrées', 2, 'ATTACK', 13, 'ALL', 'ICE', 'RANGER', null, 0, 'Volée glaciale sur tous.'],
  ['c384', 'Venin Royal', 2, 'ATTACK', 11, 'SINGLE', 'POISON', 'NINJA', null, 0, '11 dégâts + 8 Poison.'],
  ['c385', 'Foudre Céleste', 2, 'ATTACK', 15, 'SINGLE', 'LIGHTNING', 'MAGE', null, 0, 'Éclair venu des nuages.'],
  ['c386', 'Symphonie Dorée', 2, 'HEAL', 15, 'SELF', 'HOLY', 'BARD', null, 0, '+15 PV & +5 Armure.'],
  ['c387', 'Canon Plasma Lourd', 3, 'ATTACK', 20, 'SINGLE', 'FIRE', 'TECHNOMANCER', null, 0, 'Tir concentré dévastateur.'],
  ['c388', 'Garde Éternelle', 2, 'SHIELD', 15, 'SELF', 'PHYS', 'PALADIN', null, 0, '+15 Armure indéboulonnable.'],
  ['c389', 'Fureur des Éléments', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'SUMMONER', null, 0, 'Tempête élémentaire globale.'],
  ['c390', 'Élixir Suprême', 2, 'HEAL', 16, 'SELF', 'HOLY', 'ALL', null, 0, '+16 PV complets !'],
  ['c391', 'Crissaegrim Ultima 24K', 2, 'ATTACK', 26, 'SINGLE', 'PHYS', 'NINJA', 'SNES', 1, 'Lame légendaire aux entailles infinies !'],
  ['c392', 'Double Tech Luminaire 24K', 3, 'ATTACK', 28, 'ALL', 'LIGHTNING', 'MAGE', 'SNES', 1, 'Fusion céleste Crono & Marle Or !'],
  ['c393', 'Anima Souveraine 24K', 3, 'ATTACK', 27, 'ALL', 'ARCANE', 'SUMMONER', 'SNES', 1, 'Invocation abyssale dorée 16-bits !'],
  ['c394', 'Triforce Absolue 24K', 2, 'SHIELD', 23, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+23 Armure sacrée des Déesses !'],
  ['c395', 'Étoile de Vie 24K', 2, 'HEAL', 24, 'SELF', 'HOLY', 'ALL', 'N64', 1, '+24 PV & +12 Armure étoilée !'],
  ['c396', 'Hyper Rayon Zebes 24K', 3, 'ATTACK', 27, 'ALL', 'FIRE', 'TECHNOMANCER', 'SNES', 1, 'Faisceau suprême de Samus Aran !'],
  ['c397', 'Shin Gouki Raging 24K', 3, 'ATTACK', 28, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 1, 'Mille coups instantanés d’Akuma !'],
  ['c398', 'Masamune Divine 24K', 2, 'ATTACK', 26, 'SINGLE', 'HOLY', 'WARRIOR', 'SNES', 1, 'Lame sacrée des héros de 600 AD !'],
  ['c399', 'Égide d’Or des Sages 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+22 Armure sacrée éternelle !'],
  ['c400', 'Couronne Master Set 2000', 3, 'ATTACK', 30, 'SINGLE', 'HOLY', 'ALL', 'SNES', 1, 'Trophée Absolu des 2 000 cases !'],
  ['c401', 'Invocation Phénix Ardent', 2, 'SUMMON', 8, 'SINGLE', 'FIRE', 'SUMMONER', 'SNES', 0, 'Invoque Phénix Flamboyant (3 tours).'],
  ['c402', 'Invocation Léviathan', 2, 'SUMMON', 9, 'SINGLE', 'ICE', 'SUMMONER', 'SNES', 0, 'Invoque Léviathan Glacial (3 tours).'],
  ['c403', 'Invocation Odin Céleste', 2, 'SUMMON', 11, 'SINGLE', 'PHYS', 'SUMMONER', 'SNES', 0, 'Invoque Odin Zantetsuken (3 tours).'],
  ['c404', 'Appel Pikachu Étincelle', 1, 'SUMMON', 8, 'SINGLE', 'LIGHTNING', 'ALL', 'GB', 0, 'Invoque Pikachu Étincelle (3 tours).'],
  ['c405', 'Buster Sword Cloud 24K', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Entaille céleste du Soldat 1re Classe !'],
  ['c406', 'Épée Gunblade 16-Bits', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'SNES', 0, 'Gâchette explosive au contact !'],
  ['c407', 'Rayon Grappin Samus', 1, 'ATTACK', 10, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Lasso énergétique de Zebes !'],
  ['c408', 'Marteau Forgeron Thor', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'PALADIN', 'MD', 0, 'Orage d’Asgard sur tous !'],
  ['c409', 'Invocation Ixion Tonnerre', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'SUMMONER', 'SNES', 0, 'Corne fulgurante de l’Éon !'],
  ['c410', 'Furie Dragon Ryu Gold', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Metsu Shoryuken incandescent !'],
  ['c411', 'Flèche d’Argent d’Hyrule', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'RANGER', 'SNES', 0, 'Trait sacré pourfendeur de Ganon !'],
  ['c412', 'Bouclier Miroir Zelda II', 2, 'SHIELD', 15, 'SELF', 'HOLY', 'PALADIN', 'NES', 0, '+15 Armure bénie des Sages !'],
  ['c413', 'Fleur de Glace Mario', 1, 'ATTACK', 10, 'ALL', 'ICE', 'MAGE', 'SNES', 0, 'Boules de givre rebondissantes !'],
  ['c414', 'Super Anneau Doré Sonic', 1, 'HEAL', 11, 'SELF', 'HOLY', 'ALL', 'MD', 0, '+11 PV & énergie supersonique !'],
  ['c415', 'Sabre Laser Protoman', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'TECHNOMANCER', 'NES', 0, 'Frappe au sifflet légendaire !'],
  ['c416', 'Étoile Warp Galactique', 0, 'SKILL', 6, 'SELF', 'ARCANE', 'ALL', 'GB', 0, '+6 Armure & pioche 1 carte (0 PA) !'],
  ['c417', 'Tonneau Fusée Diddy', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'RANGER', 'SNES', 0, 'Vol plané explosif sur tous !'],
  ['c418', 'Pinceau Magique Fantasia', 2, 'ATTACK', 15, 'ALL', 'ARCANE', 'MAGE', 'MD', 0, 'Tourbillon d’étoiles enchantées !'],
  ['c419', 'Fouet Chaîne Richter', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'PALADIN', 'PCE', 0, 'Enchaînement sacré de Rondo !'],
  ['c420', 'Chrono Break 1000 AD', 3, 'ATTACK', 20, 'ALL', 'LIGHTNING', 'WARRIOR', 'SNES', 0, 'Fige le temps et foudroie tous !'],
  ['c421', 'Transe Magitek Ultime', 3, 'ATTACK', 20, 'ALL', 'FIRE', 'MAGE', 'SNES', 0, 'Fusion Esper de Terra Branford !'],
  ['c422', 'Graine de Mana Sacrée', 1, 'HEAL', 12, 'SELF', 'HOLY', 'ALL', 'SNES', 0, 'Restaure 12 PV sylvestres !'],
  ['c423', 'Médaillon Soleil Alex', 2, 'ATTACK', 14, 'ALL', 'FIRE', 'MAGE', 'SMS', 0, 'Rayon solaire de Radaxian !'],
  ['c424', 'Bombe Éclair Arwing', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Frappe orbitale de Corneria !'],
  ['c425', 'Armure d’Or Sir Arthur', 2, 'SHIELD', 16, 'SELF', 'HOLY', 'PALADIN', 'SNES', 0, '+16 Armure royale brillante !'],
  ['c426', 'Bombe Atomique Bomberman', 3, 'ATTACK', 19, 'ALL', 'FIRE', 'TECHNOMANCER', 'PCE', 0, 'Déflagration totale de l’arène !'],
  ['c427', 'Vache Lancée Groovy Jim', 2, 'ATTACK', 15, 'SINGLE', 'PHYS', 'RANGER', 'MD', 0, 'Groovy ! Impact bovin cosmique !'],
  ['c428', 'Ninjutsu Karyu Dragon', 2, 'ATTACK', 15, 'ALL', 'FIRE', 'NINJA', 'MD', 0, 'Colonnes de feu de Joe Musashi !'],
  ['c429', 'Power Dunk Terry Bogard', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Saut explosif de Southtown !'],
  ['c430', 'Trois Trésors Sacrés Pit', 3, 'ATTACK', 20, 'ALL', 'HOLY', 'RANGER', 'NES', 0, 'Armure de Pégase & Arc de Lumière !'],
  ['c431', 'Toxine du Scorpion Roi', 2, 'ATTACK', 12, 'SINGLE', 'POISON', 'NINJA', null, 0, '12 dégâts + 8 Poison mortel !'],
  ['c432', 'Rempart Cryogénique', 2, 'SHIELD', 16, 'SELF', 'ICE', 'MAGE', null, 0, '+16 Armure de glace éternelle !'],
  ['c433', 'Frappe Éclair Quadruple', 0, 'ATTACK', 8, 'SINGLE', 'PHYS', 'WARRIOR', null, 0, 'Quatre coups rapides à 0 PA !'],
  ['c434', 'Source Mana Infinie 0 PA', 0, 'SKILL', 7, 'SELF', 'ARCANE', 'MAGE', null, 0, '+7 Armure & pioche 1 carte (0 PA) !'],
  ['c435', 'Bénédiction Angélique 0 PA', 0, 'HEAL', 8, 'SELF', 'HOLY', 'PALADIN', null, 0, '+8 PV gratuits pour l’escouade !'],
  ['c436', 'Apocalypse Stellaire', 3, 'ATTACK', 21, 'ALL', 'ARCANE', 'MAGE', null, 0, 'Pluie de météores arcaniques !'],
  ['c437', 'Citadelle Sacrée', 3, 'SHIELD', 20, 'SELF', 'HOLY', 'PALADIN', null, 0, '+20 Armure divine indéboulonnable !'],
  ['c438', 'Lame Dimensionnelle', 2, 'ATTACK', 16, 'SINGLE', 'ARCANE', 'NINJA', null, 0, 'Coupe à travers l’espace !'],
  ['c439', 'Symphonie des Dieux', 3, 'HEAL', 19, 'SELF', 'HOLY', 'BARD', null, 0, '+19 PV & +6 Armure escouade !'],
  ['c440', 'Canon Antigravité', 3, 'ATTACK', 21, 'SINGLE', 'LIGHTNING', 'TECHNOMANCER', null, 0, 'Faisceau plasma hyper-concentré !'],
  ['c441', 'Pacte Bahamut Zéro', 3, 'ATTACK', 21, 'ALL', 'ARCANE', 'SUMMONER', null, 0, 'Tera-Fission depuis l’orbite !'],
  ['c442', 'Tranchant Ragnarok', 3, 'ATTACK', 21, 'SINGLE', 'HOLY', 'WARRIOR', null, 0, 'Épée légendaire des anciens !'],
  ['c443', 'Salve Perforante Élite', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'RANGER', null, 0, 'Flèche transperçant toute garde !'],
  ['c444', 'Nuage Venimeux Absolu', 2, 'ATTACK', 11, 'ALL', 'POISON', 'NINJA', null, 0, '11 dégâts + 8 Poison à tous !'],
  ['c445', 'Miracle Éternel 16-Bits', 3, 'HEAL', 20, 'SELF', 'HOLY', 'ALL', null, 0, 'Restaure 20 PV lumineux !'],
  ['c446', 'Omnislash Version 5 24K', 3, 'ATTACK', 27, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 1, 'Enchaînement ultime de Cloud Strife !'],
  ['c447', 'Hypernova Magitek 24K', 3, 'ATTACK', 26, 'ALL', 'FIRE', 'MAGE', 'SNES', 1, 'Cataclysme Esper absolu !'],
  ['c448', 'Égide de la Triforce 24K', 2, 'SHIELD', 22, 'SELF', 'HOLY', 'PALADIN', 'SNES', 1, '+22 Armure dorée indestructible !'],
  ['c449', 'Élixir des Étoiles 24K', 1, 'HEAL', 22, 'SELF', 'HOLY', 'ALL', 'SNES', 1, '+22 PV & +12 Armure escouade !'],
  ['c450', 'Couronne Master Set 2250', 3, 'ATTACK', 32, 'SINGLE', 'HOLY', 'ALL', 'SNES', 1, 'Trophée Suprême des 2 250 cases !'],
  ['c451', 'Masamune Ange Déchu', 3, 'ATTACK', 21, 'ALL', 'ARCANE', 'WARRIOR', 'SNES', 0, 'Entaille céleste d’une seule aile !'],
  ['c452', 'Ombrelle Royale Peach', 1, 'HEAL', 13, 'SELF', 'HOLY', 'BARD', 'SNES', 0, 'Pluie de cœurs (+13 PV & +4 Armure).'],
  ['c453', 'Poêle à Frire Super Peach', 2, 'ATTACK', 16, 'SINGLE', 'PHYS', 'WARRIOR', 'SNES', 0, 'Coup critique de Super Mario RPG !'],
  ['c454', 'Supernova Septième Ciel', 3, 'ATTACK', 22, 'ALL', 'FIRE', 'MAGE', 'SNES', 0, 'Cataclysme cosmique des planètes !'],
  ['c455', 'Bouclier Miroir d’Alucard', 2, 'SHIELD', 16, 'SELF', 'HOLY', 'PALADIN', 'SNES', 0, '+16 Armure vampirique sacrée.'],
  ['c456', 'Canon Onde Samus Prime', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'SNES', 0, 'Faisceau ondulatoire traversant tout !'],
  ['c457', 'Saut Dragon Kain Highwind', 2, 'ATTACK', 16, 'SINGLE', 'LIGHTNING', 'WARRIOR', 'SNES', 0, 'Plongeon draconique de FFIV !'],
  ['c458', 'Chant des Espers Terra', 2, 'HEAL', 15, 'SELF', 'ARCANE', 'SUMMONER', 'SNES', 0, '+15 PV & +5 Armure d’Esper.'],
  ['c459', 'Tourbillon Lame Link 2D', 1, 'ATTACK', 10, 'ALL', 'PHYS', 'WARRIOR', 'GB', 0, 'Attaque circulaire de Link’s Awakening.'],
  ['c460', 'Émeraude Rouge Chaos', 2, 'ATTACK', 15, 'SINGLE', 'FIRE', 'NINJA', 'MD', 0, 'Explosion d’énergie rubis !'],
  ['c461', 'Laser Vic Viper III', 2, 'ATTACK', 15, 'ALL', 'LIGHTNING', 'TECHNOMANCER', 'PCE', 0, 'Formation complète d’options laser !'],
  ['c462', 'Shoryuken Flamme Bleue', 2, 'ATTACK', 16, 'SINGLE', 'FIRE', 'WARRIOR', 'ARC', 0, 'Uppercut incandescent parfait !'],
  ['c463', 'Bouclier de Cristal Zeal', 2, 'SHIELD', 16, 'SELF', 'ICE', 'MAGE', 'SNES', 0, '+16 Armure du royaume céleste.'],
  ['c464', 'Dague Venin Oboro', 1, 'ATTACK', 8, 'SINGLE', 'POISON', 'NINJA', 'MD', 0, '8 dégâts + 7 Poison mortel.'],
  ['c465', 'Flèche Étoile d’Angel Land', 2, 'ATTACK', 15, 'SINGLE', 'HOLY', 'RANGER', 'NES', 0, 'Trait lumineux purificateur.'],
  ['c466', 'Supernova Séraphin 24K', 3, 'ATTACK', 29, 'ALL', 'ARCANE', 'MAGE', 'SNES', 1, 'Sort ultime de Sephiroth Ange Déchu !'],
  ['c467', 'Couronne Princesse Peach 24K', 2, 'HEAL', 25, 'SELF', 'HOLY', 'ALL', 'SNES', 1, '+25 PV & +12 Armure royale dorée !'],
  ['c468', 'Lame Chronos Ultime 24K', 3, 'ATTACK', 28, 'SINGLE', 'LIGHTNING', 'WARRIOR', 'SNES', 1, 'Tranchant intemporel de 1000 AD !'],
  ['c469', 'Égide de Zeal 24K', 2, 'SHIELD', 24, 'SELF', 'ARCANE', 'PALADIN', 'SNES', 1, '+24 Armure cristalline éternelle !'],
  ['c470', 'Trophée Légendes 2350 24K', 3, 'ATTACK', 34, 'ALL', 'HOLY', 'ALL', 'SNES', 1, 'Relique Suprême des 2 350 cases !']
];

const SUMMON_MASCOT_MAP = {
  c007: 'chocobo',
  c019: 'yoshi',
  c020: 'rush',
  c021: 'navi',
  c022: 'mog',
  c023: 'metroid',
  c024: 'tails',
  c025: 'carbuncle',
  c401: 'phoenix',
  c402: 'leviathan',
  c403: 'odin',
  c404: 'pikachu'
};

const RAW_MONSTERS = [
  ['m290', 'Shinryu Oméga Suprême', 'SNES', 'king', 36, 10, 35, 28, 'Final Fantasy V'],
  ['m291', 'Chevalier Cecil Lune', 'SNES', 'knight', 30, 9, 25, 19, 'Final Fantasy IV'],
  ['m292', 'Dragon Leviathan Abyssal', 'SNES', 'dragon', 32, 9, 28, 22, 'Final Fantasy IV'],
  ['m293', 'Badnik Metal Tails', 'MD', 'robot', 29, 9, 24, 18, 'Sonic 16-Bits'],
  ['m294', 'Garde Chozo Doré', 'SNES', 'knight', 31, 9, 26, 20, 'Super Metroid'],
  ['m295', 'Slime Gluant Diamant', 'SNES', 'slime', 26, 8, 30, 26, 'Dragon Quest VI'],
  ['m296', 'Sorcier Wizzrobe Ombre', 'SNES', 'ghost', 28, 8, 23, 17, 'Zelda ALTTP'],
  ['m297', 'Soldat Rebel Jupiter King', 'ARC', 'robot', 31, 9, 26, 20, 'Metal Slug 3'],
  ['m298', 'Démon Galamoth', 'SNES', 'king', 34, 10, 31, 25, 'Castlevania 16-Bit'],
  ['m299', 'Ninja Hayabusa Ombre', 'NES', 'knight', 27, 8, 22, 16, 'Ninja Gaiden III'],
  ['m300', 'Dragon Bahamut Ex', 'SNES', 'dragon', 34, 10, 31, 25, 'Final Fantasy VI'],
  ['m301', 'Robot Sigma Kaiser', 'SNES', 'robot', 33, 10, 29, 23, 'Mega Man X3'],
  ['m302', 'Fantôme Roi Boo Noir', 'SNES', 'ghost', 29, 9, 24, 18, 'Super Mario World'],
  ['m303', 'Chevalier Galacta Knight', 'GB', 'knight', 32, 9, 28, 22, 'Kirby 16-Bits'],
  ['m304', 'Ogre Titan Golden Axe', 'MD', 'beast', 29, 9, 24, 18, 'Golden Axe III'],
  ['m305', 'Vaisseau Vic Viper Omega', 'PCE', 'ufo', 29, 9, 24, 18, 'Gradius II PCE'],
  ['m306', 'Golem de Mithril', 'SNES', 'knight', 32, 9, 28, 22, 'Chrono Trigger'],
  ['m307', 'Chasseur Predator Élite', 'ARC', 'knight', 31, 9, 26, 20, 'Alien vs Predator'],
  ['m308', 'Dragon Noir de Radaxian', 'SMS', 'dragon', 28, 8, 23, 17, 'Alex Kidd'],
  ['m309', 'Spectre Chakan Éternel', 'GG', 'ghost', 27, 8, 22, 16, 'Chakan GG'],
  ['m310', 'Plante Piranha Royale', 'SNES', 'beast', 28, 8, 23, 17, 'Yoshi’s Island'],
  ['m311', 'Chevalier Siegfried FFVI', 'SNES', 'knight', 31, 9, 26, 20, 'Final Fantasy VI'],
  ['m312', 'Robot Mother Brain Mk2', 'SNES', 'robot', 33, 10, 30, 24, 'Super Metroid'],
  ['m313', 'Badnik Chaos Zero', 'MD', 'slime', 32, 9, 28, 22, 'Sonic 16-Bits'],
  ['m314', 'Samouraï Genjuro Arcade', 'ARC', 'knight', 30, 9, 25, 19, 'Samurai Shodown II'],
  ['m315', 'Dragon Tiamat Céleste', 'NES', 'dragon', 29, 9, 24, 18, 'Final Fantasy I'],
  ['m316', 'Sorcier Agahnim Sombre', 'SNES', 'ghost', 31, 9, 26, 20, 'Zelda ALTTP'],
  ['m317', 'Garde Magitek Omega', 'SNES', 'robot', 33, 10, 29, 23, 'Final Fantasy VI'],
  ['m318', 'Chevalier Zeromus Eg', 'SNES', 'ghost', 34, 10, 31, 25, 'Final Fantasy IV'],
  ['m319', 'Slime Gluant Empereur Or', 'SNES', 'king', 30, 8, 34, 30, 'Dragon Quest VI'],
  ['m320', 'Weapon Rubis & Émeraude', 'SNES', 'king', 38, 11, 38, 32, 'Final Fantasy 16-Bit'],
  ['m321', 'Chevalier Kain Dragoon', 'SNES', 'knight', 32, 9, 28, 22, 'Final Fantasy IV'],
  ['m322', 'Dragon Mist de Baron', 'SNES', 'dragon', 31, 9, 27, 21, 'Final Fantasy IV'],
  ['m323', 'Badnik Silver Sonic', 'SMS', 'robot', 29, 9, 25, 19, 'Sonic 2 Master System'],
  ['m324', 'Spectre de la Tour Horloge', 'GB', 'ghost', 28, 8, 24, 18, 'Castlevania Adventure'],
  ['m325', 'Robot Pharaoh Man', 'NES', 'robot', 29, 9, 25, 19, 'Mega Man 4 NES'],
  ['m326', 'Démon Astaroth Arcade', 'ARC', 'king', 33, 10, 30, 24, 'Ghouls’n Ghosts'],
  ['m327', 'Vaisseau R-9 Arrowhead', 'PCE', 'ufo', 30, 9, 26, 20, 'R-Type PC Engine'],
  ['m328', 'Golem de Glace Shinobi', 'GG', 'beast', 29, 9, 25, 19, 'GG Shinobi II'],
  ['m329', 'Chasseur de Primes Sylux', 'SNES', 'robot', 32, 9, 28, 22, 'Super Metroid'],
  ['m330', 'Slime Roi de Métal', 'NES', 'slime', 27, 8, 36, 34, 'Dragon Quest IV'],
  ['m331', 'Dragon Valefor Sombre', 'SNES', 'dragon', 34, 10, 31, 25, 'Final Fantasy 16-Bit'],
  ['m332', 'Guerrier Gill Street Fighter', 'ARC', 'king', 34, 10, 32, 26, 'Street Fighter III'],
  ['m333', 'Sorcier Vaati Minish', 'GB', 'ghost', 31, 9, 27, 21, 'Zelda Portable'],
  ['m334', 'Gardien Omega MK-II', 'SNES', 'robot', 36, 10, 34, 28, 'Final Fantasy V'],
  ['m335', 'Chevalier Noir Golbez', 'SNES', 'knight', 34, 10, 31, 25, 'Final Fantasy IV'],
  ['m336', 'Hydre de Lerne PC Engine', 'PCE', 'beast', 32, 9, 28, 22, 'Cadash PCE'],
  ['m337', 'Robot Death Egg Guard', 'MD', 'robot', 33, 10, 30, 24, 'Sonic 3 & Knuckles'],
  ['m338', 'Chimère Ultime 16-Bits', 'SNES', 'beast', 37, 11, 36, 30, 'Chrono Trigger']
];

const RAW_BOSSES = [
  ['b01', 'Roi Bowser Koopa', 'SNES', 'king', 65, 9, 55, 45, 'Super Mario World', 'Seigneur des Koopas'],
// ... existing code ...
  ['b49', 'Zeromus & Zemus', 'SNES', 'ghost', 100, 15, 102, 88, 'Final Fantasy IV', ' incarnation de la Haine'],
  ['b50', 'Safer-Sephiroth 16-Bits', 'SNES', 'king', 110, 16, 120, 100, 'Final Fantasy 16-Bit', 'Séraphin de l’Apocalypse'],
  ['b51', 'Ultima Weapon Omega', 'SNES', 'king', 106, 16, 112, 94, 'Final Fantasy VI', 'Arme Suprême des Anciens'],
  ['b52', 'Shinryu Céleste Ultime', 'SNES', 'dragon', 112, 16, 118, 98, 'Final Fantasy V', 'Roi des Dragons Dimensionnels'],
  ['b53', 'Kefka Dieu de l’Apocalypse', 'SNES', 'king', 114, 17, 122, 102, 'Final Fantasy VI', 'Maître de la Triade Guerrière'],
  ['b54', 'Lavos Core Intemporel', 'SNES', 'beast', 116, 17, 125, 105, 'Chrono Trigger', 'Dévoreur des Époques'],
  ['b55', 'Dracula Forme Finale', 'SNES', 'king', 108, 16, 115, 96, 'Castlevania 16-Bit', 'Seigneur des Ténèbres Éternelles'],
  ['b56', 'Sigma Virus Absolu', 'SNES', 'robot', 110, 16, 118, 98, 'Mega Man X3', 'Conscience Maverick Ultime'],
  ['b57', 'Zero Awakened Maverick', 'SNES', 'knight', 112, 17, 120, 100, 'Mega Man X', 'Chasseur Légendaire Éveillé'],
  ['b58', 'Omega Rugal 2002', 'ARC', 'king', 114, 17, 124, 104, 'King of Fighters', 'Empereur du Genocide Cutter'],
  ['b59', 'Ganon Triforce Sombre', 'SNES', 'king', 116, 17, 126, 106, 'Zelda ALTTP', 'Roi Démon Tout-Puissant'],
  ['b60', 'Chronos Seigneur du Temps', 'SNES', 'king', 125, 18, 140, 120, 'Chrono Trigger', 'Gardien Absolu du Donjon 16-Bits'],
  ['b61', 'Sephiroth Ange d’Une Aile', 'SNES', 'king', 122, 18, 136, 116, 'Final Fantasy 16-Bit', 'Héraut de la Supernova'],
  ['b62', 'Golbez & Dragon Noir', 'SNES', 'knight', 118, 17, 130, 110, 'Final Fantasy IV', 'Seigneur des Cristaux Obscurs'],
  ['b63', 'Smithy Forgeron Dimensionnel', 'SNES', 'robot', 120, 18, 134, 114, 'Super Mario RPG', 'Roi du Gang des Armes'],
  ['b64', 'Mother Brain Hyper Beam', 'SNES', 'ufo', 122, 18, 136, 116, 'Super Metroid', 'Cerveau Suprême de Tourian'],
  ['b65', 'Gill Empereur Céleste', 'ARC', 'king', 124, 18, 138, 118, 'Street Fighter Arcade', 'Maître de la Résurrection'],
  ['b66', 'Empereur des Légendes 16-Bits', 'SNES', 'king', 132, 19, 155, 135, 'All-Star 16-Bit', 'Gardien Suprême des 404 Créatures']
];

const MASTER_SET_MILESTONES = [
  { slots: 25, rewardGold: 60, label: '25 Cases' },
  { slots: 75, rewardGold: 100, label: '75 Cases' },
  { slots: 150, rewardGold: 150, label: '150 Cases' },
  { slots: 300, rewardGold: 220, label: '300 Cases' },
  { slots: 500, rewardGold: 300, label: '500 Cases' },
  { slots: 750, rewardGold: 400, label: '750 Cases' },
  { slots: 1000, rewardGold: 550, label: '1 000 Cases' },
  { slots: 1200, rewardGold: 750, label: '1 200 Cases' },
  { slots: 1400, rewardGold: 1000, label: '1 400 Cases' },
  { slots: 1650, rewardGold: 1400, label: '1 650 Cases' },
  { slots: 1800, rewardGold: 1800, label: '1 800 Cases' },
  { slots: 2000, rewardGold: 2400, label: '2 000 Cases' },
  { slots: 2250, rewardGold: 3200, label: '2 250 Cases' },
  { slots: 2350, rewardGold: 4000, label: '2 350 Cases (COMPLET)' }
];

const GUEST_HEROES = [
  {
    id: 'gh_mario',
    name: 'Mario',
    console: 'SNES',
    title: 'Héros du Royaume Champignon',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance sur les cartes Feu & Physique',
    sigCards: [
      { id: 'g001', name: 'Super Saut Étoile Mario', cost: 1, type: 'ATTACK', power: 11, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Frappe bondissante du plombier légendaire.' },
      { id: 'g002', name: 'Fleur Capée Super Mario', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Tourbillon de cape et boules de feu !' }
    ]
  },
  {
    id: 'gh_link',
    name: 'Link',
    console: 'SNES',
    title: 'Héros d’Hyrule',
    bonusType: 'ARMOR',
    bonusVal: 5,
    bonusDesc: '+5 Armure au début de chaque combat',
    sigCards: [
      { id: 'g003', name: 'Attaque Tornade Link', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Lame chargée tournoyante d’Hyrule !' },
      { id: 'g004', name: 'Flèche d’Argent Sacrée', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Trait béni pourfendeur des ténèbres.' }
    ]
  },
  {
    id: 'gh_samus',
    name: 'Samus Aran',
    console: 'SNES',
    title: 'Chasseuse de Primes Chozo',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Dégâts sur toutes les attaques de zone',
    sigCards: [
      { id: 'g005', name: 'Salve Super Missiles', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Barrage plasma de Zebes.' },
      { id: 'g006', name: 'Armure Varia Intégrale', cost: 1, type: 'SHIELD', power: 12, target: 'SELF', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+12 Armure énergétique Chozo.' }
    ]
  },
  {
    id: 'gh_kirby',
    name: 'Kirby',
    console: 'GB',
    title: 'Boule Rose de Dream Land',
    bonusType: 'HEAL',
    bonusVal: 4,
    bonusDesc: '+4 Soin & pioche 1 carte supplémentaire Tour 1',
    sigCards: [
      { id: 'g007', name: 'Étoile Rodante Kirby', cost: 1, type: 'ATTACK', power: 11, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'GB', isSecret: false, desc: 'Projectile étoilé traversant tous les ennemis.' },
      { id: 'g008', name: 'Festin Maxi-Tomate', cost: 1, type: 'HEAL', power: 13, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'GB', isSecret: false, desc: 'Restaure 13 PV à toute l’escouade.' }
    ]
  },
  {
    id: 'gh_dk',
    name: 'Donkey Kong',
    console: 'SNES',
    title: 'Roi de la Jungle Kongo',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance sur les cartes Physiques',
    sigCards: [
      { id: 'g009', name: 'Frappe Sismique DK', cost: 2, type: 'ATTACK', power: 16, target: 'ALL', element: 'PHYS', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Onde de choc écrasant le sol !' },
      { id: 'g010', name: 'Régime Bananes Dorées', cost: 1, type: 'HEAL', power: 12, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+12 PV & +4 Armure.' }
    ]
  },
  {
    id: 'gh_mickey',
    name: 'Mickey Mouse',
    console: 'MD',
    title: 'Apprenti Sorcier 16-Bits',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance sur les sorts Arcaniques',
    sigCards: [
      { id: 'g011', name: 'Tourbillon d’Étoiles Fantasia', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: 'Magie des balais enchantés.' },
      { id: 'g012', name: 'Cape d’Illusion Castle', cost: 1, type: 'SHIELD', power: 12, target: 'SELF', element: 'ARCANE', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: '+12 Armure & pioche 1 carte.' }
    ]
  },
  {
    id: 'gh_sonic',
    name: 'Sonic',
    console: 'MD',
    title: 'Hérisson Supersonique',
    bonusType: 'PA',
    bonusVal: 1,
    bonusDesc: '+1 PA au premier tour & +3 Foudre',
    sigCards: [
      { id: 'g013', name: 'Light Speed Attack', cost: 1, type: 'ATTACK', power: 12, target: 'ALL', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: 'Frappe à la vitesse de la lumière !' },
      { id: 'g014', name: 'Bouclier Électrique Sonic', cost: 1, type: 'SHIELD', power: 11, target: 'SELF', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: '+11 Armure magnétique.' }
    ]
  },
  {
    id: 'gh_megaman',
    name: 'Mega Man X',
    console: 'SNES',
    title: 'Chasseur de Mavericks',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance Technomancien & Foudre',
    sigCards: [
      { id: 'g015', name: 'Spiral Crush Buster', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Tir double chargé de l’armure X.' },
      { id: 'g016', name: 'Sub-Tank Complet', cost: 2, type: 'HEAL', power: 16, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Restaure 16 PV instantanés.' }
    ]
  },
  {
    id: 'gh_simon',
    name: 'Simon Belmont',
    console: 'SNES',
    title: 'Chasseur de Vampires',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance sur les cartes Sacrées',
    sigCards: [
      { id: 'g017', name: 'Vampire Killer Sacré', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Fouet enflammé béni.' },
      { id: 'g018', name: 'Pluie d’Eau Bénite', cost: 2, type: 'ATTACK', power: 14, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Flammes bleues purificatrices.' }
    ]
  },
  {
    id: 'gh_crono',
    name: 'Crono',
    console: 'SNES',
    title: 'Voyageur Temporel 1000 AD',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance sur les attaques Foudre & Épée',
    sigCards: [
      { id: 'g019', name: 'Confuse Quadruple Crono', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Quatre entailles éclair.' },
      { id: 'g020', name: 'Luminaire Céleste', cost: 3, type: 'ATTACK', power: 21, target: 'ALL', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Jugement lumineux sur toute l’arène !' }
    ]
  },
  {
    id: 'gh_terra',
    name: 'Terra Branford',
    console: 'SNES',
    title: 'Héritière des Espers',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance sur tous les sorts élémentaires',
    sigCards: [
      { id: 'g021', name: 'Transe Esper Flamboyante', cost: 2, type: 'ATTACK', power: 16, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Explosion magique d’Esper.' },
      { id: 'g022', name: 'Grâce de Maduin', cost: 2, type: 'HEAL', power: 15, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+15 PV & +5 Armure.' }
    ]
  },
  {
    id: 'gh_alex',
    name: 'Alex Kidd',
    console: 'SMS',
    title: 'Prince de Radaxian',
    bonusType: 'GOLD',
    bonusVal: 15,
    bonusDesc: '+15 % Or gagné après chaque combat',
    sigCards: [
      { id: 'g023', name: 'Poing Sukopako Géant', cost: 1, type: 'ATTACK', power: 11, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'SMS', isSecret: false, desc: 'Coup de poing démesuré Master System !' },
      { id: 'g024', name: 'Bracelet Ondes Solaires', cost: 2, type: 'ATTACK', power: 14, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'SMS', isSecret: false, desc: 'Vagues d’énergie sur toute la ligne.' }
    ]
  },
  {
    id: 'gh_ryu',
    name: 'Ryu',
    console: 'ARC',
    title: 'Guerrier Errant Ansatsuken',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance sur les cartes Physiques & Feu',
    sigCards: [
      { id: 'g025', name: 'Shinku Hadoken', cost: 2, type: 'ATTACK', power: 16, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Vague d’énergie concentrée !' },
      { id: 'g026', name: 'Metsu Shoryuken', cost: 2, type: 'ATTACK', power: 17, target: 'SINGLE', element: 'FIRE', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Uppercut du dragon ultime !' }
    ]
  },
  {
    id: 'gh_fox',
    name: 'Fox McCloud',
    console: 'SNES',
    title: 'Leader de l’Escadron Star Fox',
    bonusType: 'ARMOR',
    bonusVal: 5,
    bonusDesc: '+5 Armure Réflecteur & +2 Foudre',
    sigCards: [
      { id: 'g027', name: 'Hyper Laser Arwing', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Tir jumelé depuis l’espace.' },
      { id: 'g028', name: 'Réflecteur Shine Fox', cost: 1, type: 'SHIELD', power: 12, target: 'SELF', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+12 Armure hexagonale.' }
    ]
  },
  {
    id: 'gh_arthur',
    name: 'Sir Arthur',
    console: 'SNES',
    title: 'Chevalier d’Or d’Astaroth',
    bonusType: 'ARMOR',
    bonusVal: 6,
    bonusDesc: '+6 Armure Royale au début du combat',
    sigCards: [
      { id: 'g029', name: 'Dague de Feu Dorée', cost: 1, type: 'ATTACK', power: 11, target: 'SINGLE', element: 'FIRE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Lancer rapide en armure d’or.' },
      { id: 'g030', name: 'Magie du Dragon Doré', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Invocation sacrée de Super Ghouls’n Ghosts.' }
    ]
  },
  {
    id: 'gh_bomberman',
    name: 'Bomberman',
    console: 'PCE',
    title: 'Maître des Explosifs',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Dégâts sur toutes les attaques de zone',
    sigCards: [
      { id: 'g031', name: 'Bombe Dangereuse Géante', cost: 2, type: 'ATTACK', power: 16, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'PCE', isSecret: false, desc: 'Déflagration couvrant toute la salle !' },
      { id: 'g032', name: 'Gilet Ignifugé PC Engine', cost: 1, type: 'SHIELD', power: 11, target: 'SELF', element: 'FIRE', cls: 'ALL', cameoConsole: 'PCE', isSecret: false, desc: '+11 Armure anti-explosion.' }
    ]
  },
  {
    id: 'gh_jim',
    name: 'Earthworm Jim',
    console: 'MD',
    title: 'Héros en Super-Combinaison',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance globale (Groovy !)',
    sigCards: [
      { id: 'g033', name: 'Plasma Blaster Groovy', cost: 2, type: 'ATTACK', power: 15, target: 'SINGLE', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: 'Tir laser déjanté !' },
      { id: 'g034', name: 'Lancer de Vache Cosmique', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'PHYS', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: 'Well done ! Impact céleste.' }
    ]
  },
  {
    id: 'gh_musashi',
    name: 'Joe Musashi',
    console: 'MD',
    title: 'Maître du Clan Oboro',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance Ninja & Poison',
    sigCards: [
      { id: 'g035', name: 'Ninjutsu Ikazuchi', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: 'Bouclier d’éclairs Shinobi III.' },
      { id: 'g036', name: 'Huit Shurikens de l’Ombre', cost: 1, type: 'ATTACK', power: 11, target: 'ALL', element: 'POISON', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: '11 dégâts + 4 Poison à tous.' }
    ]
  },
  {
    id: 'gh_terry',
    name: 'Terry Bogard',
    console: 'ARC',
    title: 'Loup Légendaire de Southtown',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance sur les cartes Feu & Physique',
    sigCards: [
      { id: 'g037', name: 'Power Geyser Triple', cost: 2, type: 'ATTACK', power: 16, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Trois colonnes d’énergie jaillissantes !' },
      { id: 'g038', name: 'Rising Tackle', cost: 1, type: 'ATTACK', power: 11, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Vrille ascendante fulgurante.' }
    ]
  },
  {
    id: 'gh_pit',
    name: 'Pit',
    console: 'NES',
    title: 'Capitaine de la Garde de Palutena',
    bonusType: 'HEAL',
    bonusVal: 4,
    bonusDesc: '+4 Soin & +2 Puissance Sacrée',
    sigCards: [
      { id: 'g039', name: 'Pluie de Flèches Sacrées', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'HOLY', cls: 'ALL', cameoConsole: 'NES', isSecret: false, desc: 'Salve lumineuse d’Angel Land.' },
      { id: 'g040', name: 'Ailes d’Icarus', cost: 1, type: 'SHIELD', power: 12, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'NES', isSecret: false, desc: '+12 Armure céleste.' }
    ]
  },
  {
    id: 'gh_cloud',
    name: 'Cloud Strife',
    console: 'SNES',
    title: 'Soldat 1re Classe 16-Bits',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance sur les attaques Physiques',
    sigCards: [
      { id: 'g041', name: 'Climhazzard 16-Bits', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Estocade ascendante de l’Épée Broyeuse !' },
      { id: 'g042', name: 'Pluie de Météores Limit', cost: 3, type: 'ATTACK', power: 20, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Invocation stellaire dévastatrice.' }
    ]
  },
  {
    id: 'gh_alucard',
    name: 'Alucard Tepes',
    console: 'SNES',
    title: 'Fils de Dracula',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance Arcane & +3 Soin',
    sigCards: [
      { id: 'g043', name: 'Soul Steal Vampirique', cost: 2, type: 'ATTACK', power: 14, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Draine l’énergie vitale de tous les ennemis !' },
      { id: 'g044', name: 'Bouclier d’Alucard', cost: 2, type: 'SHIELD', power: 15, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+15 Armure ancestrale.' }
    ]
  },
  {
    id: 'gh_chunli',
    name: 'Chun-Li',
    console: 'ARC',
    title: 'Première Dame des Jeux de Combat',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance Ninja & Physique',
    sigCards: [
      { id: 'g045', name: 'Spinning Bird Kick', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'PHYS', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Tornade hélicoptère sur tous !' },
      { id: 'g046', name: 'Kikosho Sphère', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'ARCANE', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Explosion de Ki concentrée.' }
    ]
  },
  {
    id: 'gh_zero',
    name: 'Zero',
    console: 'SNES',
    title: 'Chasseur Légendaire au Z-Saber',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance Feu & Foudre',
    sigCards: [
      { id: 'g047', name: 'Genmu Zero Wave', cost: 2, type: 'ATTACK', power: 16, target: 'ALL', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Double croissant d’énergie géant !' },
      { id: 'g048', name: 'Rekkoha Pluie Laser', cost: 3, type: 'ATTACK', power: 20, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Frappe le sol et invoque des piliers de lumière.' }
    ]
  },
  {
    id: 'gh_zelda',
    name: 'Princesse Zelda',
    console: 'SNES',
    title: 'Gardienne de la Triforce de la Sagesse',
    bonusType: 'HEAL',
    bonusVal: 5,
    bonusDesc: '+5 Soin & +3 Puissance Sacrée',
    sigCards: [
      { id: 'g049', name: 'Flèche de Lumière Zelda', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Trait sacré purificateur.' },
      { id: 'g050', name: 'Arc des Esprits', cost: 2, type: 'HEAL', power: 15, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+15 PV & +5 Armure d’Hyrule.' }
    ]
  },
  {
    id: 'gh_knuckles',
    name: 'Knuckles l’Échidné',
    console: 'MD',
    title: 'Gardien de l’Émeraude Maîtresse',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance Physique & Feu',
    sigCards: [
      { id: 'g051', name: 'Poing Spirale Knuckles', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: 'Foreuse ardente d’Angel Island !' },
      { id: 'g052', name: 'Émeraude Maîtresse', cost: 2, type: 'SHIELD', power: 15, target: 'SELF', element: 'LIGHTNING', cls: 'ALL', cameoConsole: 'MD', isSecret: false, desc: '+15 Armure énergétique.' }
    ]
  },
  {
    id: 'gh_ken',
    name: 'Ken Masters',
    console: 'ARC',
    title: 'Maître des Flammes Ansatsuken',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance Feu',
    sigCards: [
      { id: 'g053', name: 'Shoryureppa Ken', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'FIRE', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Triple dragon enflammé !' },
      { id: 'g054', name: 'Tatsumaki Enflammé', cost: 2, type: 'ATTACK', power: 14, target: 'ALL', element: 'FIRE', cls: 'ALL', cameoConsole: 'ARC', isSecret: false, desc: 'Ouragan de feu sur tous.' }
    ]
  },
  {
    id: 'gh_richter',
    name: 'Richter Belmont',
    console: 'PCE',
    title: 'Héros de Rondo of Blood',
    bonusType: 'ATTACK',
    bonusVal: 3,
    bonusDesc: '+3 Puissance Sacrée & Glace',
    sigCards: [
      { id: 'g055', name: 'Hydro Storm Richter', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'HOLY', cls: 'ALL', cameoConsole: 'PCE', isSecret: false, desc: 'Item Crash pluie sacrée !' },
      { id: 'g056', name: 'Fouet de Flammes', cost: 2, type: 'ATTACK', power: 15, target: 'SINGLE', element: 'FIRE', cls: 'ALL', cameoConsole: 'PCE', isSecret: false, desc: 'Frappe ardente du clan Belmont.' }
    ]
  },
  {
    id: 'gh_magus',
    name: 'Magus 600 AD',
    console: 'SNES',
    title: 'Seigneur des Mystiques',
    bonusType: 'ATTACK',
    bonusVal: 4,
    bonusDesc: '+4 Puissance Arcane & Glace',
    sigCards: [
      { id: 'g057', name: 'Matière Noire Magus', cost: 3, type: 'ATTACK', power: 20, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Vortex obscur de 600 AD !' },
      { id: 'g058', name: 'Faux des Mystiques', cost: 2, type: 'ATTACK', power: 16, target: 'SINGLE', element: 'ICE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Entaille glaciale ténébreuse.' }
    ]
  },
  {
    id: 'gh_yoshiknight',
    name: 'Yoshi Chevalier',
    console: 'SNES',
    title: 'Destrier Légendaire de l’Île',
    bonusType: 'HEAL',
    bonusVal: 4,
    bonusDesc: '+4 Soin & +3 Armure au début du combat',
    sigCards: [
      { id: 'g059', name: 'Œuf Géant Yoshi', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'PHYS', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Impact rebondissant sur tous !' },
      { id: 'g060', name: 'Nuage Étoile', cost: 1, type: 'HEAL', power: 13, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+13 PV & +4 Armure.' }
    ]
  },
  {
    id: 'gh_sephiroth',
    name: 'Sephiroth',
    console: 'SNES',
    title: 'Ange Déchu à Une Aile 16-Bits',
    bonusType: 'ATTACK',
    bonusVal: 5,
    bonusDesc: '+5 Puissance sur toutes les Attaques & Arcane',
    sigCards: [
      { id: 'g061', name: 'Octaslash Masamune', cost: 2, type: 'ATTACK', power: 17, target: 'SINGLE', element: 'PHYS', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Huit entailles fulgurantes de la Masamune !' },
      { id: 'g062', name: 'Supernova Céleste', cost: 3, type: 'ATTACK', power: 22, target: 'ALL', element: 'ARCANE', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Cataclysme astral sur tout l’écran !' }
    ]
  },
  {
    id: 'gh_peach',
    name: 'Princesse Peach',
    console: 'SNES',
    title: 'Souveraine du Royaume Champignon',
    bonusType: 'HEAL',
    bonusVal: 5,
    bonusDesc: '+5 Soin & +4 Armure au début du combat',
    sigCards: [
      { id: 'g063', name: 'Thérapie Royale Peach', cost: 2, type: 'HEAL', power: 17, target: 'SELF', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: '+17 PV & +6 Armure bienveillante.' },
      { id: 'g064', name: 'Bombe Psychique SMRPG', cost: 2, type: 'ATTACK', power: 15, target: 'ALL', element: 'HOLY', cls: 'ALL', cameoConsole: 'SNES', isSecret: false, desc: 'Explosion étoilée rose sur tous !' }
    ]
  }
];

const CLASSES = {
  WARRIOR: { id: 'WARRIOR', name: 'Guerrier', icon: '⚔️', primaryStats: ['FOR', 'CHA'], desc: 'Maître des lames et des frappes critiques.' },
  MAGE: { id: 'MAGE', name: 'Archimage', icon: '🔮', primaryStats: ['MAG', 'ESP'], desc: 'Canalisateur des sorts élémentaires 16-bits.' },
  RANGER: { id: 'RANGER', name: 'Rôdeur', icon: '🏹', primaryStats: ['AGI', 'FOR'], desc: 'Tireur d’élite agile et chasseur de trésors.' },
  PALADIN: { id: 'PALADIN', name: 'Paladin', icon: '🛡️', primaryStats: ['CHA', 'ESP'], desc: 'Rempart sacré protégeant toute l’escouade.' },
  NINJA: { id: 'NINJA', name: 'Ninja Shinobi', icon: '🗡️', primaryStats: ['AGI', 'FOR'], desc: 'Assassin furtif adepte du poison et de la vitesse.' },
  BARD: { id: 'BARD', name: 'Barde Chiptune', icon: '🎵', primaryStats: ['ESP', 'CHA'], desc: 'Mélodies 16-bits soignant et galvanisant les alliés.' },
  SUMMONER: { id: 'SUMMONER', name: 'Invocateur', icon: '🐉', primaryStats: ['MAG', 'CHA'], desc: 'Appelle les Espers et familiers légendaires.' },
  TECHNOMANCER: { id: 'TECHNOMANCER', name: 'Technomancien', icon: '🤖', primaryStats: ['MAG', 'AGI'], desc: 'Expert en canons plasma, armures et gadgets.' }
};

const ORIGINS = {
  ROYAL: { id: 'ROYAL', name: 'Sang Royal d’Hyrule', icon: '👑', bonus: '+2 PV Max & +1 CHA' },
  ARCANE_BLOOD: { id: 'ARCANE_BLOOD', name: 'Lignée Esper', icon: '✨', bonus: '+2 MAG & affinité élémentaire' },
  NOMAD: { id: 'NOMAD', name: 'Voyageur Temporel', icon: '⏳', bonus: '+1 AGI & +1 ESP' },
  TEMPLAR: { id: 'TEMPLAR', name: 'Ordre Belmont', icon: '✝️', bonus: '+2 Armure sacrée' },
  SHADOW: { id: 'SHADOW', name: 'Clan Oboro', icon: '🌙', bonus: '+2 AGI & critique furtif' },
  ENGINEER: { id: 'ENGINEER', name: 'Ingénieur Chozo', icon: '⚙️', bonus: '+1 MAG & +1 FOR' }
};

const DUO_COMBOS = [
  { id: 'dc01', name: 'Triade d’Hyrule', cards: ['c002', 'c032'], bonusDmg: 10, bonusHeal: 4, desc: 'Épée de Légende + Bouclier Hylien' },
  { id: 'dc02', name: 'Super Mario World', cards: ['c001', 'c037'], bonusDmg: 9, bonusHeal: 4, desc: 'Boule de Feu + Plume Cape Mario' },
  { id: 'dc03', name: 'Chaos Supersonique', cards: ['c003', 'c042'], bonusDmg: 11, bonusHeal: 0, desc: 'Spin Dash + Chaos Emerald Bleue' },
  { id: 'dc04', name: 'Chasseuse de Zebes', cards: ['c004', 'c047'], bonusDmg: 11, bonusHeal: 3, desc: 'Super Missile + Rayon Gel Metroid' },
  { id: 'dc05', name: 'Protocole Mega Man', cards: ['c005', 'c055'], bonusDmg: 10, bonusHeal: 5, desc: 'Mega Buster + Armure Rush Adaptor' },
  { id: 'dc06', name: 'Croisade Belmont', cards: ['c006', 'c056'], bonusDmg: 11, bonusHeal: 4, desc: 'Fouet Vampire + Eau Bénite' },
  { id: 'dc07', name: 'Rêve Étoilé Kirby', cards: ['c008', 'c061'], bonusDmg: 11, bonusHeal: 5, desc: 'Aspiration Étoile + Épée Ultra Kirby' },
  { id: 'dc08', name: 'Double Tech 1000 AD', cards: ['c009', 'c010'], bonusDmg: 14, bonusHeal: 5, desc: 'Lame Luminaire + Brasier Magitek' },
  { id: 'dc09', name: 'Roi des Dragons', cards: ['c066', 'c069'], bonusDmg: 12, bonusHeal: 8, desc: 'Invocation Bahamut + Soin Max Curaga' },
  { id: 'dc10', name: 'Bataillon Metal Slug', cards: ['c071', 'c074'], bonusDmg: 10, bonusHeal: 6, desc: 'Heavy Machine Gun + Ravitaillement' },
  { id: 'dc11', name: 'Crossover Fatal Fury', cards: ['c072', 'c088'], bonusDmg: 12, bonusHeal: 0, desc: 'Buster Wolf Terry + Hadoken Ryu' },
  { id: 'dc12', name: 'Opéra de Maria & Draco', cards: ['c082', 'c084'], bonusDmg: 12, bonusHeal: 8, desc: 'Aria de Celes + Suplex Train Fantôme' },
  { id: 'dc13', name: 'Fureur Ansatsuken', cards: ['c088', 'c089'], bonusDmg: 12, bonusHeal: 0, desc: 'Hadoken Ryu + Shoryuken Dragon' },
  { id: 'dc14', name: 'Escouade Contra', cards: ['c098', 'c097'], bonusDmg: 10, bonusHeal: 3, desc: 'Tir Fusil Contra + Grenade Frag' },
  { id: 'dc15', name: 'Duo de la Jungle', cards: ['c141', 'c142'], bonusDmg: 10, bonusHeal: 4, desc: 'Tonneau Donkey Kong + Jetpack Diddy' },
  { id: 'dc16', name: 'Chasseurs Maverick', cards: ['c177', 'c178'], bonusDmg: 13, bonusHeal: 0, desc: 'X-Buster Plasma + Sabre Zéro Écarlate' },
  { id: 'dc17', name: 'Double Carapace Mario Kart', cards: ['c171', 'c172'], bonusDmg: 12, bonusHeal: 0, desc: 'Carapace Verte + Carapace Bleue Ailée' },
  { id: 'dc18', name: 'Ocarina & Bottes Pégase', cards: ['c173', 'c174'], bonusDmg: 10, bonusHeal: 6, desc: 'Ocarina des Tempêtes + Botte Pégase' },
  { id: 'dc19', name: 'Tornade d’Angel Island', cards: ['c175', 'c176'], bonusDmg: 11, bonusHeal: 3, desc: 'Tornade Tails + Poing Météore Knuckles' },
  { id: 'dc20', name: 'Arsenal Légendaire 24K', cards: ['c151', 'c152'], bonusDmg: 16, bonusHeal: 8, desc: 'Master Sword 24K + Baguette Étoile 24K' },
  { id: 'dc21', name: 'Symphonie de la Nuit', cards: ['c302', 'c331'], bonusDmg: 13, bonusHeal: 6, desc: 'Loups d’Alucard + Crissaegrim' },
  { id: 'dc22', name: 'Épée de Glace 1000 AD', cards: ['c332', 'c307'], bonusDmg: 13, bonusHeal: 5, desc: 'Double Tech Crono/Marle + Masamune Frog' },
  { id: 'dc23', name: 'X-Strike Légendaire', cards: ['c301', 'c304'], bonusDmg: 14, bonusHeal: 0, desc: 'Braver Cloud Strife + Ryuenjin Zero' },
  { id: 'dc24', name: 'Surtension Phazon Zebes', cards: ['c322', 'c334'], bonusDmg: 14, bonusHeal: 4, desc: 'Rayon Phazon + Rayon Plasma Chozo' },
  { id: 'dc25', name: 'Rivalité Ansatsuken', cards: ['c323', 'c303'], bonusDmg: 13, bonusHeal: 0, desc: 'Shoryureppa Ken + Kikoken Chun-Li' },
  { id: 'dc26', name: 'Jugement des Abysses', cards: ['c337', 'c348'], bonusDmg: 16, bonusHeal: 6, desc: 'Chaos Démoniaque Anima + Pacte Bahamut' },
  { id: 'dc27', name: 'Ange Déchu & Supernova', cards: ['c451', 'c454'], bonusDmg: 17, bonusHeal: 0, desc: 'Masamune Ange Déchu + Supernova Septième Ciel' },
  { id: 'dc28', name: 'Fureur Royale de Peach', cards: ['c452', 'c453'], bonusDmg: 13, bonusHeal: 8, desc: 'Ombrelle Royale + Poêle à Frire Super Peach' },
  { id: 'dc29', name: 'Chevaliers de Baron', cards: ['c457', 'c458'], bonusDmg: 14, bonusHeal: 7, desc: 'Saut Dragon Kain + Chant des Espers' },
  { id: 'dc30', name: 'Ascension Légendes 2350', cards: ['c466', 'c467'], bonusDmg: 18, bonusHeal: 10, desc: 'Supernova Séraphin 24K + Couronne Peach 24K' }
];

const RELICS = [
  { id: 'r_star_piece', name: 'Fragment d’Étoile SMRPG', icon: '⭐', price: 85, desc: '+2 Puissance sur toutes les cartes' },
  { id: 'r_etank', name: 'Réservoir E-Tank Chozo', icon: '🔋', price: 80, desc: '+6 Armure au début de chaque combat' },
  { id: 'r_power_glove', name: 'Power Glove NES', icon: '🧤', price: 85, desc: '+3 Puissance sur les cartes Physiques' },
  { id: 'r_golden_coin', name: 'Pièce Dragon Yoshi', icon: '🪙', price: 90, desc: '+20 % Or gagné après chaque combat' },
  { id: 'r_phoenix_down', name: 'Plume de Phénix FF', icon: '🪶', price: 80, desc: '+3 Soin sur toutes les cartes de soin' },
  { id: 'r_bomb_bag', name: 'Sac de Bombes Goron', icon: '💣', price: 85, desc: '+3 Dégâts sur les attaques de zone' },
  { id: 'r_warp_whistle', name: 'Flûte Magique Mario 3', icon: '🪈', price: 95, desc: '+15 % EXP gagnée par les héros' },
  { id: 'r_heart_container', name: 'Réceptacle de Cœur', icon: '❤️', price: 90, desc: '+6 PV Max permanents à toute l’escouade' },
  { id: 'r_magic_mirror', name: 'Miroir Magique ALTTP', icon: '🪞', price: 85, desc: '+2 Armure chaque fois qu’un sort est joué' },
  { id: 'r_hermes_sandals', name: 'Sandales d’Hermès', icon: '👟', price: 80, desc: '+10 % Charge Limit Break à chaque carte' },
  { id: 'r_dragon_scale', name: 'Écaille de Bahamut', icon: '🐉', price: 95, desc: '+3 Dégâts sur les Familiers invoqués' },
  { id: 'r_chrono_trigger', name: 'Œuf du Temps Chrono', icon: '⏳', price: 110, desc: 'Sauve automatiquement l’escouade 1 fois par run' },
  { id: 'r_ocarina', name: 'Ocarina d’Or', icon: '🎶', price: 85, desc: '+2 Soin & +2 Bouclier sur les cartes défensives' },
  { id: 'r_pegasus_boots', name: 'Bottes de Pégase', icon: '👢', price: 105, desc: '+1 PA supplémentaire au Tour 1' },
  { id: 'r_chocobo_feather', name: 'Plume de Chocobo', icon: '🐤', price: 100, desc: '+1 Carte piochée au début du combat' },
  { id: 'r_rainbow_shell', name: 'Coquille Arc-en-Ciel', icon: '🌈', price: 95, desc: '+3 Puissance sur toutes les Attaques' },
  { id: 'r_mana_ring', name: 'Bague de l’Arbre Mana', icon: '💍', price: 90, desc: '+3 Puissance sur Feu, Glace, Foudre & Arcane' },
  { id: 'r_light_crystal', name: 'Cristal de Lumière FF', icon: '💎', price: 100, desc: '+4 Armure initiale & +2 Puissance globale' },
  { id: 'r_invisibility_cape', name: 'Cape Magique d’Hyrule', icon: '🧥', price: 90, desc: '+6 Armure au début du combat' },
  { id: 'r_triforce_wisdom', name: 'Triforce de la Sagesse', icon: '🔺', price: 115, desc: '+2 Puissance globale & +15 % Or' }
];

const EVENTS = [
  {
    id: 'ev01',
    title: 'La Fontaine des Fées d’Hyrule',
    icon: '🧚',
    text: 'Une grande fée émerge d’un bassin scintillant en musique 16-bits et propose de bénir votre escouade.',
    choices: [
      { label: 'Baigner l’escouade (+18 PV à tous)', type: 'HEAL', val: 18, desc: 'Restaure 18 PV' },
      { label: 'Offrir une prière (+55 Or & +15 EXP)', type: 'GOLD', val: 55, desc: '+55 Or' }
    ]
  },
  {
    id: 'ev02',
    title: 'L’Atelier Aéronef de Cid',
    icon: '🔧',
    text: 'Cid ajuste les moteurs à vapeur Magitek et vous propose des pièces de rechange.',
    choices: [
      { label: 'Améliorer les armes (+65 Or)', type: 'GOLD', val: 65, desc: '+65 Or' },
      { label: 'Réparer les armures (+14 PV)', type: 'HEAL', val: 14, desc: '+14 PV' }
    ]
  },
  {
    id: 'ev03',
    title: 'Le Dojo Secret de Maître Gouken',
    icon: '🥋',
    text: 'Un vieux maître d’arts martiaux vous invite à méditer devant une cascade.',
    choices: [
      { label: 'Entraînement intensif (+35 EXP escouade)', type: 'EXP', val: 35, desc: '+35 EXP' },
      { label: 'Repos réparateur (+16 PV)', type: 'HEAL', val: 16, desc: '+16 PV' }
    ]
  },
  {
    id: 'ev04',
    title: 'Le Marchand Ambulant de Zeal',
    icon: '🧙',
    text: 'Un mystérieux marchand flottant ouvre son manteau rempli de reliques anciennes.',
    choices: [
      { label: 'Accepter son cadeau (Relique aléatoire)', type: 'RELIC', val: 1, desc: '+1 Relique' },
      { label: 'Prendre une bourse dorée (+70 Or)', type: 'GOLD', val: 70, desc: '+70 Or' }
    ]
  },
  {
    id: 'ev05',
    title: 'La Clairière des Champignons 1-UP',
    icon: '🍄',
    text: 'Des blocs dorés flottent au-dessus d’un sentier verdoyant.',
    choices: [
      { label: 'Frapper les blocs (+75 Or)', type: 'GOLD', val: 75, desc: '+75 Or' },
      { label: 'Manger un Super Champignon (+16 PV)', type: 'HEAL', val: 16, desc: '+16 PV' }
    ]
  },
  {
    id: 'ev06',
    title: 'La Statue Chozo de Zebes',
    icon: '🗿',
    text: 'Une statue ancienne tient une sphère d’énergie lumineuse entre ses mains.',
    choices: [
      { label: 'Absorber l’énergie (+20 PV)', type: 'HEAL', val: 20, desc: '+20 PV' },
      { label: 'Analyser les données (+30 EXP)', type: 'EXP', val: 30, desc: '+30 EXP' }
    ]
  },
  {
    id: 'ev07',
    title: 'La Taverne des Chasseurs Belmont',
    icon: '🕯️',
    text: 'Des chasseurs de vampires partagent leurs provisions autour d’un feu.',
    choices: [
      { label: 'Partager le festin (+15 PV)', type: 'HEAL', val: 15, desc: '+15 PV' },
      { label: 'Collecter la prime (+60 Or)', type: 'GOLD', val: 60, desc: '+60 Or' }
    ]
  },
  {
    id: 'ev08',
    title: 'La Salle d’Arcade Neo-Geo MVS',
    icon: '🕹️',
    text: 'Une borne d’arcade rouge clignote au milieu du donjon avec un crédit gratuit !',
    choices: [
      { label: 'Battre le High-Score (+80 Or)', type: 'GOLD', val: 80, desc: '+80 Or' },
      { label: 'Mode Coopération (+30 EXP)', type: 'EXP', val: 30, desc: '+30 EXP' }
    ]
  },
  {
    id: 'ev09',
    title: 'La Forêt Cachée des Chocobos',
    icon: '🐤',
    text: 'Un Chocobo doré gratte le sol et déterre un coffre enfoui.',
    choices: [
      { label: 'Ouvrir le coffre (+75 Or)', type: 'GOLD', val: 75, desc: '+75 Or' },
      { label: 'Caresser le Chocobo (+16 PV)', type: 'HEAL', val: 16, desc: '+16 PV' }
    ]
  },
  {
    id: 'ev10',
    title: 'La Forge Volcanique des Gorons',
    icon: '🌋',
    text: 'Biggoron propose de tremper vos lames dans la lave sacrée.',
    choices: [
      { label: 'Forger un artefact (+1 Relique)', type: 'RELIC', val: 1, desc: '+1 Relique' },
      { label: 'Vendre des minerais (+70 Or)', type: 'GOLD', val: 70, desc: '+70 Or' }
    ]
  },
  {
    id: 'ev11',
    title: 'Le Campement de Chrono Trigger',
    icon: '🔥',
    text: 'Le feu crépite doucement dans la forêt de Fiona sous un ciel étoilé.',
    choices: [
      { label: 'Se reposer jusqu’à l’aube (+20 PV)', type: 'HEAL', val: 20, desc: '+20 PV' },
      { label: 'Discuter du futur (+35 EXP)', type: 'EXP', val: 35, desc: '+35 EXP' }
    ]
  },
  {
    id: 'ev12',
    title: 'Le Coffre Piégé de Mimic',
    icon: '📦',
    text: 'Un coffre doré respire doucement... mais regorge de pièces.',
    choices: [
      { label: 'Forcer la serrure (+90 Or)', type: 'GOLD', val: 90, desc: '+90 Or' },
      { label: 'Passer prudemment (+25 EXP)', type: 'EXP', val: 25, desc: '+25 EXP' }
    ]
  },
  {
    id: 'ev13',
    title: 'Le Sanctuaire de la Master Sword',
    icon: '🗡️',
    text: 'Trois piédestaux brillent dans la brume des Bois Perdus.',
    choices: [
      { label: 'Saisir la bénédiction (+1 Relique)', type: 'RELIC', val: 1, desc: '+1 Relique' },
      { label: 'Méditer devant l’épée (+35 EXP)', type: 'EXP', val: 35, desc: '+35 EXP' }
    ]
  },
  {
    id: 'ev14',
    title: 'L’Atelier de Geppetto SMRPG',
    icon: '🎭',
    text: 'Une marionnette étoilée anime des jouets mécaniques dans l’ombre.',
    choices: [
      { label: 'Récupérer des Fragments (+75 Or)', type: 'GOLD', val: 75, desc: '+75 Or' },
      { label: 'Soigner l’équipe (+16 PV)', type: 'HEAL', val: 16, desc: '+16 PV' }
    ]
  },
  {
    id: 'ev15',
    title: 'Le Laboratoire Secret du Dr. Wily',
    icon: '🤖',
    text: 'Vous découvrez des réserves d’énergie E-Tank abandonnées.',
    choices: [
      { label: 'Boire un E-Tank (+22 PV)', type: 'HEAL', val: 22, desc: '+22 PV' },
      { label: 'Pirater les plans (+70 Or)', type: 'GOLD', val: 70, desc: '+70 Or' }
    ]
  },
  {
    id: 'ev16',
    title: 'La Salle du Trône de Zeal',
    icon: '👑',
    text: 'Un cristal de Mammon pulse d’une énergie arcanique infinie.',
    choices: [
      { label: 'Puiser dans le cristal (+40 EXP)', type: 'EXP', val: 40, desc: '+40 EXP' },
      { label: 'Récolter l’or royal (+85 Or)', type: 'GOLD', val: 85, desc: '+85 Or' }
    ]
  },
  {
    id: 'ev17',
    title: 'La Caverne des Chocobos Dorés',
    icon: '✨',
    text: 'Un troupeau de Chocobos rares vous entoure joyeusement.',
    choices: [
      { label: 'Suivre le Chocobo Doré (+1 Relique)', type: 'RELIC', val: 1, desc: '+1 Relique' },
      { label: 'Danser avec eux (+18 PV)', type: 'HEAL', val: 18, desc: '+18 PV' }
    ]
  },
  {
    id: 'ev18',
    title: 'Le Dojo de Ryu Hayabusa',
    icon: '🥷',
    text: 'Des parchemins ninja anciens sont exposés sur un autel en bois.',
    choices: [
      { label: 'Étudier les techniques (+35 EXP)', type: 'EXP', val: 35, desc: '+35 EXP' },
      { label: 'Prendre le trésor du clan (+75 Or)', type: 'GOLD', val: 75, desc: '+75 Or' }
    ]
  },
  {
    id: 'ev19',
    title: 'La Tour de Kefka',
    icon: '🤡',
    text: 'Des statues magiques s’alignent le long d’un balcon vertigineux.',
    choices: [
      { label: 'Piller le coffre impérial (+95 Or)', type: 'GOLD', val: 95, desc: '+95 Or' },
      { label: 'Canaliser la magie (+35 EXP)', type: 'EXP', val: 35, desc: '+35 EXP' }
    ]
  },
  {
    id: 'ev20',
    title: 'Le Vaisseau Blue Falcon F-Zero',
    icon: '🏎️',
    text: 'Captain Falcon répare son bolide sur une piste magnétique.',
    choices: [
      { label: 'Prime de course (+85 Or)', type: 'GOLD', val: 85, desc: '+85 Or' },
      { label: 'Recharge bouclier (+18 PV)', type: 'HEAL', val: 18, desc: '+18 PV' }
    ]
  },
  {
    id: 'ev21',
    title: 'L’Autel de l’Émeraude Maîtresse',
    icon: '💚',
    text: 'L’Émeraude géante lévite paisiblement sur Angel Island.',
    choices: [
      { label: 'Recevoir sa bénédiction (+20 PV)', type: 'HEAL', val: 20, desc: '+20 PV' },
      { label: 'Absorber sa puissance (+1 Relique)', type: 'RELIC', val: 1, desc: '+1 Relique' }
    ]
  },
  {
    id: 'ev22',
    title: 'La Bibliothèque d’Alucard',
    icon: '📚',
    text: 'Des grimoires volants tournoient autour d’un bibliothécaire mystérieux.',
    choices: [
      { label: 'Lire les chroniques (+40 EXP)', type: 'EXP', val: 40, desc: '+40 EXP' },
      { label: 'Acheter une relique rare (+1 Relique)', type: 'RELIC', val: 1, desc: '+1 Relique' }
    ]
  }
];

const QUIZZES = [
  { id: 'qz01', question: 'Quelle est l’année de sortie de la Super Nintendo (Super Famicom) au Japon ?', options: ['1988', '1990', '1992'], answerIdx: 1, rewardGold: 65 },
  { id: 'qz02', question: 'Comment s’appelle le compagnon dinosaure vert de Mario apparu dans Super Mario World ?', options: ['Birdo', 'Yoshi', 'Koopa'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz03', question: 'Dans The Legend of Zelda: A Link to the Past, quel objet permet de voyager entre les mondes ?', options: ['Le Miroir Magique', 'L’Ocarina', 'Le Grappin'], answerIdx: 0, rewardGold: 65 },
  { id: 'qz04', question: 'Quel compositeur a signé les musiques légendaires de Final Fantasy VI ?', options: ['Koji Kondo', 'Nobuo Uematsu', 'Yuzo Koshiro'], answerIdx: 1, rewardGold: 65 },
  { id: 'qz05', question: 'Quelle cartouche Mega Drive permettait d’encastrer Sonic 2 ou Sonic 3 sur son port supérieur ?', options: ['32X', 'Sonic & Knuckles', 'Game Genie'], answerIdx: 1, rewardGold: 70 },
  { id: 'qz06', question: 'Combien de processeurs graphiques / sonores rendent célèbre la puce audio de la SNES ?', options: ['Sony SPC700', 'Yamaha YM2612', 'Ricoh 2A03'], answerIdx: 0, rewardGold: 70 },
  { id: 'qz07', question: 'Quel est le nom du vaisseau de Fox McCloud dans Star Fox (SNES) ?', options: ['Blue Falcon', 'Arwing', 'Vic Viper'], answerIdx: 1, rewardGold: 65 },
  { id: 'qz08', question: 'Dans Chrono Trigger, quelle époque abrite le Royaume flottant de Zeal ?', options: ['600 AD', '12 000 BC', '2300 AD'], answerIdx: 1, rewardGold: 70 },
  { id: 'qz09', question: 'Quel héros utilise le fouet légendaire « Vampire Killer » ?', options: ['Ryu Hayabusa', 'Simon Belmont', 'Sir Arthur'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz10', question: 'Quelle attaque spéciale Ryu et Ken partagent-ils dans Street Fighter II ?', options: ['Sonic Boom', 'Hadoken', 'Buster Wolf'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz11', question: 'Sur quelle console portable monochrome Kirby a-t-il fait ses débuts en 1992 ?', options: ['Game Gear', 'Game Boy', 'Lynx'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz12', question: 'Dans Super Metroid, quelle planète Samus Aran explore-t-elle ?', options: ['SR388', 'Zebes', 'Tallon IV'], answerIdx: 1, rewardGold: 65 },
  { id: 'qz13', question: 'Quel personnage de Final Fantasy VI peut faire un Suplex sur un train fantôme ?', options: ['Edgar', 'Sabin', 'Locke'], answerIdx: 1, rewardGold: 70 },
  { id: 'qz14', question: 'Quelle célèbre séquence de touches commence par Haut, Haut, Bas, Bas... ?', options: ['Code Konami', 'Code Debug Sonic', 'Code Justin Bailey'], answerIdx: 0, rewardGold: 65 },
  { id: 'qz15', question: 'Quel est le nom du chien robot rouge fidèle de Mega Man ?', options: ['Protoman', 'Rush', 'Beat'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz16', question: 'Dans Donkey Kong Country (SNES), quel studio britannique a créé les graphismes pré-calculés ?', options: ['Rare', 'Square', 'Capcom'], answerIdx: 0, rewardGold: 65 },
  { id: 'qz17', question: 'Quel est le cri emblématique de Terry Bogard lors de son Buster Wolf ?', options: ['Are you OK?!', 'Hadoken!', 'Show me your moves!'], answerIdx: 0, rewardGold: 70 },
  { id: 'qz18', question: 'Quelle console 16-bits utilisait des HuCards au format carte de crédit ?', options: ['Neo-Geo AES', 'PC Engine', 'Master System'], answerIdx: 1, rewardGold: 70 },
  { id: 'qz19', question: 'Dans Secret of Mana, combien de joueurs pouvaient jouer simultanément avec le Multitap SNES ?', options: ['2 joueurs', '3 joueurs', '4 joueurs'], answerIdx: 1, rewardGold: 70 },
  { id: 'qz20', question: 'Quel méchant principal affronte-t-on dans Mega Man X sur SNES ?', options: ['Dr. Wily', 'Sigma', 'Bison'], answerIdx: 1, rewardGold: 65 },
  { id: 'qz21', question: 'Quel est le nom de l’épée géante portée par Cloud Strife ?', options: ['Masamune', 'Buster Sword', 'Excalibur'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz22', question: 'Dans Castlevania: Symphony of the Night, qui est le héros principal ?', options: ['Alucard', 'Richter', 'Trevor'], answerIdx: 0, rewardGold: 65 },
  { id: 'qz23', question: 'Combien d’Émeraudes du Chaos faut-il réunir pour devenir Super Sonic ?', options: ['5', '7', '8'], answerIdx: 1, rewardGold: 65 },
  { id: 'qz24', question: 'Quel studio a développé Super Mario RPG sur Super Nintendo ?', options: ['Square', 'Enix', 'Konami'], answerIdx: 0, rewardGold: 70 },
  { id: 'qz25', question: 'Dans Streets of Rage 2 (Mega Drive), qui a composé la bande-son culte ?', options: ['Yuzo Koshiro', 'Hiroki Kikuta', 'Yasunori Mitsuda'], answerIdx: 0, rewardGold: 70 },
  { id: 'qz26', question: 'Quel est le nom de la princesse du Royaume Champignon ?', options: ['Zelda', 'Peach', 'Daisy'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz27', question: 'Dans Metal Slug, quel cri pousse le prisonnier libéré qui vous offre une arme ?', options: ['Thank you!', 'Groovy!', 'Kupo!'], answerIdx: 0, rewardGold: 65 },
  { id: 'qz28', question: 'Quelle créature blanche avec un pompon rouge dit toujours « Kupo » ?', options: ['Chocobo', 'Mog', 'Pampa'], answerIdx: 1, rewardGold: 60 },
  { id: 'qz29', question: 'Quel chevalier de Ghosts’n Goblins perd son armure au premier coup reçu ?', options: ['Sir Arthur', 'Cecil', 'Kain'], answerIdx: 0, rewardGold: 65 },
  { id: 'qz30', question: 'Quel est le titre complet du 3e épisode de Zelda sorti sur Super Nintendo ?', options: ['Link’s Awakening', 'A Link to the Past', 'Ocarina of Time'], answerIdx: 1, rewardGold: 65 }
];

const TROPHIES = [
  { id: 'tr01', name: 'Premiers Pas 16-Bits', icon: '🥾', desc: 'Remporter votre tout premier combat dans le donjon.' },
  { id: 'tr02', name: 'Collectionneur Débutant', icon: '🃏', desc: 'Débloquer 25 cartes différentes dans l’Album.' },
  { id: 'tr03', name: 'Chasseur de Boss', icon: '👑', desc: 'Vaincre votre premier Gardien Boss d’étage.' },
  { id: 'tr04', name: 'Duo Légendaire', icon: '⚡', desc: 'Déclencher un Combo Duo 16-Bits en combat.' },
  { id: 'tr05', name: 'Souffleur de Cartouche', icon: '🌬️', desc: 'Nettoyer une cartouche poussiéreuse.' },
  { id: 'tr06', name: 'Alchimiste Rétro', icon: '⚗️', desc: 'Synthétiser une Carte Secrète dans l’Alambic.' },
  { id: 'tr07', name: 'Forgeron 24 Carats', icon: '🔨', desc: 'Forger une carte jusqu’en finition Or 24K.' },
  { id: 'tr08', name: 'Code Konami Activé', icon: '🕹️', desc: 'Entrer le célèbre code secret sur le Menu Principal.' },
  { id: 'tr09', name: 'Invocateur de Familiers', icon: '🐤', desc: 'Invoquer une Mascotte rétro sur le terrain.' },
  { id: 'tr10', name: 'Allié d’Élite', icon: '🌟', desc: 'Recruter un Héros Invité dans votre escouade.' },
  { id: 'tr11', name: 'Maître des Mini-Sets', icon: '✨', desc: 'Compléter intégralement un Mini-Set Thématique.' },
  { id: 'tr12', name: 'Érudit Arcade', icon: '🎓', desc: 'Réussir un Quiz Rétrogaming dans le donjon.' },
  { id: 'tr13', name: 'Explorateur des Profondeurs', icon: '🏰', desc: 'Atteindre l’Étage 5 du donjon.' },
  { id: 'tr14', name: 'Seigneur du Donjon', icon: '🔥', desc: 'Atteindre l’Étage 10 du donjon.' },
  { id: 'tr15', name: 'Encyclopédiste 100', icon: '🐉', desc: 'Découvrir 100 créatures dans le Bestiaire.' },
  { id: 'tr16', name: 'Archive 200 Cartes', icon: '📘', desc: 'Débloquer 200 cartes différentes.' },
  { id: 'tr17', name: 'Archive 350 Cartes', icon: '📙', desc: 'Débloquer 350 cartes différentes.' },
  { id: 'tr18', name: 'Collectionneur 450', icon: '🏆', desc: 'Débloquer les 450 cartes TCG de base.' },
  { id: 'tr19', name: 'Master Set 500', icon: '💎', desc: 'Remplir 500 cases du Master Set.' },
  { id: 'tr20', name: 'Master Set 1 200', icon: '💠', desc: 'Remplir 1 200 cases du Master Set.' },
  { id: 'tr21', name: 'Master Set 2 000', icon: '👑', desc: 'Remplir 2 000 cases du Master Set.' },
  { id: 'tr22', name: 'Vétéran Niveau 10', icon: '⬆️', desc: 'Faire monter un héros au Niveau 10.' },
  { id: 'tr23', name: 'Chasseur de Reliques', icon: '🏺', desc: 'Posséder 5 Reliques simultanément.' },
  { id: 'tr24', name: 'Fortune de Dragon', icon: '💰', desc: 'Accumuler 1 000 pièces d’Or.' },
  { id: 'tr25', name: 'Limit Break Absolu', icon: '💥', desc: 'Déclencher une attaque Limit Break à 100 %.' },
  { id: 'tr26', name: 'Surcharge Critique', icon: '⚡', desc: 'Utiliser le Mode Surcharge x1.6 en combat.' },
  { id: 'tr27', name: 'Résonance Élémentaire', icon: '🔗', desc: 'Enchaîner deux cartes du même élément.' },
  { id: 'tr28', name: 'Peintre Pixel Art IA', icon: '🎨', desc: 'Générer une illustration IA Flash.' },
  { id: 'tr29', name: 'Ascension Héroïque', icon: '😈', desc: 'Terminer un combat en Mode Ascension 5+.' },
  { id: 'tr30', name: 'Légende Super Nintendo', icon: '🌟', desc: 'Débloquer 25 Trophées du jeu.' }
];

const LOCKON_CARTS = [
  { id: 'cart_none', name: 'Aucune Cartouche Lock-On', icon: '⬜', desc: 'Mode cartouche standard sans modificateur.' },
  { id: 'cart_sonic_knuckles', name: 'Sonic & Knuckles Lock-On', icon: '🦔', desc: 'Booste les Mini-Sets complétés (+2 Puissance globale).' },
  { id: 'cart_gamegenie', name: 'Game Genie 16-Bits', icon: '🧞', desc: '+3 Puissance sur toutes les cartes jouées.' },
  { id: 'cart_actionreplay', name: 'Pro Action Replay', icon: '🛡️', desc: '+5 Armure au début de chaque combat.' },
  { id: 'cart_supergameboy', name: 'Super Game Boy Adapter', icon: '🟢', desc: '+15 % Or gagné après chaque victoire.' },
  { id: 'cart_satellaview', name: 'Satellaview BS-X', icon: '📡', desc: '+20 % EXP gagnée par toute l’escouade.' },
  { id: 'cart_sufami', name: 'SuFami Turbo Double', icon: '👯', desc: '+5 Dégâts bonus sur les Combos Duo.' },
  { id: 'cart_64dd', name: 'Extension 64DD Magnétique', icon: '💾', desc: '+15 % Charge Limit Break à chaque carte.' },
  { id: 'cart_neogeocd', name: 'Neo-Geo Arcade Stick', icon: '🕹️', desc: '+4 Puissance sur les cartes Cameo Arcade.' }
];

const CARD_BACKS = [
  { id: 'back_snes', name: 'Super Nintendo Classique', icon: '🎮', bg: 'from-slate-800 via-indigo-950 to-slate-900', border: 'border-indigo-400', desc: 'Les 4 couleurs mythiques rouge, jaune, bleu, vert.' },
  { id: 'back_gameboy', name: 'Game Boy Dot-Matrix', icon: '🟩', bg: 'from-lime-950 via-emerald-950 to-lime-900', border: 'border-lime-400', desc: 'Écran vert olive rétro 1989.' },
  { id: 'back_famicom', name: 'Famicom Rouge & Or', icon: '🟥', bg: 'from-red-950 via-amber-950 to-red-900', border: 'border-amber-400', desc: 'L’élégance bordeaux et dorée 8-bits.' },
  { id: 'back_megadrive', name: 'Mega Drive 16-BIT', icon: '🟦', bg: 'from-slate-950 via-blue-950 to-cyan-950', border: 'border-cyan-400', desc: 'Grille néon bleue Blast Processing.' },
  { id: 'back_gold24k', name: 'Cartouche Zelda Dorée 24K', icon: '👑', bg: 'from-amber-900 via-yellow-800 to-amber-950', border: 'border-yellow-300', desc: 'Édition collector dorée légendaire.' }
];

const DUNGEON_BIOMES = [
  { id: 'forest', name: 'Bois Perdus & Clairière des Fées', icon: '🌿', wallGrad: 'from-emerald-950 via-teal-950 to-slate-950', floorGrad: 'from-emerald-950 to-slate-950', accent: 'border-emerald-400/70', particle: '✨', prompt: '16-bit SNES RPG Secret of Mana enchanted emerald forest temple path with sunbeams and glowing fairies, crisp pixel art' },
  { id: 'stone', name: 'Citadelle d’Hyrule & Vitraux', icon: '🏰', wallGrad: 'from-indigo-950 via-slate-900 to-slate-950', floorGrad: 'from-slate-900 to-indigo-950', accent: 'border-amber-400/70', particle: '🔸', prompt: '16-bit SNES RPG Hyrule castle royal hall with stained glass windows, golden banners and stone pillars, crisp pixel art' },
  { id: 'zeal', name: 'Palais Céleste de Zeal', icon: '☁️', wallGrad: 'from-sky-950 via-indigo-950 to-slate-950', floorGrad: 'from-sky-950 to-indigo-950', accent: 'border-cyan-300/75', particle: '💠', prompt: '16-bit SNES Chrono Trigger Kingdom of Zeal floating marble palace with azure sky and glowing blue crystals, crisp pixel art' },
  { id: 'volcano', name: 'Forges Volcaniques Goron', icon: '🌋', wallGrad: 'from-red-950 via-stone-900 to-amber-950', floorGrad: 'from-stone-900 to-red-950', accent: 'border-orange-500/70', particle: '🔥', prompt: '16-bit SNES RPG volcanic lava cavern dungeon with glowing magma rivers and carved obsidian pillars, crisp pixel art' },
  { id: 'angel_island', name: 'Ruines Solaires d’Angel Island', icon: '🏛️', wallGrad: 'from-amber-950 via-emerald-950 to-slate-950', floorGrad: 'from-amber-950 to-teal-950', accent: 'border-yellow-300/70', particle: '🌟', prompt: '16-bit SNES Sonic Angel Island ancient golden ruins with turquoise waterfalls and lush jungle vines, crisp pixel art' },
  { id: 'crystal', name: 'Sanctuaire des Cristaux Éternels', icon: '🔮', wallGrad: 'from-purple-950 via-indigo-950 to-slate-950', floorGrad: 'from-purple-950 to-slate-950', accent: 'border-fuchsia-400/70', particle: '💎', prompt: '16-bit SNES RPG luminous prism crystal cavern glowing violet, cyan and magenta, crisp pixel art' },
  { id: 'magitek', name: 'Forteresse Magitek & Zebes', icon: '⚙️', wallGrad: 'from-cyan-950 via-slate-900 to-emerald-950', floorGrad: 'from-slate-900 to-cyan-950', accent: 'border-emerald-400/70', particle: '⚡', prompt: '16-bit SNES sci-fi Magitek industrial fortress hallway with glowing neon conduits, crisp pixel art' },
  { id: 'gothic', name: 'Château Lunaire de Castlevania', icon: '🦇', wallGrad: 'from-purple-950 via-slate-950 to-rose-950', floorGrad: 'from-slate-950 to-purple-950', accent: 'border-rose-400/70', particle: '🕯️', prompt: '16-bit SNES gothic vampire castle hall with full moon stained glass and candelabras, crisp pixel art' }
];

const DUNGEON_STRUCTURES = [
  { id: 'labyrinth', name: 'Labyrinthe Ancien', desc: 'Couloirs sinueux remplis de secrets.' },
  { id: 'pillars', name: 'Grande Salle à Piliers', desc: 'Chambres ouvertes et salles aux trésors.' },
  { id: 'wings', name: 'Ailes Jumelles & Pont', desc: 'Deux ailes symétriques reliées au centre.' },
  { id: 'citadel', name: 'Citadelle Concentrique', desc: 'Anneaux fortifiés autour du sanctuaire.' },
  { id: 'serpent', name: 'Catacombes en S', desc: 'Parcours tactique en zigzag.' }
];

const ALL_CARDS_LIST = [
  ...RAW_CARDS.map((r) => ({
    id: r[0],
    name: r[1],
    cost: r[2],
    type: r[3],
    power: r[4],
    target: r[5],
    element: r[6],
    cls: r[7],
    cameoConsole: r[8],
    isSecret: Boolean(r[9]),
    desc: r[10]
  })),
  ...GUEST_HEROES.flatMap((g) => g.sigCards)
];

const ALL_CARDS_MAP = ALL_CARDS_LIST.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

const MONSTERS_LIST = RAW_MONSTERS.map((m) => ({
  id: m[0],
  name: m[1],
  console: m[2],
  spriteType: m[3],
  maxHp: m[4],
  atk: m[5],
  gold: m[6],
  exp: m[7],
  game: m[8],
  isBoss: false
}));

const BOSSES_LIST = RAW_BOSSES.map((b) => ({
  id: b[0],
  name: b[1],
  console: b[2],
  spriteType: b[3],
  maxHp: b[4],
  atk: b[5],
  gold: b[6],
  exp: b[7],
  game: b[8],
  title: b[9] || 'Gardien d’Étage',
  isBoss: true
}));

const ALL_CREATURES_LIST = [...MONSTERS_LIST, ...BOSSES_LIST];
const ALL_CREATURES_MAP = ALL_CREATURES_LIST.reduce((acc, cr) => {
  acc[cr.id] = cr;
  return acc;
}, {});

// ============================================================================
// 2. SYNTHÉTISEUR AUDIO 16-BITS POLYPHONIQUE (PUCE SONY SPC700)
// ============================================================================
const RETRO_AUDIO = (() => {
  let ctx = null;
  let bgmTimer = null;
  let currentTrack = null;
  let stepIdx = 0;
  let musicEnabled = true;
  let sfxEnabled = true;

  const ensureCtx = () => {
    if (typeof window === 'undefined') return null;
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  };

  // Notes MIDI -> Fréquence Hz
  const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Voix SPC700 filtrée (chorus doux + passe-bas 16-bits)
  const playVoice = (midi, dur, type = 'triangle', vol = 0.06, detune = 0, cutoff = 2200) => {
    const c = ensureCtx();
    if (!c || !midi) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(midiToFreq(midi), now);
    if (detune) osc.detune.setValueAtTime(detune, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(cutoff, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  };

  const playDrum = (kind) => {
    const c = ensureCtx();
    if (!c) return;
    const now = c.currentTime;
    if (kind === 'kick') {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(135, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (kind === 'snare' || kind === 'hat') {
      const bufSize = Math.floor(c.sampleRate * (kind === 'snare' ? 0.11 : 0.04));
      const buf = c.createBuffer(1, bufSize, c.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = c.createBufferSource();
      noise.buffer = buf;
      const filter = c.createBiquadFilter();
      filter.type = kind === 'snare' ? 'bandpass' : 'highpass';
      filter.frequency.setValueAtTime(kind === 'snare' ? 1400 : 5500, now);
      const gain = c.createGain();
      gain.gain.setValueAtTime(kind === 'snare' ? 0.055 : 0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (kind === 'snare' ? 0.11 : 0.04));
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(c.destination);
      noise.start(now);
    }
  };

  // Partitions polyphoniques 64 pas (A-A'-B-C) inspirées SNES JRPG
  const TRACKS = {
    MENU: {
      tempo: 195,
      lead: [
        64,0,67,71, 72,0,71,67, 69,0,72,76, 74,0,71,0,
        64,0,67,71, 72,0,74,76, 79,0,76,74, 72,0,0,0,
        69,0,72,76, 77,0,76,72, 67,0,71,74, 76,0,72,0,
        65,0,69,72, 74,0,72,69, 67,0,71,74, 72,0,0,0
      ],
      arp: [
        52,55,59,55, 52,55,59,55, 57,60,64,60, 55,59,62,59,
        52,55,59,55, 52,55,59,55, 55,59,62,59, 52,55,59,55,
        57,60,64,60, 53,57,60,57, 55,59,62,59, 52,55,59,55,
        53,57,60,57, 53,57,60,57, 55,59,62,59, 52,55,59,55
      ],
      bass: [
        40,0,40,0, 40,0,40,0, 45,0,45,0, 43,0,43,0,
        40,0,40,0, 40,0,40,0, 43,0,43,0, 40,0,40,0,
        45,0,45,0, 41,0,41,0, 43,0,43,0, 40,0,40,0,
        41,0,41,0, 41,0,41,0, 43,0,43,0, 40,0,40,0
      ],
      drums: false
    },
    DUNGEON: {
      tempo: 230,
      lead: [
        57,0,60,0, 64,0,63,0, 64,0,67,0, 64,0,60,0,
        57,0,60,0, 65,0,64,0, 62,0,59,0, 57,0,0,0,
        60,0,64,0, 67,0,69,0, 67,0,64,0, 62,0,60,0,
        59,0,62,0, 64,0,62,0, 59,0,56,0, 57,0,0,0
      ],
      arp: [
        45,48,52,48, 45,48,52,48, 45,48,52,48, 45,48,52,48,
        45,48,52,48, 41,45,48,45, 43,47,50,47, 45,48,52,48,
        48,52,55,52, 48,52,55,52, 48,52,55,52, 43,47,50,47,
        40,44,47,44, 40,44,47,44, 40,44,47,44, 45,48,52,48
      ],
      bass: [
        33,0,0,33, 0,0,33,0, 36,0,0,36, 0,0,33,0,
        33,0,0,33, 29,0,0,29, 31,0,0,31, 33,0,0,0,
        36,0,0,36, 0,0,36,0, 36,0,0,36, 31,0,0,31,
        28,0,0,28, 0,0,28,0, 28,0,31,0, 33,0,0,0
      ],
      drums: false
    },
    COMBAT: {
      tempo: 138,
      lead: [
        64,64,67,69, 71,0,69,67, 69,69,72,74, 76,0,74,72,
        71,0,74,0, 76,74,72,71, 69,0,71,0, 72,0,0,0,
        76,76,74,72, 71,71,72,74, 72,72,71,69, 67,0,64,0,
        69,0,72,0, 74,0,76,0, 79,76,74,71, 76,0,0,0
      ],
      arp: [
        52,55,59,55, 52,55,59,55, 57,60,64,60, 57,60,64,60,
        55,59,62,59, 55,59,62,59, 57,60,64,60, 48,52,55,52,
        52,55,59,55, 55,59,62,59, 57,60,64,60, 52,55,59,55,
        53,57,60,57, 55,59,62,59, 55,59,62,59, 52,55,59,55
      ],
      bass: [
        40,40,40,40, 40,40,40,40, 45,45,45,45, 45,45,45,45,
        43,43,43,43, 43,43,43,43, 45,45,45,45, 36,36,36,36,
        40,40,40,40, 43,43,43,43, 45,45,45,45, 40,40,40,40,
        41,41,41,41, 43,43,43,43, 43,43,43,43, 40,40,40,40
      ],
      drums: true
    },
    BOSS: {
      tempo: 122,
      lead: [
        52,53,52,55, 52,53,52,58, 57,55,53,52, 53,52,50,49,
        52,53,52,55, 58,57,55,53, 64,0,63,0, 64,0,0,0,
        64,65,64,67, 64,65,64,70, 69,67,65,64, 65,64,62,61,
        64,67,70,73, 76,73,70,67, 64,0,58,0, 64,0,0,0
      ],
      arp: [
        40,43,46,43, 40,43,46,43, 41,44,47,44, 41,44,47,44,
        40,43,46,43, 40,43,46,43, 40,43,46,43, 40,43,46,43,
        52,55,58,55, 52,55,58,55, 53,56,59,56, 53,56,59,56,
        52,55,58,55, 52,55,58,55, 52,55,58,55, 52,55,58,55
      ],
      bass: [
        28,28,28,28, 28,28,28,28, 29,29,29,29, 29,29,29,29,
        28,28,28,28, 28,28,28,28, 28,28,31,31, 28,28,28,28,
        40,40,40,40, 40,40,40,40, 41,41,41,41, 41,41,41,41,
        40,40,40,40, 40,40,40,40, 40,40,34,34, 40,40,40,40
      ],
      drums: true
    }
  };

  const tick = () => {
    if (!musicEnabled || !currentTrack) return;
    const t = TRACKS[currentTrack] || TRACKS.MENU;
    const i = stepIdx % 64;
    const lNote = t.lead[i];
    const aNote = t.arp[i];
    const bNote = t.bass[i];
    if (lNote) {
      playVoice(lNote, 0.24, 'triangle', 0.048, -5, 2400);
      playVoice(lNote, 0.24, 'sawtooth', 0.018, 6, 1700);
    }
    if (aNote) playVoice(aNote, 0.14, 'triangle', 0.022, 0, 1600);
    if (bNote) playVoice(bNote, 0.18, 'sine', 0.065, 0, 900);
    if (t.drums) {
      if (i % 4 === 0) playDrum('kick');
      else if (i % 4 === 2) playDrum('snare');
      else playDrum('hat');
    }
    stepIdx = (stepIdx + 1) % 64;
  };

  const setTrack = (trackName) => {
    if (currentTrack === trackName && bgmTimer) return;
    currentTrack = trackName;
    stepIdx = 0;
    if (bgmTimer) clearInterval(bgmTimer);
    if (!musicEnabled || !trackName) return;
    const t = TRACKS[trackName] || TRACKS.MENU;
    bgmTimer = setInterval(tick, t.tempo);
  };

  const setMusicEnabled = (val) => {
    musicEnabled = val;
    if (!val) {
      if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
      }
    } else if (currentTrack) {
      const tr = currentTrack;
      currentTrack = null;
      setTrack(tr);
    }
  };

  const setSfxEnabled = (val) => {
    sfxEnabled = val;
  };

  const sfx = (type) => {
    if (!sfxEnabled) return;
    ensureCtx();
    switch (type) {
      case 'step':
        playVoice(43, 0.05, 'triangle', 0.04, 0, 800);
        break;
      case 'attack':
        playVoice(67, 0.08, 'sawtooth', 0.06, 0, 2600);
        setTimeout(() => playVoice(55, 0.12, 'square', 0.05, 0, 1800), 45);
        break;
      case 'crit':
        [72, 76, 79, 84].forEach((n, idx) =>
          setTimeout(() => playVoice(n, 0.14, 'triangle', 0.07, 4, 3200), idx * 45)
        );
        break;
      case 'heal':
        [64, 68, 71, 76].forEach((n, idx) =>
          setTimeout(() => playVoice(n, 0.18, 'sine', 0.06, 0, 3000), idx * 55)
        );
        break;
      case 'shield':
        playVoice(52, 0.09, 'square', 0.045, 0, 1500);
        setTimeout(() => playVoice(64, 0.14, 'triangle', 0.055, 0, 2200), 50);
        break;
      case 'gold':
        playVoice(83, 0.07, 'square', 0.05, 0, 3500);
        setTimeout(() => playVoice(88, 0.18, 'square', 0.055, 0, 4000), 65);
        break;
      case 'booster':
        [60, 64, 67, 72, 76, 79, 84].forEach((n, idx) =>
          setTimeout(() => playVoice(n, 0.16, 'triangle', 0.065, 5, 3600), idx * 45)
        );
        break;
      case 'hurt':
        playVoice(45, 0.12, 'sawtooth', 0.07, -12, 1100);
        setTimeout(() => playVoice(38, 0.16, 'sawtooth', 0.07, 12, 900), 55);
        break;
      case 'victory':
        [64, 64, 64, 64, 60, 62, 64, 62, 64].forEach((n, idx) =>
          setTimeout(() => playVoice(n, idx === 8 ? 0.35 : 0.11, 'triangle', 0.07, 4, 3200), idx * 95)
        );
        break;
      case 'levelup':
        [60, 64, 67, 72, 76, 79, 84, 88].forEach((n, idx) =>
          setTimeout(() => playVoice(n, 0.2, 'triangle', 0.075, 5, 3800), idx * 60)
        );
        break;
      default:
        playVoice(69, 0.08, 'triangle', 0.04, 0, 2000);
    }
  };

  return { setTrack, setMusicEnabled, setSfxEnabled, sfx };
})();

// ============================================================================
// 3. STOCKAGE INDEXEDDB & MOTEUR PIXEL ART IA FLASH (GEMINI 3.1 FLASH IMAGE)
// ============================================================================
const IDB_NAME = 'RetroDungeonTCG_DB_v1';
const IDB_STORE = 'kv_store';

const openIdb = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('No IndexedDB'));
      return;
    }
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const idbGet = async (key) => {
  try {
    const db = await openIdb();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

const idbSet = async (key, value) => {
  try {
    const db = await openIdb();
    await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch {
    // Ignore storage quota errors gracefully
  }
};

const idbGetAllSprites = async () => {
  try {
    const db = await openIdb();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const reqKeys = store.getAllKeys();
      reqKeys.onsuccess = async () => {
        const keys = (reqKeys.result || []).filter((k) => typeof k === 'string' && k.startsWith('sprite_'));
        const map = {};
        for (const k of keys) {
          const val = await idbGet(k);
          if (val) map[k.replace('sprite_', '')] = val;
        }
        resolve(map);
      };
      reqKeys.onerror = () => resolve({});
    });
  } catch {
    return {};
  }
};

// Fallback SVG Pixel Art 16-bits instantané pendant ou hors génération IA
const PixelSpriteSVG = ({ type = 'knight', element = 'PHYS', className = 'w-16 h-16' }) => {
  const palette = {
    FIRE: ['#f97316', '#ef4444', '#fde047'],
    ICE: ['#38bdf8', '#0284c7', '#e0f2fe'],
    LIGHTNING: ['#facc15', '#eab308', '#fef08a'],
    HOLY: ['#fde047', '#f59e0b', '#ffffff'],
    ARCANE: ['#c084fc', '#9333ea', '#f3e8ff'],
    POISON: ['#4ade80', '#16a34a', '#bbf7d0'],
    PHYS: ['#94a3b8', '#475569', '#f8fafc']
  }[element] || ['#60a5fa', '#2563eb', '#dbeafe'];

  return (
    <svg viewBox="0 0 16 16" shapeRendering="crispEdges" className={className}>
      <rect x="2" y="2" width="12" height="12" fill="#0f172a" opacity="0.45" />
      {type === 'slime' ? (
        <>
          <rect x="5" y="4" width="6" height="2" fill={palette[0]} />
          <rect x="3" y="6" width="10" height="5" fill={palette[0]} />
          <rect x="2" y="10" width="12" height="3" fill={palette[1]} />
          <rect x="5" y="8" width="2" height="2" fill="#ffffff" />
          <rect x="9" y="8" width="2" height="2" fill="#ffffff" />
          <rect x="6" y="9" width="1" height="1" fill="#0f172a" />
          <rect x="10" y="9" width="1" height="1" fill="#0f172a" />
        </>
      ) : type === 'dragon' || type === 'beast' ? (
        <>
          <rect x="3" y="3" width="3" height="3" fill={palette[2]} />
          <rect x="10" y="3" width="3" height="3" fill={palette[2]} />
          <rect x="4" y="5" width="8" height="7" fill={palette[0]} />
          <rect x="3" y="10" width="10" height="3" fill={palette[1]} />
          <rect x="5" y="7" width="2" height="2" fill="#fde047" />
          <rect x="9" y="7" width="2" height="2" fill="#fde047" />
        </>
      ) : type === 'robot' || type === 'ufo' ? (
        <>
          <rect x="6" y="2" width="4" height="2" fill={palette[2]} />
          <rect x="4" y="4" width="8" height="7" fill={palette[0]} />
          <rect x="5" y="6" width="6" height="2" fill="#38bdf8" />
          <rect x="3" y="11" width="10" height="3" fill={palette[1]} />
        </>
      ) : type === 'ghost' ? (
        <>
          <rect x="5" y="3" width="6" height="2" fill={palette[2]} />
          <rect x="4" y="5" width="8" height="7" fill={palette[0]} />
          <rect x="4" y="12" width="2" height="2" fill={palette[1]} />
          <rect x="7" y="12" width="2" height="2" fill={palette[1]} />
          <rect x="10" y="12" width="2" height="2" fill={palette[1]} />
          <rect x="5" y="7" width="2" height="2" fill="#ef4444" />
          <rect x="9" y="7" width="2" height="2" fill="#ef4444" />
        </>
      ) : (
        <>
          <rect x="5" y="2" width="6" height="2" fill={palette[2]} />
          <rect x="4" y="4" width="8" height="4" fill={palette[0]} />
          <rect x="5" y="6" width="6" height="2" fill="#fef08a" />
          <rect x="3" y="8" width="10" height="5" fill={palette[1]} />
          <rect x="12" y="4" width="2" height="8" fill={palette[2]} />
        </>
      )}
    </svg>
  );
};

// Effets visuels Pixel Art Super Nintendo déclenchés lors des attaques, soins et boucliers
const CombatPixelVFX = ({ vfx }) => {
  if (!vfx) return null;
  const kind = vfx.type === 'HEAL' ? 'HEAL' : vfx.type === 'SHIELD' || vfx.type === 'SKILL' ? 'SHIELD' : vfx.element || 'PHYS';

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="snes-vfx-burst flex flex-col items-center justify-center">
        {kind === 'FIRE' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_14px_rgba(249,115,22,0.95)]">
            <rect x="10" y="2" width="4" height="4" fill="#fef08a" />
            <rect x="8" y="6" width="8" height="4" fill="#f97316" />
            <rect x="5" y="10" width="14" height="6" fill="#ef4444" />
            <rect x="8" y="11" width="8" height="5" fill="#fde047" />
            <rect x="7" y="16" width="10" height="4" fill="#dc2626" />
            <rect x="10" y="14" width="4" height="4" fill="#ffffff" />
          </svg>
        )}
        {kind === 'ICE' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_14px_rgba(56,189,248,0.95)]">
            <rect x="11" y="2" width="2" height="20" fill="#e0f2fe" />
            <rect x="2" y="11" width="20" height="2" fill="#e0f2fe" />
            <rect x="6" y="6" width="12" height="12" fill="#38bdf8" opacity="0.85" />
            <rect x="8" y="8" width="8" height="8" fill="#bae6fd" />
            <rect x="10" y="10" width="4" height="4" fill="#ffffff" />
          </svg>
        )}
        {kind === 'LIGHTNING' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_16px_rgba(250,204,21,0.98)]">
            <rect x="12" y="1" width="5" height="4" fill="#fef08a" />
            <rect x="9" y="5" width="6" height="4" fill="#facc15" />
            <rect x="6" y="9" width="11" height="3" fill="#ffffff" />
            <rect x="10" y="12" width="6" height="4" fill="#facc15" />
            <rect x="7" y="16" width="5" height="4" fill="#eab308" />
            <rect x="5" y="20" width="4" height="3" fill="#fef08a" />
          </svg>
        )}
        {kind === 'HOLY' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_16px_rgba(253,224,71,0.95)]">
            <rect x="10" y="1" width="4" height="22" fill="#fef08a" />
            <rect x="3" y="8" width="18" height="4" fill="#fef08a" />
            <rect x="11" y="3" width="2" height="18" fill="#ffffff" />
            <rect x="5" y="9" width="14" height="2" fill="#ffffff" />
          </svg>
        )}
        {kind === 'ARCANE' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_16px_rgba(192,132,252,0.95)]">
            <rect x="6" y="4" width="12" height="2" fill="#e879f9" />
            <rect x="4" y="6" width="2" height="12" fill="#c084fc" />
            <rect x="18" y="6" width="2" height="12" fill="#c084fc" />
            <rect x="6" y="18" width="12" height="2" fill="#e879f9" />
            <rect x="8" y="8" width="8" height="8" fill="#9333ea" />
            <rect x="10" y="10" width="4" height="4" fill="#f5d0fe" />
          </svg>
        )}
        {kind === 'POISON' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_14px_rgba(74,222,128,0.95)]">
            <rect x="7" y="4" width="10" height="8" fill="#4ade80" />
            <rect x="5" y="7" width="14" height="6" fill="#22c55e" />
            <rect x="8" y="8" width="2" height="2" fill="#052e16" />
            <rect x="14" y="8" width="2" height="2" fill="#052e16" />
            <rect x="8" y="14" width="8" height="4" fill="#86efac" />
            <rect x="9" y="18" width="2" height="3" fill="#4ade80" />
            <rect x="13" y="18" width="2" height="3" fill="#4ade80" />
          </svg>
        )}
        {kind === 'SHIELD' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_15px_rgba(56,189,248,0.95)]">
            <rect x="5" y="3" width="14" height="3" fill="#fde047" />
            <rect x="4" y="6" width="16" height="8" fill="#0284c7" />
            <rect x="6" y="7" width="12" height="6" fill="#38bdf8" />
            <rect x="6" y="14" width="12" height="4" fill="#0369a1" />
            <rect x="9" y="18" width="6" height="3" fill="#fde047" />
          </svg>
        )}
        {kind === 'HEAL' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_15px_rgba(52,211,153,0.95)]">
            <rect x="10" y="4" width="4" height="16" fill="#34d399" />
            <rect x="4" y="10" width="16" height="4" fill="#34d399" />
            <rect x="11" y="6" width="2" height="12" fill="#ecfdf5" />
            <rect x="6" y="11" width="12" height="2" fill="#ecfdf5" />
          </svg>
        )}
        {kind === 'PHYS' && (
          <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className="w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_14px_rgba(255,255,255,0.95)]">
            <rect x="18" y="2" width="4" height="4" fill="#ffffff" />
            <rect x="14" y="6" width="4" height="4" fill="#fef08a" />
            <rect x="10" y="10" width="4" height="4" fill="#ffffff" />
            <rect x="6" y="14" width="4" height="4" fill="#facc15" />
            <rect x="2" y="18" width="4" height="4" fill="#ffffff" />
          </svg>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 4. VUE DONJON 16-BITS EN PERSPECTIVE 3 PAS (EXPLORATION & INTERACTIONS)
// ============================================================================
const DungeonTorchPixelArt = ({ side = 'left' }) => (
  <div className="flex flex-col items-center pointer-events-none">
    <svg
      viewBox="0 0 12 16"
      shapeRendering="crispEdges"
      className={`w-7 h-9 sm:w-8 sm:h-11 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)] ${
        side === 'right' ? 'scale-x-[-1]' : ''
      }`}
    >
      {/* Flamme 16-bits animée */}
      <rect x="5" y="1" width="2" height="2" fill="#fef08a" className="animate-pulse" />
      <rect x="4" y="3" width="4" height="2" fill="#fb923c" />
      <rect x="3" y="5" width="6" height="3" fill="#ef4444" />
      <rect x="5" y="5" width="2" height="2" fill="#ffffff" />
      {/* Vasque & support mural en fer forgé */}
      <rect x="3" y="8" width="6" height="2" fill="#facc15" />
      <rect x="4" y="10" width="4" height="3" fill="#475569" />
      <rect x="2" y="12" width="3" height="2" fill="#334155" />
    </svg>
  </div>
);

const DungeonEncounterPixelArt = ({ tile, sizeClass = 'w-20 h-20 sm:w-24 sm:h-24' }) => {
  switch (tile) {
    case 'BOSS':
      return (
        <svg viewBox="0 0 24 24" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_14px_rgba(250,204,21,0.85)]`}>
          <rect x="3" y="2" width="18" height="20" fill="#7f1d1d" />
          <rect x="2" y="1" width="20" height="2" fill="#facc15" />
          <rect x="2" y="3" width="2" height="19" fill="#facc15" />
          <rect x="20" y="3" width="2" height="19" fill="#facc15" />
          <rect x="11" y="3" width="2" height="19" fill="#450a0a" />
          {/* Emblème Couronne & Rubis */}
          <rect x="8" y="6" width="8" height="2" fill="#fde047" />
          <rect x="7" y="8" width="10" height="4" fill="#f59e0b" />
          <rect x="11" y="9" width="2" height="2" fill="#ef4444" />
          {/* Poignées dorées */}
          <rect x="8" y="14" width="2" height="3" fill="#fde047" />
          <rect x="14" y="14" width="2" height="3" fill="#fde047" />
        </svg>
      );
    case 'CHEST':
      return (
        <svg viewBox="0 0 20 18" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]`}>
          <rect x="3" y="4" width="14" height="4" fill="#b45309" />
          <rect x="2" y="4" width="16" height="2" fill="#facc15" />
          <rect x="2" y="8" width="16" height="8" fill="#92400e" />
          <rect x="2" y="8" width="16" height="2" fill="#fde047" />
          <rect x="2" y="14" width="16" height="2" fill="#facc15" />
          <rect x="2" y="4" width="2" height="12" fill="#facc15" />
          <rect x="16" y="4" width="2" height="12" fill="#facc15" />
          {/* Serrure rubis */}
          <rect x="8" y="7" width="4" height="5" fill="#fde047" />
          <rect x="9" y="9" width="2" height="2" fill="#ef4444" />
          {/* Étincelles */}
          <rect x="4" y="1" width="2" height="2" fill="#ffffff" className="animate-ping" />
          <rect x="15" y="2" width="2" height="2" fill="#fef08a" />
        </svg>
      );
    case 'FOUNTAIN':
      return (
        <svg viewBox="0 0 22 20" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_12px_rgba(56,189,248,0.85)]`}>
          <rect x="9" y="2" width="4" height="3" fill="#e0f2fe" />
          <rect x="7" y="5" width="8" height="3" fill="#38bdf8" />
          <rect x="5" y="8" width="12" height="4" fill="#0284c7" />
          <rect x="8" y="7" width="6" height="2" fill="#bae6fd" />
          {/* Vasque en marbre */}
          <rect x="3" y="12" width="16" height="3" fill="#e2e8f0" />
          <rect x="5" y="15" width="12" height="3" fill="#94a3b8" />
          <rect x="4" y="3" width="2" height="2" fill="#f472b6" />
          <rect x="16" y="4" width="2" height="2" fill="#fde047" />
        </svg>
      );
    case 'FORGE':
      return (
        <svg viewBox="0 0 20 18" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]`}>
          <rect x="3" y="6" width="14" height="3" fill="#94a3b8" />
          <rect x="2" y="7" width="3" height="2" fill="#cbd5e1" />
          <rect x="6" y="9" width="8" height="4" fill="#475569" />
          <rect x="4" y="13" width="12" height="3" fill="#78350f" />
          {/* Braises ardentes */}
          <rect x="7" y="4" width="6" height="2" fill="#f97316" />
          <rect x="9" y="2" width="2" height="2" fill="#fde047" />
        </svg>
      );
    case 'CAMPFIRE':
      return (
        <svg viewBox="0 0 20 18" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_14px_rgba(251,146,60,0.9)]`}>
          <rect x="9" y="2" width="2" height="3" fill="#fef08a" />
          <rect x="7" y="5" width="6" height="3" fill="#f97316" />
          <rect x="6" y="8" width="8" height="4" fill="#ef4444" />
          <rect x="8" y="8" width="4" height="3" fill="#fde047" />
          {/* Bûches croisées */}
          <rect x="4" y="12" width="12" height="2" fill="#92400e" />
          <rect x="5" y="14" width="10" height="2" fill="#78350f" />
        </svg>
      );
    case 'MYSTERY_BLOCK':
      return (
        <svg viewBox="0 0 18 18" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_14px_rgba(250,204,21,0.9)]`}>
          <rect x="2" y="2" width="14" height="14" fill="#f59e0b" />
          <rect x="2" y="2" width="14" height="2" fill="#fef08a" />
          <rect x="2" y="2" width="2" height="14" fill="#fde047" />
          <rect x="14" y="2" width="2" height="14" fill="#b45309" />
          <rect x="2" y="14" width="14" height="2" fill="#b45309" />
          {/* Point d'interrogation pixelisé */}
          <rect x="7" y="5" width="4" height="2" fill="#ffffff" />
          <rect x="10" y="7" width="2" height="2" fill="#ffffff" />
          <rect x="8" y="9" width="2" height="2" fill="#ffffff" />
          <rect x="8" y="12" width="2" height="2" fill="#ffffff" />
        </svg>
      );
    case 'EVENT':
      return (
        <svg viewBox="0 0 20 20" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_14px_rgba(192,132,252,0.9)]`}>
          <rect x="6" y="2" width="8" height="2" fill="#e879f9" />
          <rect x="4" y="4" width="12" height="12" fill="#7e22ce" />
          <rect x="6" y="6" width="8" height="8" fill="#38bdf8" />
          <rect x="8" y="8" width="4" height="4" fill="#ffffff" />
          <rect x="6" y="16" width="8" height="2" fill="#e879f9" />
        </svg>
      );
    case 'AMBUSH':
      return (
        <svg viewBox="0 0 22 20" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_12px_rgba(249,115,22,0.85)]`}>
          <rect x="4" y="4" width="6" height="12" fill="#1e1b4b" />
          <rect x="12" y="4" width="6" height="12" fill="#1e1b4b" />
          <rect x="5" y="7" width="2" height="2" fill="#facc15" />
          <rect x="8" y="7" width="1" height="2" fill="#facc15" />
          <rect x="13" y="7" width="2" height="2" fill="#f97316" />
          <rect x="16" y="7" width="1" height="2" fill="#f97316" />
        </svg>
      );
    case 'ENEMY':
    default:
      return (
        <svg viewBox="0 0 20 20" shapeRendering="crispEdges" className={`${sizeClass} drop-shadow-[0_0_12px_rgba(244,63,94,0.85)]`}>
          <rect x="4" y="2" width="2" height="3" fill="#fde047" />
          <rect x="14" y="2" width="2" height="3" fill="#fde047" />
          <rect x="5" y="5" width="10" height="9" fill="#be123c" />
          <rect x="4" y="12" width="12" height="5" fill="#881337" />
          <rect x="6" y="7" width="3" height="2" fill="#fef08a" />
          <rect x="11" y="7" width="3" height="2" fill="#fef08a" />
          <rect x="7" y="11" width="6" height="2" fill="#ffffff" />
        </svg>
      );
  }
};

const DungeonFirstPersonView = ({
  grid,
  pos,
  dir,
  biome,
  floor,
  stepAnim,
  dustyScreen,
  onBlowDust,
  onMoveForward,
  onTurnLeft,
  onTurnRight,
  onInteractCell,
  bgSprite,
  activeGuest,
  wallSecret,
  onClaimWallSecret
}) => {
  const dirs = [
    { dx: 0, dy: -1, label: 'N' },
    { dx: 1, dy: 0, label: 'E' },
    { dx: 0, dy: 1, label: 'S' },
    { dx: -1, dy: 0, label: 'O' }
  ];
  const curDir = dirs[dir] || dirs[0];
  const leftDir = dirs[(dir + 3) % 4];
  const rightDir = dirs[(dir + 1) % 4];

  const getTile = (x, y) => {
    if (!grid || y < 0 || y >= grid.length || x < 0 || x >= grid[0].length) return 'WALL';
    return grid[y][x];
  };

  // Inspection sur 3 niveaux de profondeur (1, 2 et 3 pas devant)
  const front1 = getTile(pos.x + curDir.dx, pos.y + curDir.dy);
  const front2 = front1 !== 'WALL' ? getTile(pos.x + curDir.dx * 2, pos.y + curDir.dy * 2) : 'WALL';
  const front3 = front1 !== 'WALL' && front2 !== 'WALL' ? getTile(pos.x + curDir.dx * 3, pos.y + curDir.dy * 3) : 'WALL';

  const left1 = getTile(pos.x + leftDir.dx, pos.y + leftDir.dy);
  const right1 = getTile(pos.x + rightDir.dx, pos.y + rightDir.dy);
  const left2 = front1 !== 'WALL' ? getTile(pos.x + curDir.dx + leftDir.dx, pos.y + curDir.dy + leftDir.dy) : 'WALL';
  const right2 = front1 !== 'WALL' ? getTile(pos.x + curDir.dx + rightDir.dx, pos.y + curDir.dy + rightDir.dy) : 'WALL';
  const currentTile = getTile(pos.x, pos.y);

  const touchStartRef = useRef(null);

  const encounterLabels = {
    BOSS: { text: '👑 PORTE DU GARDIEN', cls: 'bg-red-950/95 border-amber-400 text-amber-300' },
    ENEMY: { text: '⚔️ MONSTRE EN GARDE', cls: 'bg-rose-950/95 border-rose-400 text-rose-200' },
    AMBUSH: { text: '⚠️ OMBRE SUSPECTE', cls: 'bg-amber-950/95 border-orange-400 text-orange-200' },
    CHEST: { text: '✨ COFFRE AU TRÉSOR', cls: 'bg-amber-950/95 border-yellow-300 text-yellow-200' },
    FOUNTAIN: { text: '⛲ FONTAINE DES FÉES', cls: 'bg-cyan-950/95 border-cyan-300 text-cyan-200' },
    EVENT: { text: '🔮 PORTAIL DE ZEAL', cls: 'bg-purple-950/95 border-purple-300 text-purple-200' },
    FORGE: { text: '🔨 ENCLUME & BOUTIQUE', cls: 'bg-orange-950/95 border-amber-400 text-amber-200' },
    CAMPFIRE: { text: '🔥 FEU DE CAMP (+PV/EXP)', cls: 'bg-orange-950/95 border-amber-300 text-amber-200' },
    MYSTERY_BLOCK: { text: '🟨 BLOC MYSTÈRE [?]', cls: 'bg-yellow-950/95 border-yellow-300 text-yellow-200' }
  };

  const renderTileVisual = (tile, sizeClass = 'w-20 h-20 sm:w-24 sm:h-24') => {
    const info = encounterLabels[tile];
    if (!info) return null;
    return (
      <div className={`flex flex-col items-center ${tile === 'CHEST' || tile === 'BOSS' || tile === 'MYSTERY_BLOCK' ? 'animate-bounce' : ''}`}>
        <div className={`px-2.5 py-0.5 border-2 rounded text-[11px] font-black mb-1 shadow-lg whitespace-nowrap ${info.cls}`}>
          {info.text}
        </div>
        <DungeonEncounterPixelArt tile={tile} sizeClass={sizeClass} />
      </div>
    );
  };

  // Réplique JRPG vivante du Héros Invité selon la salle
  const guestLine = useMemo(() => {
    const gName = activeGuest?.name || 'Compagnon';
    if (wallSecret) return `${gName} : « Regarde sur la paroi ! Un ${wallSecret.label} scintille ! »`;
    if (front1 === 'BOSS') return `${gName} : « Une puissance colossale émane derrière cette porte dorée… »`;
    if (front1 === 'CHEST') return `${gName} : « Un coffre au trésor 16-bits juste devant nous ! »`;
    if (front1 === 'FOUNTAIN') return `${gName} : « L’eau cristalline de cette fontaine va revigorer l’escouade. »`;
    if (front1 === 'CAMPFIRE') return `${gName} : « Un feu de camp chaleureux ! Prenons un instant pour souffler. »`;
    if (front1 === 'MYSTERY_BLOCK') return `${gName} : « Un Bloc Mystère [?] flotte dans l’air ! Sautons dessus ! »`;
    if (front1 === 'AMBUSH') return `${gName} : « Restez sur vos gardes, des silhouettes rôdent dans l’ombre… »`;
    if (front1 === 'ENEMY') return `${gName} : « Un gardien bloque le passage ! Préparez vos cartes ! »`;
    if (front1 === 'FORGE') return `${gName} : « On entend le marteau d’un forgeron tout près ! »`;
    return `${gName} : « Nous explorons ${biome.name}… Quel panorama 16-bits ! »`;
  }, [activeGuest, wallSecret, front1, biome.name]);

  return (
    <div className="space-y-2">
      <div
        className={`relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-4 ${biome.accent} bg-gradient-to-b ${biome.wallGrad} shadow-2xl select-none cursor-pointer`}
        onTouchStart={(e) => {
          if (e.touches?.[0]) {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        }}
        onTouchEnd={(e) => {
          if (!touchStartRef.current || !e.changedTouches?.[0]) return;
          const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
          const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
          touchStartRef.current = null;
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) onTurnLeft();
            else onTurnRight();
          } else if (dy < -30) {
            onMoveForward();
          }
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const relX = (e.clientX - rect.left) / rect.width;
          if (relX < 0.25) onTurnLeft();
          else if (relX > 0.75) onTurnRight();
          else onMoveForward();
        }}
      >
        {/* Décor Biome Pixel Art IA Pleine Luminosité */}
        {bgSprite && (
          <img
            src={bgSprite}
            alt={biome.name}
            className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        )}

        {/* Voûte Supérieure & Frise Sculptée SNES */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/60 via-transparent to-black/15 pointer-events-none" />
        <div className="absolute top-10 inset-x-12 h-2 border-b-2 border-amber-300/30 pointer-events-none" />

        {/* Sol en Perspective Mode-7 */}
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t ${biome.floorGrad} opacity-80 border-t-2 border-amber-300/30 pointer-events-none`}
        >
          <div
            className="w-full h-full opacity-35"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(253,224,71,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(253,224,71,0.22) 1px, transparent 1px)',
              backgroundSize: '40px 24px'
            }}
          />
        </div>

        {/* Particules Féeriques / Braises Flottantes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-14 left-1/4 text-sm animate-bounce opacity-80">{biome.particle || '✨'}</span>
          <span className="absolute top-20 right-1/3 text-xs animate-pulse opacity-75">{biome.particle || '✨'}</span>
          <span className="absolute bottom-16 left-1/3 text-sm animate-pulse opacity-80">{biome.particle || '✨'}</span>
        </div>

        {/* Couloir 3D Multi-Profondeurs */}
        <div
          className={`relative w-full h-full flex items-center justify-center transition-transform duration-150 ${
            stepAnim === 'forward'
              ? 'scale-105'
              : stepAnim === 'left'
              ? '-translate-x-2'
              : stepAnim === 'right'
              ? 'translate-x-2'
              : ''
          }`}
        >
          {/* Profondeur 3 (lointain) */}
          <div className="absolute w-40 h-32 border-2 border-amber-200/20 bg-black/45 flex items-center justify-center rounded-sm">
            {front3 !== 'WALL' && front3 !== 'EMPTY' && (
              <div className="scale-50 opacity-75">
                <DungeonEncounterPixelArt tile={front3} sizeClass="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Profondeur 2 (mi-distance) */}
          <div
            className={`absolute w-72 h-52 border-2 ${
              front2 === 'WALL' ? 'border-amber-400/40 bg-slate-950/60' : 'border-amber-200/25 bg-black/25'
            } flex items-center justify-center transition-all rounded-sm`}
          >
            {/* Embrasures latérales à 2 pas */}
            {left2 !== 'WALL' && (
              <div className="absolute -left-7 inset-y-4 w-7 bg-black/55 border-y-2 border-l-2 border-amber-300/25" />
            )}
            {right2 !== 'WALL' && (
              <div className="absolute -right-7 inset-y-4 w-7 bg-black/55 border-y-2 border-r-2 border-amber-300/25" />
            )}

            {front2 === 'WALL' ? (
              <div className="px-3 py-1 rounded bg-slate-950/70 border border-amber-400/30 text-[10px] font-mono tracking-widest text-amber-200/75">
                ARCHE ANCIENNE
              </div>
            ) : (
              <div className="scale-75 opacity-95">{renderTileVisual(front2, 'w-16 h-16')}</div>
            )}
          </div>

          {/* Profondeur 1 (1 pas devant vous) */}
          {front1 === 'WALL' ? (
            <div className="relative z-10 w-80 sm:w-[26rem] h-60 border-4 border-amber-400/60 bg-gradient-to-b from-slate-800/90 to-slate-950/90 shadow-2xl flex flex-col items-center justify-center rounded-lg">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 22px, #000 22px, #000 24px), repeating-linear-gradient(90deg, transparent, transparent 44px, #000 44px, #000 46px)'
                }}
              />
              {/* Bas-relief décoratif sur le mur frontal */}
              <div className="relative z-10 px-4 py-2 rounded-xl bg-slate-950/80 border-2 border-amber-400/50 text-center">
                <div className="text-2xl mb-1">{biome.icon}</div>
                <div className="text-xs font-black tracking-widest text-amber-200 uppercase">Paroi Sculptée</div>
                <div className="text-[11px] text-cyan-200 mt-0.5">Pivotez à gauche ou à droite</div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center">
              {renderTileVisual(front1, 'w-24 h-24 sm:w-28 sm:h-28')}
            </div>
          )}

          {/* Murs ou Couloirs latéraux immédiats (Gauche & Droite) avec Torches Pixel Art */}
          <div
            className={`absolute left-0 inset-y-3 w-14 sm:w-24 border-r-2 ${
              left1 === 'WALL'
                ? 'bg-gradient-to-r from-slate-950/90 to-slate-800/75 border-amber-400/45'
                : 'bg-black/45 border-emerald-400/55'
            } flex flex-col items-center justify-center`}
          >
            {left1 === 'WALL' ? (
              <DungeonTorchPixelArt side="left" />
            ) : (
              <span className="px-2 py-1 rounded bg-emerald-950/90 border border-emerald-400 text-[10px] font-black text-emerald-200 -rotate-90 whitespace-nowrap shadow">
                ⬅ COULOIR
              </span>
            )}
          </div>

          <div
            className={`absolute right-0 inset-y-3 w-14 sm:w-24 border-l-2 ${
              right1 === 'WALL'
                ? 'bg-gradient-to-l from-slate-950/90 to-slate-800/75 border-amber-400/45'
                : 'bg-black/45 border-emerald-400/55'
            } flex flex-col items-center justify-center`}
          >
            {right1 === 'WALL' ? (
              <DungeonTorchPixelArt side="right" />
            ) : (
              <span className="px-2 py-1 rounded bg-emerald-950/90 border border-emerald-400 text-[10px] font-black text-emerald-200 rotate-90 whitespace-nowrap shadow">
                COULOIR ➡
              </span>
            )}
          </div>

          {/* Secret Mural Interactif Cliquable ! */}
          {wallSecret && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClaimWallSecret?.();
              }}
              className={`absolute z-20 ${
                wallSecret.side === 'LEFT'
                  ? 'left-3 sm:left-6 bottom-12'
                  : wallSecret.side === 'RIGHT'
                  ? 'right-3 sm:right-6 bottom-12'
                  : 'top-14 left-1/2 -translate-x-1/2'
              } px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-amber-500 text-slate-950 font-black text-[11px] border-2 border-white shadow-xl animate-bounce`}
            >
              {wallSecret.icon} {wallSecret.label} !
            </button>
          )}
        </div>

        {/* HUD supérieur de navigation SNES : Biome, Étage & Boussole */}
        <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between gap-2 pointer-events-none">
          <div className="px-3 py-1 rounded-lg bg-slate-950/90 border border-amber-400/70 text-xs font-black text-amber-200 flex items-center gap-1.5 shadow-lg">
            <span>{biome.icon}</span>
            <span>
              Étage {floor} • {biome.name}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-cyan-400/70 text-xs font-mono font-black text-cyan-200 shadow-lg">
            🧭 {curDir.label} ({pos.x},{pos.y})
          </div>
        </div>

        {/* Interaction directe si on se trouve déjà sur une case spéciale */}
        {currentTile !== 'EMPTY' && currentTile !== 'START' && (
          <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInteractCell();
              }}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs border-2 border-white shadow-lg animate-bounce"
            >
              ✨ Interagir ici ({currentTile})
            </button>
          </div>
        )}

        {/* Écran poussiéreux tactile (Souffler la cartouche !) */}
        {dustyScreen && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onBlowDust();
            }}
            className="absolute inset-0 z-30 bg-amber-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center cursor-pointer"
          >
            <div className="text-4xl mb-2 animate-bounce">🌬️📼</div>
            <div className="text-amber-300 font-extrabold text-sm sm:text-base">
              CARTOUCHE POUSSIÉREUSE !
            </div>
            <div className="text-xs text-amber-100 mt-1">
              Touchez l’écran pour souffler sur les broches (+15 Or & Trophée)
            </div>
          </div>
        )}
      </div>

      {/* Boîte de Dialogue JRPG Bleue Super Nintendo du Héros Invité */}
      <div className="px-3 py-2 rounded-xl snes-window flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-300 flex items-center justify-center text-base shrink-0">
          🌟
        </div>
        <p className="text-xs sm:text-sm font-bold text-cyan-100 leading-snug">{guestLine}</p>
      </div>
    </div>
  );
};

// ============================================================================
// 5. COMPOSANT PRINCIPAL : RETRO DUNGEON TCG (SUPER NINTENDO 16-BITS)
// ============================================================================
const FINISHES = [
  { id: 'STD', label: 'STD', mult: 1.0, badge: 'bg-slate-700 text-slate-200 border-slate-500' },
  { id: 'FOIL', label: 'FOIL', mult: 1.25, badge: 'bg-sky-800 text-sky-200 border-sky-400' },
  { id: 'HOLO', label: 'HOLO', mult: 1.5, badge: 'bg-fuchsia-800 text-fuchsia-200 border-fuchsia-400' },
  { id: 'GLITCH', label: 'GLITCH', mult: 2.0, badge: 'bg-emerald-800 text-emerald-200 border-emerald-400' },
  { id: 'GOLD24K', label: 'OR 24K', mult: 2.5, badge: 'bg-amber-600 text-yellow-100 border-yellow-300' }
];

const SQUAD_PRESETS = [
  {
    id: 'chrono',
    name: '⏳ Équipe Chrono 1000 AD',
    members: [
      { name: 'Crono', cls: 'WARRIOR', origin: 'NOMAD', stats: { FOR: 5, MAG: 3, AGI: 4, ESP: 2, CHA: 4 } },
      { name: 'Marle', cls: 'BARD', origin: 'ROYAL', stats: { FOR: 2, MAG: 4, AGI: 3, ESP: 5, CHA: 4 } },
      { name: 'Lucca', cls: 'TECHNOMANCER', origin: 'ENGINEER', stats: { FOR: 2, MAG: 5, AGI: 4, ESP: 4, CHA: 3 } },
      { name: 'Frog', cls: 'PALADIN', origin: 'TEMPLAR', stats: { FOR: 4, MAG: 2, AGI: 3, ESP: 4, CHA: 5 } }
    ]
  },
  {
    id: 'ffvi',
    name: '🔮 Résistance FFVI',
    members: [
      { name: 'Terra', cls: 'MAGE', origin: 'ARCANE_BLOOD', stats: { FOR: 2, MAG: 6, AGI: 3, ESP: 4, CHA: 3 } },
      { name: 'Locke', cls: 'NINJA', origin: 'SHADOW', stats: { FOR: 4, MAG: 2, AGI: 6, ESP: 3, CHA: 3 } },
      { name: 'Celes', cls: 'PALADIN', origin: 'ROYAL', stats: { FOR: 4, MAG: 4, AGI: 2, ESP: 4, CHA: 4 } },
      { name: 'Sabin', cls: 'WARRIOR', origin: 'NOMAD', stats: { FOR: 6, MAG: 2, AGI: 4, ESP: 2, CHA: 4 } }
    ]
  },
  {
    id: 'hyrule',
    name: '🔺 Héros d’Hyrule & Zebes',
    members: [
      { name: 'Link', cls: 'WARRIOR', origin: 'ROYAL', stats: { FOR: 5, MAG: 3, AGI: 4, ESP: 2, CHA: 4 } },
      { name: 'Zelda', cls: 'SUMMONER', origin: 'ROYAL', stats: { FOR: 2, MAG: 5, AGI: 3, ESP: 5, CHA: 3 } },
      { name: 'Samus', cls: 'TECHNOMANCER', origin: 'ENGINEER', stats: { FOR: 4, MAG: 5, AGI: 4, ESP: 2, CHA: 3 } },
      { name: 'Pit', cls: 'RANGER', origin: 'TEMPLAR', stats: { FOR: 4, MAG: 2, AGI: 5, ESP: 4, CHA: 3 } }
    ]
  },
  {
    id: 'arcade',
    name: '🔥 Guerriers Arcade 16-Bits',
    members: [
      { name: 'Ryu', cls: 'WARRIOR', origin: 'NOMAD', stats: { FOR: 6, MAG: 3, AGI: 4, ESP: 2, CHA: 3 } },
      { name: 'Chun-Li', cls: 'NINJA', origin: 'SHADOW', stats: { FOR: 4, MAG: 2, AGI: 6, ESP: 3, CHA: 3 } },
      { name: 'Alucard', cls: 'MAGE', origin: 'ARCANE_BLOOD', stats: { FOR: 3, MAG: 5, AGI: 4, ESP: 3, CHA: 3 } },
      { name: 'Simon', cls: 'PALADIN', origin: 'TEMPLAR', stats: { FOR: 4, MAG: 2, AGI: 3, ESP: 4, CHA: 5 } }
    ]
  }
];

const INITIAL_UNLOCKED_CARDS = [
  'c001', 'c002', 'c003', 'c004', 'c005', 'c006', 'c007', 'c008',
  'c011', 'c012', 'c013', 'c014', 'c015', 'c016', 'c017', 'c018',
  'c026', 'c027', 'c028', 'c029', 'c030', 'c031', 'c032', 'c036'
];

function RetroDungeonTCG() {
  // Navigation principale
  const [screen, setScreen] = useState('MENU'); // MENU | TAVERN | DUNGEON | COMBAT | EVENT | QUIZ | GAMEOVER
  const [tavernTab, setTavernTab] = useState('SQUAD'); // SQUAD | ALBUM | FORGE | ALAMBIC | TROPHIES
  const [crtFilter, setCrtFilter] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);

  // Clé API Gemini (automatique dans l'environnement ou personnalisée pour iPhone 14)
const [customGeminiKey, setCustomGeminiKey] = useState('AQ.Ab8RN6LO9AB8uAj-kTGcrUdthnXF547fob0ZyPFNSL0FdGxN7A');

  // Sprites Pixel Art IA en mémoire + cache IndexedDB
  const [sprites, setSprites] = useState({});
  const [generatingIds, setGeneratingIds] = useState({});
  const queueRef = useRef([]);
  const activeWorkersRef = useRef(0);
  const spritesRef = useRef({});
  useEffect(() => {
    spritesRef.current = sprites;
  }, [sprites]);

  // Progression persistante du joueur
  const [gold, setGold] = useState(180);
  const [unlockedCards, setUnlockedCards] = useState(() => new Set(INITIAL_UNLOCKED_CARDS));
  const [masterSet, setMasterSet] = useState(() => {
    const init = {};
    INITIAL_UNLOCKED_CARDS.forEach((id) => {
      init[`${id}_STD`] = true;
    });
    return init;
  });
  const [cardSelectedFinish, setCardSelectedFinish] = useState({});
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedConsoleBounties, setClaimedConsoleBounties] = useState([]);
  const [bestiary, setBestiary] = useState({}); // { creatureId: killsCount }
  const [trophies, setTrophies] = useState([]);
  const [discoveredDuos, setDiscoveredDuos] = useState([]);
  const [lockOnCart, setLockOnCart] = useState('cart_none');
  const [cardBack, setCardBack] = useState('back_snes');
  const [ascension, setAscension] = useState(0);
  const [difficulty, setDifficulty] = useState('NORMAL'); // EASY | NORMAL | HARD
  const [activeGuestId, setActiveGuestId] = useState('gh_mario');

  // Escouade (4 Héros personnalisables avec EXP & Level Up)
  const [squad, setSquad] = useState(() =>
    SQUAD_PRESETS[0].members.map((m, idx) => ({
      id: `hero_${idx}`,
      name: m.name,
      cls: m.cls,
      origin: m.origin,
      stats: { ...m.stats },
      hp: 26,
      maxHp: 26,
      level: 1,
      exp: 0
    }))
  );

  // État d'expédition dans le Donjon
  const [floor, setFloor] = useState(1);
  const [dungeonGrid, setDungeonGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [playerDir, setPlayerDir] = useState(1);
  const [visitedCells, setVisitedCells] = useState({});
  const [stepAnim, setStepAnim] = useState('');
  const [dustyScreen, setDustyScreen] = useState(false);
  const [wallSecret, setWallSecret] = useState(null);
  const [relics, setRelics] = useState([]);
  const [chronoReviveUsed, setChronoReviveUsed] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState('');

  // État du Combat JRPG
  const [enemies, setEnemies] = useState([]);
  const [selectedEnemyIdx, setSelectedEnemyIdx] = useState(0);
  const [isBossFight, setIsBossFight] = useState(false);
  const [isAmbushFight, setIsAmbushFight] = useState(false);
  const [pa, setPa] = useState(3);
  const [maxPa, setMaxPa] = useState(3);
  const [armor, setArmor] = useState(0);
  const [turn, setTurn] = useState(1);
  const [drawPile, setDrawPile] = useState([]);
  const [hand, setHand] = useState([]);
  const [discardPile, setDiscardPile] = useState([]);
  const [dustyHandIdx, setDustyHandIdx] = useState(null);
  const [activeMascot, setActiveMascot] = useState(null); // { ...mascot, turnsLeft }
  const [playedThisTurn, setPlayedThisTurn] = useState([]);
  const [lastElementPlayed, setLastElementPlayed] = useState(null);
  const [overchargeMode, setOverchargeMode] = useState(false);
  const [recycledThisTurn, setRecycledThisTurn] = useState(false);
  const [limitGauge, setLimitGauge] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [duoCutIn, setDuoCutIn] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const [floatingPopup, setFloatingPopup] = useState(null);
  const [combatVfx, setCombatVfx] = useState(null);
  const [actingHeroId, setActingHeroId] = useState(null);
  const [hitEnemyMask, setHitEnemyMask] = useState(null); // null | 'ALL' | number

  // Mini-jeux interactifs lors de la sélection d'une carte
  const [miniGamesEnabled, setMiniGamesEnabled] = useState(true);
  const [activeMiniGame, setActiveMiniGame] = useState(null); // { card, handIdx, kind, cursor, dir, runes, input, ring, notes, hitCount }

  // Modales & Filtres UI
  const [inspectedCard, setInspectedCard] = useState(null);
  const [showBestiaryModal, setShowBestiaryModal] = useState(false);
  const [bestiaryFilter, setBestiaryFilter] = useState('ALL');
  const [bestiarySearch, setBestiarySearch] = useState('');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('ALL'); // ALL | CARDS | CREATURES | HEROES_SCENES
  const [galleryZoomItem, setGalleryZoomItem] = useState(null);
  const [albumFilter, setAlbumFilter] = useState('ALL');
  const [albumSearch, setAlbumSearch] = useState('');
  const [boosterModal, setBoosterModal] = useState(null); // { title, cards: [{ card, finish, isNew }] }
  const [toastMsg, setToastMsg] = useState('');
  const konamiSeqRef = useRef([]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg((prev) => (prev === msg ? '' : prev)), 3200);
  }, []);

  const unlockTrophy = useCallback(
    (id) => {
      setTrophies((prev) => {
        if (prev.includes(id)) return prev;
        const tr = TROPHIES.find((t) => t.id === id);
        if (tr) showToast(`🏆 Trophée débloqué : ${tr.name} !`);
        const next = [...prev, id];
        if (next.length >= 25 && !next.includes('tr30')) next.push('tr30');
        return next;
      });
    },
    [showToast]
  );

  // ==========================================================================
  // MOTEUR DE GÉNÉRATION PIXEL ART IA FLASH (FILE RÉGULÉE + PRIORITÉ MONSTRES)
  // ==========================================================================
  const processSpriteQueue = useCallback(async () => {
    if (activeWorkersRef.current >= 2 || queueRef.current.length === 0) return;
    const job = queueRef.current.shift();
    if (!job || spritesRef.current[job.id]) {
      processSpriteQueue();
      return;
    }
    activeWorkersRef.current += 1;
    setGeneratingIds((prev) => ({ ...prev, [job.id]: true }));

    try {
      const apiKey = customGeminiKey || (typeof window !== 'undefined' && window.__GEMINI_API_KEY__) || '';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`;
      let dataUrl = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: job.prompt }] }],
              generationConfig: {
                responseModalities: ['IMAGE'],
                imageConfig: { aspectRatio: job.aspectRatio || '1:1' }
              }
            })
          });
          if (resp.ok) {
            const json = await resp.json();
            const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
            if (part?.inlineData?.data) {
              dataUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
              break;
            }
          }
        } catch {
          // Retry with backoff
        }
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }

      if (dataUrl) {
        await idbSet(`sprite_${job.id}`, dataUrl);
        setSprites((prev) => ({ ...prev, [job.id]: dataUrl }));
        unlockTrophy('tr28');
      }
    } finally {
      activeWorkersRef.current -= 1;
      setGeneratingIds((prev) => {
        const next = { ...prev };
        delete next[job.id];
        return next;
      });
      processSpriteQueue();
    }
  }, [customGeminiKey, unlockTrophy]);

  const requestSprite = useCallback(
    (id, prompt, options = {}) => {
      if (!id || spritesRef.current[id]) return;
      const exists = queueRef.current.some((q) => q.id === id);
      if (exists) {
        if (options.priority) {
          queueRef.current = [
            { id, prompt, aspectRatio: options.aspectRatio || '1:1' },
            ...queueRef.current.filter((q) => q.id !== id)
          ];
        }
        return;
      }
      const job = { id, prompt, aspectRatio: options.aspectRatio || '1:1' };
      if (options.priority) queueRef.current.unshift(job);
      else queueRef.current.push(job);
      processSpriteQueue();
      processSpriteQueue();
    },
    [processSpriteQueue]
  );

  // Chargement initial IndexedDB (sprites + sauvegarde)
  useEffect(() => {
    (async () => {
      const cachedSprites = await idbGetAllSprites();
      if (cachedSprites && Object.keys(cachedSprites).length > 0) {
        setSprites((prev) => ({ ...cachedSprites, ...prev }));
      }
      const saved = await idbGet('save_state_v1');
      if (saved) {
        if (typeof saved.gold === 'number') setGold(saved.gold);
        if (Array.isArray(saved.unlockedCards)) setUnlockedCards(new Set(saved.unlockedCards));
        if (saved.masterSet) setMasterSet(saved.masterSet);
        if (saved.cardSelectedFinish) setCardSelectedFinish(saved.cardSelectedFinish);
        if (Array.isArray(saved.claimedMilestones)) setClaimedMilestones(saved.claimedMilestones);
        if (Array.isArray(saved.claimedConsoleBounties)) setClaimedConsoleBounties(saved.claimedConsoleBounties);
        if (saved.bestiary) setBestiary(saved.bestiary);
        if (Array.isArray(saved.trophies)) setTrophies(saved.trophies);
        if (Array.isArray(saved.discoveredDuos)) setDiscoveredDuos(saved.discoveredDuos);
        if (saved.lockOnCart) setLockOnCart(saved.lockOnCart);
        if (saved.cardBack) setCardBack(saved.cardBack);
        if (typeof saved.ascension === 'number') setAscension(saved.ascension);
        if (saved.difficulty) setDifficulty(saved.difficulty);
        if (saved.activeGuestId) setActiveGuestId(saved.activeGuestId);
        if (Array.isArray(saved.squad) && saved.squad.length === 4) setSquad(saved.squad);
      }
      requestSprite(
        'main_banner',
        '16-bit Super Nintendo RPG title screen pixel art banner, heroic fantasy castle, glowing crystals, dragon silhouette, vibrant SNES palette, crisp pixel art',
        { aspectRatio: '16:9' }
      );
    })();
  }, [requestSprite]);

  // Sauvegarde automatique IndexedDB
  useEffect(() => {
    idbSet('save_state_v1', {
      gold,
      unlockedCards: Array.from(unlockedCards),
      masterSet,
      cardSelectedFinish,
      claimedMilestones,
      claimedConsoleBounties,
      bestiary,
      trophies,
      discoveredDuos,
      lockOnCart,
      cardBack,
      ascension,
      difficulty,
      activeGuestId,
      squad
    });
  }, [
    gold,
    unlockedCards,
    masterSet,
    cardSelectedFinish,
    claimedMilestones,
    claimedConsoleBounties,
    bestiary,
    trophies,
    discoveredDuos,
    lockOnCart,
    cardBack,
    ascension,
    difficulty,
    activeGuestId,
    squad
  ]);

  // Synchronisation musique 16-bits selon l'écran
  useEffect(() => {
    RETRO_AUDIO.setMusicEnabled(musicOn);
    if (!musicOn) return;
    if (screen === 'COMBAT') RETRO_AUDIO.setTrack(isBossFight ? 'BOSS' : 'COMBAT');
    else if (screen === 'DUNGEON' || screen === 'EVENT' || screen === 'QUIZ') RETRO_AUDIO.setTrack('DUNGEON');
    else RETRO_AUDIO.setTrack('MENU');
  }, [screen, isBossFight, musicOn]);

  useEffect(() => {
    RETRO_AUDIO.setSfxEnabled(sfxOn);
  }, [sfxOn]);

  // Écoute du Code Konami sur le Menu Principal
  useEffect(() => {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    const onKey = (e) => {
      if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (screen === 'MENU') {
        konamiSeqRef.current = [...konamiSeqRef.current.slice(-9), e.key];
        if (konamiSeqRef.current.join(',').toLowerCase() === code.join(',').toLowerCase()) {
          setGold((g) => g + 300);
          unlockTrophy('tr08');
          RETRO_AUDIO.sfx('levelup');
          showToast('🕹️ CODE KONAMI ACTIVÉ ! +300 Or offerts !');
          konamiSeqRef.current = [];
        }
      } else if (screen === 'DUNGEON') {
        if (e.key === 'ArrowUp' || e.key === 'w') moveDungeonForward();
        else if (e.key === 'ArrowLeft' || e.key === 'a') turnDungeon(-1);
        else if (e.key === 'ArrowRight' || e.key === 'd') turnDungeon(1);
      } else if (screen === 'COMBAT' && !activeMiniGame && !inspectedCard) {
        const k = e.key.toLowerCase();
        if (['1', '2', '3', '4', '5'].includes(k)) {
          const cardIdx = Number(k) - 1;
          if (hand[cardIdx]) handleSelectHandCard(hand[cardIdx], cardIdx);
        } else if (k === 'o') {
          setOverchargeMode((o) => !o);
        } else if (k === 'l' && limitGauge >= 100) {
          triggerLimitBreak();
        } else if (k === 'e') {
          endPlayerTurn();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Calculs collection, Master Set & Mini-Sets actifs
  const masterSetCount = useMemo(() => Object.keys(masterSet).length, [masterSet]);
  const activeGuest = useMemo(
    () => GUEST_HEROES.find((g) => g.id === activeGuestId) || GUEST_HEROES[0],
    [activeGuestId]
  );

  const activeMiniSets = useMemo(() => {
    return MINI_SETS.map((ms) => {
      const owned = ms.cardIds.filter((id) => unlockedCards.has(id)).length;
      const completed = owned === ms.cardIds.length;
      const golden =
        completed &&
        ms.cardIds.every(
          (id) =>
            masterSet[`${id}_FOIL`] ||
            masterSet[`${id}_HOLO`] ||
            masterSet[`${id}_GLITCH`] ||
            masterSet[`${id}_GOLD24K`]
        );
      return { ...ms, owned, completed, golden };
    }).filter((ms) => ms.completed);
  }, [unlockedCards, masterSet]);

  const currentBiome = useMemo(() => DUNGEON_BIOMES[(floor - 1) % DUNGEON_BIOMES.length], [floor]);
  const currentStructure = useMemo(() => DUNGEON_STRUCTURES[(floor - 1) % DUNGEON_STRUCTURES.length], [floor]);

  // ==========================================================================
  // GÉNÉRATION D'UN ÉTAGE DU DONJON (5 ARCHITECTURES DISTINCTES)
  // ==========================================================================
  const generateFloorMap = useCallback(
    (targetFloor) => {
      const size = 9;
      const grid = Array.from({ length: size }, () => Array(size).fill('WALL'));
      const structIdx = (targetFloor - 1) % 5;

      // Creusage de couloirs connectés selon la structure d'étage
      const carveRect = (x1, y1, x2, y2) => {
        for (let y = y1; y <= y2; y++) {
          for (let x = x1; x <= x2; x++) {
            if (y > 0 && y < size - 1 && x > 0 && x < size - 1) grid[y][x] = 'EMPTY';
          }
        }
      };

      if (structIdx === 0) {
        // Labyrinthe Ancien
        carveRect(1, 1, 7, 1);
        carveRect(1, 4, 7, 4);
        carveRect(1, 7, 7, 7);
        carveRect(1, 1, 1, 4);
        carveRect(7, 1, 7, 7);
        carveRect(4, 4, 4, 7);
      } else if (structIdx === 1) {
        // Grande Salle à Piliers
        carveRect(1, 1, 7, 7);
        grid[2][2] = 'WALL';
        grid[2][6] = 'WALL';
        grid[6][2] = 'WALL';
        grid[6][6] = 'WALL';
        grid[4][4] = 'WALL';
      } else if (structIdx === 2) {
        // Ailes Jumelles & Pont Central
        carveRect(1, 1, 2, 7);
        carveRect(6, 1, 7, 7);
        carveRect(2, 4, 6, 4);
      } else if (structIdx === 3) {
        // Citadelle Concentrique
        carveRect(1, 1, 7, 1);
        carveRect(1, 7, 7, 7);
        carveRect(1, 1, 1, 7);
        carveRect(7, 1, 7, 7);
        carveRect(3, 3, 5, 5);
        grid[2][4] = 'EMPTY';
        grid[4][6] = 'EMPTY';
      } else {
        // Catacombes en S
        carveRect(1, 1, 7, 1);
        carveRect(7, 1, 7, 3);
        carveRect(1, 3, 7, 3);
        carveRect(1, 3, 1, 5);
        carveRect(1, 5, 7, 5);
        carveRect(7, 5, 7, 7);
        carveRect(1, 7, 7, 7);
      }

      grid[1][1] = 'START';
      grid[7][7] = 'BOSS';

      const empties = [];
      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          if (grid[y][x] === 'EMPTY') empties.push({ x, y });
        }
      }
      empties.sort(() => Math.random() - 0.5);
      const specials = [
        'ENEMY',
        'ENEMY',
        'AMBUSH',
        'AMBUSH',
        'CHEST',
        'CHEST',
        'FOUNTAIN',
        'EVENT',
        'FORGE',
        'CAMPFIRE',
        'MYSTERY_BLOCK'
      ];
      specials.forEach((sp, idx) => {
        if (empties[idx]) grid[empties[idx].y][empties[idx].x] = sp;
      });

      setDungeonGrid(grid);
      setPlayerPos({ x: 1, y: 1 });
      setPlayerDir(1);
      setVisitedCells({ '1_1': true });
      setDustyScreen(Math.random() < 0.25);
      setWallSecret({
        side: 'LEFT',
        label: 'Filon de Cristal',
        icon: '💎'
      });

      const biome = DUNGEON_BIOMES[(targetFloor - 1) % DUNGEON_BIOMES.length];
      requestSprite(`biome_${biome.id}`, biome.prompt, { aspectRatio: '16:9' });
    },
    [requestSprite]
  );

  // Démarrer une nouvelle expédition
  const startNewExpedition = () => {
    const heartBonus = relics.includes('r_heart_container') ? 6 : 0;
    const diffHpBonus = difficulty === 'EASY' ? 4 : 0;
    setSquad((prev) =>
      prev.map((h) => {
        const nextMax = 26 + (h.level - 1) * 3 + heartBonus + diffHpBonus;
        return {
          ...h,
          hp: nextMax,
          maxHp: nextMax
        };
      })
    );
    setFloor(1);
    setRelics([]);
    setChronoReviveUsed(false);
    generateFloorMap(1);
    setScreen('DUNGEON');
    RETRO_AUDIO.sfx('step');
  };

  // ==========================================================================
  // DÉMARRAGE D'UN COMBAT (TIRAGE ALÉATOIRE COLLECTION + PRIORITÉ MONSTRES IA)
  // ==========================================================================
  const startCombat = useCallback(
    (mode = false) => {
      const bossMode = mode === true || mode === 'BOSS';
      const ambushMode = mode === 'AMBUSH';
      const diffMult = difficulty === 'EASY' ? 0.85 : difficulty === 'HARD' ? 1.28 : 1.0;
      const mult = (1 + (floor - 1) * 0.16 + ascension * 0.12) * diffMult;
      let spawned = [];
      if (bossMode) {
        const bossTemplate = BOSSES_LIST[(floor - 1) % BOSSES_LIST.length] || BOSSES_LIST[0];
        spawned = [
          {
            ...bossTemplate,
            uid: `b_${Date.now()}`,
            hp: Math.round(bossTemplate.maxHp * mult),
            maxHp: Math.round(bossTemplate.maxHp * mult),
            atk: Math.round(bossTemplate.atk * mult),
            armor: Math.round(8 * diffMult),
            poison: 0,
            frozen: false,
            isElite: true,
            enraged: false,
            intent: '🔥 Frappe Boss'
          }
        ];
      } else {
        const count = ambushMode
          ? 3
          : floor >= 2 && (difficulty === 'HARD' || Math.random() < 0.65)
          ? 3
          : 2;
        for (let i = 0; i < count; i++) {
          const m = MONSTERS_LIST[Math.floor(Math.random() * MONSTERS_LIST.length)];
          const isElite = (ambushMode && i === 1) || (difficulty === 'HARD' && i === 0);
          const eliteMult = isElite ? 1.35 : 1.0;
          spawned.push({
            ...m,
            name: isElite ? `★ ${m.name} Élite` : m.name,
            uid: `m_${Date.now()}_${i}`,
            hp: Math.round(m.maxHp * mult * eliteMult),
            maxHp: Math.round(m.maxHp * mult * eliteMult),
            atk: Math.round(m.atk * mult * (isElite ? 1.2 : 1.0)),
            armor: i === 1 ? Math.round(6 * diffMult) : 0,
            poison: 0,
            frozen: false,
            isElite,
            enraged: false,
            intent: i === 0 ? '⚔️ Attaque' : i === 1 ? '🛡️ Garde de Fer' : '💥 Frappe Lourde'
          });
        }
      }

      // Peinture IA prioritaire immédiate des monstres & boss rencontrés !
      spawned.forEach((en) => {
        requestSprite(
          en.id,
          `16-bit SNES JRPG enemy monster sprite "${en.name}" inspired by ${en.game} (${en.console}), dramatic dark fantasy pixel art on dark background, crisp pixel art`,
          { priority: true, aspectRatio: '1:1' }
        );
      });

      // Composition d'un deck frais ALÉATOIRE parmi TOUTE la collection débloquée + cartes signatures de l'Invité
      const unlockedPool = Array.from(unlockedCards)
        .map((id) => ALL_CARDS_MAP[id])
        .filter(Boolean);
      const guestPool = activeGuest ? activeGuest.sigCards : [];
      const fullPool = [...unlockedPool, ...guestPool];

      const shuffled = [...fullPool].sort(() => Math.random() - 0.5);
      const chosenCards = shuffled.slice(0, Math.min(20, shuffled.length)).map((c, idx) => {
        const finishId = cardSelectedFinish[c.id] || 'STD';
        const finObj = FINISHES.find((f) => f.id === finishId) || FINISHES[0];
        return {
          ...c,
          uid: `c_${c.id}_${idx}_${Date.now()}`,
          finish: finObj
        };
      });

      // Peindre en arrière-plan les 5 premières cartes tirées
      chosenCards.slice(0, 5).forEach((c) => {
        requestSprite(
          c.id,
          `16-bit Super Nintendo fantasy TCG card illustration for "${c.name}", ${c.desc}, vibrant SNES pixel art`,
          { aspectRatio: '1:1' }
        );
      });

      // Peindre en arrière-plan les portraits IA des 4 héros de l'escouade
      squad.forEach((h) => {
        const clsName = CLASSES[h.cls]?.name || h.cls;
        requestSprite(
          `hero_${h.id}_${h.cls}_${h.name}`,
          `16-bit Super Nintendo RPG hero character portrait "${h.name}", ${clsName}, expressive SNES pixel art portrait`,
          { aspectRatio: '1:1' }
        );
      });

      // Calcul armure & PA initiaux (Reliques, Invité, Lock-On, Mini-Sets)
      let startArmor = 0;
      if (relics.includes('r_etank')) startArmor += 6;
      if (relics.includes('r_light_crystal')) startArmor += 4;
      if (relics.includes('r_invisibility_cape')) startArmor += 6;
      if (lockOnCart === 'cart_actionreplay') startArmor += 5;
      if (activeGuest?.bonusType === 'ARMOR') startArmor += activeGuest.bonusVal;
      if (activeGuest?.id === 'gh_yoshiknight') startArmor += 3;
      activeMiniSets.forEach((ms) => {
        const mMult = ms.golden ? 2 : 1;
        if (ms.id === 'ms_zebes') startArmor += 2 * mMult;
        if (ms.id === 'ms_paladins') startArmor += 4 * mMult;
      });

      let startPa = 3;
      if (relics.includes('r_pegasus_boots')) startPa += 1;
      if (activeGuest?.bonusType === 'PA') startPa += activeGuest.bonusVal;
      if (activeMiniSets.some((ms) => ms.id === 'ms_mobius')) startPa += 1;

      const initDrawCount = 5 + (relics.includes('r_chocobo_feather') ? 1 : 0) + (activeGuest?.id === 'gh_kirby' ? 1 : 0);
      const initialHand = chosenCards.slice(0, initDrawCount);
      const restDraw = chosenCards.slice(initDrawCount);

      setEnemies(spawned);
      setSelectedEnemyIdx(0);
      setIsBossFight(bossMode);
      setIsAmbushFight(ambushMode);
      setMaxPa(3);
      setPa(startPa);
      setArmor(startArmor);
      setTurn(1);
      setHand(initialHand);
      setDrawPile(restDraw);
      setDiscardPile([]);
      setDustyHandIdx(Math.random() < 0.3 && initialHand.length > 0 ? Math.floor(Math.random() * initialHand.length) : null);
      setActiveMascot(null);
      setPlayedThisTurn([]);
      setLastElementPlayed(null);
      setOverchargeMode(false);
      setRecycledThisTurn(false);
      setLimitGauge(0);
      setActiveMiniGame(null);
      setCombatVfx(null);
      setActingHeroId(null);
      setHitEnemyMask(null);
      setCombatLog([
        bossMode
          ? `👑 GARDIEN D’ÉTAGE : ${spawned[0].name} apparaît !`
          : ambushMode
          ? `⚠️ EMBUSCADE SURPRISE ! ${spawned.length} créatures vous encerclent (+30 % Or & EXP) !`
          : `⚔️ Rencontre (${spawned.length} ennemis) : ${spawned.map((e) => e.name).join(', ')} !`
      ]);
      setScreen('COMBAT');
      RETRO_AUDIO.sfx('attack');
    },
    [floor, ascension, difficulty, unlockedCards, activeGuest, cardSelectedFinish, relics, lockOnCart, activeMiniSets, squad, requestSprite]
  );

  // ==========================================================================
  // VICTOIRE EN COMBAT (OR, EXP / LEVEL UP JRPG, BESTIAIRE, LOOT)
  // ==========================================================================
  const handleCombatVictory = useCallback(
    (defeatedEnemies) => {
      RETRO_AUDIO.sfx('victory');
      unlockTrophy('tr01');
      if (isBossFight) unlockTrophy('tr03');
      if (ascension >= 5) unlockTrophy('tr29');

      // Mise à jour Bestiaire
      setBestiary((prev) => {
        const next = { ...prev };
        defeatedEnemies.forEach((en) => {
          next[en.id] = (next[en.id] || 0) + 1;
        });
        if (Object.keys(next).length >= 100) unlockTrophy('tr15');
        return next;
      });

      // Calcul Or & EXP (avec primes Embuscade +30% et Cauchemar +25%)
      let baseGold = defeatedEnemies.reduce((s, e) => s + (e.gold || 20), 0);
      if (isAmbushFight) baseGold = Math.round(baseGold * 1.3);
      if (difficulty === 'HARD') baseGold = Math.round(baseGold * 1.25);
      if (relics.includes('r_golden_coin')) baseGold = Math.round(baseGold * 1.2);
      if (relics.includes('r_triforce_wisdom')) baseGold = Math.round(baseGold * 1.15);
      if (lockOnCart === 'cart_supergameboy') baseGold = Math.round(baseGold * 1.15);
      if (activeGuest?.bonusType === 'GOLD') baseGold = Math.round(baseGold * 1.15);
      baseGold = Math.round(baseGold * (1 + claimedConsoleBounties.length * 0.1));

      let baseExp = defeatedEnemies.reduce((s, e) => s + (e.exp || 18), 0);
      if (isAmbushFight) baseExp = Math.round(baseExp * 1.3);
      if (difficulty === 'HARD') baseExp = Math.round(baseExp * 1.25);
      if (relics.includes('r_warp_whistle')) baseExp = Math.round(baseExp * 1.15);
      if (lockOnCart === 'cart_satellaview') baseExp = Math.round(baseExp * 1.2);

      setGold((g) => {
        const ng = g + baseGold;
        if (ng >= 1000) unlockTrophy('tr24');
        return ng;
      });

      // Gain d'EXP & Montée de niveau JRPG (Nv. 1 -> Nv. 20)
      let leveledUpNames = [];
      setSquad((prevSquad) =>
        prevSquad.map((hero) => {
          if (hero.level >= 20) return hero;
          const gain = hero.hp > 0 ? baseExp : Math.round(baseExp * 0.5);
          let newExp = hero.exp + gain;
          let newLvl = hero.level;
          let newMaxHp = hero.maxHp;
          let newHp = hero.hp;
          const newStats = { ...hero.stats };
          const clsInfo = CLASSES[hero.cls] || CLASSES.WARRIOR;

          while (newLvl < 20 && newExp >= newLvl * 45) {
            newExp -= newLvl * 45;
            newLvl += 1;
            newMaxHp += 3;
            newHp = Math.min(newMaxHp, (newHp > 0 ? newHp : 1) + 6);
            clsInfo.primaryStats.forEach((st) => {
              newStats[st] = (newStats[st] || 3) + 1;
            });
            if (newLvl % 3 === 0) {
              Object.keys(newStats).forEach((k) => {
                newStats[k] = (newStats[k] || 3) + 1;
              });
            }
            leveledUpNames.push(`${hero.name} (Nv.${newLvl})`);
            if (newLvl >= 10) unlockTrophy('tr22');
          }
          return { ...hero, exp: newExp, level: newLvl, maxHp: newMaxHp, hp: newHp, stats: newStats };
        })
      );

      if (leveledUpNames.length > 0) {
        RETRO_AUDIO.sfx('levelup');
        showToast(`🌟 LEVEL UP ! ${leveledUpNames.join(', ')} ! (+${baseGold} Or)`);
      } else {
        showToast(`🎉 Victoire ! +${baseGold} Or & +${baseExp} EXP !`);
      }

      // Effacer l'ennemi sur la carte du donjon
      setDungeonGrid((prev) => {
        const copy = prev.map((row) => [...row]);
        const curT = copy[playerPos.y]?.[playerPos.x];
        if (curT === 'ENEMY' || curT === 'AMBUSH' || curT === 'BOSS') {
          copy[playerPos.y][playerPos.x] = 'EMPTY';
        }
        return copy;
      });

      if (isBossFight) {
        // Offrir un Booster de Boss et passer à l'étage suivant
        openBoosterPack(`👑 Coffre du Gardien (Étage ${floor})`, 'RARE');
        const nextFloor = floor + 1;
        setFloor(nextFloor);
        if (nextFloor >= 5) unlockTrophy('tr13');
        if (nextFloor >= 10) unlockTrophy('tr14');
        generateFloorMap(nextFloor);
      }
      setScreen('DUNGEON');
    },
    [
      isBossFight,
      isAmbushFight,
      difficulty,
      ascension,
      relics,
      lockOnCart,
      activeGuest,
      claimedConsoleBounties,
      playerPos,
      floor,
      unlockTrophy,
      showToast,
      generateFloorMap
    ]
  );

  // ==========================================================================
  // EXÉCUTION D'UNE CARTE EN COMBAT (AVEC MULTIPLICATEUR MINI-JEU & OVERCHARGE)
  // ==========================================================================
  const executeCardEffect = useCallback(
    (card, handIdx, actionMult = 1.0) => {
      const effectiveCost = card.cost + (overchargeMode ? 1 : 0);
      if (pa < effectiveCost) {
        showToast('⚠️ Pas assez de PA !');
        return;
      }

      setPa((p) => p - effectiveCost);
      setOverchargeMode(false);
      setActiveMiniGame(null);

      // Retirer la carte de la main -> défausse
      setHand((prev) => {
        const copy = [...prev];
        copy.splice(handIdx, 1);
        return copy;
      });
      if (dustyHandIdx === handIdx) setDustyHandIdx(null);
      setDiscardPile((prev) => [...prev, card]);

      // Bonus de statistiques des héros vivants selon la classe de la carte
      const aliveHeroes = squad.filter((h) => h.hp > 0);
      const matchingHeroes = aliveHeroes.filter((h) => card.cls === 'ALL' || h.cls === card.cls);
      const leadHero = matchingHeroes[0] || aliveHeroes[0] || squad[0];
      const statBonus = leadHero
        ? Math.floor(
            ((card.element === 'PHYS' ? leadHero.stats.FOR : leadHero.stats.MAG) +
              (leadHero.level - 1)) /
              2
          )
        : 0;

      // Multiplicateur de finition (STD 1.0 -> OR 24K 2.5)
      const finishMult = card.finish?.mult || 1.0;

      // Bonus Reliques, Lock-On, Invité, Bestiaire & Mini-Sets
      let flatBonus = statBonus;
      if (relics.includes('r_star_piece')) flatBonus += 2;
      if (relics.includes('r_light_crystal')) flatBonus += 2;
      if (relics.includes('r_triforce_wisdom')) flatBonus += 2;
      if (lockOnCart === 'cart_gamegenie') flatBonus += 3;
      if (lockOnCart === 'cart_neogeocd' && card.cameoConsole === 'ARC') flatBonus += 4;
      if (lockOnCart === 'cart_sonic_knuckles' && activeMiniSets.length > 0) flatBonus += 2;
      if (activeGuest?.id === 'gh_jim') flatBonus += 3;
      if (card.type === 'ATTACK') {
        if (relics.includes('r_rainbow_shell')) flatBonus += 3;
        if (relics.includes('r_power_glove') && card.element === 'PHYS') flatBonus += 3;
        if (relics.includes('r_bomb_bag') && card.target === 'ALL') flatBonus += 3;
        if (
          relics.includes('r_mana_ring') &&
          ['FIRE', 'ICE', 'LIGHTNING', 'ARCANE'].includes(card.element)
        ) {
          flatBonus += 3;
        }
        if (activeGuest?.bonusType === 'ATTACK') flatBonus += activeGuest.bonusVal;
      }

      // Bonus des Mini-Sets complétés
      activeMiniSets.forEach((ms) => {
        const mMult = ms.golden ? 2 : 1;
        if (ms.id === 'ms_hyrule' && card.element === 'HOLY') flatBonus += 2 * mMult;
        if (ms.id === 'ms_mushroom' && card.element === 'FIRE') flatBonus += 2 * mMult;
        if (ms.id === 'ms_mobius' && card.element === 'LIGHTNING') flatBonus += 2 * mMult;
        if (ms.id === 'ms_zebes' && card.target === 'ALL') flatBonus += 3 * mMult;
        if (ms.id === 'ms_wily' && card.cls === 'TECHNOMANCER') flatBonus += 3 * mMult;
        if (ms.id === 'ms_belmont' && ['HOLY', 'ARCANE'].includes(card.element)) flatBonus += 3 * mMult;
        if (ms.id === 'ms_dreamland') flatBonus += 2 * mMult;
        if (ms.id === 'ms_square' && ['FIRE', 'ICE', 'LIGHTNING'].includes(card.element)) flatBonus += 3 * mMult;
        if (ms.id === 'ms_neogeo' && card.type === 'ATTACK') flatBonus += 3 * mMult;
        if (ms.id === 'ms_pce' && card.cameoConsole) flatBonus += 2 * mMult;
        if (ms.id === 'ms_opera' && card.target === 'ALL') flatBonus += 3 * mMult;
        if (ms.id === 'ms_worldwarrior' && ['PHYS', 'FIRE'].includes(card.element)) flatBonus += 3 * mMult;
        if (ms.id === 'ms_marines' && card.target === 'ALL') flatBonus += 3 * mMult;
        if (ms.id === 'ms_arsenal' && ['WARRIOR', 'RANGER'].includes(card.cls)) flatBonus += 3 * mMult;
        if (ms.id === 'ms_shadow' && card.element === 'POISON') flatBonus += 3 * mMult;
        if (ms.id === 'ms_secrets') flatBonus += 3 * mMult;
      });

      // Chaîne Élémentaire (+5 dégâts si même élément que la carte précédente)
      const elemChainBonus = lastElementPlayed && lastElementPlayed === card.element ? 5 : 0;
      if (elemChainBonus > 0) unlockTrophy('tr27');
      setLastElementPlayed(card.element);

      // Compteur de Chaîne de Tour (+2 Puissance par carte déjà jouée ce tour)
      const turnComboBonus = playedThisTurn.length * 2;

      // Animation du héros lanceur & effet visuel Pixel Art SNES
      if (leadHero?.id) {
        setActingHeroId(leadHero.id);
        setTimeout(() => setActingHeroId((prev) => (prev === leadHero.id ? null : prev)), 950);
      }
      const vfxId = Date.now();
      setCombatVfx({ id: vfxId, element: card.element, type: card.type, target: card.target });
      setTimeout(() => setCombatVfx((prev) => (prev?.id === vfxId ? null : prev)), 720);

      // Détection Combo Duo 16-Bits !
      const newPlayed = [...playedThisTurn, card.id];
      setPlayedThisTurn(newPlayed);
      let duoBonusDmg = 0;
      let duoBonusHeal = 0;
      DUO_COMBOS.forEach((dc) => {
        if (dc.cards.every((cid) => newPlayed.includes(cid))) {
          const cartBonus = lockOnCart === 'cart_sufami' ? 5 : 0;
          duoBonusDmg += dc.bonusDmg + cartBonus;
          duoBonusHeal += dc.bonusHeal;
          setDuoCutIn(dc);
          setTimeout(() => setDuoCutIn(null), 2400);
          unlockTrophy('tr04');
          if (!discoveredDuos.includes(dc.id)) {
            setDiscoveredDuos((prev) => [...prev, dc.id]);
            setGold((g) => g + 40);
            showToast(`⚡ NOUVEAU COMBO DUO : ${dc.name} (+40 Or) !`);
          }
        }
      });

      const overchargeMult = overchargeMode ? 1.6 : 1.0;
      if (overchargeMode) unlockTrophy('tr26');
      const totalVal = Math.max(
        1,
        Math.round((card.power + flatBonus + turnComboBonus + elemChainBonus + duoBonusDmg) * finishMult * actionMult * overchargeMult)
      );

      // Charge de jauge Limit Break
      const limitGain =
        (overchargeMode ? 28 : 16) +
        (relics.includes('r_hermes_sandals') ? 10 : 0) +
        (lockOnCart === 'cart_64dd' ? 15 : 0) +
        (elemChainBonus > 0 ? 10 : 0);
      setLimitGauge((g) => Math.min(100, g + limitGain));

      // Miroir Magique : +2 Armure quand un sort élémentaire est joué
      if (relics.includes('r_magic_mirror') && ['FIRE', 'ICE', 'LIGHTNING', 'ARCANE', 'HOLY'].includes(card.element)) {
        setArmor((a) => a + 2);
      }

      const logs = [];
      if (turnComboBonus > 0) logs.push(`🔥 Chaîne de Tour x${newPlayed.length} (+${turnComboBonus} Puiss.) !`);
      if (elemChainBonus > 0) logs.push(`🔗 Résonance Élémentaire (${card.element}) +5 !`);
      if (duoBonusDmg > 0) logs.push(`⚡ COMBO DUO ACTIVÉ (+${duoBonusDmg} dég / +${duoBonusHeal} PV) !`);

      // Application de l'effet principal de la carte
      if (card.type === 'ATTACK') {
        RETRO_AUDIO.sfx(actionMult > 1.2 || overchargeMode ? 'crit' : 'attack');
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 260);
        setHitEnemyMask(card.target === 'ALL' ? 'ALL' : selectedEnemyIdx);
        setTimeout(() => setHitEnemyMask(null), 320);
        setFloatingPopup(`-${totalVal} 💥`);
        setTimeout(() => setFloatingPopup(null), 900);

        setEnemies((prevEnemies) => {
          const updated = prevEnemies.map((en, idx) => {
            if (en.hp <= 0) return en;
            if (card.target === 'ALL' || idx === selectedEnemyIdx) {
              const masteryBonus = (bestiary[en.id] || 0) >= 3 ? 2 : 0;
              const dmg = totalVal + masteryBonus;
              const blockedByEn = Math.min(en.armor || 0, dmg);
              const nextEnArmor = Math.max(0, (en.armor || 0) - blockedByEn);
              const hpLoss = Math.max(0, dmg - blockedByEn);
              const nextHp = Math.max(0, en.hp - hpLoss);
              const newPoison = card.element === 'POISON' ? en.poison + 5 : en.poison;
              const newFrozen = card.element === 'ICE' && Math.random() < 0.35 ? true : en.frozen;
              const triggersRage =
                nextHp > 0 && (en.isBoss || en.isElite) && !en.enraged && nextHp <= en.maxHp * 0.5;
              return {
                ...en,
                hp: nextHp,
                armor: nextEnArmor,
                poison: newPoison,
                frozen: newFrozen,
                enraged: en.enraged || triggersRage,
                atk: triggersRage ? en.atk + 3 : en.atk
              };
            }
            return en;
          });
          const allDead = updated.every((e) => e.hp <= 0);
          if (allDead) {
            setTimeout(() => handleCombatVictory(updated), 450);
          } else if (updated[selectedEnemyIdx]?.hp <= 0) {
            const nextAlive = updated.findIndex((e) => e.hp > 0);
            if (nextAlive >= 0) setSelectedEnemyIdx(nextAlive);
          }
          return updated;
        });
        logs.push(
          `${leadHero?.name || 'Escouade'} joue ${card.name} → ${totalVal} dégâts ${
            card.target === 'ALL' ? 'à tous' : ''
          } !`
        );
      } else if (card.type === 'SHIELD') {
        RETRO_AUDIO.sfx('shield');
        const shieldGain = totalVal + (relics.includes('r_ocarina') ? 2 : 0);
        setArmor((a) => a + shieldGain);
        logs.push(`🛡️ ${card.name} confère +${shieldGain} Armure !`);
      } else if (card.type === 'HEAL') {
        RETRO_AUDIO.sfx('heal');
        const healGain =
          totalVal +
          (relics.includes('r_phoenix_down') ? 3 : 0) +
          (relics.includes('r_ocarina') ? 2 : 0) +
          (activeGuest?.bonusType === 'HEAL' ? activeGuest.bonusVal : 0) +
          duoBonusHeal;
        setSquad((prev) =>
          prev.map((h) => (h.hp > 0 ? { ...h, hp: Math.min(h.maxHp, h.hp + healGain) } : h))
        );
        logs.push(`💚 ${card.name} restaure +${healGain} PV à l’escouade !`);
      } else if (card.type === 'SKILL') {
        RETRO_AUDIO.sfx('shield');
        setArmor((a) => a + totalVal);
        // Pioche 1 carte
        setDrawPile((dp) => {
          if (dp.length === 0) return dp;
          const [drawn, ...rest] = dp;
          setHand((h) => [...h, drawn]);
          return rest;
        });
        logs.push(`✨ ${card.name} : +${totalVal} Armure & +1 carte piochée !`);
      } else if (card.type === 'SUMMON') {
        RETRO_AUDIO.sfx('heal');
        unlockTrophy('tr09');
        const mascotId = SUMMON_MASCOT_MAP[card.id] || 'chocobo';
        const mascotData = MASCOTS.find((m) => m.id === mascotId) || MASCOTS[0];
        if (activeMascot && activeMascot.id === mascotData.id) {
          // Attaque Synchro immédiate !
          const synchroDmg = (mascotData.dmg + 4) * 2;
          setEnemies((prev) => {
            const upd = prev.map((e, i) => {
              if (i !== selectedEnemyIdx || e.hp <= 0) return e;
              const blk = Math.min(e.armor || 0, synchroDmg);
              return {
                ...e,
                armor: Math.max(0, (e.armor || 0) - blk),
                hp: Math.max(0, e.hp - Math.max(0, synchroDmg - blk))
              };
            });
            if (upd.every((e) => e.hp <= 0)) setTimeout(() => handleCombatVictory(upd), 450);
            return upd;
          });
          logs.push(`🌟 ATTAQUE SYNCHRO ${mascotData.name} : ${synchroDmg} dégâts !`);
        }
        setActiveMascot({ ...mascotData, turnsLeft: 3 });
        requestSprite(
          `mascot_${mascotData.id}`,
          `16-bit SNES RPG cute companion mascot sprite "${mascotData.name}", vibrant pixel art`,
          { aspectRatio: '1:1' }
        );
        logs.push(`🐾 ${mascotData.name} rejoint le terrain pour 3 tours !`);
      }

      if (duoBonusHeal > 0 && card.type !== 'HEAL') {
        setSquad((prev) =>
          prev.map((h) => (h.hp > 0 ? { ...h, hp: Math.min(h.maxHp, h.hp + duoBonusHeal) } : h))
        );
      }

      setCombatLog((prev) => [...logs, ...prev].slice(0, 8));
    },
    [
      overchargeMode,
      pa,
      dustyHandIdx,
      squad,
      relics,
      lockOnCart,
      activeMiniSets,
      activeGuest,
      lastElementPlayed,
      playedThisTurn,
      discoveredDuos,
      selectedEnemyIdx,
      bestiary,
      activeMascot,
      showToast,
      unlockTrophy,
      handleCombatVictory
    ]
  );

  // Déclenchement d'une carte depuis la main (lance un mini-jeu interactif si activé)
  const handleSelectHandCard = (card, idx) => {
    const effectiveCost = card.cost + (overchargeMode ? 1 : 0);
    if (pa < effectiveCost) {
      showToast('⚠️ Pas assez de PA !');
      return;
    }
    if (!miniGamesEnabled) {
      executeCardEffect(card, idx, 1.0);
      return;
    }

    // Choix du mini-jeu selon le type / élément de la carte
    if (card.type === 'ATTACK' && (card.element === 'PHYS' || card.cls === 'WARRIOR' || card.cls === 'RANGER')) {
      setActiveMiniGame({ card, handIdx: idx, kind: 'TIMING_BAR', cursor: 10, dir: 1 });
    } else if (['FIRE', 'ICE', 'LIGHTNING', 'ARCANE'].includes(card.element) && card.type === 'ATTACK') {
      const pool = ['🔥', '❄️', '⚡', '🔮'];
      const seq = [pool[Math.floor(Math.random() * 4)], pool[Math.floor(Math.random() * 4)], pool[Math.floor(Math.random() * 4)]];
      setActiveMiniGame({ card, handIdx: idx, kind: 'RUNE_SEQ', runes: seq, input: [] });
    } else if (card.type === 'SHIELD' || card.type === 'SKILL') {
      setActiveMiniGame({ card, handIdx: idx, kind: 'PARRY_RING', ring: 100 });
    } else {
      setActiveMiniGame({ card, handIdx: idx, kind: 'RHYTHM_HEAL', cursor: 0, hitCount: 0 });
    }
  };

  // Boucle temps réel pour les mini-jeux animés (TIMING_BAR, PARRY_RING, RHYTHM_HEAL)
  useEffect(() => {
    if (!activeMiniGame) return;
    if (!['TIMING_BAR', 'PARRY_RING', 'RHYTHM_HEAL'].includes(activeMiniGame.kind)) return;

    const timer = setInterval(() => {
      setActiveMiniGame((mg) => {
        if (!mg) return null;
        if (mg.kind === 'TIMING_BAR') {
          let nextC = mg.cursor + mg.dir * 5;
          let nextD = mg.dir;
          if (nextC >= 95) {
            nextC = 95;
            nextD = -1;
          } else if (nextC <= 5) {
            nextC = 5;
            nextD = 1;
          }
          return { ...mg, cursor: nextC, dir: nextD };
        }
        if (mg.kind === 'PARRY_RING') {
          const nextR = mg.ring <= 15 ? 100 : mg.ring - 4;
          return { ...mg, ring: nextR };
        }
        if (mg.kind === 'RHYTHM_HEAL') {
          const nextC = (mg.cursor + 4) % 100;
          return { ...mg, cursor: nextC };
        }
        return mg;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [activeMiniGame]);

  // Recyclage Tactique (1x par tour : défausse 1 carte -> +1 PA & pioche 1 carte)
  const handleRecycleCard = (idx) => {
    if (recycledThisTurn) {
      showToast('♻️ Déjà utilisé ce tour !');
      return;
    }
    setRecycledThisTurn(true);
    setHand((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      if (removed) setDiscardPile((d) => [...d, removed]);
      return copy;
    });
    setPa((p) => p + 1);
    setDrawPile((dp) => {
      if (dp.length === 0) return dp;
      const [drawn, ...rest] = dp;
      setHand((h) => [...h, drawn]);
      return rest;
    });
    RETRO_AUDIO.sfx('gold');
    showToast('♻️ Recyclage Tactique : +1 PA & +1 Carte !');
  };

  // Attaque Ultime Limit Break (100 %)
  const triggerLimitBreak = () => {
    if (limitGauge < 100) return;
    setLimitGauge(0);
    unlockTrophy('tr25');
    RETRO_AUDIO.sfx('crit');
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 350);

    const dmg = 26 + floor * 4;
    setEnemies((prev) => {
      const upd = prev.map((e) => {
        if (e.hp <= 0) return e;
        const blk = Math.min(e.armor || 0, dmg);
        return {
          ...e,
          armor: Math.max(0, (e.armor || 0) - blk),
          hp: Math.max(0, e.hp - Math.max(0, dmg - blk))
        };
      });
      if (upd.every((e) => e.hp <= 0)) setTimeout(() => handleCombatVictory(upd), 450);
      return upd;
    });
    setSquad((prev) => prev.map((h) => (h.hp > 0 ? { ...h, hp: Math.min(h.maxHp, h.hp + 10) } : h)));
    setCombatLog((prev) => [`🔥 LIMIT BREAK 16-BITS ! ${dmg} dégâts à tous & +10 PV !`, ...prev].slice(0, 8));
  };

  // Fin de tour du joueur -> Action du Familier + Tour des Ennemis
  const endPlayerTurn = () => {
    setActiveMiniGame(null);
    setOverchargeMode(false);
    const logs = [];

    // Action automatique du Familier invoqué
    let currentEnemies = [...enemies];
    if (activeMascot && activeMascot.turnsLeft > 0) {
      const mBonus =
        (relics.includes('r_dragon_scale') ? 3 : 0) +
        (activeMiniSets.some((ms) => ms.id === 'ms_summons') ? 4 : 0);
      const mDmg = activeMascot.dmg + mBonus;
      currentEnemies = currentEnemies.map((e, idx) => {
        if (idx !== selectedEnemyIdx || e.hp <= 0) return e;
        const blk = Math.min(e.armor || 0, mDmg);
        return {
          ...e,
          armor: Math.max(0, (e.armor || 0) - blk),
          hp: Math.max(0, e.hp - Math.max(0, mDmg - blk))
        };
      });
      if (activeMascot.heal > 0) {
        setSquad((prev) =>
          prev.map((h) => (h.hp > 0 ? { ...h, hp: Math.min(h.maxHp, h.hp + activeMascot.heal) } : h))
        );
      }
      logs.push(`🐾 ${activeMascot.name} inflige ${mDmg} dég. & +${activeMascot.heal} PV !`);
      setActiveMascot((m) => (m && m.turnsLeft > 1 ? { ...m, turnsLeft: m.turnsLeft - 1 } : null));
    }

    // Dégâts de Poison + Exécution des capacités réelles des ennemis vivants
    let totalIncoming = 0;
    let groupHealTriggered = false;
    currentEnemies = currentEnemies.map((en) => {
      if (en.hp <= 0) return en;
      let hpAfterPoison = en.hp;
      if (en.poison > 0) {
        hpAfterPoison = Math.max(0, hpAfterPoison - en.poison);
        logs.push(`☠️ ${en.name} subit ${en.poison} dégâts de Poison !`);
      }
      if (hpAfterPoison <= 0) return { ...en, hp: 0 };
      if (en.frozen) {
        logs.push(`❄️ ${en.name} est gelé et passe son tour !`);
        return { ...en, hp: hpAfterPoison, frozen: false, intent: '⚔️ Attaque' };
      }

      let nextEnemyArmor = en.armor || 0;
      if (en.intent === '💥 Frappe Lourde') {
        const heavy = Math.round(en.atk * 1.5);
        totalIncoming += heavy;
        logs.push(`💥 ${en.name} exécute une Frappe Lourde (${heavy} dég.) !`);
      } else if (en.intent === '🔥 Frappe Boss') {
        const bossStrike = Math.round(en.atk * 1.25);
        totalIncoming += bossStrike;
        logs.push(`🔥 ${en.name} déchaîne sa Frappe Boss (${bossStrike} dég.) !`);
      } else if (en.intent === '🛡️ Garde de Fer') {
        const gainArm = Math.round(8 + floor * 2);
        const lightStrike = Math.round(en.atk * 0.6);
        nextEnemyArmor += gainArm;
        totalIncoming += lightStrike;
        logs.push(`🛡️ ${en.name} renforce sa garde (+${gainArm} Armure) & frappe (${lightStrike}) !`);
      } else if (en.intent === '💚 Régén Groupe') {
        groupHealTriggered = true;
        logs.push(`💚 ${en.name} lance Régénération sur les monstres (+10 PV) !`);
      } else {
        totalIncoming += en.atk;
      }

      const roll = Math.random();
      const nextIntent = en.isBoss
        ? roll < 0.45
          ? '🔥 Frappe Boss'
          : roll < 0.75
          ? '🛡️ Garde de Fer'
          : '💚 Régén Groupe'
        : roll < 0.28
        ? '💥 Frappe Lourde'
        : roll < 0.52
        ? '🛡️ Garde de Fer'
        : roll < 0.68
        ? '💚 Régén Groupe'
        : '⚔️ Attaque';

      return {
        ...en,
        hp: hpAfterPoison,
        armor: nextEnemyArmor,
        intent: nextIntent
      };
    });

    if (groupHealTriggered) {
      currentEnemies = currentEnemies.map((e) =>
        e.hp > 0 ? { ...e, hp: Math.min(e.maxHp, e.hp + 10) } : e
      );
    }

    setEnemies(currentEnemies);
    if (currentEnemies.every((e) => e.hp <= 0)) {
      handleCombatVictory(currentEnemies);
      return;
    }

    // Absorption par l'Armure puis fonte partielle (-50% en fin de tour)
    const decayRate = difficulty === 'EASY' ? 0.75 : 0.5;
    if (totalIncoming > 0) {
      RETRO_AUDIO.sfx('hurt');
      const blocked = Math.min(armor, totalIncoming);
      const netDmg = Math.max(0, totalIncoming - blocked);
      const remAfterBlock = Math.max(0, armor - blocked);
      setArmor(Math.floor(remAfterBlock * decayRate));

      if (netDmg > 0) {
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 260);
        setSquad((prev) => {
          const alive = prev.filter((h) => h.hp > 0);
          if (alive.length === 0) return prev;
          const perHero = Math.max(1, Math.ceil(netDmg / alive.length));
          const nextSquad = prev.map((h) => (h.hp > 0 ? { ...h, hp: Math.max(0, h.hp - perHero) } : h));
          if (nextSquad.every((h) => h.hp <= 0)) {
            if (relics.includes('r_chrono_trigger') && !chronoReviveUsed) {
              setChronoReviveUsed(true);
              showToast('⏳ Œuf du Temps Chrono : Escouade ressuscitée !');
              return nextSquad.map((h) => ({ ...h, hp: Math.ceil(h.maxHp * 0.5) }));
            }
            setTimeout(() => setScreen('GAMEOVER'), 400);
          }
          return nextSquad;
        });
        logs.push(`💥 Ennemis attaquent : ${blocked} bloqués, ${netDmg} dégâts subis !`);
      } else {
        logs.push(`🛡️ Armure absorbe 100 % des ${totalIncoming} dégâts !`);
      }
    } else if (armor > 0) {
      setArmor((a) => Math.floor(a * decayRate));
    }

    // Pioche de nouvelles cartes pour le tour suivant
    setTurn((t) => t + 1);
    setPa(maxPa);
    setPlayedThisTurn([]);
    setRecycledThisTurn(false);

    setHand((curHand) => {
      const needed = Math.max(0, 5 - curHand.length);
      if (needed === 0) return curHand;
      let pool = [...drawPile];
      let disc = [...discardPile];
      if (pool.length < needed && disc.length > 0) {
        pool = [...pool, ...disc.sort(() => Math.random() - 0.5)];
        disc = [];
      }
      const drawn = pool.slice(0, needed);
      setDrawPile(pool.slice(needed));
      setDiscardPile(disc);
      return [...curHand, ...drawn];
    });

    setCombatLog((prev) => [...logs, ...prev].slice(0, 8));
  };

  // ==========================================================================
  // DÉPLACEMENT DANS LE DONJON & INTERACTIONS DE CASES
  // ==========================================================================
  const handleCellArrival = (x, y, grid) => {
    const tile = grid[y]?.[x];
    if (!tile || tile === 'EMPTY' || tile === 'START') return;

    if (tile === 'ENEMY') {
      startCombat(false);
    } else if (tile === 'AMBUSH') {
      startCombat('AMBUSH');
    } else if (tile === 'BOSS') {
      startCombat(true);
    } else if (tile === 'CHEST') {
      RETRO_AUDIO.sfx('booster');
      const bonusGold = 45 + floor * 12;
      setGold((g) => g + bonusGold);
      openBoosterPack(`📦 Coffre au Trésor (Étage ${floor})`, 'STANDARD');
      setDungeonGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[y][x] = 'EMPTY';
        return copy;
      });
    } else if (tile === 'FOUNTAIN') {
      RETRO_AUDIO.sfx('heal');
      setSquad((prev) =>
        prev.map((h) => ({ ...h, hp: Math.min(h.maxHp, (h.hp > 0 ? h.hp : 1) + 16) }))
      );
      showToast('⛲ Fontaine Sacrée : +16 PV à toute l’escouade !');
      setDungeonGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[y][x] = 'EMPTY';
        return copy;
      });
    } else if (tile === 'EVENT') {
      if (Math.random() < 0.4) {
        const q = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
        setActiveQuiz(q);
        setQuizFeedback('');
        setScreen('QUIZ');
      } else {
        const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        setActiveEvent(ev);
        setScreen('EVENT');
      }
      setDungeonGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[y][x] = 'EMPTY';
        return copy;
      });
    } else if (tile === 'FORGE') {
      showToast('🔨 Échoppe & Forge ambulante ouverte !');
      setTavernTab('FORGE');
      setScreen('TAVERN');
    } else if (tile === 'CAMPFIRE') {
      RETRO_AUDIO.sfx('heal');
      setSquad((prev) =>
        prev.map((h) => ({
          ...h,
          hp: Math.min(h.maxHp, (h.hp > 0 ? h.hp : 1) + 14),
          exp: h.exp + 15
        }))
      );
      showToast('🔥 Feu de Camp : +14 PV & +15 EXP à toute l’escouade !');
      setDungeonGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[y][x] = 'EMPTY';
        return copy;
      });
    } else if (tile === 'MYSTERY_BLOCK') {
      RETRO_AUDIO.sfx('gold');
      const bonusGold = 40 + floor * 10;
      setGold((g) => g + bonusGold);
      showToast(`🟨 Bloc Mystère [?] : +${bonusGold} Pièces d’Or !`);
      setDungeonGrid((prev) => {
        const copy = prev.map((r) => [...r]);
        copy[y][x] = 'EMPTY';
        return copy;
      });
    }
  };

  const moveDungeonForward = () => {
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 }
    ];
    const d = dirs[playerDir] || dirs[0];
    const nx = playerPos.x + d.dx;
    const ny = playerPos.y + d.dy;
    if (!dungeonGrid[ny] || dungeonGrid[ny][nx] === 'WALL') {
      RETRO_AUDIO.sfx('hurt');
      return;
    }
    RETRO_AUDIO.sfx('step');
    setStepAnim('forward');
    setTimeout(() => setStepAnim(''), 160);
    setPlayerPos({ x: nx, y: ny });
    setVisitedCells((prev) => ({ ...prev, [`${nx}_${ny}`]: true }));
    if (!wallSecret && Math.random() < 0.35) {
      const secretTypes = [
        { side: 'LEFT', label: 'Filon de Cristal', icon: '💎' },
        { side: 'RIGHT', label: 'Fresque Ancienne', icon: '📜' },
        { side: 'LEFT', label: 'Interrupteur Secret', icon: '🔘' }
      ];
      setWallSecret(secretTypes[Math.floor(Math.random() * secretTypes.length)]);
    }
    handleCellArrival(nx, ny, dungeonGrid);
  };

  const turnDungeon = (delta) => {
    RETRO_AUDIO.sfx('step');
    setStepAnim(delta < 0 ? 'left' : 'right');
    setTimeout(() => setStepAnim(''), 160);
    setPlayerDir((d) => (d + delta + 4) % 4);
  };

  // ==========================================================================
  // OUVERTURE DE BOOSTERS & FORGE DES FINITIONS
  // ==========================================================================
  const openBoosterPack = (title, tier = 'STANDARD') => {
    RETRO_AUDIO.sfx('booster');
    const pool = RAW_CARDS.map((r) => ALL_CARDS_MAP[r[0]]).filter((c) => {
      if (tier === 'CAMEO') return Boolean(c.cameoConsole) && !c.isSecret;
      return !c.isSecret;
    });
    const pulled = [];
    const newUnlocked = new Set(unlockedCards);
    const newMaster = { ...masterSet };

    for (let i = 0; i < 4; i++) {
      const card = pool[Math.floor(Math.random() * pool.length)];
      const roll = Math.random();
      let fin = 'STD';
      if (tier === 'GOLD') fin = roll < 0.4 ? 'GOLD24K' : roll < 0.75 ? 'GLITCH' : 'HOLO';
      else if (tier === 'RARE') fin = roll < 0.12 ? 'GOLD24K' : roll < 0.35 ? 'HOLO' : roll < 0.7 ? 'FOIL' : 'STD';
      else fin = roll < 0.04 ? 'GOLD24K' : roll < 0.15 ? 'HOLO' : roll < 0.4 ? 'FOIL' : 'STD';

      const isNew = !newUnlocked.has(card.id);
      newUnlocked.add(card.id);
      newMaster[`${card.id}_${fin}`] = true;
      pulled.push({ card, finish: fin, isNew });

      requestSprite(
        card.id,
        `16-bit Super Nintendo fantasy TCG card illustration for "${card.name}", ${card.desc}, vibrant SNES pixel art`,
        { aspectRatio: '1:1' }
      );
    }

    setUnlockedCards(newUnlocked);
    setMasterSet(newMaster);
    if (newUnlocked.size >= 25) unlockTrophy('tr02');
    if (newUnlocked.size >= 200) unlockTrophy('tr16');
    if (newUnlocked.size >= 350) unlockTrophy('tr17');
    if (newUnlocked.size >= 450) unlockTrophy('tr18');

    const mCount = Object.keys(newMaster).length;
    if (mCount >= 500) unlockTrophy('tr19');
    if (mCount >= 1200) unlockTrophy('tr20');
    if (mCount >= 2000) unlockTrophy('tr21');

    setBoosterModal({ title, cards: pulled });
  };

  const forgeCardNextFinish = (cardId) => {
    const order = ['STD', 'FOIL', 'HOLO', 'GLITCH', 'GOLD24K'];
    const costs = { STD: 40, FOIL: 75, HOLO: 120, GLITCH: 180 };
    const cur = cardSelectedFinish[cardId] || 'STD';
    const idx = order.indexOf(cur);
    if (idx < 0 || idx >= order.length - 1) return;
    const cost = costs[cur] || 50;
    if (gold < cost) {
      showToast(`⚠️ Il faut ${cost} Or pour forger cette carte !`);
      return;
    }
    const nextFin = order[idx + 1];
    setGold((g) => g - cost);
    setCardSelectedFinish((prev) => ({ ...prev, [cardId]: nextFin }));
    setMasterSet((prev) => ({ ...prev, [`${cardId}_${nextFin}`]: true }));
    RETRO_AUDIO.sfx('gold');
    if (nextFin === 'GOLD24K') unlockTrophy('tr07');
    showToast(`🔨 Carte forgée en finition ${nextFin} !`);
  };

  // Synthèse d'une Carte Secrète (#151-#160, #196-#200, #236-#240, #276-#280, #296-#300, #326-#330, #391-#400, #446-#450)
  const synthesizeSecretCard = (cardId) => {
    const cost = 150;
    if (gold < cost) {
      showToast('⚠️ Il faut 150 Or dans l’Alambic !');
      return;
    }
    setGold((g) => g - cost);
    setUnlockedCards((prev) => new Set([...prev, cardId]));
    setMasterSet((prev) => ({ ...prev, [`${cardId}_GOLD24K`]: true }));
    setCardSelectedFinish((prev) => ({ ...prev, [cardId]: 'GOLD24K' }));
    RETRO_AUDIO.sfx('booster');
    unlockTrophy('tr06');
    const c = ALL_CARDS_MAP[cardId];
    if (c) {
      requestSprite(
        c.id,
        `16-bit Super Nintendo legendary golden 24K TCG card art for "${c.name}", ${c.desc}, radiant gold SNES pixel art`,
        { priority: true, aspectRatio: '1:1' }
      );
      showToast(`⚗️ Carte Secrète synthétisée : ${c.name} (OR 24K) !`);
    }
  };

  // Export / Import Sauvegarde JSON
  const exportSaveJson = () => {
    const payload = {
      version: 'RetroDungeonTCG_v5',
      exportedAt: new Date().toISOString(),
      gold,
      unlockedCards: Array.from(unlockedCards),
      masterSet,
      cardSelectedFinish,
      claimedMilestones,
      claimedConsoleBounties,
      bestiary,
      trophies,
      discoveredDuos,
      lockOnCart,
      cardBack,
      ascension,
      activeGuestId,
      squad
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `retro-dungeon-tcg-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('💾 Sauvegarde .JSON exportée !');
  };

  const importSaveJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(String(ev.target?.result || '{}'));
        if (typeof data.gold === 'number') setGold(data.gold);
        if (Array.isArray(data.unlockedCards)) setUnlockedCards(new Set(data.unlockedCards));
        if (data.masterSet) setMasterSet(data.masterSet);
        if (data.cardSelectedFinish) setCardSelectedFinish(data.cardSelectedFinish);
        if (Array.isArray(data.claimedMilestones)) setClaimedMilestones(data.claimedMilestones);
        if (Array.isArray(data.claimedConsoleBounties)) setClaimedConsoleBounties(data.claimedConsoleBounties);
        if (data.bestiary) setBestiary(data.bestiary);
        if (Array.isArray(data.trophies)) setTrophies(data.trophies);
        if (Array.isArray(data.discoveredDuos)) setDiscoveredDuos(data.discoveredDuos);
        if (data.lockOnCart) setLockOnCart(data.lockOnCart);
        if (data.cardBack) setCardBack(data.cardBack);
        if (typeof data.ascension === 'number') setAscension(data.ascension);
        if (data.activeGuestId) setActiveGuestId(data.activeGuestId);
        if (Array.isArray(data.squad) && data.squad.length === 4) setSquad(data.squad);
        showToast('📂 Sauvegarde .JSON importée avec succès !');
      } catch {
        showToast('❌ Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  };

  // ==========================================================================
  // RENDU D'UNE CARTE TCG 16-BITS
  // ==========================================================================
  const renderCardView = (card, options = {}) => {
    const { onClick, compact = false, disabled = false, showRecycle = false, onRecycle } = options;
    const finId = card.finish?.id || cardSelectedFinish[card.id] || 'STD';
    const fin = FINISHES.find((f) => f.id === finId) || FINISHES[0];
    const spriteUrl = sprites[card.id];
    const isPainting = Boolean(generatingIds[card.id]);
    const isElemChain = screen === 'COMBAT' && lastElementPlayed && lastElementPlayed === card.element;
    const isDuoReady =
      screen === 'COMBAT' &&
      DUO_COMBOS.some(
        (dc) =>
          dc.cards.includes(card.id) &&
          dc.cards.some((other) => other !== card.id && playedThisTurn.includes(other))
      );

    const elemBadge = {
      FIRE: '🔥 Feu',
      ICE: '❄️ Glace',
      LIGHTNING: '⚡ Foudre',
      HOLY: '✨ Sacré',
      ARCANE: '🔮 Arcane',
      POISON: '☠️ Poison',
      PHYS: '⚔️ Phys'
    }[card.element] || '⚔️ Phys';

    return (
      <div
        onClick={disabled ? undefined : onClick}
        className={`relative rounded-xl border-2 transition-all select-none flex flex-col justify-between overflow-hidden ${
          finId === 'GOLD24K'
            ? 'border-yellow-300 bg-gradient-to-b from-amber-900 via-yellow-950 to-slate-950 shadow-lg shadow-amber-500/25'
            : finId === 'GLITCH'
            ? 'border-emerald-400 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950'
            : finId === 'HOLO'
            ? 'border-fuchsia-400 bg-gradient-to-b from-fuchsia-950 via-indigo-950 to-slate-950'
            : finId === 'FOIL'
            ? 'border-sky-400 bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950'
            : 'border-slate-500 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'} ${
          compact ? 'p-2' : 'p-2.5'
        }`}
      >
        {/* En-tête : Coût PA + Nom + Finition */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border border-white shrink-0">
            {card.cost}
          </span>
          <span className="text-[11px] font-extrabold text-white truncate flex-1">{card.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${fin.badge}`}>{fin.label}</span>
        </div>

        {/* Cadre Illustration Pixel Art */}
        <div className="relative w-full aspect-square rounded-lg bg-slate-950/90 border border-white/15 overflow-hidden flex items-center justify-center mb-1.5">
          {spriteUrl ? (
            <img
              src={spriteUrl}
              alt={card.name}
              className="w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <PixelSpriteSVG
              type={card.type === 'SHIELD' ? 'knight' : card.type === 'SUMMON' ? 'dragon' : 'ghost'}
              element={card.element}
              className="w-16 h-16"
            />
          )}

          {isPainting && (
            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-indigo-950/90 border border-cyan-400 text-[9px] text-cyan-200 font-bold animate-pulse">
              🎨 IA...
            </span>
          )}

          {card.cameoConsole && (
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-amber-400/70 text-[9px] font-black text-amber-300">
              [{card.cameoConsole}]
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              requestSprite(
                card.id,
                `16-bit Super Nintendo fantasy TCG card illustration for "${card.name}", ${card.desc}, vibrant SNES pixel art`,
                { priority: true, aspectRatio: '1:1' }
              );
              setInspectedCard(card);
            }}
            title="Inspecter la carte"
            className="absolute top-1 right-1 w-6 h-6 rounded bg-slate-950/85 hover:bg-amber-500 hover:text-slate-950 text-white text-[11px] flex items-center justify-center border border-white/25"
          >
            🔍
          </button>
        </div>

        {/* Badges Synergies en combat */}
        {(isElemChain || isDuoReady) && (
          <div className="flex flex-wrap gap-1 mb-1">
            {isDuoReady && (
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] animate-pulse">
                ⚡ DUO PRÊT !
              </span>
            )}
            {isElemChain && (
              <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-black text-[9px]">
                🔗 +5 CHAÎNE
              </span>
            )}
          </div>
        )}

        {/* Stats & Description */}
        <div className="flex items-center justify-between text-[10px] font-bold text-amber-200 mb-0.5">
          <span>{elemBadge}</span>
          <span>
            {card.type === 'ATTACK' ? '⚔️' : card.type === 'SHIELD' ? '🛡️' : card.type === 'HEAL' ? '💚' : '✨'}{' '}
            {Math.round(card.power * fin.mult)}
          </span>
        </div>
        <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">{card.desc}</p>

        {showRecycle && (
          <button
            type="button"
            disabled={recycledThisTurn}
            onClick={(e) => {
              e.stopPropagation();
              onRecycle?.();
            }}
            className="mt-1.5 w-full py-0.5 rounded bg-slate-800 hover:bg-cyan-800 disabled:opacity-40 text-[9px] font-bold text-cyan-200 border border-cyan-500/40"
          >
            ♻️ Recycler (+1 PA)
          </button>
        )}
      </div>
    );
  };

  // ==========================================================================
  // RENDU PRINCIPAL DE L'INTERFACE SUPER NINTENDO 16-BITS
  // ==========================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Styles SNES 16-Bits & Filtre CRT */}
      <style>{`
        .snes-window {
          background: linear-gradient(180deg, #172554 0%, #0f172a 100%);
          border: 3px solid #e2e8f0;
          box-shadow: inset 0 0 0 2px #1e3a8a, 0 8px 24px rgba(0,0,0,0.65);
        }
        .snes-boss-card {
          background: linear-gradient(180deg, #450a0a 0%, #1e1b4b 100%);
          border: 3px solid #facc15;
          box-shadow: inset 0 0 0 2px #991b1b, 0 0 20px rgba(250, 204, 21, 0.3);
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.25s ease-in-out; }
        @keyframes snes-vfx-burst {
          0% { transform: scale(0.35) rotate(-10deg); opacity: 0; }
          30% { transform: scale(1.2) rotate(4deg); opacity: 1; }
          70% { transform: scale(1.05) rotate(-2deg); opacity: 1; }
          100% { transform: scale(1.35) rotate(0deg); opacity: 0; }
        }
        .snes-vfx-burst { animation: snes-vfx-burst 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}</style>

      {crtFilter && (
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-15"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.65) 0px, rgba(0,0,0,0.65) 1px, transparent 1px, transparent 3px)'
          }}
        />
      )}

      {/* Toast Notification SNES */}
      {toastMsg && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl snes-window text-amber-300 font-extrabold text-xs sm:text-sm shadow-2xl animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Bandeau Cut-In Combo Duo 16-Bits */}
      {duoCutIn && (
        <div className="fixed inset-x-0 top-1/3 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 py-3 px-6 border-y-4 border-white shadow-2xl text-center animate-pulse">
          <div className="text-xs font-black uppercase tracking-widest">⚡ SUPER TECHNIQUE DUO 16-BITS ⚡</div>
          <div className="text-xl sm:text-2xl font-black">{duoCutIn.name}</div>
          <div className="text-xs font-bold">{duoCutIn.desc}</div>
        </div>
      )}

      {/* BARRE SUPÉRIEURE SNES (OR, MASTER SET, AUDIO, RACCOURCIS) */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b-2 border-indigo-400/50 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScreen('MENU')}
            className="px-2.5 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white font-black text-xs border border-indigo-300"
          >
            🎮 RETRO DUNGEON TCG
          </button>
          <span className="px-2.5 py-1 rounded bg-amber-950 border border-amber-400 text-amber-300 font-extrabold text-xs">
            💰 {gold} Or
          </span>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-900 border border-cyan-400/60 text-cyan-200 font-bold text-xs">
            📘 Master Set : {masterSetCount} / 2 350
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowGalleryModal(true)}
            className="px-2 py-1 rounded bg-indigo-950 hover:bg-indigo-900 border border-cyan-400/70 text-cyan-200 text-xs font-bold"
          >
            🖼️ Galerie IA ({Object.keys(sprites).length})
          </button>
          <button
            type="button"
            onClick={() => setShowBestiaryModal(true)}
            className="px-2 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-400/70 text-rose-200 text-xs font-bold"
          >
            🐉 Bestiaire ({Object.keys(bestiary).length}/404)
          </button>
          <button
            type="button"
            onClick={() => setShowGuestModal(true)}
            className="px-2 py-1 rounded bg-amber-950 hover:bg-amber-900 border border-amber-400/70 text-amber-200 text-xs font-bold"
          >
            🌟 Invité : {activeGuest?.name}
          </button>
          <button
            type="button"
            onClick={() => setMusicOn((m) => !m)}
            className={`px-2 py-1 rounded border text-xs font-bold ${
              musicOn ? 'bg-emerald-950 border-emerald-400 text-emerald-200' : 'bg-slate-900 border-slate-600 text-slate-400'
            }`}
          >
            {musicOn ? '🎵 BGM' : '🔇 BGM'}
          </button>
          <button
            type="button"
            onClick={() => setSfxOn((s) => !s)}
            className={`px-2 py-1 rounded border text-xs font-bold ${
              sfxOn ? 'bg-sky-950 border-sky-400 text-sky-200' : 'bg-slate-900 border-slate-600 text-slate-400'
            }`}
          >
            {sfxOn ? '🔊 SFX' : '🔇 SFX'}
          </button>
          <button
            type="button"
            onClick={() => setCrtFilter((c) => !c)}
            className={`px-2 py-1 rounded border text-xs font-bold ${
              crtFilter ? 'bg-purple-950 border-purple-400 text-purple-200' : 'bg-slate-900 border-slate-600 text-slate-400'
            }`}
          >
            📺 CRT
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* ÉCRAN 1 : MENU PRINCIPAL SUPER NINTENDO                              */}
      {/* ==================================================================== */}
      {screen === 'MENU' && (
        <main className="max-w-5xl mx-auto p-4 space-y-4">
          {/* Bannière 16-Bits IA */}
          <div className="relative rounded-2xl overflow-hidden snes-window">
            <div className="relative h-48 sm:h-64 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center">
              {sprites.main_banner && (
                <img
                  src={sprites.main_banner}
                  alt="Bannière SNES"
                  className="absolute inset-0 w-full h-full object-cover opacity-65"
                  style={{ imageRendering: 'pixelated' }}
                />
              )}
              <div className="relative z-10 text-center p-4 bg-slate-950/65 rounded-xl border border-amber-400/50 backdrop-blur-[1px]">
                <div className="text-xs font-black tracking-widest text-amber-300 uppercase mb-1">
                  ★ ÉDITION COLLECTOR 16-BITS • 534 CARTES & 404 CRÉATURES ★
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white drop-shadow">
                  RETRO DUNGEON TCG
                </h1>
                <p className="text-xs sm:text-sm text-cyan-200 mt-1">
                  Exploration JRPG • Combats Tactiques • Master Set 2 350 Cases • Pixel Art IA Flash
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  requestSprite(
                    'main_banner',
                    '16-bit Super Nintendo RPG title screen pixel art banner, heroic fantasy castle, glowing crystals, dragon silhouette, vibrant SNES palette, crisp pixel art',
                    { priority: true, aspectRatio: '16:9' }
                  )
                }
                className="absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded bg-slate-950/85 border border-cyan-400 text-[11px] font-bold text-cyan-200"
              >
                {generatingIds.main_banner ? '🎨 IA Flash...' : '🔄 Peindre Bannière'}
              </button>
            </div>
          </div>

          {/* Boutons d'Action Principaux */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={startNewExpedition}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base border-2 border-white shadow-xl flex flex-col items-center"
            >
              <span>⚔️ ENTRER DANS LE DONJON</span>
              <span className="text-xs font-bold opacity-80">Ascension Nv.{ascension} • Étage 1</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTavernTab('SQUAD');
                setScreen('TAVERN');
              }}
              className="p-4 rounded-xl snes-window hover:border-amber-300 text-white font-black text-base flex flex-col items-center"
            >
              <span>🛡️ ESCOUADE & CRÉATION</span>
              <span className="text-xs font-normal text-cyan-200">4 Héros • Portraits IA • Synergies</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTavernTab('ALBUM');
                setScreen('TAVERN');
              }}
              className="p-4 rounded-xl snes-window hover:border-amber-300 text-white font-black text-base flex flex-col items-center"
            >
              <span>📘 ALBUM, FORGE & ALAMBIC</span>
              <span className="text-xs font-normal text-amber-200">
                {unlockedCards.size}/534 Cartes • {masterSetCount}/2 350 Cases
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowGalleryModal(true)}
              className="p-4 rounded-xl snes-window hover:border-cyan-300 text-white font-black text-base flex flex-col items-center"
            >
              <span>🖼️ GALERIE D’ART IA</span>
              <span className="text-xs font-normal text-cyan-200">
                Musée Pixel Art Plein Écran ({Object.keys(sprites).length})
              </span>
            </button>
          </div>

          {/* Cartouche Lock-On, Ascension & Sauvegarde JSON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl snes-window space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-amber-300 text-sm">🔌 CARTOUCHE LOCK-ON, DIFFICULTÉ & ASCENSION</h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setAscension((a) => Math.max(0, a - 1))}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-500 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-400 text-rose-200 text-xs font-bold">
                    Ascension {ascension}/20
                  </span>
                  <button
                    type="button"
                    onClick={() => setAscension((a) => Math.min(20, a + 1))}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-500 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Sélecteur de Difficulté Tactique */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'EASY', label: '🟢 Aventurier', sub: 'Souple' },
                  { id: 'NORMAL', label: '🟡 Vétéran SNES', sub: 'Équilibré' },
                  { id: 'HARD', label: '🔴 Cauchemar', sub: '+25% Or/EXP' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`p-1.5 rounded-lg border text-center transition ${
                      difficulty === d.id
                        ? 'bg-amber-400 text-slate-950 border-white font-black'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-300 font-bold'
                    }`}
                  >
                    <div className="text-[11px]">{d.label}</div>
                    <div className="text-[9px] opacity-80">{d.sub}</div>
                  </button>
                ))}
              </div>

              <select
                value={lockOnCart}
                onChange={(e) => setLockOnCart(e.target.value)}
                className="w-full p-2 rounded bg-slate-900 border border-indigo-400 text-xs font-bold text-white"
              >
                {LOCKON_CARTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name} — {c.desc}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs text-slate-300">Dos de carte :</span>
                <select
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  className="p-1.5 rounded bg-slate-900 border border-indigo-400 text-xs text-white"
                >
                  {CARD_BACKS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.icon} {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl snes-window space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-cyan-300 text-sm">💾 SAUVEGARDE & MOTEUR IA FLASH</h2>
                <span className="text-[11px] text-emerald-300 font-bold">
                  🎨 {Object.keys(sprites).length} sprites en cache
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportSaveJson}
                  className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs border border-emerald-300"
                >
                  💾 Exporter (.JSON)
                </button>
                <label className="px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs border border-sky-300 cursor-pointer">
                  📂 Importer (.JSON)
                  <input type="file" accept=".json" onChange={importSaveJson} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setTavernTab('TROPHIES');
                    setScreen('TAVERN');
                  }}
                  className="px-3 py-1.5 rounded bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold text-xs border border-amber-400"
                >
                  🏆 Trophées ({trophies.length}/30)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={customGeminiKey}
                  onChange={(e) => {
                    setCustomGeminiKey(e.target.value);
                    try {
                      window.localStorage?.setItem('retro_gemini_key', e.target.value);
                    } catch {
                      // Ignore
                    }
                  }}
                  placeholder="🔑 Clé API Gemini optionnelle (iPhone 14)"
                  className="flex-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-600 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* ÉCRAN 2 : TAVERNE (CRÉATION ESCOUADE, ALBUM 2250, FORGE, ALAMBIC)     */}
      {/* ==================================================================== */}
      {screen === 'TAVERN' && (
        <main className="max-w-6xl mx-auto p-3 sm:p-4 space-y-4">
          {/* Onglets Taverne */}
          <div className="flex flex-wrap items-center justify-between gap-2 snes-window p-2 rounded-xl">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'SQUAD', label: '🛡️ Escouade & Création' },
                { id: 'ALBUM', label: `📘 Album (${masterSetCount}/2 350)` },
                { id: 'FORGE', label: '🔨 Forge & Boutique' },
                { id: 'ALAMBIC', label: '⚗️ Alambic Secrètes' },
                { id: 'TROPHIES', label: `🏆 Trophées (${trophies.length}/30)` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTavernTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition ${
                    tavernTab === tab.id
                      ? 'bg-amber-400 text-slate-950 border-white'
                      : 'bg-slate-900 text-slate-200 border-slate-600 hover:border-amber-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => (dungeonGrid.length > 0 ? setScreen('DUNGEON') : startNewExpedition())}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs border border-emerald-200"
            >
              ⚔️ Retour Donjon
            </button>
          </div>

          {/* ONGLET 1 : CRÉATION & PERSONNALISATION D'ESCOUADE */}
          {tavernTab === 'SQUAD' && (
            <div className="space-y-4">
              {/* Présélections d'Escouades Légendaires */}
              <div className="p-3 rounded-xl snes-window flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-300 mr-1">Présélections :</span>
                  {SQUAD_PRESETS.map((pr) => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() =>
                        setSquad(
                          pr.members.map((m, idx) => ({
                            id: `hero_${idx}`,
                            name: m.name,
                            cls: m.cls,
                            origin: m.origin,
                            stats: { ...m.stats },
                            hp: 26,
                            maxHp: 26,
                            level: 1,
                            exp: 0
                          }))
                        )
                      }
                      className="px-2.5 py-1 rounded bg-indigo-900 hover:bg-indigo-700 border border-indigo-400 text-xs font-bold"
                    >
                      {pr.name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    squad.forEach((h) => {
                      const clsName = CLASSES[h.cls]?.name || h.cls;
                      requestSprite(
                        `hero_${h.id}_${h.cls}_${h.name}`,
                        `16-bit Super Nintendo RPG hero character portrait "${h.name}", ${clsName}, expressive SNES pixel art portrait`,
                        { priority: true, aspectRatio: '1:1' }
                      );
                    });
                    showToast('🎨 Génération des 4 portraits IA lancée !');
                  }}
                  className="px-3 py-1.5 rounded bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs border border-cyan-300"
                >
                  🎨 Peindre les 4 Portraits IA
                </button>
              </div>

              {/* Cartes des 4 Héros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {squad.map((hero, hIdx) => {
                  const portraitKey = `hero_${hero.id}_${hero.cls}_${hero.name}`;
                  const usedPoints = Object.values(hero.stats).reduce((a, b) => a + b, 0);
                  const remainingPts = Math.max(0, 18 - usedPoints);
                  return (
                    <div key={hero.id} className="p-4 rounded-xl snes-window space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-xl bg-slate-950 border-2 border-amber-400 overflow-hidden flex items-center justify-center shrink-0">
                          {sprites[portraitKey] ? (
                            <img
                              src={sprites[portraitKey]}
                              alt={hero.name}
                              className="w-full h-full object-cover"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          ) : (
                            <PixelSpriteSVG type="knight" element="HOLY" className="w-14 h-14" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={hero.name}
                              onChange={(e) =>
                                setSquad((prev) =>
                                  prev.map((h, i) => (i === hIdx ? { ...h, name: e.target.value } : h))
                                )
                              }
                              className="flex-1 px-2 py-1 rounded bg-slate-900 border border-indigo-400 text-sm font-black text-white"
                            />
                            <span className="px-2 py-1 rounded bg-amber-500 text-slate-950 font-black text-xs">
                              Nv.{hero.level}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            <select
                              value={hero.cls}
                              onChange={(e) =>
                                setSquad((prev) =>
                                  prev.map((h, i) => (i === hIdx ? { ...h, cls: e.target.value } : h))
                                )
                              }
                              className="p-1 rounded bg-slate-900 border border-slate-600 text-xs font-bold"
                            >
                              {Object.values(CLASSES).map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.icon} {c.name}
                                </option>
                              ))}
                            </select>

                            <select
                              value={hero.origin}
                              onChange={(e) =>
                                setSquad((prev) =>
                                  prev.map((h, i) => (i === hIdx ? { ...h, origin: e.target.value } : h))
                                )
                              }
                              className="p-1 rounded bg-slate-900 border border-slate-600 text-xs font-bold"
                            >
                              {Object.values(ORIGINS).map((o) => (
                                <option key={o.id} value={o.id}>
                                  {o.icon} {o.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Répartition des points de statistiques */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-cyan-300">Statistiques JRPG</span>
                          <span className="text-amber-300">Points libres : {remainingPts}</span>
                        </div>
                        {['FOR', 'MAG', 'AGI', 'ESP', 'CHA'].map((st) => (
                          <div key={st} className="flex items-center gap-2 text-xs">
                            <span className="w-10 font-mono font-bold text-slate-300">{st}</span>
                            <div className="flex-1 h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-700">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-amber-400"
                                style={{ width: `${Math.min(100, (hero.stats[st] || 1) * 12)}%` }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setSquad((prev) =>
                                  prev.map((h, i) =>
                                    i === hIdx && h.stats[st] > 1
                                      ? { ...h, stats: { ...h.stats, [st]: h.stats[st] - 1 } }
                                      : h
                                  )
                                )
                              }
                              className="w-6 h-6 rounded bg-slate-800 border border-slate-600 font-bold"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-black text-amber-300">{hero.stats[st]}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setSquad((prev) =>
                                  prev.map((h, i) =>
                                    i === hIdx && remainingPts > 0
                                      ? { ...h, stats: { ...h.stats, [st]: h.stats[st] + 1 } }
                                      : h
                                  )
                                )
                              }
                              className="w-6 h-6 rounded bg-slate-800 border border-slate-600 font-bold"
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ONGLET 2 : ALBUM & MASTER SET 2 250 CASES */}
          {tavernTab === 'ALBUM' && (
            <div className="space-y-4">
              {/* Paliers de récompenses Master Set */}
              <div className="p-3 rounded-xl snes-window space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-black text-amber-300 text-sm">
                    📘 PROGRESSION MASTER SET : {masterSetCount} / 2 350 CASES
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const visible = ALL_CARDS_LIST.filter((c) => unlockedCards.has(c.id) && !sprites[c.id]).slice(
                        0,
                        12
                      );
                      visible.forEach((c) =>
                        requestSprite(
                          c.id,
                          `16-bit Super Nintendo fantasy TCG card illustration for "${c.name}", ${c.desc}, vibrant SNES pixel art`,
                          { aspectRatio: '1:1' }
                        )
                      );
                      showToast(`🎨 Peinture IA lancée pour ${visible.length} cartes !`);
                    }}
                    className="px-3 py-1 rounded bg-cyan-700 hover:bg-cyan-600 text-xs font-bold text-white border border-cyan-300"
                  >
                    🎨 Peindre 12 cartes (IA Flash)
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {MASTER_SET_MILESTONES.map((ms) => {
                    const claimed = claimedMilestones.includes(ms.slots);
                    const reached = masterSetCount >= ms.slots;
                    return (
                      <button
                        key={ms.slots}
                        type="button"
                        disabled={!reached || claimed}
                        onClick={() => {
                          setClaimedMilestones((prev) => [...prev, ms.slots]);
                          setGold((g) => g + ms.rewardGold);
                          RETRO_AUDIO.sfx('gold');
                          showToast(`🎉 Palier ${ms.label} réclamé : +${ms.rewardGold} Or !`);
                        }}
                        className={`px-2 py-1 rounded text-[11px] font-bold border ${
                          claimed
                            ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                            : reached
                            ? 'bg-amber-400 text-slate-950 border-white animate-pulse'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        {claimed ? '✅' : reached ? '🎁' : '🔒'} {ms.label} (+{ms.rewardGold} Or)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mini-Sets Thématiques */}
              <div className="p-3 rounded-xl snes-window">
                <h3 className="font-black text-cyan-300 text-xs uppercase mb-2">
                  ✨ 18 Mini-Sets Thématiques ({activeMiniSets.length}/18 Actifs en Combat)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {MINI_SETS.map((ms) => {
                    const owned = ms.cardIds.filter((id) => unlockedCards.has(id)).length;
                    const done = owned === ms.cardIds.length;
                    return (
                      <div
                        key={ms.id}
                        className={`p-2 rounded-lg border text-xs ${
                          done ? 'bg-amber-950/50 border-amber-400' : 'bg-slate-900/80 border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between font-bold">
                          <span>
                            {ms.icon} {ms.name}
                          </span>
                          <span className={done ? 'text-amber-300' : 'text-slate-400'}>
                            {owned}/{ms.cardIds.length}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300 mt-0.5">{ms.bonusDesc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filtres & Grille des Cartes */}
              <div className="flex flex-wrap gap-2">
                {['ALL', 'UNLOCKED', 'CAMEO', 'SECRET'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setAlbumFilter(f)}
                    className={`px-3 py-1 rounded text-xs font-bold border ${
                      albumFilter === f
                        ? 'bg-indigo-600 border-white text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {f === 'ALL'
                      ? 'Toutes (534)'
                      : f === 'UNLOCKED'
                      ? `Possédées (${unlockedCards.size})`
                      : f === 'CAMEO'
                      ? 'Clins d’Œil Rétro'
                      : 'Secrètes 24K'}
                  </button>
                ))}
                <input
                  type="text"
                  value={albumSearch}
                  onChange={(e) => setAlbumSearch(e.target.value)}
                  placeholder="🔍 Rechercher une carte..."
                  className="flex-1 min-w-[180px] px-3 py-1 rounded bg-slate-900 border border-slate-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {ALL_CARDS_LIST.filter((c) => {
                  if (albumFilter === 'UNLOCKED' && !unlockedCards.has(c.id)) return false;
                  if (albumFilter === 'CAMEO' && !c.cameoConsole) return false;
                  if (albumFilter === 'SECRET' && !c.isSecret) return false;
                  if (albumSearch && !c.name.toLowerCase().includes(albumSearch.toLowerCase())) return false;
                  return true;
                })
                  .slice(0, 60)
                  .map((c) => {
                    const owned = unlockedCards.has(c.id) || c.id.startsWith('g');
                    return (
                      <div key={c.id} className="space-y-1">
                        {owned ? (
                          renderCardView(c, { compact: true, onClick: () => setInspectedCard(c) })
                        ) : (
                          <div className="h-56 rounded-xl border-2 border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center p-3 text-center">
                            <span className="text-2xl opacity-40 mb-1">❓</span>
                            <span className="text-xs font-bold text-slate-500">#{c.id.toUpperCase()}</span>
                            <span className="text-[10px] text-slate-600 mt-1">À découvrir</span>
                          </div>
                        )}
                        {/* Timbres des 5 finitions */}
                        <div className="grid grid-cols-5 gap-0.5">
                          {FINISHES.map((f) => {
                            const hasSlot = Boolean(masterSet[`${c.id}_${f.id}`]);
                            return (
                              <button
                                key={f.id}
                                type="button"
                                disabled={!hasSlot}
                                onClick={() => setCardSelectedFinish((prev) => ({ ...prev, [c.id]: f.id }))}
                                className={`py-0.5 rounded text-[8px] font-black border ${
                                  hasSlot
                                    ? cardSelectedFinish[c.id] === f.id
                                      ? 'bg-amber-400 text-slate-950 border-white'
                                      : 'bg-slate-800 text-amber-200 border-amber-500/50'
                                    : 'bg-slate-950 text-slate-700 border-slate-800'
                                }`}
                              >
                                {f.id === 'GOLD24K' ? '24K' : f.id.slice(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ONGLET 3 : FORGE D'AMÉLIORATION DES FINITIONS & BOUTIQUE 16-BITS */}
          {tavernTab === 'FORGE' && (
            <div className="space-y-4">
              {/* Boutique de Boosters & Ravitaillement */}
              <div className="p-4 rounded-xl snes-window space-y-3">
                <h2 className="font-black text-amber-300 text-sm">🏪 BOUTIQUE 16-BITS & BOOSTERS CIBLÉS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {[
                    { id: 'STANDARD', name: 'Booster Aventurier', price: 50, icon: '🎴', desc: '4 cartes aléatoires' },
                    { id: 'CAMEO', name: 'Booster Clins d’Œil', price: 85, icon: '🕹️', desc: '4 cartes Rétro Cameo' },
                    { id: 'RARE', name: 'Booster Prisme Holo', price: 120, icon: '💎', desc: 'Hautes chances Foil/Holo' },
                    { id: 'GOLD', name: 'Booster Or 24 Carats', price: 220, icon: '👑', desc: 'Finition Glitch / Or 24K' },
                    { id: 'HEAL_TEAM', name: 'Auberge Complète', price: 45, icon: '🏨', desc: 'Soigne 100 % des PV' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (gold < item.price) {
                          showToast('⚠️ Pas assez d’Or !');
                          return;
                        }
                        setGold((g) => g - item.price);
                        if (item.id === 'HEAL_TEAM') {
                          setSquad((prev) => prev.map((h) => ({ ...h, hp: h.maxHp })));
                          RETRO_AUDIO.sfx('heal');
                          showToast('🏨 Escouade entièrement soignée !');
                        } else {
                          openBoosterPack(item.name, item.id);
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-900 hover:bg-indigo-950 border-2 border-amber-400/60 text-left flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="font-black text-xs text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">{item.desc}</div>
                      </div>
                      <div className="mt-2 font-black text-xs text-amber-300">💰 {item.price} Or</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Forge des Finitions */}
              <div className="p-4 rounded-xl snes-window space-y-3">
                <h2 className="font-black text-cyan-300 text-sm">
                  🔨 FORGE D’AMÉLIORATION DES FINITIONS (STD → FOIL → HOLO → GLITCH → OR 24K)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {Array.from(unlockedCards)
                    .map((id) => ALL_CARDS_MAP[id])
                    .filter(Boolean)
                    .slice(0, 30)
                    .map((c) => {
                      const cur = cardSelectedFinish[c.id] || 'STD';
                      const order = ['STD', 'FOIL', 'HOLO', 'GLITCH', 'GOLD24K'];
                      const costs = { STD: 40, FOIL: 75, HOLO: 120, GLITCH: 180 };
                      const idx = order.indexOf(cur);
                      const isMax = idx >= order.length - 1;
                      return (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-white truncate">{c.name}</div>
                            <div className="text-[10px] text-amber-300">Finition actuelle : {cur}</div>
                          </div>
                          <button
                            type="button"
                            disabled={isMax}
                            onClick={() => forgeCardNextFinish(c.id)}
                            className="px-2.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black text-[11px] shrink-0"
                          >
                            {isMax ? '👑 MAX' : `🔨 Forger (${costs[cur]} Or)`}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 4 : ALAMBIC DES CARTES SECRÈTES HORS-SÉRIE */}
          {tavernTab === 'ALAMBIC' && (
            <div className="p-4 rounded-xl snes-window space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-black text-amber-300 text-sm">
                  ⚗️ ALAMBIC ALCHIMIQUE — SYNTHÈSE DES 55 CARTES SECRÈTES OR 24K
                </h2>
                <span className="text-xs text-cyan-200">Coût : 150 Or / Carte Secrète</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {ALL_CARDS_LIST.filter((c) => c.isSecret).map((c) => {
                  const owned = unlockedCards.has(c.id);
                  return (
                    <div key={c.id} className="space-y-1.5">
                      {renderCardView(
                        { ...c, finish: FINISHES[4] },
                        { compact: true, onClick: () => setInspectedCard(c) }
                      )}
                      <button
                        type="button"
                        disabled={owned}
                        onClick={() => synthesizeSecretCard(c.id)}
                        className="w-full py-1 rounded bg-amber-500 hover:bg-amber-400 disabled:bg-emerald-950 disabled:text-emerald-300 text-slate-950 font-black text-[11px]"
                      >
                        {owned ? '✅ Synthétisée' : '⚗️ Distiller (150 Or)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ONGLET 5 : TROPHÉES */}
          {tavernTab === 'TROPHIES' && (
            <div className="p-4 rounded-xl snes-window grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {TROPHIES.map((tr) => {
                const unlocked = trophies.includes(tr.id);
                return (
                  <div
                    key={tr.id}
                    className={`p-3 rounded-lg border flex items-center gap-3 ${
                      unlocked ? 'bg-amber-950/40 border-amber-400' : 'bg-slate-900/70 border-slate-800 opacity-55'
                    }`}
                  >
                    <span className="text-2xl">{unlocked ? tr.icon : '🔒'}</span>
                    <div>
                      <div className="font-black text-xs text-white">{tr.name}</div>
                      <div className="text-[11px] text-slate-300">{tr.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* ÉCRAN 3 : EXPLORATION DU DONJON 16-BITS                              */}
      {/* ==================================================================== */}
      {screen === 'DUNGEON' && (
        <main className="max-w-5xl mx-auto p-3 sm:p-4 space-y-3">
          {/* Bandeau Escouade avec barres de PV et EXP / Level Up */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {squad.map((h) => {
              const expMax = h.level * 45;
              const expPct = Math.min(100, Math.round((h.exp / expMax) * 100));
              const hpPct = Math.max(0, Math.min(100, Math.round((h.hp / h.maxHp) * 100)));
              return (
                <div key={h.id} className="p-2 rounded-xl snes-window text-xs">
                  <div className="flex items-center justify-between font-black">
                    <span className="truncate">
                      {CLASSES[h.cls]?.icon} {h.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px]">
                      Nv.{h.level}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-emerald-300 font-bold">
                    <span>
                      PV {h.hp}/{h.maxHp}
                    </span>
                    <span>EXP {expPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded overflow-hidden mt-0.5">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${hpPct}%` }} />
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded overflow-hidden mt-1">
                    <div className="h-full bg-cyan-400 transition-all" style={{ width: `${expPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vue 3D Première Personne */}
          <DungeonFirstPersonView
            grid={dungeonGrid}
            pos={playerPos}
            dir={playerDir}
            biome={currentBiome}
            floor={floor}
            stepAnim={stepAnim}
            dustyScreen={dustyScreen}
            onBlowDust={() => {
              setDustyScreen(false);
              setGold((g) => g + 15);
              unlockTrophy('tr05');
              RETRO_AUDIO.sfx('gold');
              showToast('🌬️ Cartouche nettoyée ! +15 Or !');
            }}
            onMoveForward={moveDungeonForward}
            onTurnLeft={() => turnDungeon(-1)}
            onTurnRight={() => turnDungeon(1)}
            onInteractCell={() => handleCellArrival(playerPos.x, playerPos.y, dungeonGrid)}
            bgSprite={sprites[`biome_${currentBiome.id}`]}
            activeGuest={activeGuest}
            wallSecret={wallSecret}
            onClaimWallSecret={() => {
              setWallSecret(null);
              setGold((g) => g + 25);
              setSquad((prev) => prev.map((h) => ({ ...h, exp: h.exp + 15 })));
              RETRO_AUDIO.sfx('gold');
              showToast('✨ Secret mural découvert : +25 Or & +15 EXP !');
            }}
          />

          {/* D-Pad Tactile SNES + Mini-Carte Radar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="p-3 rounded-xl snes-window text-xs space-y-1">
              <div className="font-black text-amber-300">🏛️ {currentStructure.name}</div>
              <div className="text-slate-300">{currentStructure.desc}</div>
              <div className="pt-1 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTavernTab('FORGE');
                    setScreen('TAVERN');
                  }}
                  className="px-2.5 py-1 rounded bg-amber-600 text-slate-950 font-black text-[11px]"
                >
                  🔨 Forge & Boutique
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeckModal(true)}
                  className="px-2.5 py-1 rounded bg-indigo-700 text-white font-bold text-[11px]"
                >
                  🃏 Collection ({unlockedCards.size})
                </button>
              </div>
            </div>

            {/* Contrôles Directionnels Tactiles */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => turnDungeon(-1)}
                className="w-14 h-14 rounded-xl snes-window hover:border-amber-300 font-black text-xl active:scale-95"
              >
                ↺
              </button>
              <button
                type="button"
                onClick={moveDungeonForward}
                className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 font-black text-2xl border-2 border-white shadow-xl active:scale-95"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => turnDungeon(1)}
                className="w-14 h-14 rounded-xl snes-window hover:border-amber-300 font-black text-xl active:scale-95"
              >
                ↻
              </button>
            </div>

            {/* Mini-Carte Radar 9x9 */}
            <div className="p-2 rounded-xl snes-window flex flex-col items-center">
              <div className="grid grid-cols-9 gap-0.5 bg-slate-950 p-1 rounded border border-slate-700">
                {dungeonGrid.map((row, y) =>
                  row.map((cell, x) => {
                    const isPlayer = playerPos.x === x && playerPos.y === y;
                    const seen = visitedCells[`${x}_${y}`] || Math.abs(playerPos.x - x) + Math.abs(playerPos.y - y) <= 1;
                    return (
                      <div
                        key={`${x}_${y}`}
                        className={`w-3 h-3 rounded-[1px] flex items-center justify-center text-[7px] font-black ${
                          isPlayer
                            ? 'bg-amber-400 text-slate-950'
                            : !seen
                            ? 'bg-slate-950'
                            : cell === 'WALL'
                            ? 'bg-slate-700'
                            : cell === 'BOSS'
                            ? 'bg-red-600'
                            : cell === 'ENEMY'
                            ? 'bg-rose-500'
                            : cell === 'AMBUSH'
                            ? 'bg-orange-500'
                            : cell === 'CHEST'
                            ? 'bg-yellow-500'
                            : cell === 'FOUNTAIN'
                            ? 'bg-cyan-400'
                            : cell === 'FORGE'
                            ? 'bg-amber-400'
                            : cell === 'CAMPFIRE'
                            ? 'bg-orange-400'
                            : cell === 'MYSTERY_BLOCK'
                            ? 'bg-yellow-300'
                            : 'bg-slate-800'
                        }`}
                      >
                        {isPlayer ? '▲' : ''}
                      </div>
                    );
                  })
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Radar 16-Bits</span>
            </div>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* ÉCRAN 4 : ARÈNE DE COMBAT JRPG GRAND FORMAT                          */}
      {/* ==================================================================== */}
      {screen === 'COMBAT' && (
        <main className={`max-w-6xl mx-auto p-2 sm:p-4 space-y-3 ${screenShake ? 'animate-shake' : ''}`}>
          {/* Scène Panoramique des Ennemis */}
          <div className="relative rounded-2xl overflow-hidden snes-window p-3 sm:p-4">
            {sprites[`biome_${currentBiome.id}`] && (
              <img
                src={sprites[`biome_${currentBiome.id}`]}
                alt="Arène"
                className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
              />
            )}

            {/* Effets Visuels Pixel Art SNES en surimpression */}
            <CombatPixelVFX vfx={combatVfx} />

            {floatingPopup && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-lg animate-bounce pointer-events-none">
                {floatingPopup}
              </div>
            )}

            {/* En-tête Combat : Tour, Armure, Chaîne de Tour, Mini-Sets Actifs, Toggle Mini-Jeux */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded bg-slate-950/90 border border-amber-400 text-xs font-black text-amber-300">
                  Tour {turn} • Étage {floor}
                </span>
                <span className="px-2.5 py-1 rounded bg-sky-950/90 border border-sky-400 text-xs font-black text-sky-200">
                  🛡️ Armure : {armor}
                </span>
                {playedThisTurn.length > 0 && (
                  <span className="px-2.5 py-1 rounded bg-gradient-to-r from-orange-600 to-amber-500 border border-white text-xs font-black text-slate-950 animate-pulse">
                    🔥 COMBO x{playedThisTurn.length + 1} (+{playedThisTurn.length * 2} Puiss.)
                  </span>
                )}
                {activeMiniSets.length > 0 && (
                  <span className="px-2 py-1 rounded bg-amber-950/90 border border-amber-400 text-[11px] font-bold text-amber-200">
                    ✨ {activeMiniSets.length} Mini-Set(s) actifs
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMiniGamesEnabled((m) => !m)}
                className={`px-2.5 py-1 rounded border text-xs font-bold ${
                  miniGamesEnabled
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                    : 'bg-slate-900 border-slate-600 text-slate-400'
                }`}
              >
                🕹️ Mini-Jeux : {miniGamesEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Portraits Grand Format des Ennemis & Boss */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-2">
              {enemies.map((en, idx) => {
                const isSelected = idx === selectedEnemyIdx;
                const isHit = en.hp > 0 && (hitEnemyMask === 'ALL' || hitEnemyMask === idx);
                const hpPct = Math.max(0, Math.min(100, Math.round((en.hp / en.maxHp) * 100)));
                const enSprite = sprites[en.id];
                const isPaintingEn = Boolean(generatingIds[en.id]);

                return (
                  <div
                    key={en.uid}
                    onClick={() => en.hp > 0 && setSelectedEnemyIdx(idx)}
                    className={`relative p-3 rounded-2xl transition-all cursor-pointer flex flex-col items-center ${
                      en.isBoss ? 'snes-boss-card' : 'bg-slate-950/85 border-2'
                    } ${
                      isSelected ? 'border-amber-300 scale-105 shadow-2xl' : 'border-slate-600 opacity-85'
                    } ${isHit ? 'brightness-150 scale-110 ring-4 ring-white' : ''} ${
                      en.hp <= 0 ? 'opacity-30 grayscale' : ''
                    }`}
                  >
                    {/* Intention télégraphiée avec valeur réelle */}
                    <div className="px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-400 text-rose-200 text-[11px] font-extrabold mb-2">
                      {en.frozen
                        ? '❄️ GELÉ'
                        : en.intent === '💥 Frappe Lourde'
                        ? `💥 Frappe Lourde (${Math.round(en.atk * 1.5)} dég)`
                        : en.intent === '🔥 Frappe Boss'
                        ? `🔥 Frappe Boss (${Math.round(en.atk * 1.25)} dég)`
                        : en.intent === '🛡️ Garde de Fer'
                        ? `🛡️ Garde (+${Math.round(8 + floor * 2)} Arm) & ${Math.round(en.atk * 0.6)} dég`
                        : en.intent === '💚 Régén Groupe'
                        ? '💚 Régén Groupe (+10 PV)'
                        : `${en.intent} (${en.atk} dég)`}
                    </div>

                    {/* Sprite Pixel Art IA Grand Format */}
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-xl bg-slate-900/90 border border-white/20 overflow-hidden flex items-center justify-center">
                      {enSprite ? (
                        <img
                          src={enSprite}
                          alt={en.name}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      ) : (
                        <PixelSpriteSVG type={en.spriteType} element="FIRE" className="w-28 h-28" />
                      )}

                      {isPaintingEn && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-indigo-950/95 border border-cyan-400 text-[10px] font-bold text-cyan-200 animate-pulse">
                          🎨 Peinture Monstre IA...
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requestSprite(
                            en.id,
                            `16-bit SNES JRPG enemy monster sprite "${en.name}" inspired by ${en.game} (${en.console}), dramatic dark fantasy pixel art on dark background, crisp pixel art`,
                            { priority: true, aspectRatio: '1:1' }
                          );
                        }}
                        className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-950/90 border border-amber-400/70 text-[10px] font-bold text-amber-200"
                      >
                        🔄 IA
                      </button>
                    </div>

                    {/* Nom, Console & Barre de Vie */}
                    <div className="w-full mt-2 text-center">
                      <div className="text-xs sm:text-sm font-black text-white">
                        {en.name}{' '}
                        <span className="text-[10px] text-amber-300 font-mono">[{en.console}]</span>
                      </div>
                      <div className="text-[10px] text-slate-300 flex items-center justify-center gap-1.5">
                        <span>{en.game}</span>
                        {en.enraged && (
                          <span className="px-1.5 rounded bg-orange-600 text-white font-black text-[9px] animate-pulse">
                            🔥 FURIE
                          </span>
                        )}
                      </div>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-600 mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all"
                          style={{ width: `${hpPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-bold mt-0.5">
                        <span className="text-rose-200">
                          PV {en.hp} / {en.maxHp}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {(en.armor || 0) > 0 && <span className="text-sky-300">🛡️ {en.armor}</span>}
                          {en.poison > 0 && <span className="text-emerald-400">☠️ {en.poison}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Familier invoqué actif */}
              {activeMascot && (
                <div className="p-2.5 rounded-xl bg-amber-950/90 border-2 border-amber-300 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black text-amber-300">
                    🐾 FAMILIER ({activeMascot.turnsLeft} tours)
                  </span>
                  <div className="w-16 h-16 my-1 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
                    {sprites[`mascot_${activeMascot.id}`] ? (
                      <img
                        src={sprites[`mascot_${activeMascot.id}`]}
                        alt={activeMascot.name}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <span className="text-3xl">{activeMascot.icon}</span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-white">{activeMascot.name}</div>
                </div>
              )}
            </div>

            {/* Ligne de Front JRPG : Portraits IA des 4 Héros + Héros Invité */}
            <div className="relative z-10 mt-3 pt-2.5 border-t border-indigo-400/35 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {squad.map((h) => {
                const portraitKey = `hero_${h.id}_${h.cls}_${h.name}`;
                const isActing = actingHeroId === h.id;
                const hpPct = Math.max(0, Math.min(100, Math.round((h.hp / h.maxHp) * 100)));
                const expPct = Math.min(100, Math.round((h.exp / (h.level * 45)) * 100));
                return (
                  <div
                    key={h.id}
                    className={`p-2 rounded-xl bg-slate-950/90 border transition-all flex items-center gap-2 ${
                      isActing
                        ? '-translate-y-1.5 border-amber-300 ring-2 ring-amber-400 shadow-lg shadow-amber-500/30'
                        : 'border-indigo-500/50'
                    } ${h.hp <= 0 ? 'opacity-40 grayscale' : ''}`}
                  >
                    <div className="w-11 h-11 rounded-lg bg-slate-900 border border-amber-400/60 overflow-hidden flex items-center justify-center shrink-0">
                      {sprites[portraitKey] ? (
                        <img
                          src={sprites[portraitKey]}
                          alt={h.name}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      ) : (
                        <PixelSpriteSVG type="knight" element="HOLY" className="w-9 h-9" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-black text-white truncate">{h.name}</span>
                        <span className="text-[9px] font-black px-1 rounded bg-amber-400 text-slate-950">
                          Nv.{h.level}
                        </span>
                      </div>
                      {isActing && (
                        <div className="text-[9px] font-black text-amber-300 animate-pulse">⚡ EN ACTION !</div>
                      )}
                      <div className="text-[9px] text-emerald-300 font-bold">
                        PV {h.hp}/{h.maxHp}
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${hpPct}%` }} />
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded overflow-hidden mt-0.5">
                        <div className="h-full bg-cyan-400" style={{ width: `${expPct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 5e Membre : Héros Invité Actif */}
              {activeGuest && (
                <div className="p-2 rounded-xl bg-amber-950/75 border border-amber-400/70 flex items-center gap-2 col-span-2 sm:col-span-1">
                  <div className="w-11 h-11 rounded-lg bg-slate-950 border border-amber-300 flex items-center justify-center text-xl shrink-0">
                    🌟
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-black text-amber-300 uppercase">Allié Invité</div>
                    <div className="text-[11px] font-black text-white truncate">{activeGuest.name}</div>
                    <div className="text-[9px] text-cyan-200 truncate">{activeGuest.bonusDesc}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Journal de Combat Compact */}
            <div className="relative z-10 mt-2 p-2 rounded-lg bg-slate-950/85 border border-indigo-400/40 text-[11px] text-cyan-100 max-h-16 overflow-y-auto">
              {combatLog.map((line, i) => (
                <div key={i} className={i === 0 ? 'font-bold text-amber-200' : 'opacity-75'}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Barre d'Escouade & Commandes Tactiques (PA, Surcharge, Limit Break, Pioche/Défausse, Fin de Tour) */}
          <div className="p-3 rounded-xl snes-window flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-sm border-2 border-white">
                ⚡ PA : {pa} / {maxPa}
              </div>

              <button
                type="button"
                onClick={() => setOverchargeMode((o) => !o)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 transition ${
                  overchargeMode
                    ? 'bg-orange-500 text-slate-950 border-white animate-pulse'
                    : 'bg-slate-900 text-orange-300 border-orange-500/60'
                }`}
              >
                🔥 Surcharge [O] (+1 PA → x1.6)
              </button>

              <button
                type="button"
                disabled={limitGauge < 100}
                onClick={triggerLimitBreak}
                className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 ${
                  limitGauge >= 100
                    ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 border-white animate-bounce'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                💥 LIMIT BREAK [L] ({limitGauge}%)
              </button>

              {/* Pioche & Défausse visuelles utilisant le Dos de Carte choisi */}
              {(() => {
                const backObj = CARD_BACKS.find((b) => b.id === cardBack) || CARD_BACKS[0];
                return (
                  <div className="flex items-center gap-1.5">
                    <div
                      title={`Pioche (${backObj.name})`}
                      className={`px-2.5 py-1 rounded-lg bg-gradient-to-br ${backObj.bg} border ${backObj.border} text-[11px] font-black text-white shadow`}
                    >
                      {backObj.icon} Pioche : {drawPile.length}
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-600 text-[11px] font-bold text-slate-300">
                      🗑️ Défausse : {discardPile.length}
                    </div>
                  </div>
                );
              })()}
            </div>

            <button
              type="button"
              onClick={endPlayerTurn}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm border-2 border-white shadow-lg"
            >
              ⏭️ FIN DU TOUR [E]
            </button>
          </div>

          {/* Main de Cartes du Joueur */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {hand.map((card, idx) => {
              const effCost = card.cost + (overchargeMode ? 1 : 0);
              return (
                <div key={card.uid} className="relative">
                  <span className="hidden md:flex absolute -top-2 -left-1.5 z-20 w-5 h-5 rounded bg-slate-950 border border-amber-300 text-[10px] font-black text-amber-300 items-center justify-center shadow">
                    {idx + 1}
                  </span>
                  {renderCardView(card, {
                    disabled: pa < effCost,
                    showRecycle: !recycledThisTurn,
                    onRecycle: () => handleRecycleCard(idx),
                    onClick: () => handleSelectHandCard(card, idx)
                  })}
                  {dustyHandIdx === idx && (
                    <button
                      type="button"
                      onClick={() => {
                        setDustyHandIdx(null);
                        setPa((p) => p + 1);
                        RETRO_AUDIO.sfx('gold');
                        showToast('💨 Cartouche soufflée ! +1 PA bonus !');
                      }}
                      className="absolute inset-0 z-20 rounded-xl bg-amber-950/85 border-2 border-amber-300 flex flex-col items-center justify-center p-2 text-center"
                    >
                      <span className="text-2xl animate-bounce">💨</span>
                      <span className="text-[11px] font-black text-amber-200">SOUFFLER (+1 PA)</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* ÉCRANS ÉVÉNEMENT, QUIZ RÉTRO & GAME OVER                             */}
      {/* ==================================================================== */}
      {screen === 'EVENT' && activeEvent && (
        <main className="max-w-xl mx-auto p-4 mt-6">
          <div className="p-6 rounded-2xl snes-window text-center space-y-4">
            <div className="text-5xl">{activeEvent.icon}</div>
            <h2 className="text-xl font-black text-amber-300">{activeEvent.title}</h2>
            <p className="text-sm text-slate-200">{activeEvent.text}</p>
            <div className="space-y-2 pt-2">
              {activeEvent.choices.map((ch, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (ch.type === 'HEAL') {
                      setSquad((prev) =>
                        prev.map((h) => ({ ...h, hp: Math.min(h.maxHp, (h.hp > 0 ? h.hp : 1) + ch.val) }))
                      );
                      RETRO_AUDIO.sfx('heal');
                    } else if (ch.type === 'GOLD') {
                      setGold((g) => g + ch.val);
                      RETRO_AUDIO.sfx('gold');
                    } else if (ch.type === 'RELIC') {
                      const avail = RELICS.filter((r) => !relics.includes(r.id));
                      const pick = avail[Math.floor(Math.random() * avail.length)] || RELICS[0];
                      setRelics((prev) => {
                        const next = [...new Set([...prev, pick.id])];
                        if (next.length >= 5) unlockTrophy('tr23');
                        return next;
                      });
                      RETRO_AUDIO.sfx('booster');
                      showToast(`🏺 Relique obtenue : ${pick.name} !`);
                    } else if (ch.type === 'EXP') {
                      setSquad((prev) => prev.map((h) => ({ ...h, exp: h.exp + ch.val })));
                      RETRO_AUDIO.sfx('levelup');
                    }
                    setActiveEvent(null);
                    setScreen('DUNGEON');
                  }}
                  className="w-full p-3 rounded-xl bg-indigo-800 hover:bg-indigo-700 border border-amber-300 font-bold text-sm text-white"
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>
        </main>
      )}

      {screen === 'QUIZ' && activeQuiz && (
        <main className="max-w-xl mx-auto p-4 mt-6">
          <div className="p-6 rounded-2xl snes-window text-center space-y-4">
            <div className="text-4xl">🎓🕹️</div>
            <h2 className="text-lg font-black text-cyan-300">QUIZ ARCADE & SUPER NINTENDO</h2>
            <p className="text-sm font-bold text-white">{activeQuiz.question}</p>
            <div className="space-y-2">
              {activeQuiz.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (idx === activeQuiz.answerIdx) {
                      setGold((g) => g + activeQuiz.rewardGold);
                      unlockTrophy('tr12');
                      RETRO_AUDIO.sfx('victory');
                      showToast(`✅ Bonne réponse ! +${activeQuiz.rewardGold} Or !`);
                    } else {
                      RETRO_AUDIO.sfx('hurt');
                      showToast(`❌ Raté ! Réponse : ${activeQuiz.options[activeQuiz.answerIdx]}`);
                    }
                    setActiveQuiz(null);
                    setScreen('DUNGEON');
                  }}
                  className="w-full p-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-indigo-400 font-bold text-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
            {quizFeedback && <div className="text-xs text-amber-300">{quizFeedback}</div>}
          </div>
        </main>
      )}

      {screen === 'GAMEOVER' && (
        <main className="max-w-lg mx-auto p-4 mt-10 text-center">
          <div className="p-6 rounded-2xl snes-boss-card space-y-4">
            <div className="text-5xl">💀</div>
            <h2 className="text-2xl font-black text-amber-300">ESCOUADE VAINCUE</h2>
            <p className="text-xs text-slate-200">
              Votre collection, votre Master Set ({masterSetCount}/2 350), votre Bestiaire et vos Trophées sont conservés !
            </p>
            <button
              type="button"
              onClick={() => setScreen('MENU')}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-sm border-2 border-white"
            >
              🎮 Retour au Menu Principal
            </button>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* MODALE MINI-JEU INTERACTIF LORS DE LA SÉLECTION D'UNE CARTE          */}
      {/* ==================================================================== */}
      {activeMiniGame && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-5 rounded-2xl snes-window text-center space-y-4">
            <div className="text-xs font-black uppercase text-amber-300">
              🕹️ ACTION COMMAND 16-BITS : {activeMiniGame.card.name}
            </div>

            {activeMiniGame.kind === 'TIMING_BAR' && (
              <div className="space-y-3">
                <p className="text-xs text-cyan-200">Frappez dans la zone dorée centrale pour x1.45 dégâts !</p>
                <div className="relative w-full h-8 rounded-full bg-slate-900 border-2 border-white overflow-hidden">
                  <div className="absolute inset-y-0 left-[38%] w-[24%] bg-amber-400/80" />
                  <div
                    className="absolute inset-y-0 w-2 bg-white shadow"
                    style={{ left: `${activeMiniGame.cursor}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const hit = activeMiniGame.cursor >= 38 && activeMiniGame.cursor <= 62;
                    executeCardEffect(activeMiniGame.card, activeMiniGame.handIdx, hit ? 1.45 : 1.0);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-sm"
                >
                  ⚔️ FRAPPER MAINTENANT !
                </button>
              </div>
            )}

            {activeMiniGame.kind === 'RUNE_SEQ' && (
              <div className="space-y-3">
                <p className="text-xs text-cyan-200">Reproduisez la séquence runique pour x1.50 Surtension !</p>
                <div className="flex justify-center gap-3 text-3xl">
                  {activeMiniGame.runes.map((r, i) => (
                    <span
                      key={i}
                      className={`p-2 rounded-lg border ${
                        i < activeMiniGame.input.length
                          ? 'bg-emerald-900 border-emerald-400'
                          : 'bg-slate-900 border-amber-400'
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['🔥', '❄️', '⚡', '🔮'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => {
                        const nextIn = [...activeMiniGame.input, sym];
                        if (nextIn.length >= 3) {
                          const ok = nextIn.every((v, idx) => v === activeMiniGame.runes[idx]);
                          executeCardEffect(activeMiniGame.card, activeMiniGame.handIdx, ok ? 1.5 : 1.0);
                        } else {
                          setActiveMiniGame({ ...activeMiniGame, input: nextIn });
                        }
                      }}
                      className="py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-800 border border-white/30 text-2xl"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMiniGame.kind === 'PARRY_RING' && (
              <div className="space-y-3">
                <p className="text-xs text-cyan-200">Synchronisez l’anneau d’énergie sur le cœur doré (x1.45) !</p>
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-400 bg-amber-400/20" />
                  <div
                    className="absolute rounded-full border-2 border-cyan-300"
                    style={{ width: `${activeMiniGame.ring}%`, height: `${activeMiniGame.ring}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const ok = activeMiniGame.ring >= 25 && activeMiniGame.ring <= 52;
                    executeCardEffect(activeMiniGame.card, activeMiniGame.handIdx, ok ? 1.45 : 1.0);
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-sm"
                >
                  🛡️ PARADE SACRÉE !
                </button>
              </div>
            )}

            {activeMiniGame.kind === 'RHYTHM_HEAL' && (
              <div className="space-y-3">
                <p className="text-xs text-cyan-200">Validez la note étoilée dorée pour x1.45 Soin & Puissance !</p>
                <div className="relative w-full h-8 rounded-full bg-slate-900 border-2 border-white overflow-hidden">
                  <div className="absolute inset-y-0 left-[60%] w-[25%] bg-emerald-400/80" />
                  <div
                    className="absolute inset-y-0 w-2 bg-amber-300"
                    style={{ left: `${activeMiniGame.cursor}%` }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const ok = activeMiniGame.cursor >= 60 && activeMiniGame.cursor <= 85;
                    executeCardEffect(activeMiniGame.card, activeMiniGame.handIdx, ok ? 1.45 : 1.0);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black text-sm"
                >
                  🎵 JOUER LA NOTE !
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => executeCardEffect(activeMiniGame.card, activeMiniGame.handIdx, 1.0)}
              className="text-xs text-slate-300 underline"
            >
              ⚡ Lancer direct (x1.0)
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE BESTIAIRE (380 CRÉATURES & BOSS + PRIMES CONSOLES)            */}
      {/* ==================================================================== */}
      {showBestiaryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3">
          <div className="max-w-5xl w-full max-h-[90vh] rounded-2xl snes-window flex flex-col overflow-hidden">
            <div className="p-3 border-b border-indigo-400/50 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-black text-amber-300 text-sm sm:text-base">
                🐉 ENCYCLOPÉDIE DU BESTIAIRE ({Object.keys(bestiary).length} / 404 Créatures)
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const list = ALL_CREATURES_LIST.filter((cr) => !sprites[cr.id]).slice(0, 12);
                    list.forEach((cr) =>
                      requestSprite(
                        cr.id,
                        `16-bit SNES JRPG enemy monster sprite "${cr.name}" inspired by ${cr.game} (${cr.console}), crisp pixel art`,
                        { aspectRatio: '1:1' }
                      )
                    );
                    showToast(`🎨 Peinture IA lancée pour ${list.length} créatures !`);
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-700 text-white text-xs font-bold border border-cyan-300"
                >
                  🎨 Peindre 12 créatures (IA)
                </button>
                <button
                  type="button"
                  onClick={() => setShowBestiaryModal(false)}
                  className="px-3 py-1 rounded bg-rose-700 text-white text-xs font-black"
                >
                  Fermer ✕
                </button>
              </div>
            </div>

            {/* Filtres & Recherche Bestiaire */}
            <div className="p-3 border-b border-slate-800 flex flex-wrap gap-2">
              {['ALL', 'BOSS', 'DISCOVERED'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setBestiaryFilter(f)}
                  className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    bestiaryFilter === f ? 'bg-amber-400 text-slate-950 border-white' : 'bg-slate-900 border-slate-700'
                  }`}
                >
                  {f === 'ALL' ? 'Toutes (404)' : f === 'BOSS' ? '👑 Gardiens Boss (66)' : '✅ Découverts'}
                </button>
              ))}
              <input
                type="text"
                value={bestiarySearch}
                onChange={(e) => setBestiarySearch(e.target.value)}
                placeholder="🔍 Rechercher monstre, jeu ou console (SNES, MD, ARC...)"
                className="flex-1 min-w-[200px] px-3 py-1 rounded bg-slate-900 border border-slate-600 text-xs"
              />
            </div>

            <div className="p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {ALL_CREATURES_LIST.filter((cr) => {
                if (bestiaryFilter === 'BOSS' && !cr.isBoss) return false;
                if (bestiaryFilter === 'DISCOVERED' && !bestiary[cr.id]) return false;
                if (
                  bestiarySearch &&
                  !`${cr.name} ${cr.game} ${cr.console}`.toLowerCase().includes(bestiarySearch.toLowerCase())
                ) {
                  return false;
                }
                return true;
              })
                .slice(0, 80)
                .map((cr) => {
                  const kills = bestiary[cr.id] || 0;
                  return (
                    <div
                      key={cr.id}
                      className={`p-2.5 rounded-xl flex flex-col items-center text-center ${
                        cr.isBoss ? 'snes-boss-card' : 'bg-slate-900 border border-slate-700'
                      }`}
                    >
                      <div className="w-20 h-20 rounded-lg bg-slate-950 border border-white/15 overflow-hidden flex items-center justify-center mb-1.5">
                        {sprites[cr.id] ? (
                          <img
                            src={sprites[cr.id]}
                            alt={cr.name}
                            className="w-full h-full object-cover"
                            style={{ imageRendering: 'pixelated' }}
                          />
                        ) : (
                          <PixelSpriteSVG type={cr.spriteType} element={cr.isBoss ? 'FIRE' : 'PHYS'} className="w-14 h-14" />
                        )}
                      </div>
                      <div className="font-black text-xs text-white line-clamp-1">{cr.name}</div>
                      <div className="text-[10px] text-amber-300 font-mono">
                        [{cr.console}] • {cr.game}
                      </div>
                      <div className="text-[10px] text-slate-300 mt-0.5">
                        PV {cr.maxHp} • ATK {cr.atk} • Vaincus : {kills}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE RECRUTEMENT DES 30 HÉROS INVITÉS CLINS D'ŒIL                  */}
      {/* ==================================================================== */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3">
          <div className="max-w-4xl w-full max-h-[88vh] rounded-2xl snes-window flex flex-col overflow-hidden">
            <div className="p-3 border-b border-indigo-400/50 flex items-center justify-between">
              <h2 className="font-black text-amber-300 text-sm sm:text-base">
                🌟 RECRUTER UN HÉROS INVITÉ LÉGENDAIRE (32 INVITÉS & 64 SIGNATURES)
              </h2>
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                className="px-3 py-1 rounded bg-rose-700 text-white text-xs font-black"
              >
                Fermer ✕
              </button>
            </div>
            <div className="p-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {GUEST_HEROES.map((gh) => {
                const selected = gh.id === activeGuestId;
                return (
                  <button
                    key={gh.id}
                    type="button"
                    onClick={() => {
                      setActiveGuestId(gh.id);
                      unlockTrophy('tr10');
                      RETRO_AUDIO.sfx('heal');
                      showToast(`🌟 ${gh.name} rejoint votre escouade !`);
                      setShowGuestModal(false);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition ${
                      selected
                        ? 'bg-amber-950/60 border-amber-300'
                        : 'bg-slate-900 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-white">{gh.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 text-[10px] font-mono">
                        [{gh.console}]
                      </span>
                    </div>
                    <div className="text-[10px] text-cyan-200">{gh.title}</div>
                    <div className="text-[10px] text-emerald-300 font-bold mt-1">{gh.bonusDesc}</div>
                    <div className="text-[9px] text-slate-400 mt-1">
                      Signatures : {gh.sigCards.map((s) => s.name).join(' • ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE GALERIE D'ART IA PLEIN ÉCRAN (MUSÉE PIXEL ART 16-BITS)        */}
      {/* ==================================================================== */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col overflow-hidden">
          <div className="p-3 sm:p-4 border-b-2 border-indigo-400/60 bg-slate-900/95 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-black text-amber-300 text-sm sm:text-lg">
                🖼️ GALERIE D’ART IA — MUSÉE PIXEL ART 16-BITS ({Object.keys(sprites).length} œuvres générées)
              </h2>
              <p className="text-[11px] text-cyan-200">
                Cliquez sur une illustration pour l’admirer en plein écran ou peignez de nouvelles œuvres avec Gemini Flash
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const ungeneratedCards = ALL_CARDS_LIST.filter((c) => unlockedCards.has(c.id) && !sprites[c.id]).slice(0, 6);
                  const ungeneratedCreatures = ALL_CREATURES_LIST.filter((cr) => !sprites[cr.id]).slice(0, 6);
                  ungeneratedCards.forEach((c) =>
                    requestSprite(
                      c.id,
                      `16-bit Super Nintendo fantasy TCG card illustration for "${c.name}", ${c.desc}, vibrant SNES pixel art`,
                      { aspectRatio: '1:1' }
                    )
                  );
                  ungeneratedCreatures.forEach((cr) =>
                    requestSprite(
                      cr.id,
                      `16-bit SNES JRPG enemy monster sprite "${cr.name}" inspired by ${cr.game} (${cr.console}), crisp pixel art`,
                      { aspectRatio: '1:1' }
                    )
                  );
                  showToast(`🎨 Peinture IA lancée pour ${ungeneratedCards.length + ungeneratedCreatures.length} œuvres !`);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black border border-cyan-200"
              >
                🎨 Peindre 12 œuvres IA
              </button>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-black border border-rose-300"
              >
                Fermer ✕
              </button>
            </div>
          </div>

          {/* Filtres de la Galerie */}
          <div className="px-4 py-2.5 bg-slate-900/70 border-b border-slate-800 flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: '✨ Toutes les œuvres' },
              { id: 'CARDS', label: '🃏 Cartes TCG' },
              { id: 'CREATURES', label: '🐉 Monstres & Boss' },
              { id: 'HEROES_SCENES', label: '🛡️ Héros, Familiers & Décors' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGalleryFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${
                  galleryFilter === tab.id
                    ? 'bg-amber-400 text-slate-950 border-white'
                    : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-cyan-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grille des Œuvres Générées */}
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(() => {
              const items = [];
              if (galleryFilter === 'ALL' || galleryFilter === 'HEROES_SCENES') {
                if (sprites.main_banner) {
                  items.push({
                    id: 'main_banner',
                    title: 'Bannière Principale 16-Bits',
                    subtitle: 'Écran Titre SNES',
                    url: sprites.main_banner,
                    prompt: '16-bit Super Nintendo RPG title screen pixel art banner, heroic fantasy castle, glowing crystals, dragon silhouette, vibrant SNES palette, crisp pixel art',
                    aspect: '16:9'
                  });
                }
                DUNGEON_BIOMES.forEach((b) => {
                  const key = `biome_${b.id}`;
                  if (sprites[key]) {
                    items.push({
                      id: key,
                      title: b.name,
                      subtitle: 'Décor de Donjon & Arène',
                      url: sprites[key],
                      prompt: b.prompt,
                      aspect: '16:9'
                    });
                  }
                });
                squad.forEach((h) => {
                  const key = `hero_${h.id}_${h.cls}_${h.name}`;
                  if (sprites[key]) {
                    items.push({
                      id: key,
                      title: `${h.name} (Nv.${h.level})`,
                      subtitle: CLASSES[h.cls]?.name || h.cls,
                      url: sprites[key],
                      prompt: `16-bit Super Nintendo RPG hero character portrait "${h.name}", ${CLASSES[h.cls]?.name || h.cls}, expressive SNES pixel art portrait`,
                      aspect: '1:1'
                    });
                  }
                });
                MASCOTS.forEach((m) => {
                  const key = `mascot_${m.id}`;
                  if (sprites[key]) {
                    items.push({
                      id: key,
                      title: m.name,
                      subtitle: 'Familier Rétro Invocable',
                      url: sprites[key],
                      prompt: `16-bit SNES RPG cute companion mascot sprite "${m.name}", vibrant pixel art`,
                      aspect: '1:1'
                    });
                  }
                });
              }
              if (galleryFilter === 'ALL' || galleryFilter === 'CARDS') {
                ALL_CARDS_LIST.forEach((c) => {
                  if (sprites[c.id]) {
                    items.push({
                      id: c.id,
                      title: c.name,
                      subtitle: `${c.cameoConsole ? `[${c.cameoConsole}] ` : ''}${c.desc}`,
                      url: sprites[c.id],
                      prompt: `16-bit Super Nintendo fantasy TCG card illustration for "${c.name}", ${c.desc}, vibrant SNES pixel art`,
                      aspect: '1:1'
                    });
                  }
                });
              }
              if (galleryFilter === 'ALL' || galleryFilter === 'CREATURES') {
                ALL_CREATURES_LIST.forEach((cr) => {
                  if (sprites[cr.id]) {
                    items.push({
                      id: cr.id,
                      title: cr.name,
                      subtitle: `[${cr.console}] ${cr.game} • ${cr.isBoss ? 'Gardien Boss' : 'Monstre'}`,
                      url: sprites[cr.id],
                      prompt: `16-bit SNES JRPG enemy monster sprite "${cr.name}" inspired by ${cr.game} (${cr.console}), crisp pixel art`,
                      aspect: '1:1'
                    });
                  }
                });
              }

              if (items.length === 0) {
                return (
                  <div className="col-span-full py-16 text-center space-y-3">
                    <div className="text-5xl">🎨</div>
                    <div className="text-base font-black text-amber-300">
                      Aucune œuvre dans cette catégorie pour le moment
                    </div>
                    <p className="text-xs text-slate-300">
                      Cliquez sur « 🎨 Peindre 12 œuvres IA » ci-dessus pour remplir le musée !
                    </p>
                  </div>
                );
              }

              return items.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setGalleryZoomItem(art)}
                  className="group rounded-xl snes-window overflow-hidden cursor-pointer flex flex-col justify-between hover:border-amber-300 transition"
                >
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={art.url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/90 border border-amber-400/70 text-[10px] font-bold text-amber-200">
                      🔍 Plein Écran
                    </span>
                  </div>
                  <div className="p-2">
                    <div className="font-black text-xs text-white truncate">{art.title}</div>
                    <div className="text-[10px] text-cyan-200 truncate">{art.subtitle}</div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Lightbox Plein Écran d'une Œuvre de la Galerie */}
      {galleryZoomItem && (
        <div
          onClick={() => setGalleryZoomItem(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full p-4 rounded-2xl snes-window space-y-3 text-center"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-black text-base sm:text-lg text-amber-300">{galleryZoomItem.title}</h3>
                <p className="text-xs text-cyan-200">{galleryZoomItem.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setGalleryZoomItem(null)}
                className="px-3 py-1 rounded bg-rose-700 text-white text-xs font-black"
              >
                Fermer ✕
              </button>
            </div>
            <div className="w-full max-h-[65vh] rounded-xl bg-slate-950 border-2 border-amber-400/60 overflow-hidden flex items-center justify-center">
              <img
                src={sprites[galleryZoomItem.id] || galleryZoomItem.url}
                alt={galleryZoomItem.title}
                className="max-h-[65vh] w-auto object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  requestSprite(galleryZoomItem.id, galleryZoomItem.prompt, {
                    priority: true,
                    aspectRatio: galleryZoomItem.aspect || '1:1'
                  });
                  showToast('🔄 Régénération IA Flash en cours...');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs border border-cyan-200"
              >
                {generatingIds[galleryZoomItem.id] ? '🎨 Peinture IA...' : '🔄 Régénérer l’illustration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE APERÇU COLLECTION RAPIDE                                      */}
      {/* ==================================================================== */}
      {showDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3">
          <div className="max-w-4xl w-full max-h-[85vh] rounded-2xl snes-window flex flex-col overflow-hidden">
            <div className="p-3 border-b border-indigo-400/50 flex items-center justify-between">
              <h2 className="font-black text-amber-300 text-sm">
                🃏 POOL DE COMBAT ALÉATOIRE ({unlockedCards.size} cartes débloquées + 2 signatures Invité)
              </h2>
              <button
                type="button"
                onClick={() => setShowDeckModal(false)}
                className="px-3 py-1 rounded bg-rose-700 text-white text-xs font-black"
              >
                Fermer ✕
              </button>
            </div>
            <div className="p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Array.from(unlockedCards)
                .map((id) => ALL_CARDS_MAP[id])
                .filter(Boolean)
                .slice(0, 40)
                .map((c) => (
                  <div key={c.id}>{renderCardView(c, { compact: true })}</div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  return <RetroDungeonTCG />;
}

export default App;
