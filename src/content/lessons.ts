import type { Track } from '@/content/types';

export const tracks: Track[] = [
  {
    id: 'basics',
    title: 'Basics',
    eyebrow: 'Start here',
    summary: 'Follow a signal from the mic to the master, and learn the words on the console.',
    color: '#7C6CFF',
    lessons: [
      {
        id: 'signal-flow',
        title: 'Signal flow',
        minutes: 4,
        summary: 'Every mix, live or in a studio, is the same path. Learn it once and troubleshooting gets easier.',
        signal: ['Mic', 'Preamp / gain', 'EQ', 'Dynamics', 'Fader', 'Bus', 'Master'],
        steps: [
          {
            title: 'The mic makes a tiny voltage',
            body: 'A microphone turns sound in the air into a small electrical signal. That signal is too quiet for a speaker, and it is easy to bury in hiss if you turn it up in the wrong place.',
          },
          {
            title: 'Gain comes before the fader',
            body: 'The preamp and its gain knob raise the mic to a healthy level. The fader comes later. The fader decides how loud that channel is in the mix. They are not the same knob.',
          },
          {
            title: 'Then tone, then dynamics, then level',
            body: 'EQ changes the balance of low, mid, and high. Dynamics, usually a compressor or a gate, controls how much the level jumps around. After that, the fader sets the channel in the mix.',
          },
          {
            title: 'Buses collect channels. The master is the exit.',
            body: 'A bus sums a group, like all the drums, so you can turn them up together. The master is the last stop before the speakers, the recorder, or the file. If the master clips, the whole mix clips.',
          },
        ],
        tip: 'When something sounds wrong, walk the path from the source forward. The problem is usually earlier than the knob you want to grab.',
      },
      {
        id: 'gain-staging',
        title: 'Gain staging and headroom',
        minutes: 4,
        summary: 'Set a clean level at every stage so the mix has room before it distorts.',
        steps: [
          {
            title: 'Headroom is the space before clipping',
            body: 'Clipping is the ceiling. In a digital mixer or a DAW, that ceiling is 0 dBFS. Headroom is how much room you still have under it. If the loudest peak is at -10 dBFS, you have 10 dB of headroom.',
          },
          {
            title: 'Turn the gain up at the source, then mix with faders',
            body: 'Have the musician play or sing at their real volume, including the loudest part. Raise the preamp until the peaks are healthy and the clip light stays off. Leave the fader near unity while you do this. Unity means the fader is neither adding nor cutting level.',
          },
          {
            title: 'Too quiet is a problem too',
            body: 'If the gain is tiny and you make it up later with a fader or a plugin, you also turn up hiss. You want the signal clearly above the noise without slamming the top.',
          },
          {
            title: 'Leave room on the master',
            body: 'Channels add together. Six healthy channels can clip the master even when no single channel is clipping. Pull the master down, or trim the channels, until the master meter has space. For a mix you will master later, peaks around -6 dBFS is a common target.',
          },
        ],
        tip: 'Do not mix by cranking the preamp. Set the gain once, during the loud part, then ride the fader.',
      },
      {
        id: 'decibels',
        title: 'Decibels and meters',
        minutes: 4,
        summary: 'dB is a ratio, not a unit of "amount of sound." Meters show different things on purpose.',
        steps: [
          {
            title: 'Decibels are logarithmic',
            body: 'A decibel compares two levels. +6 dB is about twice the amplitude (the voltage, or the speaker excursion). It is not twice as loud. Loudness to your ears needs closer to +10 dB before it feels like double.',
          },
          {
            title: 'dBFS means full scale',
            body: 'On a digital meter, 0 dBFS is the maximum. You cannot go past it without clipping. Numbers are negative because they are under that ceiling: -12 dBFS is 12 dB below clipping. Analog consoles use other references, like dBu, where 0 is not the ceiling.',
          },
          {
            title: 'Peak meters and average meters answer different questions',
            body: 'A peak meter shows the highest instant, which tells you if you are about to clip. A VU or RMS meter shows an average, closer to how loud it feels. LUFS is the loudness measurement streaming services use.',
          },
          {
            title: 'Yellow is not automatically bad',
            body: 'A meter in the yellow can be fine. Red that stays on, or a peak that hits 0 dBFS, is the problem. Use the meter to stay safe, and use your ears for balance.',
          },
        ],
        tip: 'If two mixes only sound different because one is louder, turn them to the same level before you decide which balance is better.',
      },
      {
        id: 'eq-ranges',
        title: 'EQ and frequency ranges',
        minutes: 5,
        summary: 'EQ is a volume knob for a range of pitches. Knowing the ranges is most of the skill.',
        steps: [
          {
            title: 'Low, low-mid, mid, high-mid, air',
            body: 'Sub and bass, about 20–120 Hz, are weight. 120–250 Hz is warmth. 250–500 Hz is where mixes get muddy or boxy. 500 Hz–2 kHz is body and honk. 2–6 kHz is presence and edge. Above that is clarity, brightness, and air.',
          },
          {
            title: 'Cut before you boost',
            body: 'If the vocal is hard to hear, the guitar may be too loud in the same range. A small cut on the guitar often sounds cleaner than a big boost on the vocal. Boosting everything just makes a louder, harsher mix.',
          },
          {
            title: 'High-pass what does not need lows',
            body: 'A high-pass filter, also called a low cut, removes rumble. Vocals, guitars, and most mics that are not kick or bass can take one around 80–100 Hz. That leaves the low end for the instruments that actually play there.',
          },
          {
            title: 'Q is the width',
            body: 'A high Q is a narrow cut, good for one ringing note. A low Q is a wide, gentle shape, good for tone. If a cut sounds like you punched a hole in the instrument, the Q is too narrow or the cut is too deep.',
          },
        ],
        tip: 'The EQ explorer in this app plays the band you are pointing at. Sweep it until you can name "mud" and "presence" by ear.',
        links: [{ label: 'Open the EQ explorer', href: '/eq' }],
      },
      {
        id: 'compression',
        title: 'Compression',
        minutes: 5,
        summary: 'A compressor turns the loud parts down so the level stays more even. Five controls do almost all of it.',
        steps: [
          {
            title: 'Threshold is where it starts',
            body: 'Nothing happens until the signal crosses the threshold. A lower threshold means more of the performance gets compressed. If you want only the shouts squeezed, keep the threshold higher.',
          },
          {
            title: 'Ratio is how hard it clamps',
            body: '4:1 means that once you are over the threshold, 4 dB of input becomes about 1 dB of output. 2:1 is gentle. 4:1 is obvious. 10:1 and higher is limiting: a ceiling more than a squeeze.',
          },
          {
            title: 'Attack and release are timing',
            body: 'Attack is how fast the compressor grabs after the signal crosses the threshold. A slower attack lets the snap of a snare through, then turns the rest down. Release is how fast it lets go. Too fast can pump. Too slow stays squashed.',
          },
          {
            title: 'Makeup gain puts the level back',
            body: 'Compression lowers the peaks, so the track sounds quieter. Makeup gain brings the average back up. If you compare compressor on and off without matching loudness, the louder one always seems better. That is not a fair test.',
          },
        ],
        tip: 'Starting points, not rules: vocals often like 2:1 to 4:1, a medium attack, and only a few dB of gain reduction. If you can obviously hear it working, you may have too much.',
      },
      {
        id: 'panning',
        title: 'Panning',
        minutes: 3,
        summary: 'Pan is left, center, and right. It is how a mix gets a picture instead of a pile.',
        steps: [
          {
            title: 'Keep the core in the center',
            body: 'Kick, snare, bass, and lead vocal usually stay near the center. They are the song. If they are hard left, anyone standing on the right side of the room, or listening on one speaker, loses them.',
          },
          {
            title: 'Spread the rest',
            body: 'Guitars, keyboards, backing vocals, and percussion can move left and right. A common start is one guitar left and keys right, not both on the same side. That is balance, not decoration.',
          },
          {
            title: 'Check the mix in mono',
            body: 'Mono is one speaker. Some clubs, phones, and PA hangs sum left and right. If a part disappears in mono, it was relying on extreme pan or on two mics that are cancelling. Pan law also means the center can get a few dB quieter or louder depending on the console. Trust your ears at the same loudness.',
          },
        ],
        tip: 'Pan is not a fix for two instruments that fight. If they occupy the same frequencies, EQ or arrangement still has to help. Pan just separates them in space.',
      },
      {
        id: 'space-and-time',
        title: 'Reverb and delay',
        minutes: 4,
        summary: 'Reverb is a room. Delay is a repeat. Both are usually sent from the channel, not printed on top of everything.',
        delayCalculator: true,
        steps: [
          {
            title: 'Reverb is many reflections',
            body: 'A short room puts a singer on a stage. A long hall puts them in a church. Pre-delay is a small gap before the reverb starts, which keeps the dry vocal up front. Too much reverb pushes a vocal backward even if the fader is up.',
          },
          {
            title: 'Delay is distinct echoes',
            body: 'A quarter-note delay lands on the beat. An eighth note is twice as fast. The formula is simple: quarter-note delay in milliseconds = 60,000 ÷ BPM. At 120 BPM that is 500 ms. A dotted eighth is three quarters of that quarter-note time.',
          },
          {
            title: 'Use sends, and high-pass the return',
            body: 'An aux send copies the channel to a reverb or delay. Post-fader is normal for effects, so the effect follows the fader. High-pass the return, often somewhere above 100–200 Hz, so the low end stays with the dry bass and kick instead of turning into a cloud.',
          },
        ],
        tip: 'If the mix is muddy after you add space, the effect return is probably full of lows. Cut them. The room should not play bass.',
      },
      {
        id: 'ear-training',
        title: 'Ear training',
        minutes: 3,
        summary: 'Mixing is a listening skill. You can practice it the same way you practice an instrument.',
        links: [
          { label: 'Open the EQ explorer', href: '/eq' },
          { label: 'Open the problem mix', href: '/mixer', preset: 'problem' },
        ],
        steps: [
          {
            title: 'Name the range before you touch a knob',
            body: 'When something sounds wrong, say which band it is: low, low-mid, mid, presence, or air. Then make one move. If you boost at random, you will not learn what that band does.',
          },
          {
            title: 'Compare levels, not vibes',
            body: 'Ask three questions. Is the vocal in front of the band? Do kick and bass blur together? Does the picture lean left or right? Those are the notes the mixer in this app gives you, and they are the same questions a soundcheck asks.',
          },
          {
            title: 'Take breaks',
            body: 'Ears get tired. A mix that sounds exciting and bright at the end of a long session often sounds harsh the next morning. Turn it down, step outside, and check again. Quiet listening tells the truth.',
          },
        ],
        tip: 'Headphones show the low end that a phone speaker hides. Practice the mixer on headphones when you can, then sanity-check on a speaker.',
      },
    ],
  },
  {
    id: 'live',
    title: 'Live sound',
    eyebrow: 'Shows',
    summary: 'Soundcheck order, monitors, feedback, mics, and the list you run on show day.',
    color: '#FF8A3D',
    lessons: [
      {
        id: 'soundcheck',
        title: 'Soundcheck order',
        minutes: 4,
        summary: 'A soundcheck is a sequence. If you skip ahead, you end up mixing problems you could have caught in five minutes.',
        steps: [
          {
            title: 'Line check before tone',
            body: 'Every input should make sound on the channel you think it is. Kick in the kick channel, vocal in the vocal channel. Label the board to match the stage plot before the band arrives.',
          },
          {
            title: 'Set gain on the loudest moment',
            body: 'One channel at a time. Ask for the real playing volume, not a timid version. Gain up until the peaks are solid and the clip light is quiet. High-pass vocals and most instruments. Leave the deep lows for kick and bass.',
          },
          {
            title: 'Build from the foundation',
            body: 'A common order is kick, snare, hat and toms, overheads, bass, guitars and keys, then vocals. Vocals last because they are the most sensitive, and because singers blow their voices out if you make them sing for an hour while you hunt for a tom.',
          },
          {
            title: 'Rough mix, then monitors, then detail',
            body: 'Get a rough front-of-house balance first so the room is not empty. Then ring out the monitors. Then walk the room and fix the mix people will actually hear, not just the mix at your elbows.',
          },
        ],
        tip: 'The first song of the set is still part of soundcheck. Keep a hand near the vocal and the master.',
      },
      {
        id: 'foh-monitors',
        title: 'FOH and monitor mixes',
        minutes: 4,
        summary: 'The audience and the band are not supposed to hear the same mix.',
        steps: [
          {
            title: 'FOH is the audience',
            body: 'Front of house is the mix in the PA, the one the crowd hears. It should translate across the room: vocal clear, kick and bass even, nothing stabbing in one frequency.',
          },
          {
            title: 'Monitors are for performing',
            body: 'Wedges and in-ear monitors are separate mixes. A singer usually wants more of themselves than the audience does. A drummer may want kick and bass. Their mix is there so they can play in time and in tune, not so it sounds like a record.',
          },
          {
            title: 'Pre-fader for wedges',
            body: 'Monitor sends are almost always pre-fader. The copy is taken before the channel fader, so when you move the FOH fader you do not change the wedge. Effects like reverb are usually post-fader, so they follow the fader.',
          },
          {
            title: 'Ask, do not guess',
            body: 'Walk to the musician, or talk on the talkback, and ask what they want. "More me, less guitar" is a useful answer. Changing their mix every time you change yours will make them stop trusting the stage.',
          },
        ],
        tip: 'If the singer says they cannot hear themselves, turn them up in the monitor. Do not turn them up in the PA unless the audience also needs it.',
      },
      {
        id: 'feedback',
        title: 'Feedback and ringing out',
        minutes: 4,
        summary: 'Feedback is a loop. You stop it by finding the note and removing the extra gain at that note.',
        steps: [
          {
            title: 'What the loop is',
            body: 'The mic hears the speaker, the speaker plays the mic, and one frequency gets louder every trip around. More gain, a mic pointed at a wedge, or a cupped mic makes it easier to start.',
          },
          {
            title: 'Ring it out before the show',
            body: 'Slowly turn up the monitor send until it almost howls. Find that frequency on a graphic EQ and cut a few dB, narrow if you can. Turn it up again, find the next ring, and repeat. You are buying gain before feedback, not sculpting a smile.',
          },
          {
            title: 'When it happens during a song',
            body: 'Turn down the mic that is feeding back, or that monitor send, right away. Then cut the ringing frequency. Do not yank the master unless the whole PA is taking off. Do not slash every slider on the graphic.',
          },
          {
            title: 'Point the mic away from the wedge',
            body: 'A cardioid mic rejects sound at the rear. Aim that null, the quiet side, toward the wedge when the stand allows it. Gain before feedback is the goal. A louder wedge that howls is not a better monitor mix.',
          },
        ],
        tip: 'Cupping a handheld mic changes its pickup pattern and makes feedback more likely. If you can, ask the singer to hold it on the body, not over the grille.',
      },
      {
        id: 'mics',
        title: 'Mic choice and placement',
        minutes: 5,
        summary: 'The mic position is the first EQ. Move it a few centimeters before you reach for a knob.',
        steps: [
          {
            title: 'Vocals',
            body: 'Live vocals are usually a rugged dynamic cardioid, the handheld kind schools already own. A fist away from the mouth is a fair start, slightly off to the side if p-pops are bad. Condensers pick up more detail and more of the room, so they feed back easier on a loud stage.',
          },
          {
            title: 'Kick and snare',
            body: 'A kick mic just inside the hole, aimed at the beater, gets click. Pull it back a little for more body. A snare mic sits a couple of centimeters off the top head, aimed toward the center, and you watch how much hi-hat bleeds in. If you mic the bottom too, flip polarity on one of them when the snare sounds thin.',
          },
          {
            title: 'Guitar amps',
            body: 'A dynamic mic on the grille, at the edge of the speaker cone, is darker. Toward the center dust cap is brighter. Close-miked is the normal live move, because the room is already loud. Turn the amp down before you ask the PA to fight it.',
          },
          {
            title: 'Placement beats EQ',
            body: 'If a tom is boomy, move the mic. If a guitar is harsh, slide toward the edge of the cone. EQ is for what placement cannot do. Proximity effect means a directional mic gets bassier as it gets closer, so "too much low end" is sometimes just "too close."',
          },
        ],
        tip: 'High-pass the vocal, the snare, and the guitar. Do not high-pass the kick and the bass into nothing. They are supposed to have lows.',
      },
      {
        id: 'direct-inputs',
        title: 'DI boxes',
        minutes: 4,
        summary: 'Keyboards, acoustic-electric guitars, and e-drum modules usually hit the snake through a DI, not a microphone.',
        steps: [
          {
            title: 'What a DI does',
            body: 'A DI, direct inject or direct box, takes an unbalanced instrument or line signal and sends a balanced mic-level signal down the snake. Balanced lines reject hum over long cables. That is why you do not run a 30-foot guitar cable to the console.',
          },
          {
            title: 'Passive or active',
            body: 'A passive DI uses a transformer and does not need power. It handles hot bass pickups well. An active DI needs phantom power or a battery and has a higher input impedance, which passive piezo pickups on acoustic guitars like. If a piezo sounds thin and quacky, an active DI is the first thing to try.',
          },
          {
            title: 'Line outputs are loud',
            body: 'Keyboard outputs and e-drum module outputs are often line level, much hotter than a guitar pickup. If the preamp clips with the gain all the way down, pad the DI or the channel. The pad is a switch that drops the level, often by about 20 dB.',
          },
          {
            title: 'Ground lift is for hum',
            body: 'The ground-lift switch breaks a ground loop between the stage and the console. Flip it if you hear buzz. It is not a tone switch, and it will not fix a broken cable. Do not lift the AC safety ground on a power plug. That is a different, dangerous thing.',
          },
        ],
        tip: 'Bass is often both: a DI for a clean low end, and a mic on the amp for grit. Check polarity when you combine them. If the low end thins out, flip one.',
      },
      {
        id: 'stage-and-room',
        title: 'Stage volume and the room',
        minutes: 4,
        summary: 'The PA is not the only thing the audience hears. The stage and the room are part of the mix.',
        steps: [
          {
            title: 'Loud amps leak into every mic',
            body: 'A loud guitar amp on stage gets into the vocal mic, the snare mic, and the room itself. You cannot turn that down with the vocal fader. Ask players to aim amps at their own ears and keep them reasonable. Tilt the amp up, or move it closer to them, so they hear it without washing the stage.',
          },
          {
            title: 'The room adds low mids',
            body: 'Empty gyms, churches, and cafeterias bloom around 200–400 Hz. A mix that sounded tight in headphones will sound muddy there. Cut a little low-mid in the PA, and do not pile sub on a room that is already booming.',
          },
          {
            title: 'Walk away from the console',
            body: 'The mix at your faders is not the mix under the balcony, next to a wall, or in the front row where the wedges are louder than the PA. Walk the room during soundcheck. Fix what you hear out there.',
          },
          {
            title: 'Protect ears',
            body: 'A common guideline is about 85 dB(A) averaged across a day, and every extra 3 dB cuts the safe time roughly in half. Shows are often louder than that. Musician earplugs, lower stage volume, and not leaning into a wedge are how you still have hearing at 30. It does not grow back.',
          },
        ],
        tip: 'If the vocal will not sit on top, the stage is often too loud. That is a volume conversation, not another 4 kHz boost.',
      },
      {
        id: 'show-day',
        title: 'Show-day checklist',
        minutes: 4,
        summary: 'The boring list is the job. Most show disasters are a cable, a gain, or a phantom switch.',
        steps: [
          {
            title: 'Before doors',
            body: 'Power up in order: snake and stage first if that is the house way, then the console, then amps, so you do not pop the PA. Tape cable paths. Confirm the snake is labeled. Test talkback and the walk-in music.',
          },
          {
            title: 'Phantom only where it is needed',
            body: 'Condenser mics and some active DIs need 48 volts. Turn it on for those channels. A vintage ribbon mic can be damaged by phantom, especially on a bad cable. Do not enable it on every channel by habit.',
          },
          {
            title: 'Spares and a saved scene',
            body: 'Have a spare mic, a spare cable, a spare DI, and batteries for active DIs and wireless packs. If the console can save a scene, save it after soundcheck. A photo of the board is better than nothing.',
          },
          {
            title: 'During the set',
            body: 'Mute channels that are not in use so you do not amplify a dropped mic. Ride the vocal if the singer moves on and off the mic. Keep the master out of the red. Write down what you will fix at the next song, then do it between songs, not in a panic mid-chorus.',
          },
        ],
        tip: 'When something dies, swap the cable first, then the mic or DI, then the channel. Change one thing at a time so you know what fixed it.',
      },
    ],
  },
  {
    id: 'studio',
    title: 'Studio',
    eyebrow: 'Recording',
    summary: 'Track at a safe level, edit cleanly, then build a mix from a static balance outward.',
    color: '#3EC1F0',
    lessons: [
      {
        id: 'daw-basics',
        title: 'DAW basics',
        minutes: 4,
        summary: 'A DAW is a recorder and a mixer in software. The screen has two jobs: arranging time, and mixing level.',
        steps: [
          {
            title: 'Tracks, timeline, transport',
            body: 'Audio tracks hold recordings. MIDI tracks hold notes that trigger a virtual instrument. The timeline is bars and beats, and also minutes and seconds. Transport is play, stop, record, and loop.',
          },
          {
            title: 'Arm, input, and monitor',
            body: 'Arm a track to record. Pick the input that matches the interface channel the mic or DI is plugged into. Input monitoring lets the player hear themselves while recording. If they hear a slapback echo, the buffer is too big or they are monitoring through a slow path.',
          },
          {
            title: 'Arrange view and mix view',
            body: 'Arrange view is where you edit and see the song in time. Mix view is the console: faders, pan, sends, plugins. Same tracks, two windows. Naming tracks as you make them ("lead vox", "kick in") matters more than the color.',
          },
          {
            title: 'Save like you mean it',
            body: 'Save the session, and keep the audio files with it. "Save as" a new version before a big edit. A session file without its audio folder is an empty shell.',
          },
        ],
        tip: 'Low buffer while recording so the performer does not hear delay. Higher buffer while mixing so the computer can run more plugins. Those are two different jobs.',
      },
      {
        id: 'recording-levels',
        title: 'Recording levels',
        minutes: 3,
        summary: 'In a DAW, hotter is not better. 0 dBFS is a hard clip, and 24-bit audio does not need to live near it.',
        steps: [
          {
            title: 'Leave space under 0',
            body: 'Aim for peaks somewhere around -12 to -6 dBFS on the way in. If the preamp clips, or the interface input clips, that distortion is in the file. EQ and compression cannot undo it. Re-record.',
          },
          {
            title: '24-bit has a low noise floor',
            body: 'You do not need to record as hot as people did for 16-bit or for analog tape. A take that peaks at -18 dBFS is clean. Turning it up later in the DAW does not add the kind of noise a quiet cassette would.',
          },
          {
            title: 'Watch the interface, not only the track fader',
            body: 'The clip light on the audio interface is the one that matters while recording. The fader in the DAW is after the recording. Pulling that fader down does not fix an input that already clipped.',
          },
        ],
        tip: 'Record a little of the loudest section first and check the waveform. Flat tops on the wave mean you clipped. Peaks with space above them mean you are fine.',
      },
      {
        id: 'mic-placement',
        title: 'Studio mic placement',
        minutes: 5,
        summary: 'The room, the distance, and polarity do more than the first plugin you drop on the track.',
        steps: [
          {
            title: 'Vocals',
            body: 'A large-diaphragm condenser, cardioid, about 15–30 cm away, with a pop filter, is the usual start. Off to the side a bit reduces plosives. Treat the space behind the singer or the reflections come back into the mic. Closer means more bass, because of proximity effect. Back the mic up before you EQ boominess out.',
          },
          {
            title: 'Acoustic guitar and amps',
            body: 'A small condenser around the 12th fret, 15–30 cm out, hears a balanced acoustic guitar. A second mic on the body adds low end. Check polarity when you combine them. A guitar amp can take a close mic and a room mic. If the pair sounds thin, flip polarity on one, or move the room mic until the low end comes back.',
          },
          {
            title: 'Drums',
            body: 'Kick, snare, and a pair of overheads is enough to make a record. Overheads should be about the same distance from the snare if you want the snare in the center and in phase. Two mics on one snare, top and bottom, often need a polarity flip.',
          },
          {
            title: 'Distance is tone',
            body: 'Close is dry and detailed. Far is the room. You can add a room later with reverb, but you cannot remove a bad room that is already in a distant mic. Record drier than you think, then decide on space in the mix.',
          },
        ],
        tip: 'The polarity switch (often marked ø) is the first check when two mics on one source sound weak together. It flips the wave upside down. It is not the same thing as waiting a few milliseconds, but it fixes a lot of thin low end.',
      },
      {
        id: 'midi',
        title: 'Recording MIDI',
        minutes: 4,
        summary: 'E-drums and keyboards can record as notes, as audio, or as both. Notes can be fixed. Audio is what they actually heard.',
        steps: [
          {
            title: 'MIDI is the performance, not the sound',
            body: 'MIDI stores which note, how hard, and how long. You can change the drum kit or the piano later, fix a late snare, or move a wrong chord. It does not store the tone by itself. The virtual instrument or the module makes the sound.',
          },
          {
            title: 'Record audio too when the sound matters',
            body: 'If the drummer loves the module they practiced with, record its outputs (through a DI or line input) as well as the MIDI. You can still edit the MIDI and re-amp, and you will not lose the take they felt.',
          },
          {
            title: 'Quantize carefully',
            body: 'Quantize pulls notes toward the grid. A little can tighten sloppy drums. One hundred percent can make a human part sound like a machine. Try 50 percent strength before you flatten the feel. Do not quantize a part that was supposed to sit behind the beat.',
          },
          {
            title: 'Latency',
            body: 'A big buffer makes the keys feel late. Lower the buffer while tracking. If the MIDI notes land late even when the playing felt right, you can nudge the whole part, but fix the monitoring first so the next take is easier to play.',
          },
        ],
        tip: 'A scratch audio pass of the whole band, even on a phone if you have to, gives you the arrangement. MIDI and overdubs can replace sounds. They should not replace the memory of how the song went.',
      },
      {
        id: 'editing',
        title: 'Editing',
        minutes: 4,
        summary: 'Clean edits are invisible. The goal is the performance, not a waveform that looks tidy and feels dead.',
        steps: [
          {
            title: 'Fades stop clicks',
            body: 'Cutting a wave in the middle of a slope makes a click. Zoom in, cut near a zero crossing when you can, and put a short fade on every edit. Silence at the top of a track should be trimmed so noise gates and compressors are not reacting to the room.',
          },
          {
            title: 'Comp the vocal',
            body: 'Comping means building one lead from the best phrases of several takes. Crossfade the joins so you do not hear the edit. Do not comp every syllable unless you have to. A slightly human line beats a perfect, jumpy one.',
          },
          {
            title: 'Line up doubles, do not erase feel',
            body: 'Doubled guitars that flam, the little "tick-tick" of two picks not together, can be nudged into place. Layered drums too. Leave the push and pull that makes the chorus feel like a chorus.',
          },
        ],
        tip: 'Listen to the edit in context, at normal speed, not only zoomed in. If you can hear the join, the fade is too short or you picked the wrong take.',
      },
      {
        id: 'building-a-mix',
        title: 'Building a mix',
        minutes: 5,
        summary: 'Static mix first. Then EQ, compression, effects, automation, and buses. Plugins do not rescue a balance that never worked.',
        steps: [
          {
            title: 'Static mix',
            body: 'Pull every fader down. Bring the tracks in with level and pan only, no plugins. The vocal should lead. Kick and bass should agree. Guitars and keys should not sit on top of each other in the center. If this rough mix is not basically the song, stop and fix the recordings or the arrangement.',
          },
          {
            title: 'EQ, then compression',
            body: 'High-pass what does not need sub. Cut mud. Small boosts for presence. Then compress the sources that need control: a jumpy vocal, a bass that disappears on some notes. Two or three dB of gain reduction is often enough. Match the loudness when you bypass, so you are hearing tone and control, not just volume.',
          },
          {
            title: 'Effects on sends, automation for the story',
            body: 'Reverb and delay usually go on sends so several tracks can share one space, and so you can EQ the effect without EQ-ing the dry track. Automation is a recorded fader move. Ride the vocal up a little in the verse if it gets lost, and let the chorus lift.',
          },
          {
            title: 'Buses and a reference',
            body: 'A drum bus lets you compress the kit a little as one instrument. A vocal bus can hold the lead and the doubles. A reference track is a finished song in a similar style, level-matched to yours. If yours only wins when it is louder, you are not done.',
          },
        ],
        tip: 'The practice mixer in this app is the static-mix step: faders, pan, and a simple EQ. Get that right before you dream about more plugins.',
        links: [{ label: 'Try a static mix', href: '/mixer' }],
      },
      {
        id: 'mastering-export',
        title: 'Loudness, mastering, export',
        minutes: 5,
        summary: 'Mastering is the last polish and the file you actually send. Loud is not the same as finished.',
        steps: [
          {
            title: 'Leave the mix bus some room',
            body: 'If someone else will master, do not slam a limiter on the mix. Peaks around -6 dBFS give them room to EQ and to add their own limiting. Print the mix without the master-bus processing you were only using to make it loud in the control room, or print both and label them.',
          },
          {
            title: 'A limiter is a ceiling',
            body: 'On a master you are finishing yourself, a limiter catches peaks so the song can be turned up without digital clipping. Set the ceiling around -1 dB so the file still survives conversion to MP3 or AAC, which can push true peaks over 0 even when the WAV looked safe.',
          },
          {
            title: 'Streaming turns you down',
            body: 'Many streaming services adjust songs toward roughly -14 LUFS integrated. Apple Music sits a bit lower, near -16. A mix that is only "better" because it is louder will be turned down, and the squashed one will sound smaller. Balance beats a loudness war.',
          },
          {
            title: 'Export the right file',
            body: 'A master is usually a stereo WAV at 24-bit, 44.1 kHz for music or 48 kHz for video. Dither only when you reduce bit depth, such as 24-bit down to 16-bit. Name the file with the song, the version, and the date. Keep the WAV. Make an MP3 or AAC for a text message.',
          },
        ],
        tip: 'Turn your mix down to the same loudness as the reference before you decide it needs more limiter. Most of the time it needs a better vocal balance, not more smash.',
      },
    ],
  },
];

export function findTrack(trackId: string) {
  return tracks.find((track) => track.id === trackId);
}

export function findLesson(trackId: string, lessonId: string) {
  const track = findTrack(trackId);
  const lesson = track?.lessons.find((item) => item.id === lessonId);
  if (!track || !lesson) return null;
  const index = track.lessons.findIndex((item) => item.id === lessonId);
  const next = track.lessons[index + 1] ?? null;
  return { track, lesson, index, next };
}

export function allLessons() {
  return tracks.flatMap((track) => track.lessons.map((lesson) => ({ track, lesson })));
}

export function lessonKey(trackId: string, lessonId: string) {
  return `${trackId}:${lessonId}`;
}
