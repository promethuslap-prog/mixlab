/* Mix Lab audio engine.
   Plain JavaScript on purpose: it runs inside a WebView (iOS/Android Expo Go)
   and is eval'd by the stem check. Keep this file free of template-literal syntax.
   Stems are synthesized here. Nothing is sampled from a recording. */
(function (root) {
  'use strict';

  var BPM = 96;
  var BEAT = 60 / BPM;
  var BARS = 4;
  var LOOP = BARS * 4 * BEAT;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function dbToGain(db) {
    if (db <= -60) return 0;
    return Math.pow(10, db / 20);
  }

  function hashNoise(i) {
    var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  }

  function loudness(buf, rmsTarget, peakCeiling) {
    var sum = 0;
    var peak = 0;
    var i;
    for (i = 0; i < buf.length; i++) {
      var a = Math.abs(buf[i]);
      if (a > peak) peak = a;
      sum += buf[i] * buf[i];
    }
    var rms = Math.sqrt(sum / Math.max(1, buf.length));
    if (rms < 1e-8 || peak < 1e-8) return;
    var g = rmsTarget / rms;
    if (peak * g > peakCeiling) g = peakCeiling / peak;
    for (i = 0; i < buf.length; i++) buf[i] *= g;
  }

  function fadeEdges(buf, sr) {
    var n = Math.max(1, Math.floor(sr * 0.003));
    var i;
    for (i = 0; i < n; i++) {
      var g = i / n;
      buf[i] *= g;
      buf[buf.length - 1 - i] *= g;
    }
  }

  function dcBlock(buf) {
    var r = 0.995;
    var prevX = 0;
    var prevY = 0;
    var i;
    for (i = 0; i < buf.length; i++) {
      var x = buf[i];
      var y = x - prevX + r * prevY;
      prevX = x;
      prevY = y;
      buf[i] = y;
    }
  }

  function addKick(buf, sr, start, velocity) {
    var vel = velocity == null ? 1 : velocity;
    var dur = 0.48;
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var phase = 0;
    var i;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var t = i / sr;
      var f = 46 + 150 * Math.exp(-t * 24);
      phase += (2 * Math.PI * f) / sr;
      var body = Math.sin(phase);
      var click = hashNoise(i0 + i) * Math.exp(-t * 220);
      var amp = Math.exp(-t * 6.2) * vel;
      var x = body * 1.05 + click * 0.42;
      buf[i0 + i] += Math.tanh(x * 1.35) * amp;
    }
  }

  function addSnare(buf, sr, start, velocity) {
    var dur = 0.32;
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var phase = 0;
    var hp = 0;
    var prev = 0;
    var i;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var t = i / sr;
      phase += (2 * Math.PI * 186) / sr;
      var tone = Math.sin(phase) * Math.exp(-t * 26);
      var white = hashNoise(i0 + i + 17);
      hp = white - prev + hp * 0.58;
      prev = white;
      var noise = hp * Math.exp(-t * 12);
      var x = (tone * 0.55 + noise * 0.85) * velocity;
      buf[i0 + i] += Math.tanh(x * 1.6);
    }
  }

  function addHat(buf, sr, start, open, velocity) {
    var dur = open ? 0.18 : 0.05;
    var decay = open ? 16 : 48;
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var hp = 0;
    var prev = 0;
    var i;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var t = i / sr;
      var white = hashNoise(i0 + i + 91);
      hp = white - prev + hp * 0.72;
      prev = white;
      var amp = Math.exp(-t * decay) * velocity;
      buf[i0 + i] += Math.tanh(hp * 2.2) * amp;
    }
  }

  function addBassNote(buf, sr, startBeat, durBeats, freq) {
    var start = startBeat * BEAT;
    var dur = Math.max(0.05, durBeats * BEAT);
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var phaseSub = 0;
    var phase = 0;
    var lp = 0;
    var i;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var t = i / sr;
      phaseSub += (2 * Math.PI * (freq * 0.5)) / sr;
      phase += (2 * Math.PI * freq) / sr;
      if (phase > Math.PI * 200) {
        phase -= Math.PI * 200;
        phaseSub -= Math.PI * 100;
      }
      var saw = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
      lp += (saw - lp) * 0.16;
      var envA = t < 0.008 ? t / 0.008 : 1;
      var rel = dur - t;
      var envR = rel < 0.045 ? Math.max(0, rel / 0.045) : 1;
      var sub = Math.sin(phaseSub);
      var x = sub * 0.72 + lp * 0.38;
      buf[i0 + i] += Math.tanh(x * 1.25) * envA * envR;
    }
  }

  function addEpNote(buf, sr, startBeat, freq, amp) {
    var start = startBeat * BEAT;
    var dur = 1.2;
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var p1 = 0;
    var p2 = 0;
    var p3 = 0;
    var det = freq * 1.004;
    var i;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var t = i / sr;
      p1 += (2 * Math.PI * freq) / sr;
      p2 += (2 * Math.PI * det) / sr;
      p3 += (2 * Math.PI * freq * 2.01) / sr;
      var envA = t < 0.006 ? t / 0.006 : 1;
      var env = Math.exp(-t * 2.15) * envA;
      var x = Math.sin(p1) * 0.62 + Math.sin(p2) * 0.28 + Math.sin(p3) * 0.16 * Math.exp(-t * 5);
      buf[i0 + i] += x * env * amp;
    }
  }

  function addPluck(buf, sr, start, freq, dur, decay, velocity) {
    var N = Math.max(8, Math.round(sr / freq));
    var line = new Float32Array(N);
    var seed = Math.floor(freq * 13 + start * sr);
    var i;
    for (i = 0; i < N; i++) line[i] = hashNoise(seed + i) * 0.9;
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var idx = 0;
    var prev = 0;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var a = line[idx];
      var next = ((a + prev) * 0.5) * decay;
      line[idx] = next;
      prev = a;
      idx += 1;
      if (idx >= N) idx = 0;
      var pick = i < sr * 0.008 ? hashNoise(seed + i * 3) * (1 - i / (sr * 0.008)) * 0.35 : 0;
      buf[i0 + i] += (next + pick) * velocity;
    }
  }

  function makeBandpass(freq, Q, sr) {
    var w0 = (2 * Math.PI * freq) / sr;
    var cos = Math.cos(w0);
    var sin = Math.sin(w0);
    var alpha = sin / (2 * Q);
    var a0 = 1 + alpha;
    return {
      b0: alpha / a0,
      b1: 0,
      b2: -alpha / a0,
      a1: (-2 * cos) / a0,
      a2: (1 - alpha) / a0,
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
    };
  }

  function stepBiquad(f, x) {
    var y = f.b0 * x + f.b1 * f.x1 + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2;
    if (y > 2) y = 2;
    if (y < -2) y = -2;
    f.x2 = f.x1;
    f.x1 = x;
    f.y2 = f.y1;
    f.y1 = y;
    return y;
  }

  function vowelFilters(name, sr) {
    if (name === 'oh') return [makeBandpass(520, 4.2, sr), makeBandpass(980, 4.4, sr)];
    if (name === 'ee') return [makeBandpass(340, 4.6, sr), makeBandpass(2300, 5.2, sr)];
    return [makeBandpass(780, 4.2, sr), makeBandpass(1250, 4.6, sr)];
  }

  function addVocalNote(buf, sr, startBeat, durBeats, freq, vowel) {
    var start = startBeat * BEAT;
    var dur = Math.max(0.08, durBeats * BEAT);
    var n = Math.floor(dur * sr);
    var i0 = Math.floor(start * sr);
    var filters = vowelFilters(vowel, sr);
    var phase = 0;
    var vib = 0;
    var lp = 0;
    var i;
    for (i = 0; i < n && i0 + i < buf.length; i++) {
      var t = i / sr;
      vib += (2 * Math.PI * 5.1) / sr;
      var f = freq * (1 + 0.006 * Math.sin(vib));
      phase += (2 * Math.PI * f) / sr;
      if (phase > Math.PI * 2) phase -= Math.PI * 2;
      var saw = 2 * (phase / (2 * Math.PI)) - 1;
      lp += (saw - lp) * 0.2;
      var burst = t < 0.012 ? hashNoise(i0 + i) * (1 - t / 0.012) * 0.25 : 0;
      var exc = lp + burst;
      var y = stepBiquad(filters[0], exc) * 0.85 + stepBiquad(filters[1], exc) * 0.65;
      var envA = t < 0.02 ? t / 0.02 : 1;
      var rel = dur - t;
      var envR = rel < 0.05 ? Math.max(0, rel / 0.05) : 1;
      buf[i0 + i] += y * envA * envR * 0.85;
    }
  }

  function renderDrums(kick, snare, sr) {
    var bar;
    for (bar = 0; bar < 4; bar++) {
      var base = bar * 4;
      addKick(kick, sr, base * BEAT, 1);
      addKick(kick, sr, (base + 2) * BEAT, 0.96);
      if (bar === 1 || bar === 3) addKick(kick, sr, (base + 2.5) * BEAT, 0.72);
      addSnare(snare, sr, (base + 1) * BEAT, 1);
      addSnare(snare, sr, (base + 3) * BEAT, 0.96);
      var e;
      for (e = 0; e < 8; e++) {
        var beat = base + e * 0.5;
        var open = e === 7;
        var accent = e % 2 === 0 ? 0.26 : 0.15;
        addHat(snare, sr, beat * BEAT, open, open ? 0.2 : accent);
      }
    }
  }

  function renderBass(buf, sr) {
    var notes = [
      [0, 1.35, 110],
      [1.5, 0.4, 110],
      [2, 1.35, 130.81],
      [3.5, 0.4, 98],
      [4, 1.35, 87.31],
      [5.5, 0.4, 87.31],
      [6, 1.35, 130.81],
      [7.5, 0.4, 98],
      [8, 1.35, 130.81],
      [9.5, 0.4, 130.81],
      [10, 1.35, 164.81],
      [11.5, 0.4, 146.83],
      [12, 1.35, 98],
      [13.5, 0.4, 98],
      [14, 0.85, 123.47],
      [15, 0.8, 110],
    ];
    var i;
    for (i = 0; i < notes.length; i++) {
      addBassNote(buf, sr, notes[i][0], notes[i][1], notes[i][2]);
    }
  }

  function renderKeys(buf, sr) {
    var chords = [
      [0, [220, 261.63, 329.63]],
      [2.5, [220, 261.63, 329.63]],
      [4, [174.61, 220, 261.63]],
      [6.5, [174.61, 220, 261.63]],
      [8, [130.81, 164.81, 196, 261.63]],
      [10.5, [130.81, 164.81, 196, 261.63]],
      [12, [196, 246.94, 293.66]],
      [14.5, [196, 246.94, 293.66]],
    ];
    var i;
    var n;
    for (i = 0; i < chords.length; i++) {
      var notes = chords[i][1];
      var amp = 0.72 / Math.sqrt(notes.length);
      for (n = 0; n < notes.length; n++) addEpNote(buf, sr, chords[i][0], notes[n], amp);
    }
  }

  function renderGuitar(buf, sr) {
    var roots = [220, 174.61, 261.63, 196];
    var fifths = [329.63, 261.63, 392, 293.66];
    var octs = [440, 349.23, 523.25, 392];
    var bar;
    var e;
    for (bar = 0; bar < 4; bar++) {
      for (e = 0; e < 8; e++) {
        var beat = bar * 4 + e * 0.5;
        var down = e % 2 === 0;
        var vel = down ? 0.85 : 0.5;
        var decay = down ? 0.9 : 0.84;
        var start = beat * BEAT;
        addPluck(buf, sr, start, roots[bar], 0.22, decay, vel);
        addPluck(buf, sr, start, fifths[bar], 0.2, decay, vel * 0.75);
        addPluck(buf, sr, start, octs[bar], 0.16, decay * 0.98, vel * 0.45);
      }
    }
  }

  function renderVocal(buf, sr) {
    var notes = [
      [0, 0.85, 329.63, 'ah'],
      [1, 0.85, 392, 'oh'],
      [2, 1.3, 440, 'ah'],
      [3.5, 0.4, 392, 'ee'],
      [4, 0.85, 440, 'ah'],
      [5, 0.85, 523.25, 'ee'],
      [6, 0.85, 440, 'oh'],
      [7, 0.85, 392, 'ah'],
      [8, 0.42, 392, 'ah'],
      [8.5, 0.42, 440, 'ee'],
      [9, 1.7, 329.63, 'oh'],
      [11, 0.85, 293.66, 'ah'],
      [12, 0.85, 329.63, 'ah'],
      [13, 0.85, 293.66, 'oh'],
      [14, 0.85, 392, 'ee'],
      [15, 0.75, 329.63, 'ah'],
    ];
    var i;
    for (i = 0; i < notes.length; i++) {
      addVocalNote(buf, sr, notes[i][0], notes[i][1], notes[i][2], notes[i][3]);
    }
  }

  function renderStems(sampleRate) {
    var sr = sampleRate || 44100;
    var n = Math.floor(LOOP * sr);
    var vocal = new Float32Array(n);
    var guitar = new Float32Array(n);
    var keys = new Float32Array(n);
    var kick = new Float32Array(n);
    var snare = new Float32Array(n);
    var bass = new Float32Array(n);
    renderDrums(kick, snare, sr);
    renderBass(bass, sr);
    renderKeys(keys, sr);
    renderGuitar(guitar, sr);
    renderVocal(vocal, sr);
    dcBlock(vocal);
    dcBlock(guitar);
    dcBlock(bass);
    dcBlock(keys);
    loudness(vocal, 0.09, 0.7);
    loudness(guitar, 0.055, 0.72);
    loudness(keys, 0.05, 0.66);
    loudness(kick, 0.075, 0.78);
    loudness(snare, 0.05, 0.68);
    loudness(bass, 0.07, 0.66);
    fadeEdges(vocal, sr);
    fadeEdges(guitar, sr);
    fadeEdges(keys, sr);
    fadeEdges(kick, sr);
    fadeEdges(snare, sr);
    fadeEdges(bass, sr);
    return {
      vocal: vocal,
      guitar: guitar,
      keys: keys,
      kick: kick,
      snare: snare,
      bass: bass,
      sampleRate: sr,
      loopSeconds: LOOP,
    };
  }

  var stemCache = null;

  function getStems(sr) {
    if (stemCache && stemCache.sampleRate === sr) return stemCache;
    stemCache = renderStems(sr);
    return stemCache;
  }

  function makeShaper(ctx) {
    var curve = new Float32Array(1025);
    var i;
    for (i = 0; i < 1025; i++) {
      var x = i / 512 - 1;
      curve[i] = Math.tanh(x * 1.15);
    }
    var ws = ctx.createWaveShaper();
    ws.curve = curve;
    ws.oversample = '2x';
    return ws;
  }

  function makePanner(ctx) {
    if (ctx.createStereoPanner) {
      var node = ctx.createStereoPanner();
      return {
        node: node,
        set: function (value, time) {
          node.pan.setTargetAtTime(clamp(value, -1, 1), time, 0.02);
        },
      };
    }
    var p = ctx.createPanner();
    p.panningModel = 'equalpower';
    return {
      node: p,
      set: function (value, time) {
        if (p.positionX) p.positionX.setTargetAtTime(clamp(value, -1, 1), time, 0.02);
      },
    };
  }

  function loudnessGain(freq, volume) {
    var x = Math.log(freq / 3200) / Math.LN10;
    var sensitive = Math.exp(-x * x * 1.6);
    var db = -11 * sensitive;
    if (freq > 9000) db -= (freq - 9000) / 2500;
    if (freq < 100) db += 3;
    return Math.pow(10, db / 20) * 0.2 * clamp(volume, 0, 1);
  }

  function create(postMessage) {
    var ctx = null;
    var keepAlive = null;
    var graph = null;
    var mode = 'idle';
    var playing = false;
    var building = false;
    var pendingMix = null;
    var clipUntil = 0;
    var meterBuf = null;
    var byteBuf = null;
    var eqFreq = 1000;
    var eqMode = 'noise';
    var eqVolume = 0.75;

    function post(obj) {
      if (postMessage) {
        try {
          postMessage(obj);
        } catch (err) {}
      }
    }

    function ac() {
      if (!ctx) {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) throw new Error('This browser has no Web Audio API.');
        ctx = new AC();
      }
      return ctx;
    }

    function unlock() {
      var c = ac();
      if (!keepAlive) {
        keepAlive = c.createOscillator();
        var silent = c.createGain();
        silent.gain.value = 0;
        keepAlive.connect(silent);
        silent.connect(c.destination);
        try {
          keepAlive.start();
        } catch (err) {}
      }
      var resumed = c.resume();
      if (resumed && resumed.catch) resumed.catch(function () {});
      return c;
    }

    function destroy() {
      if (!graph) {
        mode = 'idle';
        playing = false;
        return;
      }
      var ids = graph.channels ? Object.keys(graph.channels) : [];
      var i;
      for (i = 0; i < ids.length; i++) {
        try {
          graph.channels[ids[i]].source.stop();
        } catch (err) {}
      }
      if (graph.eq) {
        try {
          graph.eq.noise.stop();
        } catch (err2) {}
        try {
          graph.eq.osc.stop();
        } catch (err3) {}
      }
      try {
        if (graph.master) graph.master.disconnect();
      } catch (err4) {}
      try {
        if (graph.out) graph.out.disconnect();
      } catch (err5) {}
      graph = null;
      mode = 'idle';
      playing = false;
    }

    function applyMix(state) {
      if (!graph || !ctx || mode !== 'mixer' || !state) return;
      var now = ctx.currentTime;
      graph.master.gain.setTargetAtTime(dbToGain(state.masterDb), now, 0.03);
      var ids = ['vocal', 'guitar', 'keys', 'kick', 'snare', 'bass'];
      var anySolo = false;
      var i;
      for (i = 0; i < ids.length; i++) {
        if (state.channels[ids[i]] && state.channels[ids[i]].solo) anySolo = true;
      }
      for (i = 0; i < ids.length; i++) {
        var id = ids[i];
        var s = state.channels[id];
        var node = graph.channels[id];
        if (!s || !node) continue;
        var audible = !s.mute && (!anySolo || s.solo);
        var g = audible ? dbToGain(s.gainDb) : 0;
        node.gain.gain.setTargetAtTime(g, now, 0.02);
        node.panner.set(s.pan || 0, now);
        node.low.gain.setTargetAtTime(clamp(s.low || 0, -12, 12), now, 0.025);
        node.mid.gain.setTargetAtTime(clamp(s.mid || 0, -12, 12), now, 0.025);
        node.high.gain.setTargetAtTime(clamp(s.high || 0, -12, 12), now, 0.025);
      }
    }

    function buildMixer(state) {
      destroy();
      var c = ac();
      var stems = getStems(c.sampleRate);
      var master = c.createGain();
      var analyser = c.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.45;
      var safety = c.createGain();
      safety.gain.value = 0.5;
      var shaper = makeShaper(c);
      master.connect(analyser);
      analyser.connect(safety);
      safety.connect(shaper);
      shaper.connect(c.destination);

      var channels = {};
      var ids = ['vocal', 'guitar', 'keys', 'kick', 'snare', 'bass'];
      var i;
      for (i = 0; i < ids.length; i++) {
        var id = ids[i];
        var source = c.createBufferSource();
        var buffer = c.createBuffer(1, stems[id].length, c.sampleRate);
        buffer.getChannelData(0).set(stems[id]);
        source.buffer = buffer;
        source.loop = true;
        var low = c.createBiquadFilter();
        low.type = 'lowshelf';
        low.frequency.value = 120;
        var mid = c.createBiquadFilter();
        mid.type = 'peaking';
        mid.frequency.value = 1000;
        mid.Q.value = 0.85;
        var high = c.createBiquadFilter();
        high.type = 'highshelf';
        high.frequency.value = 8000;
        var panner = makePanner(c);
        var gain = c.createGain();
        source.connect(low);
        low.connect(mid);
        mid.connect(high);
        high.connect(panner.node);
        panner.node.connect(gain);
        gain.connect(master);
        channels[id] = { source: source, low: low, mid: mid, high: high, panner: panner, gain: gain };
      }
      graph = { master: master, analyser: analyser, channels: channels, out: null, eq: null };
      mode = 'mixer';
      playing = true;
      applyMix(state);
      var t = c.currentTime + 0.06;
      for (i = 0; i < ids.length; i++) channels[ids[i]].source.start(t);
    }

    function updateEq(freq, modeName, volume) {
      if (!graph || !graph.eq || !ctx) return;
      var now = ctx.currentTime;
      var f = clamp(freq, 20, 20000);
      eqFreq = f;
      eqMode = modeName;
      eqVolume = volume;
      graph.eq.bp.frequency.setTargetAtTime(f, now, 0.015);
      graph.eq.osc.frequency.setTargetAtTime(f, now, 0.015);
      var loud = loudnessGain(f, volume);
      var toneOn = modeName === 'tone';
      graph.eq.toneGain.gain.setTargetAtTime(toneOn ? loud : 0, now, 0.02);
      graph.eq.noiseGain.gain.setTargetAtTime(toneOn ? 0 : loud, now, 0.02);
    }

    function buildEq(freq, modeName, volume) {
      destroy();
      var c = ac();
      var noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate * 2), c.sampleRate);
      var data = noiseBuf.getChannelData(0);
      var prev = 0;
      var i;
      for (i = 0; i < data.length; i++) {
        var white = Math.random() * 2 - 1;
        prev = prev * 0.97 + white * 0.03;
        data[i] = white * 0.55 + prev * 8;
      }
      var peak = 0;
      for (i = 0; i < data.length; i++) peak = Math.max(peak, Math.abs(data[i]));
      if (peak > 0) {
        for (i = 0; i < data.length; i++) data[i] = (data[i] / peak) * 0.9;
      }
      var noise = c.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      var osc = c.createOscillator();
      osc.type = 'sine';
      var bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 2.4;
      var toneGain = c.createGain();
      var noiseGain = c.createGain();
      var out = c.createGain();
      out.gain.value = 1;
      var analyser = c.createAnalyser();
      analyser.fftSize = 1024;
      noise.connect(bp);
      bp.connect(noiseGain);
      noiseGain.connect(out);
      osc.connect(toneGain);
      toneGain.connect(out);
      out.connect(analyser);
      analyser.connect(c.destination);
      graph = {
        master: out,
        analyser: analyser,
        channels: null,
        out: out,
        eq: { noise: noise, osc: osc, bp: bp, toneGain: toneGain, noiseGain: noiseGain },
      };
      mode = 'eq';
      playing = true;
      updateEq(freq, modeName, volume);
      noise.start();
      osc.start();
    }

    function sampleMeter() {
      var silent = { db: -96, peak: 0, clipping: false, rms: 0, state: ctx ? ctx.state : 'none' };
      if (!graph || !graph.analyser || !playing || !ctx) return silent;
      var analyser = graph.analyser;
      var size = analyser.fftSize;
      if (!meterBuf || meterBuf.length !== size) meterBuf = new Float32Array(size);
      var i;
      if (analyser.getFloatTimeDomainData) {
        analyser.getFloatTimeDomainData(meterBuf);
      } else {
        if (!byteBuf || byteBuf.length !== size) byteBuf = new Uint8Array(size);
        analyser.getByteTimeDomainData(byteBuf);
        for (i = 0; i < size; i++) meterBuf[i] = (byteBuf[i] - 128) / 128;
      }
      var peak = 0;
      var sum = 0;
      for (i = 0; i < size; i++) {
        var a = Math.abs(meterBuf[i]);
        if (a > peak) peak = a;
        sum += meterBuf[i] * meterBuf[i];
      }
      var db = 20 * Math.log(peak + 1e-8) / Math.LN10;
      var now = ctx.currentTime;
      if (peak > 0.98) clipUntil = now + 1.5;
      return {
        db: db,
        peak: peak,
        clipping: now < clipUntil,
        rms: Math.sqrt(sum / size),
        state: ctx.state,
      };
    }

    function startMixer(state) {
      pendingMix = state;
      if (mode === 'mixer' && graph && !building) {
        applyMix(state);
        playing = true;
        post({ type: 'status', busy: false, playing: true, mode: 'mixer' });
        return;
      }
      if (building) return;
      building = true;
      post({ type: 'status', busy: true, playing: false, mode: 'mixer' });
      setTimeout(function () {
        try {
          unlock();
          buildMixer(pendingMix);
          post({ type: 'status', busy: false, playing: true, mode: 'mixer' });
        } catch (err) {
          building = false;
          post({ type: 'error', message: String((err && err.message) || err) });
          return;
        }
        building = false;
      }, 20);
    }

    function startEq(freq, modeName, volume) {
      eqFreq = freq;
      eqMode = modeName || 'noise';
      eqVolume = volume == null ? 0.75 : volume;
      if (mode === 'eq' && graph && graph.eq && !building) {
        updateEq(eqFreq, eqMode, eqVolume);
        playing = true;
        post({ type: 'status', busy: false, playing: true, mode: 'eq' });
        return;
      }
      if (building) return;
      building = true;
      post({ type: 'status', busy: true, playing: false, mode: 'eq' });
      setTimeout(function () {
        try {
          unlock();
          buildEq(eqFreq, eqMode, eqVolume);
          post({ type: 'status', busy: false, playing: true, mode: 'eq' });
        } catch (err) {
          building = false;
          post({ type: 'error', message: String((err && err.message) || err) });
          return;
        }
        building = false;
      }, 20);
    }

    function stop() {
      pendingMix = null;
      destroy();
      clipUntil = 0;
      post({ type: 'status', busy: false, playing: false, mode: 'idle' });
    }

    return {
      unlock: unlock,
      startMixer: startMixer,
      setMix: function (state) {
        pendingMix = state;
        applyMix(state);
      },
      startEq: startEq,
      stop: stop,
      sampleMeter: sampleMeter,
    };
  }

  root.MixLabEngine = {
    renderStems: renderStems,
    create: create,
    BPM: BPM,
    LOOP: LOOP,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
