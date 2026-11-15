import type { QuizQuestion } from '@/content/types';

export const quizzes: Record<'basics' | 'live' | 'studio', QuizQuestion[]> = {
  basics: [
    {
      id: 'b1',
      prompt: 'In a normal signal chain, what comes first after the microphone?',
      choices: ['The master fader', 'The preamp / gain', 'The reverb return', 'The drum bus'],
      answer: 1,
      why: 'The mic signal is tiny. The preamp raises it before EQ, dynamics, and the fader.',
    },
    {
      id: 'b2',
      prompt: 'What is headroom?',
      choices: [
        'How much reverb is on the vocal',
        'The space between your peaks and clipping',
        'The height of the microphone stand',
        'The pan distance between kick and bass',
      ],
      answer: 1,
      why: 'If the master peaks at -6 dBFS, you have 6 dB of headroom before 0 dBFS.',
    },
    {
      id: 'b3',
      prompt: 'About how much does +6 dB change the signal?',
      choices: [
        'It adds 6 hertz',
        'It makes the sound feel about twice as loud',
        'It roughly doubles the amplitude',
        'It cuts the level in half',
      ],
      answer: 2,
      why: '+6 dB is about twice the amplitude. Perceived loudness needs closer to +10 dB to feel like double.',
    },
    {
      id: 'b4',
      prompt: 'Where does a muddy, boxy build-up often live?',
      choices: ['250–500 Hz', '8–12 kHz', 'Only below 30 Hz', 'Above 16 kHz'],
      answer: 0,
      why: 'Low mids around 250–500 Hz are where guitars, pianos, and room sound pile up.',
    },
    {
      id: 'b5',
      prompt: 'A compressor ratio of 4:1 means:',
      choices: [
        'The signal is delayed by 4 milliseconds',
        '4 dB over the threshold comes out as about 1 dB over',
        'Attack is four times the release',
        'The fader should sit at +4 dB',
      ],
      answer: 1,
      why: 'Ratio compares the change above the threshold going in to the change coming out.',
    },
    {
      id: 'b6',
      prompt: 'What does a slower attack on a compressor do to a snare?',
      choices: [
        'Lets the initial hit through, then turns the rest down',
        'Removes the snare low end',
        'Pans the snare right',
        'Delays the snare like an echo',
      ],
      answer: 0,
      why: 'Attack is how fast the compressor reacts. Slower leaves the transient, which is the crack.',
    },
    {
      id: 'b7',
      prompt: 'What is the quarter-note delay time at 120 BPM?',
      choices: ['120 ms', '250 ms', '500 ms', '1000 ms'],
      answer: 2,
      why: 'Milliseconds = 60,000 ÷ BPM. 60,000 ÷ 120 = 500 ms. An eighth note would be 250 ms.',
    },
    {
      id: 'b8',
      prompt: 'Which sources should usually stay near the center?',
      choices: [
        'Only the reverb return',
        'Hi-hats and overheads only',
        'Every channel, always',
        'Kick, snare, bass, and lead vocal',
      ],
      answer: 3,
      why: 'Those four are the core. Hard-pan them and one side of the room loses the song. Spread guitars, keys, and percussion instead.',
    },
  ],
  live: [
    {
      id: 'l1',
      prompt: 'Why are monitor sends usually pre-fader?',
      choices: [
        'So the wedge is always louder than the PA',
        'So moving the FOH fader does not change the musician’s wedge',
        'So feedback becomes impossible',
        'So the send is stereo',
      ],
      answer: 1,
      why: 'Pre-fader takes the signal before the channel fader. The stage mix stays put while you mix the audience.',
    },
    {
      id: 'l2',
      prompt: 'What is ringing out a monitor?',
      choices: [
        'Finding frequencies that are about to feed back and cutting them',
        'Tuning the snare to the key of the song',
        'Pushing every graphic EQ slider up',
        'Adding a feedback effect on purpose',
      ],
      answer: 0,
      why: 'Raise the wedge until it almost howls, find the note, and make a narrow cut. Do not scoop the whole EQ.',
    },
    {
      id: 'l3',
      prompt: 'A cardioid vocal mic rejects sound best from:',
      choices: ['The front', 'The rear', 'All angles equally', 'Only 10 degrees off axis'],
      answer: 1,
      why: 'Cardioid is sensitive in front and quietest behind. Point the back toward the wedge when you can.',
    },
    {
      id: 'l4',
      prompt: 'Which source normally goes through a DI box?',
      choices: [
        'A handheld dynamic vocal mic',
        'A guitar cabinet speaker',
        'A keyboard, an acoustic-electric guitar, or an e-drum module',
        'The main PA output',
      ],
      answer: 2,
      why: 'A DI turns an unbalanced instrument or line output into a balanced mic-level signal for the snake. Mics do not need one. An amp is usually miked.',
    },
    {
      id: 'l5',
      prompt: 'The singer wants more vocal in the wedge. The audience mix is already fine. What do you turn up?',
      choices: [
        'That vocal’s monitor send',
        'The FOH master',
        'Phantom power',
        'The vocal high-pass until it is gone',
      ],
      answer: 0,
      why: 'Monitors and front of house are separate mixes. Give the singer more of themselves on stage. Do not make the crowd pay for it.',
    },
    {
      id: 'l6',
      prompt: 'Feedback starts in the middle of a song. What is a good first move?',
      choices: [
        'Push the master to +10 dB',
        'Turn down the mic or its send, then cut the ringing frequency',
        'Pan the vocal hard left',
        'Turn the high-pass filter off',
      ],
      answer: 1,
      why: 'Feedback is a loop with too much gain. Reduce the level, then use a narrow cut at the note that is ringing.',
    },
    {
      id: 'l7',
      prompt: 'Why does a loud guitar amp on stage make the vocal harder to mix?',
      choices: [
        'It bleeds into the vocal mic and adds volume the vocal fader cannot fully control',
        'It deletes the low end from the PA',
        'It turns phantom power off',
        'It forces the console into mono',
      ],
      answer: 0,
      why: 'Stage wash gets into every open mic. If the amp is louder than the vocal in the room, the vocal fader cannot fix the balance by itself.',
    },
    {
      id: 'l8',
      prompt: 'When should you turn phantom power on?',
      choices: [
        'On every channel, including vintage ribbon mics',
        'Only on the master bus',
        'For condenser mics and active DIs that need it',
        'Only during the encore',
      ],
      answer: 2,
      why: 'Condensers and many active DIs need 48 V. Do not put phantom on a vintage ribbon unless the maker says it is safe.',
    },
  ],
  studio: [
    {
      id: 's1',
      prompt: 'A healthy level while recording into a DAW is:',
      choices: [
        'Peaks smashed into 0 dBFS, as hot as possible',
        'Peaks safely below 0 dBFS, often around -12 to -6 dBFS',
        'Always exactly 0 dBFS',
        'Under -60 dBFS so there is no noise at all',
      ],
      answer: 1,
      why: '0 dBFS is a hard clip. 24-bit audio has a low noise floor, so you do not need to record hot. Leave margin.',
    },
    {
      id: 's2',
      prompt: 'What is a static mix?',
      choices: [
        'A balance of faders and pans before plugins',
        'A mix with no low end',
        'A stereo file with the limiter already maxed',
        'A mix that only uses stock plugins',
      ],
      answer: 0,
      why: 'Get the song working with level and pan first. If it does not basically work, plugins are hiding the problem.',
    },
    {
      id: 's3',
      prompt: 'Why leave headroom on a mix you will send out for mastering?',
      choices: [
        'Because WAV files cannot store peaks above -6',
        'So the mastering engineer has room to work before the limiter',
        'Headroom only matters for live sound',
        'So the song is required to stay quiet forever',
      ],
      answer: 1,
      why: 'Peaks around -6 dBFS give mastering room for EQ and limiting. A mix that is already slammed leaves them less to do.',
    },
    {
      id: 's4',
      prompt: 'Two mics on one guitar sound thin together. What do you try first?',
      choices: [
        'Pan both hard left',
        'Flip polarity on one mic',
        'Add a long hall reverb',
        'Raise the sample rate',
      ],
      answer: 1,
      why: 'If the mics are opposite polarity, low frequencies cancel when you sum them. The polarity switch is the first check.',
    },
    {
      id: 's5',
      prompt: 'What does quantize do to a MIDI performance?',
      choices: [
        'Pulls notes toward the grid',
        'Converts MIDI into an MP3',
        'Adds room reverb',
        'Sets the audio interface buffer',
      ],
      answer: 0,
      why: 'Quantize moves note timings toward the grid. A little can tighten drums. All the way can erase the feel.',
    },
    {
      id: 's6',
      prompt: 'What is comping a vocal?',
      choices: [
        'Building one performance from the best pieces of several takes',
        'Compressing the vocal to 10:1',
        'Recording the vocal in mono only',
        'Doubling the vocal with a pitch shifter',
      ],
      answer: 0,
      why: 'A comp, short for composite, takes the strongest phrases from multiple passes and crossfades them into one lead.',
    },
    {
      id: 's7',
      prompt: 'Many streaming services adjust a song toward roughly:',
      choices: ['0 LUFS', '-14 LUFS integrated', '-60 dBFS peak', '+6 dB of headroom'],
      answer: 1,
      why: 'Loudness normalization is often near -14 LUFS. Apple Music sits a bit lower, near -16. Louder is not a free win.',
    },
    {
      id: 's8',
      prompt: 'When should you dither?',
      choices: [
        'Every time you press play',
        'When you reduce bit depth, such as 24-bit down to 16-bit',
        'Only on live monitor sends',
        'Whenever you pan a track',
      ],
      answer: 1,
      why: 'Dither is low-level noise that keeps quiet details from distorting when the bit depth goes down. Do not add it on every 24-bit export.',
    },
  ],
};

export function quizFor(trackId: string) {
  if (trackId === 'basics' || trackId === 'live' || trackId === 'studio') return quizzes[trackId];
  return null;
}
