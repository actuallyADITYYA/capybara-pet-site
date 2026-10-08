// The invite page: https://capybarapet.app/f/?c=SX8ZC2 shows who invited you (their own capybara, drawn by the
// site's engine from the look their app shares) and opens capybara-pet://add/<code> in the app.
(function () {
  var RELAY = 'https://capybara-pet-relay.capybara-pet-relay.workers.dev';
  var raw = (new URLSearchParams(location.search).get('c') || '').toUpperCase().replace(/^CAPY-/, '');
  var ok = /^[2-9A-Z]{6}$/.test(raw);
  var code = 'CAPY-' + raw;
  var $ = function (id) { return document.getElementById(id); };
  function draw(look) {
    if (!window.Sprite) return;
    var c = $('capy'), off = document.createElement('canvas');
    off.width = off.height = Sprite.G;
    Sprite.renderFrame(c.getContext('2d'), off, 1, Object.assign(Sprite.defaultPose(), { eyeMode: 'happy', mouth: 'smile', blush: true }),
      { furColor: look.fur, blushColor: look.blush, pattern: look.pattern, accessory: look.acc || 'carrot' });
  }
  draw({ fur: '#a76c4c', blush: '#eca8a8', pattern: 'classic' });
  if (!ok) {
    $('title').textContent = 'This invite link looks broken';
    $('sub').textContent = 'Ask your friend to copy it again from their island.';
    $('code').style.display = 'none'; $('open').style.display = 'none';
    return;
  }
  $('code').textContent = code;
  $('open').href = 'capybara-pet://add/' + raw;
  fetch(RELAY + '/card/' + encodeURIComponent(code)).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j) return;
    $('title').textContent = j.name + "'s capybara wants to meet yours";
    document.title = j.name + ' invited you · Capybara Pet';
    if (j.look) draw(j.look);
  }).catch(function () { /* offline: the generic invite still works */ });
})();
