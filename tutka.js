var read 			= require('node-readability');
var _ 				= require('underscore');
var mostUsedWords 	= require('./sanat').words;
var kunnat 			= require('./kunnat').kunnat;

var freqVector = function(word, letters) {
  var freq = _.groupBy(word.split(''), function(l) {return l;});
  return _.map(letters, function(l) {
    return freq[l] ? freq[l].length : 0;
  });
};

var dot = function(v1, v2) {
  return _.reduce(_.zip(v1, v2), function(acc, els) {
    return acc + els[0] * els[1];
  }, 0);
};

var mag = function(v) {
  return Math.sqrt(_.reduce(v, function(acc, el) {
    return acc + el * el;
  }, 0));
};

var compare = function(word1, word2) {
  var letters = _.union(word1.split(''), word2.split(''));
  var v1 = freqVector(word1, letters);
  var v2 = freqVector(word2, letters);
  return dot(v1, v2) / (mag(v1) * mag(v2));
};

var findLocation = function (word) {

	var locations = [],
		kunta, res;
	for(var i = 0; i < kunnat.features.length; i++) {
		kunta = kunnat.features[i].properties.Kunta;

		res = compare(word, kunta);
		res2 = compare(word.substr(0, parseInt(word.length / 2), 10), kunta.substr(0, parseInt(kunta.length / 2), 10));
		if (res > 0.85 && res2 > 0.85) {
			console.log(word, kunta, res, res2);
		}
	}
}

var splitArticleWords = function (text) {

	var capitalRegex = /^([A-Z][a-z]+)+$/;
	var words = text.split(" ");
	var capitalizedWords = [];

	for (var i in words) {
		var word = words[i];
		if(word.match(capitalRegex)){
			capitalizedWords.push(word);
		}
	}

	for (var i in capitalizedWords) {
		findLocation(capitalizedWords[i]);
	}
};

var getLocation = function(url) {
	read(url, function(err, article, meta) {
		splitArticleWords(article.content);
	});
};

var urls = [
"http://www.karjalainen.fi/uutiset/uutis-alueet/maakunta/item/49726-ammattikorkeakoulun-yt-neuvottelut-paattyivat-erimielisyytta-irtisanomisten-laillisuudesta",
"http://www.lappeenrannanuutiset.fi/artikkeli/219958-outotec-kaynnistaa-yt-neuvottelut-lomautuksista",
"http://yle.fi/uutiset/kouvolasta_vahennetaan_yhdeksan_itellan_kuljettajaa/7264767",
"http://www.pardia.fi/?x43=5171868",
"http://www.kouvolansanomat.fi/Online/2014/06/09/Sanoma+Lehtimedian+yt-neuvottelut+p%C3%A4%C3%A4ttyiv%C3%A4t/20142163/4",
"http://www.iltalehti.fi/talous/2014060918389698_ta.shtml",
"http://www.lahti.fi/www/bulletin.nsf/pfbd/486D72EF7EEE014BC2257CF200318A70",
"http://myjobcafe.net/2014/08/05/starkki-ja-puukeskus-aloittavat-yt-neuvottelut-vahennyksia-enintaan-100/",
"http://www.ilkka.fi/uutiset/maakunta/itella-aloittaa-yt-neuvottelut-tyomaara-seinajoella-vahenee-1.1659985",
"http://yle.fi/uutiset/putkivalmistaja_uponor_aikoo_irtisanoa_100_tyontekijaa/7391608?origin=rss",
"http://www.kauppalehti.fi/etusivu/uponor+voi+vahentaa+jopa+sata/201408692652?ext=rss",
"http://www.taloussanomat.fi/yritykset/2014/08/01/crocsit-eivat-myy-aloittaa-yt-neuvottelut-suomessa/201410714/12",
"http://www.mtv.fi/uutiset/talous/artikkeli/265-lahtee-lemminkaisella-tylyt-yt-neuvottelut/3431046",
"http://yle.fi/uutiset/tieto_aloittaa_uudet_yt-neuvottelut__vahentaa_suomesta_jopa_180_tyopaikkaa/7286199",
"http://www.tekniikkatalous.fi/rakennus/lemminkaisen+ytneuvottelut+paatokseen+265+tyovuotta+pois+toimipisteita+kiinni+kokkolassa+ja+kouvolassa/a992673"];


for(var i in urls) {
	var url = urls[i];
	getLocation(url);
}
