// load characters_data.js first

var allCases = {
  "10": [
    {
      "subject": "Needs rescue north of The Wall",
      "priority":"High",
      "date":"10/11/2017 9:17 AM"
    },
    {
      "subject": "Return Valyrian steel sword to Jorah Mormont?",
      "priority":"Low",
      "date":"10/11/2017 9:17 AM"
    }
  ]
};

var id2user = {};
var number2user = {};

for (var i=0;i<characters.length;i++) {
  var id = i+1;
  var char = characters[i];
  char.id = id;
  id2user[id] = char;
  var number = char.character.phoneNumbers[0].value;
  number2user[number] = char;
}

function number2id(number, number2user) {
  if (number in number2user) {
    return number2user[number].id;
  }
  return "";
}

function queryString(qs) {
  var t=this;
  t.queryString = qs;
  t.paramsMap = {};
  t.parse = function(queryString) {
    var paramsMap = {};
    var params=queryString.substring(1).split('&');
    for(var i=0; i<params.length; i++){
      var pair=params[i].split('=');
      var k = decodeURIComponent(pair[0]);
      var v = decodeURIComponent(pair[1]);
      paramsMap[k] = v;
    }
    t.paramsMap = paramsMap;
  }
  t.parse(qs);
}

var qs = new queryString(location.search);
