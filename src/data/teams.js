// 2026 FIFA World Cup — real groups from the final draw, December 5 2025, Washington D.C.

export const GROUPS = {
  A: ['MEX', 'RSA', 'KOR', 'CZE'],
  B: ['CAN', 'SUI', 'QAT', 'BIH'],
  C: ['BRA', 'MAR', 'HAI', 'SCO'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'CUW', 'CIV', 'ECU'],
  F: ['NED', 'JPN', 'TUN', 'SWE'],
  G: ['BEL', 'EGY', 'IRN', 'NZL'],
  H: ['ESP', 'CPV', 'KSA', 'URU'],
  I: ['FRA', 'SEN', 'NOR', 'IRQ'],
  J: ['ARG', 'ALG', 'AUT', 'JOR'],
  K: ['POR', 'UZB', 'COL', 'COD'],
  L: ['ENG', 'CRO', 'GHA', 'PAN'],
}

export const VENUES = [
  'MetLife Stadium, New York/New Jersey',
  'SoFi Stadium, Los Angeles',
  'Estadio Azteca, Mexico City',
  'BMO Field, Toronto',
  'AT&T Stadium, Dallas',
  'Mercedes-Benz Stadium, Atlanta',
  'Estadio Akron, Guadalajara',
  'BC Place, Vancouver',
  'Hard Rock Stadium, Miami',
  'NRG Stadium, Houston',
  'Gillette Stadium, Boston',
  'Lincoln Financial Field, Philadelphia',
  'Lumen Field, Seattle',
  "Levi's Stadium, San Francisco Bay Area",
  'Arrowhead Stadium, Kansas City',
  'Estadio BBVA, Monterrey',
]

export const FINAL_VENUE = 'MetLife Stadium, New York/New Jersey'

export const TEAMS = {
  MEX: {
    id: 'MEX', name: 'Mexico', flag: 'mx', group: 'A', rank: 14, confed: 'CONCACAF', host: true,
    att: 78, mid: 80, def: 77,
    style: 'Patient possession with quick wide rotations. Loud home support in Azteca.',
    star: 'Santiago Giménez',
    players: [
      { n: 'Santiago Giménez', p: 'FW' }, { n: 'Raúl Jiménez', p: 'FW' },
      { n: 'Edson Álvarez', p: 'MF' }, { n: 'Luis Chávez', p: 'MF' }, { n: 'Johan Vásquez', p: 'DF' },
    ],
  },
  RSA: {
    id: 'RSA', name: 'South Africa', flag: 'za', group: 'A', rank: 61, confed: 'CAF',
    att: 71, mid: 73, def: 72,
    style: 'Compact block, brave short build-up through midfield triangles.',
    star: 'Lyle Foster',
    players: [
      { n: 'Lyle Foster', p: 'FW' }, { n: 'Percy Tau', p: 'FW' },
      { n: 'Teboho Mokoena', p: 'MF' }, { n: 'Themba Zwane', p: 'MF' }, { n: 'Aubrey Modiba', p: 'DF' },
    ],
  },
  KOR: {
    id: 'KOR', name: 'South Korea', flag: 'kr', group: 'A', rank: 22, confed: 'AFC',
    att: 79, mid: 78, def: 75,
    style: 'Relentless running, rapid transitions through the front line.',
    star: 'Son Heung-min',
    players: [
      { n: 'Son Heung-min', p: 'FW' }, { n: 'Hwang Hee-chan', p: 'FW' },
      { n: 'Lee Kang-in', p: 'MF' }, { n: 'Lee Jae-sung', p: 'MF' }, { n: 'Kim Min-jae', p: 'DF' },
    ],
  },
  CZE: {
    id: 'CZE', name: 'Czechia', flag: 'cz', group: 'A', rank: 44, confed: 'UEFA',
    att: 76, mid: 75, def: 74,
    style: 'Physical, direct, dangerous from set pieces and crosses.',
    star: 'Patrik Schick',
    players: [
      { n: 'Patrik Schick', p: 'FW' }, { n: 'Adam Hložek', p: 'FW' },
      { n: 'Tomáš Souček', p: 'MF' }, { n: 'Lukáš Provod', p: 'MF' }, { n: 'Vladimír Coufal', p: 'DF' },
    ],
  },
  CAN: {
    id: 'CAN', name: 'Canada', flag: 'ca', group: 'B', rank: 28, confed: 'CONCACAF', host: true,
    att: 78, mid: 76, def: 77,
    style: 'Athletic and vertical. Devastating pace on the left flank.',
    star: 'Alphonso Davies',
    players: [
      { n: 'Jonathan David', p: 'FW' }, { n: 'Tajon Buchanan', p: 'FW' },
      { n: 'Stephen Eustáquio', p: 'MF' }, { n: 'Ismaël Koné', p: 'MF' }, { n: 'Alphonso Davies', p: 'DF' },
    ],
  },
  SUI: {
    id: 'SUI', name: 'Switzerland', flag: 'ch', group: 'B', rank: 17, confed: 'UEFA',
    att: 77, mid: 80, def: 79,
    style: 'Structured, experienced, controls tempo through central midfield.',
    star: 'Granit Xhaka',
    players: [
      { n: 'Breel Embolo', p: 'FW' }, { n: 'Dan Ndoye', p: 'FW' },
      { n: 'Granit Xhaka', p: 'MF' }, { n: 'Remo Freuler', p: 'MF' }, { n: 'Manuel Akanji', p: 'DF' },
    ],
  },
  QAT: {
    id: 'QAT', name: 'Qatar', flag: 'qa', group: 'B', rank: 51, confed: 'AFC',
    att: 72, mid: 70, def: 68,
    style: 'Fluid front pairing, vulnerable when pressed high.',
    star: 'Akram Afif',
    players: [
      { n: 'Akram Afif', p: 'FW' }, { n: 'Almoez Ali', p: 'FW' },
      { n: 'Mostafa Meshaal', p: 'MF' }, { n: 'Jassem Gaber', p: 'MF' }, { n: 'Bassam Al-Rawi', p: 'DF' },
    ],
  },
  BIH: {
    id: 'BIH', name: 'Bosnia & Herzegovina', flag: 'ba', group: 'B', rank: 68, confed: 'UEFA',
    att: 73, mid: 72, def: 72,
    style: 'Deep block built around a towering target man.',
    star: 'Edin Džeko',
    players: [
      { n: 'Edin Džeko', p: 'FW' }, { n: 'Ermedin Demirović', p: 'FW' },
      { n: 'Benjamin Tahirović', p: 'MF' }, { n: 'Anel Ahmedhodžić', p: 'DF' }, { n: 'Amar Dedić', p: 'DF' },
    ],
  },
  BRA: {
    id: 'BRA', name: 'Brazil', flag: 'br', group: 'C', rank: 5, confed: 'CONMEBOL',
    att: 92, mid: 87, def: 86,
    style: 'Explosive wide forwards, individual brilliance in the final third.',
    star: 'Vinícius Júnior',
    players: [
      { n: 'Vinícius Júnior', p: 'FW' }, { n: 'Rodrygo', p: 'FW' },
      { n: 'Raphinha', p: 'FW' }, { n: 'Bruno Guimarães', p: 'MF' }, { n: 'Marquinhos', p: 'DF' },
    ],
  },
  MAR: {
    id: 'MAR', name: 'Morocco', flag: 'ma', group: 'C', rank: 12, confed: 'CAF',
    att: 83, mid: 84, def: 86,
    style: 'Elite defensive organisation, lightning counters through the full-backs.',
    star: 'Achraf Hakimi',
    players: [
      { n: 'Youssef En-Nesyri', p: 'FW' }, { n: 'Eliesse Ben Seghir', p: 'FW' },
      { n: 'Brahim Díaz', p: 'MF' }, { n: 'Azzedine Ounahi', p: 'MF' }, { n: 'Achraf Hakimi', p: 'DF' },
    ],
  },
  HAI: {
    id: 'HAI', name: 'Haiti', flag: 'ht', group: 'C', rank: 84, confed: 'CONCACAF',
    att: 68, mid: 66, def: 65,
    style: 'Fearless underdogs. Direct running and raw pace up top.',
    star: 'Duckens Nazon',
    players: [
      { n: 'Duckens Nazon', p: 'FW' }, { n: 'Frantzdy Pierrot', p: 'FW' },
      { n: 'Danley Jean Jacques', p: 'MF' }, { n: 'Leverton Pierre', p: 'MF' }, { n: 'Ricardo Adé', p: 'DF' },
    ],
  },
  SCO: {
    id: 'SCO', name: 'Scotland', flag: 'gb-sct', group: 'C', rank: 38, confed: 'UEFA',
    att: 73, mid: 77, def: 75,
    style: 'High-energy midfield runners arriving late in the box.',
    star: 'Scott McTominay',
    players: [
      { n: 'Ché Adams', p: 'FW' }, { n: 'Lyndon Dykes', p: 'FW' },
      { n: 'Scott McTominay', p: 'MF' }, { n: 'John McGinn', p: 'MF' }, { n: 'Andy Robertson', p: 'DF' },
    ],
  },
  USA: {
    id: 'USA', name: 'United States', flag: 'us', group: 'D', rank: 15, confed: 'CONCACAF', host: true,
    att: 80, mid: 79, def: 78,
    style: 'Aggressive pressing, quick vertical play into the channels.',
    star: 'Christian Pulisic',
    players: [
      { n: 'Christian Pulisic', p: 'FW' }, { n: 'Folarin Balogun', p: 'FW' },
      { n: 'Weston McKennie', p: 'MF' }, { n: 'Tyler Adams', p: 'MF' }, { n: 'Antonee Robinson', p: 'DF' },
    ],
  },
  PAR: {
    id: 'PAR', name: 'Paraguay', flag: 'py', group: 'D', rank: 39, confed: 'CONMEBOL',
    att: 74, mid: 75, def: 78,
    style: 'Streetwise, physical, ferocious in duels and dead-ball situations.',
    star: 'Julio Enciso',
    players: [
      { n: 'Julio Enciso', p: 'FW' }, { n: 'Antonio Sanabria', p: 'FW' },
      { n: 'Miguel Almirón', p: 'MF' }, { n: 'Andrés Cubas', p: 'MF' }, { n: 'Gustavo Gómez', p: 'DF' },
    ],
  },
  AUS: {
    id: 'AUS', name: 'Australia', flag: 'au', group: 'D', rank: 26, confed: 'AFC',
    att: 72, mid: 73, def: 74,
    style: 'Organised, hard-running, strong in the air at both ends.',
    star: 'Jackson Irvine',
    players: [
      { n: 'Mitchell Duke', p: 'FW' }, { n: 'Kusini Yengi', p: 'FW' },
      { n: 'Jackson Irvine', p: 'MF' }, { n: 'Riley McGree', p: 'MF' }, { n: 'Harry Souttar', p: 'DF' },
    ],
  },
  TUR: {
    id: 'TUR', name: 'Türkiye', flag: 'tr', group: 'D', rank: 25, confed: 'UEFA',
    att: 82, mid: 83, def: 77,
    style: 'A golden generation of playmakers. Creative, streaky, dangerous.',
    star: 'Arda Güler',
    players: [
      { n: 'Kenan Yıldız', p: 'FW' }, { n: 'Barış Alper Yılmaz', p: 'FW' },
      { n: 'Arda Güler', p: 'MF' }, { n: 'Hakan Çalhanoğlu', p: 'MF' }, { n: 'Merih Demiral', p: 'DF' },
    ],
  },
  GER: {
    id: 'GER', name: 'Germany', flag: 'de', group: 'E', rank: 9, confed: 'UEFA',
    att: 88, mid: 89, def: 84,
    style: 'Positional play with two elite creators between the lines.',
    star: 'Florian Wirtz',
    players: [
      { n: 'Kai Havertz', p: 'FW' }, { n: 'Niclas Füllkrug', p: 'FW' },
      { n: 'Florian Wirtz', p: 'MF' }, { n: 'Jamal Musiala', p: 'MF' }, { n: 'Antonio Rüdiger', p: 'DF' },
    ],
  },
  CUW: {
    id: 'CUW', name: 'Curaçao', flag: 'cw', group: 'E', rank: 82, confed: 'CONCACAF',
    att: 67, mid: 66, def: 64,
    style: 'Smallest nation ever at a World Cup. Technical, nothing to lose.',
    star: 'Juninho Bacuna',
    players: [
      { n: 'Rangelo Janga', p: 'FW' }, { n: 'Gervane Kastaneer', p: 'FW' },
      { n: 'Juninho Bacuna', p: 'MF' }, { n: 'Leandro Bacuna', p: 'MF' }, { n: 'Cuco Martina', p: 'DF' },
    ],
  },
  CIV: {
    id: 'CIV', name: "Côte d'Ivoire", flag: 'ci', group: 'E', rank: 42, confed: 'CAF',
    att: 79, mid: 78, def: 76,
    style: 'African champions pedigree. Power and pace in every line.',
    star: 'Simon Adingra',
    players: [
      { n: 'Sébastien Haller', p: 'FW' }, { n: 'Simon Adingra', p: 'FW' },
      { n: 'Franck Kessié', p: 'MF' }, { n: 'Ibrahim Sangaré', p: 'MF' }, { n: 'Odilon Kossounou', p: 'DF' },
    ],
  },
  ECU: {
    id: 'ECU', name: 'Ecuador', flag: 'ec', group: 'E', rank: 23, confed: 'CONMEBOL',
    att: 78, mid: 79, def: 81,
    style: 'Young, athletic spine anchored by a world-class holding midfielder.',
    star: 'Moisés Caicedo',
    players: [
      { n: 'Enner Valencia', p: 'FW' }, { n: 'Gonzalo Plata', p: 'FW' },
      { n: 'Moisés Caicedo', p: 'MF' }, { n: 'Kendry Páez', p: 'MF' }, { n: 'Piero Hincapié', p: 'DF' },
    ],
  },
  NED: {
    id: 'NED', name: 'Netherlands', flag: 'nl', group: 'F', rank: 7, confed: 'UEFA',
    att: 86, mid: 87, def: 88,
    style: 'Total control from the back, overloads through inverted full-backs.',
    star: 'Virgil van Dijk',
    players: [
      { n: 'Cody Gakpo', p: 'FW' }, { n: 'Memphis Depay', p: 'FW' },
      { n: 'Xavi Simons', p: 'MF' }, { n: 'Frenkie de Jong', p: 'MF' }, { n: 'Virgil van Dijk', p: 'DF' },
    ],
  },
  JPN: {
    id: 'JPN', name: 'Japan', flag: 'jp', group: 'F', rank: 19, confed: 'AFC',
    att: 82, mid: 84, def: 80,
    style: 'Europe-hardened squad. Precise pressing triggers and wing overloads.',
    star: 'Takefusa Kubo',
    players: [
      { n: 'Kaoru Mitoma', p: 'FW' }, { n: 'Ayase Ueda', p: 'FW' },
      { n: 'Takefusa Kubo', p: 'MF' }, { n: 'Wataru Endo', p: 'MF' }, { n: 'Ko Itakura', p: 'DF' },
    ],
  },
  TUN: {
    id: 'TUN', name: 'Tunisia', flag: 'tn', group: 'F', rank: 41, confed: 'CAF',
    att: 71, mid: 73, def: 74,
    style: 'Disciplined low block, spiky in midfield, hard to break down.',
    star: 'Hannibal Mejbri',
    players: [
      { n: 'Seifeddine Jaziri', p: 'FW' }, { n: 'Elias Achouri', p: 'FW' },
      { n: 'Hannibal Mejbri', p: 'MF' }, { n: 'Aïssa Laïdouni', p: 'MF' }, { n: 'Montassar Talbi', p: 'DF' },
    ],
  },
  SWE: {
    id: 'SWE', name: 'Sweden', flag: 'se', group: 'F', rank: 37, confed: 'UEFA',
    att: 84, mid: 76, def: 75,
    style: 'A frightening strike pair carried them through the playoffs.',
    star: 'Alexander Isak',
    players: [
      { n: 'Alexander Isak', p: 'FW' }, { n: 'Viktor Gyökeres', p: 'FW' },
      { n: 'Dejan Kulusevski', p: 'MF' }, { n: 'Lucas Bergvall', p: 'MF' }, { n: 'Victor Lindelöf', p: 'DF' },
    ],
  },
  BEL: {
    id: 'BEL', name: 'Belgium', flag: 'be', group: 'G', rank: 8, confed: 'UEFA',
    att: 85, mid: 86, def: 81,
    style: 'New generation around an ageing conductor. Slick in transition.',
    star: 'Kevin De Bruyne',
    players: [
      { n: 'Romelu Lukaku', p: 'FW' }, { n: 'Jérémy Doku', p: 'FW' },
      { n: 'Kevin De Bruyne', p: 'MF' }, { n: 'Amadou Onana', p: 'MF' }, { n: 'Arthur Theate', p: 'DF' },
    ],
  },
  EGY: {
    id: 'EGY', name: 'Egypt', flag: 'eg', group: 'G', rank: 34, confed: 'CAF',
    att: 80, mid: 75, def: 74,
    style: 'Everything flows through the right side and their talisman.',
    star: 'Mohamed Salah',
    players: [
      { n: 'Mohamed Salah', p: 'FW' }, { n: 'Omar Marmoush', p: 'FW' },
      { n: 'Emam Ashour', p: 'MF' }, { n: 'Marwan Attia', p: 'MF' }, { n: 'Mohamed Abdelmonem', p: 'DF' },
    ],
  },
  IRN: {
    id: 'IRN', name: 'Iran', flag: 'ir', group: 'G', rank: 20, confed: 'AFC',
    att: 77, mid: 74, def: 74,
    style: 'Deep-lying resilience with two proven poachers up front.',
    star: 'Mehdi Taremi',
    players: [
      { n: 'Mehdi Taremi', p: 'FW' }, { n: 'Sardar Azmoun', p: 'FW' },
      { n: 'Alireza Jahanbakhsh', p: 'MF' }, { n: 'Saeid Ezatolahi', p: 'MF' }, { n: 'Majid Hosseini', p: 'DF' },
    ],
  },
  NZL: {
    id: 'NZL', name: 'New Zealand', flag: 'nz', group: 'G', rank: 86, confed: 'OFC',
    att: 70, mid: 66, def: 68,
    style: 'Long balls to a Premier League target man. Simple, honest, awkward.',
    star: 'Chris Wood',
    players: [
      { n: 'Chris Wood', p: 'FW' }, { n: 'Ben Waine', p: 'FW' },
      { n: 'Joe Bell', p: 'MF' }, { n: 'Sarpreet Singh', p: 'MF' }, { n: 'Michael Boxall', p: 'DF' },
    ],
  },
  ESP: {
    id: 'ESP', name: 'Spain', flag: 'es', group: 'H', rank: 1, confed: 'UEFA',
    att: 94, mid: 95, def: 89,
    style: 'European champions. Suffocating possession and the best winger alive.',
    star: 'Lamine Yamal',
    players: [
      { n: 'Lamine Yamal', p: 'FW' }, { n: 'Nico Williams', p: 'FW' },
      { n: 'Pedri', p: 'MF' }, { n: 'Rodri', p: 'MF' }, { n: 'Marc Cucurella', p: 'DF' },
    ],
  },
  CPV: {
    id: 'CPV', name: 'Cabo Verde', flag: 'cv', group: 'H', rank: 70, confed: 'CAF',
    att: 69, mid: 68, def: 67,
    style: 'Historic first qualification. Compact and spirited.',
    star: 'Ryan Mendes',
    players: [
      { n: 'Ryan Mendes', p: 'FW' }, { n: 'Willy Semedo', p: 'FW' },
      { n: 'Jamiro Monteiro', p: 'MF' }, { n: 'Kenny Rocha', p: 'MF' }, { n: 'Roberto Lopes', p: 'DF' },
    ],
  },
  KSA: {
    id: 'KSA', name: 'Saudi Arabia', flag: 'sa', group: 'H', rank: 59, confed: 'AFC',
    att: 73, mid: 72, def: 71,
    style: 'Brave high line and quick combination play. Giant-killers on their day.',
    star: 'Salem Al-Dawsari',
    players: [
      { n: 'Salem Al-Dawsari', p: 'FW' }, { n: 'Firas Al-Buraikan', p: 'FW' },
      { n: 'Mohamed Kanno', p: 'MF' }, { n: 'Musab Al-Juwayr', p: 'MF' }, { n: 'Hassan Tambakti', p: 'DF' },
    ],
  },
  URU: {
    id: 'URU', name: 'Uruguay', flag: 'uy', group: 'H', rank: 16, confed: 'CONMEBOL',
    att: 82, mid: 84, def: 85,
    style: 'Intense man-to-man pressing all over the pitch. Never stops fighting.',
    star: 'Federico Valverde',
    players: [
      { n: 'Darwin Núñez', p: 'FW' }, { n: 'Facundo Pellistri', p: 'FW' },
      { n: 'Federico Valverde', p: 'MF' }, { n: 'Manuel Ugarte', p: 'MF' }, { n: 'Ronald Araújo', p: 'DF' },
    ],
  },
  FRA: {
    id: 'FRA', name: 'France', flag: 'fr', group: 'I', rank: 3, confed: 'UEFA',
    att: 94, mid: 90, def: 91,
    style: 'Frightening depth. Can win ugly or blow you away in ten minutes.',
    star: 'Kylian Mbappé',
    players: [
      { n: 'Kylian Mbappé', p: 'FW' }, { n: 'Ousmane Dembélé', p: 'FW' },
      { n: 'Aurélien Tchouaméni', p: 'MF' }, { n: 'Eduardo Camavinga', p: 'MF' }, { n: 'William Saliba', p: 'DF' },
    ],
  },
  SEN: {
    id: 'SEN', name: 'Senegal', flag: 'sn', group: 'I', rank: 18, confed: 'CAF',
    att: 82, mid: 79, def: 81,
    style: 'Physically dominant with genuine quality in every line.',
    star: 'Sadio Mané',
    players: [
      { n: 'Sadio Mané', p: 'FW' }, { n: 'Nicolas Jackson', p: 'FW' },
      { n: 'Pape Matar Sarr', p: 'MF' }, { n: 'Lamine Camara', p: 'MF' }, { n: 'Kalidou Koulibaly', p: 'DF' },
    ],
  },
  NOR: {
    id: 'NOR', name: 'Norway', flag: 'no', group: 'I', rank: 29, confed: 'UEFA',
    att: 88, mid: 82, def: 76,
    style: 'First World Cup since 1998. The most feared striker on earth.',
    star: 'Erling Haaland',
    players: [
      { n: 'Erling Haaland', p: 'FW' }, { n: 'Alexander Sørloth', p: 'FW' },
      { n: 'Martin Ødegaard', p: 'MF' }, { n: 'Sander Berge', p: 'MF' }, { n: 'Kristoffer Ajer', p: 'DF' },
    ],
  },
  IRQ: {
    id: 'IRQ', name: 'Iraq', flag: 'iq', group: 'I', rank: 58, confed: 'AFC',
    att: 70, mid: 69, def: 70,
    style: 'Survived the intercontinental playoff. Committed and combative.',
    star: 'Aymen Hussein',
    players: [
      { n: 'Aymen Hussein', p: 'FW' }, { n: 'Ali Al-Hamadi', p: 'FW' },
      { n: 'Ibrahim Bayesh', p: 'MF' }, { n: 'Amir Al-Ammari', p: 'MF' }, { n: 'Zaid Tahseen', p: 'DF' },
    ],
  },
  ARG: {
    id: 'ARG', name: 'Argentina', flag: 'ar', group: 'J', rank: 2, confed: 'CONMEBOL',
    att: 92, mid: 91, def: 89,
    style: 'Defending champions. Ruthless, streetwise, and still led by the greatest.',
    star: 'Lionel Messi',
    players: [
      { n: 'Lionel Messi', p: 'FW' }, { n: 'Julián Álvarez', p: 'FW' },
      { n: 'Enzo Fernández', p: 'MF' }, { n: 'Alexis Mac Allister', p: 'MF' }, { n: 'Cristian Romero', p: 'DF' },
    ],
  },
  ALG: {
    id: 'ALG', name: 'Algeria', flag: 'dz', group: 'J', rank: 35, confed: 'CAF',
    att: 80, mid: 78, def: 75,
    style: 'Technically gifted front line, capable of beating anyone in Africa.',
    star: 'Riyad Mahrez',
    players: [
      { n: 'Riyad Mahrez', p: 'FW' }, { n: 'Amine Gouiri', p: 'FW' },
      { n: 'Houssem Aouar', p: 'MF' }, { n: 'Ismaël Bennacer', p: 'MF' }, { n: 'Rayan Aït-Nouri', p: 'DF' },
    ],
  },
  AUT: {
    id: 'AUT', name: 'Austria', flag: 'at', group: 'J', rank: 24, confed: 'UEFA',
    att: 78, mid: 81, def: 79,
    style: 'Rangnick-drilled pressing machine. Suffocates deep build-up.',
    star: 'David Alaba',
    players: [
      { n: 'Marko Arnautović', p: 'FW' }, { n: 'Michael Gregoritsch', p: 'FW' },
      { n: 'Christoph Baumgartner', p: 'MF' }, { n: 'Marcel Sabitzer', p: 'MF' }, { n: 'David Alaba', p: 'DF' },
    ],
  },
  JOR: {
    id: 'JOR', name: 'Jordan', flag: 'jo', group: 'J', rank: 64, confed: 'AFC',
    att: 71, mid: 69, def: 68,
    style: 'First-ever World Cup. Compact 5-4-1 and rapid counters.',
    star: 'Musa Al-Taamari',
    players: [
      { n: 'Musa Al-Taamari', p: 'FW' }, { n: 'Yazan Al-Naimat', p: 'FW' },
      { n: 'Nizar Al-Rashdan', p: 'MF' }, { n: 'Mahmoud Al-Mardi', p: 'MF' }, { n: 'Abdallah Nasib', p: 'DF' },
    ],
  },
  POR: {
    id: 'POR', name: 'Portugal', flag: 'pt', group: 'K', rank: 6, confed: 'UEFA',
    att: 91, mid: 90, def: 86,
    style: 'Overflowing with talent. One last dance for the captain.',
    star: 'Cristiano Ronaldo',
    players: [
      { n: 'Cristiano Ronaldo', p: 'FW' }, { n: 'Rafael Leão', p: 'FW' },
      { n: 'Bruno Fernandes', p: 'MF' }, { n: 'Vitinha', p: 'MF' }, { n: 'Rúben Dias', p: 'DF' },
    ],
  },
  UZB: {
    id: 'UZB', name: 'Uzbekistan', flag: 'uz', group: 'K', rank: 55, confed: 'AFC',
    att: 72, mid: 73, def: 74,
    style: 'Debutants with a Premier League centre-back and no fear.',
    star: 'Abdukodir Khusanov',
    players: [
      { n: 'Eldor Shomurodov', p: 'FW' }, { n: 'Igor Sergeev', p: 'FW' },
      { n: 'Abbosbek Fayzullaev', p: 'MF' }, { n: 'Otabek Shukurov', p: 'MF' }, { n: 'Abdukodir Khusanov', p: 'DF' },
    ],
  },
  COL: {
    id: 'COL', name: 'Colombia', flag: 'co', group: 'K', rank: 13, confed: 'CONMEBOL',
    att: 83, mid: 82, def: 80,
    style: 'Rhythm and flair, devastating down the left wing.',
    star: 'Luis Díaz',
    players: [
      { n: 'Luis Díaz', p: 'FW' }, { n: 'Jhon Durán', p: 'FW' },
      { n: 'James Rodríguez', p: 'MF' }, { n: 'Richard Ríos', p: 'MF' }, { n: 'Davinson Sánchez', p: 'DF' },
    ],
  },
  COD: {
    id: 'COD', name: 'DR Congo', flag: 'cd', group: 'K', rank: 60, confed: 'CAF',
    att: 74, mid: 72, def: 73,
    style: 'Won the playoff route the hard way. Powerful and streetwise.',
    star: 'Yoane Wissa',
    players: [
      { n: 'Yoane Wissa', p: 'FW' }, { n: 'Cédric Bakambu', p: 'FW' },
      { n: 'Théo Bongonda', p: 'MF' }, { n: 'Charles Pickel', p: 'MF' }, { n: 'Chancel Mbemba', p: 'DF' },
    ],
  },
  ENG: {
    id: 'ENG', name: 'England', flag: 'gb-eng', group: 'L', rank: 4, confed: 'UEFA',
    att: 91, mid: 90, def: 87,
    style: 'A ruthless No. 9 and the deepest attacking midfield pool in Europe.',
    star: 'Jude Bellingham',
    players: [
      { n: 'Harry Kane', p: 'FW' }, { n: 'Bukayo Saka', p: 'FW' },
      { n: 'Jude Bellingham', p: 'MF' }, { n: 'Declan Rice', p: 'MF' }, { n: 'John Stones', p: 'DF' },
    ],
  },
  CRO: {
    id: 'CRO', name: 'Croatia', flag: 'hr', group: 'L', rank: 10, confed: 'UEFA',
    att: 79, mid: 86, def: 81,
    style: 'Tournament royalty. The midfield never gives the ball away.',
    star: 'Luka Modrić',
    players: [
      { n: 'Andrej Kramarić', p: 'FW' }, { n: 'Ante Budimir', p: 'FW' },
      { n: 'Luka Modrić', p: 'MF' }, { n: 'Mateo Kovačić', p: 'MF' }, { n: 'Joško Gvardiol', p: 'DF' },
    ],
  },
  GHA: {
    id: 'GHA', name: 'Ghana', flag: 'gh', group: 'L', rank: 66, confed: 'CAF',
    att: 78, mid: 77, def: 74,
    style: 'Explosive between the boxes with two elite Premier League forwards.',
    star: 'Mohammed Kudus',
    players: [
      { n: 'Antoine Semenyo', p: 'FW' }, { n: 'Iñaki Williams', p: 'FW' },
      { n: 'Mohammed Kudus', p: 'MF' }, { n: 'Thomas Partey', p: 'MF' }, { n: 'Alexander Djiku', p: 'DF' },
    ],
  },
  PAN: {
    id: 'PAN', name: 'Panama', flag: 'pa', group: 'L', rank: 31, confed: 'CONCACAF',
    att: 70, mid: 71, def: 70,
    style: 'Battle-tested in CONCACAF wars. Compact and niggly.',
    star: 'Adalberto Carrasquilla',
    players: [
      { n: 'Ismael Díaz', p: 'FW' }, { n: 'José Fajardo', p: 'FW' },
      { n: 'Adalberto Carrasquilla', p: 'MF' }, { n: 'Aníbal Godoy', p: 'MF' }, { n: 'Fidel Escobar', p: 'DF' },
    ],
  },
}

export const overall = (t) => Math.round(t.att * 0.38 + t.mid * 0.34 + t.def * 0.28)

export const flagUrl = (t, w = 80) => `https://flagcdn.com/w${w}/${t.flag}.png`
