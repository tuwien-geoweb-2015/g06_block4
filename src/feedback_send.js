var ol = require('openlayers');

module.exports = function(form, feature, url, config) {
  form.addEventListener('submit', function(evt) {
    evt.preventDefault();

    var name = form.name.value;
    var email = form.email.value;
    var message = form.message.value;

    var anrede = form.geschlecht.value || ' ';

    var teamflag;
    if (form.team.checked) {
      // Geoweb-Mitglied
      teamflag = 1;
    } else {
      // Geoweb-extern
      teamflag = 0;
    }

    feature.set('f_name', name);
    feature.set('f_mail', email);
    feature.set('f_anrede', anrede);
    feature.set('f_msg', message);
    feature.set('f_geoweb', teamflag);
    feature.set('f_datum', new Date().toISOString().substr(0, 10));

    var data = new ol.format.WFS().writeTransaction([feature], null, null, {
      featureType: config.featureType,
      featureNS: config.featureNS,
      featurePrefix: config.featurePrefix,
      gmlOptions: {srsName: config.srsName}
    });

    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function() {
      alert('Danke für das Feedback');
      window.location.reload();
    }
    xhr.send(new XMLSerializer().serializeToString(data));
  });
};
