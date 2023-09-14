const VoiceResponse = require('twilio').twiml.VoiceResponse;

const names = {
  6586:	'Štěpánka',
  2664:	'Kuča',
  4614:	'Dero',
  2468:	'Aleš',
  9681:	'Kača',
  1315:	'Darwin',
  9994:	'Wal',
  2045:	'Radek Fiľakovský',
  7899:	'Markét',
  1545:	'Dark',
  4377:	'hlína',
  2495:	'Monika Spasovová',
  1804:	'okounátor',
  5011:	'Ondra Suchánek',
  7475:	'Eliška',
  2689:	'Hanka Svozilová',
  2294:	'Karel Martišek',
  1711:	'Maťa',
  4489:	'Karel Vácha',
  7086:	'Vašek Peca',
  7147:	'Petr Svoboda',
  3483:	'Tíman',
  8618:	'Tinka',
  8743:	'M',
  9372:	'Bebe',
  1982:	'Petr Zika',
  6486:	'Elif',
  2924:	'Kristýna Kozlíková',
  3605:	'dalimir',
  1417:	'Vašek Potoček',
  2402:	'Michaela Nováková',
  9250:	'Liliana Lamserová',
  2501:	'Láďa',
  5610:	'Tomáš Brokl',
  3169:	'Vendula Rosová',
  1869:	'Vojtěch Pivnička',
  3787:	'Ela',
  1048:	'Peťa S',
  8598:	'David S',
  5857:	'Petr Černocký',
  1546:	'Sváťa Fronk',
  8174:	'Martin Matulík',
  4542:	'Anetka',
  7992:	'Kormi',
  3356:	'Anet',
  3797:	'Míša',
  9461:	'Honza',
  1839:	'Lucka',
  5939:	'Marko',
  5721:	'Dan Janek',
  1569:	'Adamat',
  2699:	'JiříK',
  9429:	'Anonyme',
  4112:	'Petra Barančíková',
  1057:	'Petr Skála',
  5242:	'Vojtech Bardiovský',
  9337:	'Vlastimil',
  5448:	'Morče na útěku',
  6016:	'Single kapybara',
  7496:	'Kontrolované snižování indexu',
  8107:	'Mirek',
  2472:	'Míša Maršálková',
  8693:	'Palko',
  8859:	'Míla',
  6977:	'Testovací účet'
}

exports.welcome = function welcome() {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: '/ivr/menu',
    numDigits: '4',
    method: 'POST',
  });

  gather.say(
    'Vítejte v záchranném centru hry Monolog.' +
    'Zadejte svůj kód.',
    {loop: 1, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
  );

  return voiceResponse.toString();
};

exports.menu = function menu(code) {
  if (Object.keys(names).includes(code)) {
    return selectStage(code)
  } else {
    return redirectWelcome();
  }
};

function selectStage(code) {
  const voiceResponse = new VoiceResponse();

  const gather = voiceResponse.gather({
    action: `/ivr/giveHint?code=${code}`,
    numDigits: '1',
    method: 'POST',
  });

  gather.say(
    'Zvolte číslo stanoviště, na které chcete záchranu.' +
    'Pro zjištění, kde se nachází cíl, zvolte 0. ', 
    {loop: 1, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
  );

  return voiceResponse.toString();
}

exports.giveHint = function giveHint(stage, code) {
  const voiceResponse = new VoiceResponse();

  const name = names[code];

  const stages = {
    0: 'Cíl se nachází v Zahradní restauraci Klamovka.',
    1: 'Ohyb ulice Kunětická.',
    2: 'Muzeum Antonína Dvořáka.',
    3: 'Amfiteátr Albertov.',
    4: 'Podskalská Celnice.',
    5: 'Venkovní posilovna Hořejší nábřeží.',
    6: 'Evangelický kostel Jana Amose Komenského.',
    7: 'Lipová alej v ulici U Mrázovky.',
    8: 'Autobusová zastávka U Blaženky.',
    9: 'Casselův pomník.',
  }
  
  if (stage === '*') {
    voiceResponse.say(
      `Vaše jméno je ${name}.`,
      {loop: 1, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
    );

    voiceResponse.hangup();
    return voiceResponse.toString();
  }

  voiceResponse.say(
    `Záchrana pro šifru číslo ${stage}:     ${stages[stage]}`,
    {loop: 2, language: 'cs-CZ', voice: 'Google.cs-CZ-Standard-A'}
  );

  voiceResponse.hangup();

  console.info('DEAD', name, stage);

  return voiceResponse.toString();
};

/**
 * Returns an xml with the redirect
 * @return {String}
 */
function redirectWelcome() {
  const twiml = new VoiceResponse();

  twiml.say('Nesprávný kód hráče.', {
    voice: 'Google.cs-CZ-Standard-A',
    language: 'cs-CZ',
  });

  twiml.redirect('/ivr/welcome');

  return twiml.toString();
}
