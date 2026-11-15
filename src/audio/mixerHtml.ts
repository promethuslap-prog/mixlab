import { ENGINE_JS } from '@/audio/engineSource';

export function mixerHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<style>
  html, body { margin: 0; height: 100%; background: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  #sheet { display: none; position: fixed; inset: 0; }
  #card { position: absolute; left: 16px; right: 16px; bottom: 28px; border-radius: 22px; padding: 22px 20px 18px; }
  h1 { margin: 0 0 8px; font-size: 22px; letter-spacing: -0.3px; }
  p { margin: 0 0 16px; font-size: 15px; line-height: 21px; }
  button { width: 100%; height: 52px; border: 0; border-radius: 14px; font-size: 16px; font-weight: 700; }
  #cancel { margin-top: 8px; height: 42px; background: transparent; font-weight: 600; }
</style>
</head>
<body>
<div id="sheet">
  <div id="card">
    <h1 id="title">One tap for sound</h1>
    <p id="body">Phones block audio until you tap. You only do this once each time you open Mix Lab.</p>
    <button id="go" type="button">Tap to start audio</button>
    <button id="cancel" type="button">Not now</button>
  </div>
</div>
<script>
${ENGINE_JS}
(function () {
  function post(obj) {
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(obj));
    }
  }
  var engine = MixLabEngine.create(post);
  function run(action) {
    if (!action) return;
    if (action.type === 'mixer') engine.startMixer(action.state);
    else if (action.type === 'mix') engine.setMix(action.state);
    else if (action.type === 'eq') engine.startEq(action.freq, action.mode, action.volume);
    else if (action.type === 'stop') engine.stop();
  }
  function showSheet(theme) {
    var sheet = document.getElementById('sheet');
    var card = document.getElementById('card');
    var title = document.getElementById('title');
    var body = document.getElementById('body');
    var go = document.getElementById('go');
    var cancel = document.getElementById('cancel');
    sheet.style.display = 'block';
    sheet.style.background = (theme && theme.overlay) || 'rgba(6,8,12,0.72)';
    card.style.background = (theme && theme.surface) || '#171B24';
    title.style.color = (theme && theme.text) || '#fff';
    body.style.color = (theme && theme.muted) || '#A3ADBE';
    go.style.background = (theme && theme.accent) || '#7C6CFF';
    go.style.color = (theme && theme.onAccent) || '#fff';
    cancel.style.color = (theme && theme.muted) || '#A3ADBE';
  }
  function hideSheet() {
    document.getElementById('sheet').style.display = 'none';
  }
  document.getElementById('go').addEventListener('click', function () {
    try { engine.unlock(); } catch (err) {}
    var pending = window.__pending;
    window.__pending = null;
    hideSheet();
    post({ type: 'unlocked' });
    run(pending);
  });
  document.getElementById('cancel').addEventListener('click', function () {
    window.__pending = null;
    hideSheet();
    post({ type: 'cancelled' });
  });
  window.__mixlabReceive = function (msg) {
    if (!msg) return;
    if (msg.cmd === 'stage') {
      window.__pending = msg.action;
      showSheet(msg.theme || {});
    } else if (msg.cmd === 'exec') {
      run(msg.action);
    }
  };
  setInterval(function () {
    try {
      var meter = engine.sampleMeter();
      if (!meter || meter.db <= -90) return;
      post({ type: 'meter', db: meter.db, peak: meter.peak, clipping: !!meter.clipping, state: meter.state });
    } catch (err) {}
  }, 80);
  post({ type: 'ready' });
})();
</script>
</body>
</html>`;
}
