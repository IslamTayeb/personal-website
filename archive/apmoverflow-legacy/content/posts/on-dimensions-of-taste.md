Over last semester, I wanted to see whether I could formalize my music preferences numerically, whether I could model the distinctions I *felt* but couldn't articulate, and use them to automatically sort my liked songs into playlists. Could I build something that surfaces patterns in my library I sense but can't describe?

Spotify Wrapped dropped around then and, as usual, offered nothing beyond top-5 artists and genre percentages. So I looked into it.

I figured [Spotify's API](https://developer.spotify.com/documentation/web-api?id=0) would give me what I needed. I remember from an [older project](https://github.com/IslamTayeb/NLP-spotify) that their API had useful endpoints: `audio-features` (danceability, valence, energy) and `audio-analysis`. Turns out they deprecated both of them in late 2024.<sup class="footnote-ref" id="fnref-1"><a href="#fn-1">1</a></sup> So I took this as an opportunity to brush up on some ML and data science skills.

P.S. This post's timing coincides with [Anna's Archive's Spotify scrape](https://annas-archive.li/blog/backing-up-spotify.html). It included the features and analyses of 99.9% of Spotify's library. This happened 3-4 days after I started this project. Had the leak dropped a week earlier, I wouldn't have built this, and I'd have missed the temporal analysis that made the project worthwhile.

* * *

<div class="toc"><div class="toc-main"><h2 id="index">Index</h2><div class="toc-sections"><div class="toc-section"><a href="#part-0-getting-the-data"><span class="toc-num">0</span>Getting the Data</a></div><div class="toc-section"><a href="#part-1-embedding-the-audio"><span class="toc-num">1</span>Embedding the Audio</a><div class="toc-subs"><a href="#essentia-classifiers">Essentia Classifiers</a> <a href="#what-these-dimensions-actually-capture">What These Dimensions Capture</a> <a href="#custom-audio-dimensions">Custom Audio Dimensions</a></div></div><div class="toc-section"><a href="#part-2-embedding-the-lyrics"><span class="toc-num">2</span>Embedding the Lyrics</a><div class="toc-subs"><a href="#gpt-as-an-annotator">GPT as an Annotator</a> <a href="#theme-and-language-encoding">Theme and Language Encoding</a> <a href="#a-note-on-ordinal-encoding">A Note on Ordinal Encoding</a> <a href="#instrumentalness-weighting">Instrumentalness Weighting</a></div></div><div class="toc-section"><a href="#part-3-clustering"><span class="toc-num">3</span>Clustering</a><div class="toc-subs"><a href="#hdbscan">HDBSCAN</a> <a href="#knn">KNN</a> <a href="#hierarchical-agglomerative-clustering-hac">HAC</a></div></div><div class="toc-section"><a href="#part-4-analysis"><span class="toc-num">4</span>Analysis</a><div class="toc-subs"><a href="#the-clusters">The Clusters</a> <a href="#audio-vs-lyrics-covariance">Audio vs. Lyrics Covariance</a> <a href="#genre-analysis">Genre Analysis</a> <a href="#temporal-analysis">Temporal Analysis</a> <a href="#future-work">Future Work</a></div></div><div class="toc-section"><a href="#part-5-afterword"><span class="toc-num">5</span>Afterword</a></div></div></div><div class="toc-meta"><div><strong>Reading time</strong><br>~6.0K words, ~24 min</div><div><strong>Last updated</strong><br>Jan 1, 2026</div><div><strong>Code</strong><br><a href="https://github.com/IslamTayeb/harmonia">GitHub</a></div><div><strong>Playlists</strong><br><a href="https://open.spotify.com/playlist/2r09O8jpBHFbsPFR9KtVBh">Hard-Rap</a> · <a href="https://open.spotify.com/playlist/0YR44cIs9Frfp4V7g0eovT">Narrative-Rap</a> · <a href="https://open.spotify.com/playlist/1Yd9WxdGakzTnwpooWP89m">Jazz-Fusion</a> · <a href="https://open.spotify.com/playlist/2UycjhM5qkU9EULPUpxMzi">Rhythm-Game-EDM</a> · <a href="https://open.spotify.com/playlist/67kgiiBpRUEqGHmzifMKVh">Mellow</a></div></div></div>

* * *

## Part 0: Getting the Data

Before any analysis, I needed the raw materials:

**Songs:** I used [Spotify's API](https://developer.spotify.com/documentation/web-api?id=0) to get all my liked songs + their metadata (*1,488* songs; *1,452* after removing duplicates).

**Audio:** I used [spotdl](https://github.com/spotDL/spotify-downloader) to download MP3s by matching tracks to YouTube. This worked: 100% match rate, with only a few quality misses on live recordings.

**Lyrics:** I fetched lyrics from Genius and Musixmatch. Got *1,148 (79%) matches*. The misses were mostly instrumental tracks, live music/remixes, niche music, leaks, or very new releases.

**Final dataset:** I wanted to include instrumental tracks that may have had no lyrics. The logic:

<div class="highlight"><pre><span></span><span class="k">for</span> <span class="n">song</span> <span class="ow">in</span> <span class="n">library</span><span class="p">:</span>
    <span class="k">if</span> <span class="n">has_lyrics</span><span class="p">(</span><span class="n">song</span><span class="p">):</span>
        <span class="n">include</span><span class="p">(</span><span class="n">song</span><span class="p">)</span>
    <span class="k">elif</span> <span class="n">instrumentalness</span><span class="p">(</span><span class="n">song</span><span class="p">)</span> <span class="o">&gt;=</span> <span class="mf">0.5</span><span class="p">:</span>
        <span class="n">include</span><span class="p">(</span><span class="n">song</span><span class="p">)</span>   <span class="c1"># instrumental, lyrics not expected</span>
    <span class="k">else</span><span class="p">:</span>
        <span class="k">pass</span>    <span class="c1"># no lyrics, but should have had them</span>
</pre></div>

Note: `instrumentalness` (see [Essentia Classifiers](#essentia-classifiers) below) is derived from a classification model run over audio embeddings, not from Spotify metadata.

This gave me *1,253 (86%) songs* with complete data. I could have manually searched for the remaining 14%, but the coverage was sufficient for clustering.

## Part 1: Embedding the Audio

My first instinct was to use existing music embedding models. If vision has *CLIP* and language has *BERT*, surely music has something similar.

I first tried [*MERT*](https://huggingface.co/m-a-p/MERT-v1-95M), a late-2024 music representation transformer that's (AFAIK) the state-of-the-art. It produced 768-dimension vectors, which I then PCA'd into 128-D vectors. I used KNN (N = 2-8), and clusters mixed mellow jazz with aggressive EDM. I couldn't empirically tell what each playlist (cluster) was about except at N = 2, where I could tell one playlist was slow/mellow and the other was fast/aggressive. Once I switched to interpretable dimensions, the clusters became legible. I then tried [*Essentia's Discogs-EffNet*](https://essentia.upf.edu/models.html) embedding model (1,280-D) and [*CLAP-Music*](https://huggingface.co/laion/larger_clap_music) (512-D). Both scattered sonically similar tracks across 4+ clusters (i.e. was terrible).

I couldn't even debug what was going wrong. I tried PCA to reduce dimensionality, but that didn't help me understand the failure. PCA finds directions of maximum variance, but variance != semantics. The top principal components captured "loudness" and "bass presence," but this was all vibes-based and wasn't going to take me very far. The whole pipeline was unsupervised: high-dimensional embedding → PCA → clustering. At no point could I inspect individual dimensions and say "this one needs work."

The failure of embedding → clustering made sense: embeddings optimize for their training objective. *MERT* for masked prediction, *EffNet* for Discogs (genre) tags. The geometry of the space encodes *their* goals, not mine. And general-purpose embeddings are trained on everything from Beethoven to Beyoncé. My library, given my limited taste, occupies a tiny corner of that space, where the distinctions I care about (sad rap vs. narrative rap, warm jazz vs. cold EDM) are smaller than the noise floor.

I started thinking it'd be better to at least understand the dimensions one by one. Instead of letting the embedding define the space, I'd define the space myself and project songs onto it. This approach is called **supervised dimensionality reduction**: you choose the dimensions that matter to you, then train or use classifiers to score data along those dimensions. I stumbled upon this out of necessity rather than "a blog told me to do so."

### Essentia Classifiers

*Essentia* doesn't just provide embeddings. It has dozens of pre-trained classifiers that output interpretable features: `mood_*`, `danceability`, `instrumentalness`, `genre_*`, and more. I first had to make sure I embedded all mp3s with *Discogs-EffNet* + *MusiCNN*, which are 2 different feature extraction/embedding models. I then ran these embeddings through these classifiers:

<table><thead><tr><th>Dim</th><th>Name</th><th>Model</th><th>Output</th><th>Description</th></tr></thead><tbody><tr><td>0</td><td><code>bpm</code></td><td>RhythmExtractor (DSP)</td><td>Float</td><td>Tempo in BPM, normalized to [0,1] via min-max</td></tr><tr><td>1</td><td><code>danceability</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Rhythm regularity, tempo stability</td></tr><tr><td>2</td><td><code>instrumentalness</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>0 = vocals present, 1 = instrumental</td></tr><tr><td>3</td><td><code>valence</code></td><td>MusiCNN + DEAM</td><td>[1-9] → [0,1]</td><td>Emotional positivity</td></tr><tr><td>4</td><td><code>arousal</code></td><td>MusiCNN + DEAM</td><td>[1-9] → [0,1]</td><td>Emotional energy/intensity</td></tr><tr><td>5</td><td><code>engagement</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Background music vs. active listening</td></tr><tr><td>6</td><td><code>approachability</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Mainstream accessibility vs. niche</td></tr><tr><td>7</td><td><code>mood_happy</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Joy/celebration presence</td></tr><tr><td>8</td><td><code>mood_sad</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Melancholy/grief presence</td></tr><tr><td>9</td><td><code>mood_aggressive</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Anger/intensity presence</td></tr><tr><td>10</td><td><code>mood_relaxed</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Calm/peace presence</td></tr><tr><td>11</td><td><code>mood_party</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Upbeat/celebratory energy</td></tr><tr><td>12</td><td><code>voice_gender</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>Female (0) vs. male (1) vocals; 0.5 for instrumentals</td></tr><tr><td>13</td><td><code>genre_fusion</code>*</td><td>Discogs-EffNet</td><td>Entropy → [0,1]</td><td>Low = pure genre, high = genre fusion</td></tr><tr><td>14</td><td><code>electronic_acoustic</code>*</td><td>Discogs-EffNet</td><td>Computed</td><td>0 = electronic, 1 = acoustic</td></tr><tr><td>15</td><td><code>timbre_brightness</code></td><td>Discogs-EffNet</td><td>[0,1]</td><td>0 = dark/mellow, 1 = bright/crisp production</td></tr><tr><td>16</td><td><code>key_sin</code>*</td><td>KeyExtractor (DSP)</td><td>[-0.33, 0.33]</td><td>Circular pitch encoding (sin component)</td></tr><tr><td>17</td><td><code>key_cos</code>*</td><td>KeyExtractor (DSP)</td><td>[-0.33, 0.33]</td><td>Circular pitch encoding (cos component)</td></tr><tr><td>18</td><td><code>key_scale</code>*</td><td>KeyExtractor (DSP)</td><td>0 or 0.33</td><td>Minor (0) vs. major (0.33)</td></tr></tbody></table>

Most of these are straightforward \[0,1\] classifiers. But a few (marked with `*`) came from interesting empirical notes or needed a custom implementation.

### What These Dimensions Actually Capture

Most dimensions do what you'd expect. BPM is just BPM.<sup class="footnote-ref" id="fnref-2"><a href="#fn-2">2</a></sup> Approachability separates TikTok indie from rhythm game EDM. Engagement distinguishes background music from foreground music. These confirm intuitions rather than reveal anything new.

Two dimensions surprised me.

**Danceability**

*Essentia*'s danceability measures rhythm regularity, not "would people dance to this." Drake averages 0.073, 59% *below* my library average of 0.178. The man who made *One Dance* scores lower than Marty Robbins.

<table><thead><tr><th>Track</th><th>Artist</th><th>Danceability</th><th>Why?</th></tr></thead><tbody><tr><td>Praise The Lord (Da Shine)</td><td>A$AP Rocky, Skepta</td><td>0.000</td><td>Flow changes, beat switches</td></tr><tr><td>Crazy</td><td>Doechii</td><td>0.000</td><td>Tempo shifts, varied samples</td></tr><tr><td>American Pie</td><td>Don McLean</td><td>0.993</td><td>Steady strum, metronomic tempo</td></tr><tr><td>A Town with an Ocean View</td><td>Joe Hisaishi</td><td>0.992</td><td>Consistent orchestral pulse</td></tr></tbody></table>

The model penalizes the beat changes and varied samples in modern hip-hop, clearly. *Praise The Lord* has flow changes in each verse; the model reads that as rhythmic instability. Meanwhile, *American Pie*'s steady acoustic strum reads as perfectly "danceable." The name is misleading: it's really measuring metronome-likeness.

**Valence x Arousal**

These two dimensions together map emotional space better than either alone.

<table><thead><tr><th>Quadrant</th><th>Example Track</th><th>Artist</th><th>Valence</th><th>Arousal</th></tr></thead><tbody><tr><td>High/High (euphoric)</td><td>Anomaly</td><td>Camellia</td><td>1.00</td><td>0.89</td></tr><tr><td>High/Low (peaceful)</td><td>A Town with an Ocean View</td><td>Joe Hisaishi</td><td>0.71</td><td>0.34</td></tr><tr><td>Low/High (aggressive)</td><td>Hard Times</td><td>Paramore</td><td>0.52</td><td>1.00</td></tr><tr><td>Low/Low (melancholic)</td><td>The Breaking of the Fellowship</td><td>Echoes of Old Stories</td><td>0.00</td><td>0.00</td></tr></tbody></table>

*The Breaking of the Fellowship* is the absolute minimum for both (0.00, 0.00), the most melancholic and calm track in my library. Interestingly, *t+pazolite*'s jarring speedcore averages 0.78 valence, nearly 2x my library average. The model reads frenetic major-key energy as "happy," which makes sense once you stop expecting valence to mean lyrical sentiment.

### Custom Audio Dimensions

#### Genre Fusion (Dim 13)

I differentiate my music as genre soup (jazz fusion, experimental hip hop) vs. one-trick ponies (pure trap, straightforward pop). I wanted to capture that.

*Essentia*'s genre classifier outputs probabilities across 400 Discogs genres. I computed the entropy of this distribution:

-   **Low entropy → pure genre.** The model is confident the song belongs to one category. Think Playboi Carti's "New Tank": obviously trap.
-   **High entropy → genre fusion.** Probability is spread across many categories. Think a track like "Raksit Leila" that blends Arabic pop, electronic, and folk.

To validate this worked, I looked at high-popularity tracks at both extremes:

<div class="table-pair"><table><thead><tr><th>Track</th><th>Artist</th><th>Genre fusion</th><th>Top Genre</th></tr></thead><tbody><tr><td>The Box</td><td>Roddy Ricch</td><td>0.164</td><td>Hip Hop / Cloud Rap</td></tr><tr><td>Drip Too Hard</td><td>Lil Baby, Gunna</td><td>0.337</td><td>Hip Hop / Trap</td></tr><tr><td>Big Dawgs</td><td>Hanumankind, Kalmi</td><td>0.376</td><td>Hip Hop / Horrorcore</td></tr><tr><td>Flex Up</td><td>Lil Yachty, Future, Playboi Carti</td><td>0.075</td><td>Hip Hop / Cloud Rap</td></tr></tbody></table><table><thead><tr><th>Track</th><th>Artist</th><th>Genre fusion</th><th>Top 3 Genres</th></tr></thead><tbody><tr><td>Self Control</td><td>Frank Ocean</td><td>0.947</td><td>Alt Rock, Indie Rock, Pop Rock</td></tr><tr><td>Bad Habit</td><td>Steve Lacy</td><td>0.850</td><td>Neo Soul, Funk, Contemporary R&amp;B</td></tr><tr><td>POWER</td><td>Kanye West</td><td>0.839</td><td>Conscious, Pop Rap, Crunk</td></tr><tr><td>LA FAMA</td><td>ROSALÍA, The Weeknd</td><td>0.833</td><td>House, Dance-pop, UK Garage</td></tr><tr><td>Feel No Ways</td><td>Drake</td><td>0.753</td><td>Contemporary R&amp;B, Experimental, Vaporwave</td></tr></tbody></table></div>

Almost all trap/cloud rap in the pure genre table; genres with distinctive sonic signatures the model recognizes confidently. Genre-bending artists (Frank Ocean, Steve Lacy, ROSALÍA, Kanye) cluster in the fusion table. Their sound draws from multiple traditions, so the model spreads probability across many categories. Although some may disagree with this being an important dimension, I thought it was useful for clustering my personal library.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/genre/genre_fusion_hist/index.html" width="100%" height="500px"></iframe>

*Genre fusion histogram showing distribution*

#### Acoustic/Electronic (Dim 14)

I expected jazz and electronic game music ([osu!](https://youtu.be/yJhcsh1ciNg?t=40) music) might cluster together. Both are instrumental with complex rhythms, and often have high `genre_fusion`. But while one uses saxophones and pianos, the other uses synthesizers. I wanted a dimension to separate them.

*Essentia* has separate `mood_acoustic` and `mood_electronic` classifiers. I initially dismissed this, but I noticed purely through empirical means that it'd be useful as a dimension to separate these. I combined them as: `(mood_acoustic - mood_electronic + 1) / 2`. This separated jazz from EDM cleanly: tracks that shared high genre\_fusion now landed in distinct clusters.

#### Circular Key Encoding (Dims 16-18)

Musical keys are cyclical: C is close to B, not twelve steps away. Standard one-hot encoding would treat them as unrelated categories.<sup class="footnote-ref" id="fnref-3"><a href="#fn-3">3</a></sup>

<div class="highlight"><pre><span></span><span class="n">w</span> <span class="o">=</span> <span class="mf">0.33</span>
<span class="n">key_sin</span> <span class="o">=</span> <span class="n">math</span><span class="o">.</span><span class="n">sin</span><span class="p">(</span><span class="mi">2</span> <span class="o">*</span> <span class="n">math</span><span class="o">.</span><span class="n">pi</span> <span class="o">/</span> <span class="mi">12</span><span class="p">)</span> <span class="o">*</span> <span class="n">w</span>
<span class="n">key_cos</span> <span class="o">=</span> <span class="n">math</span><span class="o">.</span><span class="n">cos</span><span class="p">(</span><span class="mi">2</span> <span class="o">*</span> <span class="n">math</span><span class="o">.</span><span class="n">pi</span> <span class="o">*</span> <span class="n">pitch</span> <span class="o">/</span> <span class="mi">12</span><span class="p">)</span> <span class="o">*</span> <span class="n">w</span>
<span class="n">key_scale</span> <span class="o">=</span> <span class="mi">0</span> <span class="k">if</span> <span class="n">minor</span> <span class="k">else</span> <span class="n">w</span>
</pre></div>

The weight *w* = 0.33 ensures the three key dimensions contribute roughly 1~ effective dimension of clustering influence, not 3.

<div class="key-visualizations"><div style="flex: 1"><iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/explainers/key_linear/index.html" width="100%" height="250px"></iframe><p><em>Linear key encoding visualization</em></p></div><div style="flex: 1"><iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/explainers/key_circular/index.html" width="100%" height="250px"></iframe><p><em>Circular key encoding visualization</em></p></div></div>

That gives me **19 audio dimensions** total (more like 17, effectively).

## Part 2: Embedding the Lyrics

Audio features alone weren't enough. Two songs can sound similar but have completely different lyrical content. Given that 60%+ of my library is rap, lyric features needed significant weight.

### Sentence Transformers Failed

I tried embedding lyrics with sentence transformers (*BGE-M3*, *E5-large*, *BERT*). They clustered by language, not emotion. Japanese songs grouped together regardless of mood. The embedding space captures linguistic meaning, not affective meaning.

### GPT as an Annotator

The proper approach here would mirror what I did for audio: supervised dimensionality reduction. I'd embed lyrics with something like *BERT* or *GPT* embeddings, then run those embeddings through pre-trained classifiers for each dimension (valence, arousal, mood, narrative density, etc.). Each classifier would be trained on labeled data, outputting interpretable scores. This is exactly how the *Essentia* pipeline worked: embedding → classifier → interpretable feature.

Frankly, I was too lazy to do that. But I figured prompting GPT directly would be good enough: LLMs have been trained on so much text about emotions, sentiment, and meaning that they've essentially internalized how humans label these things. So instead of hunting for classifiers, I made a bunch of *GPT-5 mini* calls with structured prompts explaining the dimensions I wanted. Sue me.

Instead of embedding lyrics and hoping the right structure emerges, I defined the dimensions I wanted and had *GPT-5 mini* score directly into them:

<table><thead><tr><th>Dim</th><th>Name</th><th>Source</th><th>Output</th><th>Description</th></tr></thead><tbody><tr><td>19</td><td><code>lyric_valence</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Emotional tone (0 = negative, 1 = positive)</td></tr><tr><td>20</td><td><code>lyric_arousal</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Energy level of lyric content</td></tr><tr><td>21</td><td><code>lyric_mood_happy</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Joy/celebration (non-mutually exclusive)</td></tr><tr><td>22</td><td><code>lyric_mood_sad</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Grief/melancholy</td></tr><tr><td>23</td><td><code>lyric_mood_aggressive</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Anger/confrontation</td></tr><tr><td>24</td><td><code>lyric_mood_relaxed</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Peace/calm</td></tr><tr><td>25</td><td><code>lyric_explicit</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>Profanity, sexual content, violence, drugs (combined)</td></tr><tr><td>26</td><td><code>lyric_narrative</code></td><td>GPT-5 mini</td><td>[0,1]</td><td>0 = vibes/hooks, 1 = story with arc</td></tr><tr><td>27</td><td><code>lyric_vocabulary</code></td><td>Local</td><td>[0,1]</td><td>Type-token ratio (vocabulary richness)</td></tr><tr><td>28</td><td><code>lyric_repetition</code></td><td>Local</td><td>[0,1]</td><td>1 - (unique lines / total lines)</td></tr><tr><td>29</td><td><code>theme</code>*</td><td>GPT-5 mini</td><td>Ordinal</td><td>Primary theme (love, party, flex, struggle, etc.)</td></tr><tr><td>30</td><td><code>language</code>*</td><td>GPT-5 mini</td><td>Ordinal</td><td>Primary language, grouped by musical tradition</td></tr><tr><td>31</td><td><code>popularity</code></td><td>Spotify API</td><td>[0,1]</td><td>Spotify recency-weighted popularity [0-100], normalized via min-max</td></tr><tr><td>32</td><td><code>release_year</code></td><td>Spotify API</td><td>[0,1]</td><td>Decade bucket encoding: 1950s=0.0, ..., 2020s=1.0</td></tr></tbody></table>

A few interesting design choices I made for the prompt:

-   **Non-mutually exclusive moods.** A song can be both happy (0.7) and sad (0.4) if it's bittersweet.
-   **Single theme choice.** Forces picking one primary theme to avoid multi-label ambiguity.
-   **Detailed anchor points.** Not just "rate 0-1" but specific guidance: "0.0-0.2: deeply negative, despair, nihilism."

Similar to the audio dimensions, a few (marked with `*`) needed custom implementation. They're underwhelming, though.

### Theme and Language Encoding

GPT extracted `theme` (one of: party, flex, love, struggle, introspection, etc.) and `language` (English, Arabic, Japanese, etc.). But these are categorical; I needed to encode them as numbers for clustering.

I used ordinal scales designed around musical similarity:

<div class="highlight"><pre><span></span>party=1.0, flex=0.89, love=0.78, social=0.67, spirituality=0.56,
introspection=0.44, street=0.33, heartbreak=0.22, struggle=0.11, other=0.0
</pre></div>

<div class="highlight"><pre><span></span>English=1.0, Romance=0.86, Germanic=0.71, Slavic=0.57,
Middle Eastern=0.43, South Asian=0.29, East Asian=0.14, African=0.0
</pre></div>

Love it or hate it, this took 5 minutes to write in claude code. I'd been debugging for days over break. The marginal gain from principled categorical encoding didn't feel worth another rabbit hole.

### A Note on Ordinal Encoding

This encoding is arbitrary. Party isn't objectively "closer" to flex than to struggle. The distances are made up. A cleaner approach would be learned embeddings or one-hot encoding with dimensionality reduction, but that would bloat the vector with 20+ sparse dimensions, drowning out the interpretable features I'd carefully constructed.

In practice, the arbitrariness matters less than it looks. The audio dimensions do the heavy lifting for separation. The `instrumentalness` dimension alone has massive effect sizes (Cohen's d = -6.37 between Hard-Rap and Jazz-Fusion), and the instrumentalness weighting pulls lyric features toward neutral values. So even if instrumentals land at an arbitrary 0.5 on the theme/language scales, they still cluster correctly because the audio dimensions handle the real separation work.

### Instrumentalness Weighting

Here's where it got tricky. What do you do with instrumental tracks? How about tracks where lyrics have very little value (e.g. in EDM)?

#### Problem 1: Zero isn't always neutral

My first attempt: zero out lyric features for instrumentals. An instrumental has no sad lyrics, so `lyric_mood_sad = 0`. But this caused instrumentals to cluster with *happy* music, because happy songs also have low sadness.

The issue is that some features are bipolar (valence: negative ↔ positive) while others are presence-based (sadness: absent ↔ present). For bipolar features, zero means "negative," not "absent." An instrumental isn't lyrically negative; it's lyrically *absent*. The neutral point is 0.5, not 0.

<table><thead><tr><th>Feature Type</th><th>Neutral Value</th><th>Rationale</th></tr></thead><tbody><tr><td>Bipolar (valence, arousal)</td><td>0.5</td><td>Neutral, not negative</td></tr><tr><td>Presence (moods, explicit, narrative)</td><td>0</td><td>Absence is absence</td></tr><tr><td>Categorical (theme, language)</td><td>0.5</td><td>Centered<sup class="footnote-ref" id="fnref-4"><a href="#fn-4">4</a></sup></td></tr></tbody></table>

#### Problem 2: Instrumentalness is a spectrum

Tracks like [Fred Again's *leavemealone*](https://open.spotify.com/track/34vzTHRwW8Im0Rkim8IJGs?si=d9a7e4472cdb40cd) technically have lyrics, but (with all due respect to Keem) these are textural at best, not semantic. The words don't carry emotional weight the way Kendrick's verses do. When GPT classified these lyrics, it'd return real values (arousal 0.8, narrative 0.1), and suddenly my EDM was clustering with lyrically similar pop instead of with other electronic music.

One should realize that GPT's classifications *are* valid. *leavemealone* does have high arousal, low narrative lyrics. But that doesn't mean those dimensions should swing the vector as much as they do, because the lyrics component of the song *as a whole* isn't that important.

Basically, instrumentalness is a spectrum, not a switch. Another Fred Again track like [*adore u*](https://open.spotify.com/track/1rf4SX7dduNbrNnOmupLzi?si=530b812b0310431c) should have *some* lyric influence, just dampened proportionally.

I needed lyrics to matter *less* as a track becomes more instrumental.

The fix: weight each lyric dimension by `(1 - instrumentalness)`, pulling toward the appropriate neutral value:

<div class="highlight"><pre><span></span><span class="c1"># For bipolar features (neutral = 0.5):</span>
<span class="n">weighted</span> <span class="o">=</span> <span class="mf">0.5</span> <span class="o">+</span> <span class="p">(</span><span class="n">raw</span> <span class="o">-</span> <span class="mf">0.5</span><span class="p">)</span> <span class="o">*</span> <span class="p">(</span><span class="mi">1</span> <span class="o">-</span> <span class="n">instrumentalness</span><span class="p">)</span>
<span class="c1"># For presence features (neutral = 0):</span>
<span class="n">weighted</span> <span class="o">=</span> <span class="n">raw</span> <span class="o">*</span> <span class="p">(</span><span class="mi">1</span> <span class="o">-</span> <span class="n">instrumentalness</span><span class="p">)</span>
</pre></div>

At `instrumentalness = 0` (pure vocals), the raw lyric value passes through unchanged. At `instrumentalness = 1` (pure instrumental), the value collapses to neutral. In between, it's a smooth blend: Fred Again's vocal samples contribute a little, Kendrick's verses contribute fully.

This fixed the scattering problem. After this change, Fred Again's *leavemealone* stopped clustering with lyrically similar pop tracks and landed with other electronic music where it belonged.

That gives me **33 dimensions total**: 19 audio, 12 lyrics, 2 metadata. Each song is now a point in 33-dimensional space. The next step: group them.

## Part 3: Clustering

With 33 interpretable dimensions, I needed a clustering algorithm. I tried 3. Do note that I (mostly) ignored things like silhouette scores (data wasn't well-separated enough) or elbow methods. Most of my work here was based on observation.

#### HDBSCAN

*HDBSCAN* was my first choice. It had worked well for me on biological data before: density-based, no need to specify k, finds arbitrary shapes. On music, HDBSCAN labeled 90% of tracks as noise.

It assumes clusters are "regions of the data that are denser than the surrounding space"; the mental model is "trying to separate the islands from the sea." But music taste barely has any density gaps. Chill pop gradates into bedroom pop gradates into lo-fi. There are no valleys to cut.

#### KNN

*KNN*\-based clustering (building a neighbor graph, then running community detection) was better. It captures local structure. A song might neighbor five chill tracks and one jazz track, and that single edge pulls it wrong. I found ~20% of tracks felt misplaced from randomly shuffling. It was miles better than *HDBSCAN*, but I was still exploring.

#### Hierarchical Agglomerative Clustering (HAC)

*HAC* worked great. It builds a tree: every song starts as its own cluster, and the algorithm repeatedly merges the two most similar. You cut wherever you want k clusters. HAC dropped misplacement rate from ~20% to ~5%.

Interestingly, I felt like *HAC* struggled with sub-clusters a little. This was especially clear when I was exploring a 100~ song cluster and trying to cluster it further because I sensed a clear distinction in mood. My intuition was that *HAC*'s greedy merges compound at higher resolution. *KNN*'s local focus, a liability globally, became an asset when "nearby" already meant "similar vibe."<sup class="footnote-ref" id="fnref-5"><a href="#fn-5">5</a></sup>

**Final approach:** *HAC* for main clustering (*k=5*), *KNN* for subclustering within each. Good enough: 90% of clusters matched my intuition on shuffle.

## Part 4: Analysis

### The Clusters

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/combined/index.html" width="100%" height="350px"></iframe>

*3D UMAP visualization with cluster colors*

After standardizing features, running HAC, and listening to a lot of my questionable music taste, I landed on 5 clusters.

#### <code class="hard-rap">Hard-Rap</code> (Cluster 0, [Playlist](https://open.spotify.com/playlist/2r09O8jpBHFbsPFR9KtVBh)) — 733 songs, 58.5%

High-energy rap dominated by trap and cloud rap. The cluster that confirms I am, at my core, a "guy music" typa guy.

**Top 3 defining features:** High `lyric_arousal`, high `lyric_explicit`, high `lyric_mood_aggressive`. This is music that's loud, profane, and confrontational.

**Top artists:** Kanye West, JPEGMAFIA, Drake, Kendrick Lamar, Travis Scott, Paris Texas.

**What it sounds like:** Main character energy.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/subclusters/Hard-Rap_subclusters/index.html" width="100%" height="350px"></iframe>

*3D UMAP visualization of <code class="hard-rap">Hard-Rap</code> sub-clusters*

I did feel like this cluster was huge and shuffling through it there felt like a *Lil Baby* rap side and a more upbeat 2010s *Kanye* rap side. Sub-clustering with k-means (k=2) revealed two modes:

-   **<code class="hard-rap-aggro">Hard-Rap-Aggro</code> (Cluster 0.0, [Playlist](https://open.spotify.com/playlist/2bV4JYV2kWfe7eB6arr1Wh)) — 472 songs, 64.4%:** Pure `mood_agressive`. JPEGMAFIA, Carnival-era Kanye, (rapping) Drake, Paris Texas. The defining split from 0.1: lower `mood_sad`, lower `electronic_acoustic` production, more hype. Big "gym playlist" energy.
-   **<code class="hard-rap-acoustic">Hard-Rap-Acoustic</code> (Cluster 0.1, [Playlist](https://open.spotify.com/playlist/11qLKy6BR2AG7aN8AE0EkH)) — 261 songs, 35.6%:** More laid-back. Ultralight Beam Kanye, DUCKWORTH Kendrick, Heaven to Me Tyler. Higher `mood_sad`, higher `electronic_acoustic` production, more relaxed. I was surprised by the "sad" label. Listening back, I hear acoustic warmth more than melancholy. Less 808s, more soul samples. The acoustic production style might be tricking the model to think the audio is sadder?

#### <code class="narrative-rap">Narrative-Rap</code> (Cluster 1, [Playlist](https://open.spotify.com/playlist/0YR44cIs9Frfp4V7g0eovT)) — 226 songs, 18.0%

Songs that tell stories. Lyrically dense, emotionally heavy.

**Top 3 defining features:** High `lyric_mood_sad`, low `lyric_valence`, high `lyric_narrative`. Feel more like essays set to music.

**Top artists:** Kendrick Lamar, Kanye West, JID, Drake, ZUTOMAYO, BROCKHAMPTON, Earl Sweatshirt.

**What it sounds like:** Kendrick's Duckworth type stories, BROCKHAMPTON's confessionals, Earl's introspection. Music you have to whip out the Genius article for.

Interesting note: J-pop was the second-largest genre here. This reminded me of those [memes](https://youtu.be/1ovKhayZ1G4) about people dancing to depressing Japanese music without understanding the lyrics. Same pattern with my Arabic rap, nearly all Shabjdeed and Daboor (Palestinian rappers) landed here.

This isn't merely sad music; it's introspective music. Frankly, I've been listening to this cluster for a while and it's almost perfectly coagulated, so no sub-clustering was necessary.

#### <code class="jazz-fusion">Jazz-Fusion</code> (Cluster 2, [Playlist](https://open.spotify.com/playlist/1Yd9WxdGakzTnwpooWP89m)) — 91 songs, 7.3%

Instrumental, relaxed, head-nodding music.

**Top 3 defining features:** High instrumentalness (0.80 average), low lyric vocabulary (because there are no lyrics), high relaxation. The "gentle" cluster.

**Top artists:** Joe Hisaishi (Ghibli's music director), Uyama Hiroto, SOIL & "PIMP" SESSIONS, Masayoshi Takanaka, Khruangbin.

**What it sounds like:** Soundtracks, ambient, downtempo, Japanese jazz fusion. Energetic but never aggressive. The kind of music that makes you nod along while working.

This cluster barely existed until summer 2024, then surged. More on that in the temporal section.

#### <code class="rhythm-game-edm">Rhythm-Game-EDM</code> (Cluster 3, [Playlist](https://open.spotify.com/playlist/2UycjhM5qkU9EULPUpxMzi)) — 47 songs, 3.8%

EDM, osu! music. Breakcore, hardcore, chiptune.

**Top 3 defining features:** High `instrumentalness`, low `approachability`, high `engagement`.

**Top artists:** Camellia, t+pazolite, Morimori Atsushi, Seiryu, VDYCD.

**What it sounds like:** 180+ BPM, complex time signatures, very electronic.

This cluster was near-zero until October 2024; easily the fastest growing cluster. More on that timing later.

#### <code class="mellow">Mellow</code> (Cluster 4, [Playlist](https://open.spotify.com/playlist/67kgiiBpRUEqGHmzifMKVh)) — 156 songs, 12.5%

Soft, reflective, acoustic-leaning.

**Top 3 defining features:** High `electronic_acoustic` production, high `mood_sad`, low `mood_party`. The opposite of Hard-Rap in almost every way.

**Top artists:** JANNABI, Kanye West (*24*, *Come to Life*), Travis Scott (*Bad Apple*, *sdp interlude*), Glass Animals, Yumi Arai, Marty Robbins.

**What it sounds like:** Late night drives. Rain on windows. The playlist you put on when you're in your feelings but not trying to wallow.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/subclusters/Mellow_subclusters/index.html" width="100%" height="350px"></iframe>

*3D UMAP visualization of <code class="mellow">Mellow</code> sub-clusters*

Although I saw the high `mood_sad`, shuffling through the playlist made me feel like it's mellow with 2 moods. Subclustering with KNN (k=2) further revealed:

- **<code class="mellow-hopecore">Mellow-Hopecore</code> (Cluster 4.0, [Playlist](https://open.spotify.com/playlist/0xe4HFUZ0EefL4542Fcext)) — 97 songs, 62.2%:** Hopeful calm. On God Kanye, SDP Interlude Travis, Latin folk. Lower `mood_sad`, lower `danceability` (in the *Essentia* sense), less `electronic_acoustic` than 4.1. The "things will be okay" playlist. One of my favorite (sub)clusters.

- **<code class="mellow-sadcore">Mellow-Sadcore</code> (Cluster 4.1, [Playlist](https://open.spotify.com/playlist/5TxF9kfvBJlyiRKpLoAbwK)) — 59 songs, 37.8%:** Sad calm. JANNABI, Glass Animals, Mustafa. Higher `mood_sad`, higher `danceability`, more `electronic_acoustic`. The "things are not okay but at least the music is pretty" playlist.

#### Overview

The dissimilarity matrix validates that the clusters are fairly different. <code class="narrative-rap">Narrative-Rap</code> and <code class="mellow">Mellow</code> are the closest pair (d = 0.59), both introspective and emotionally weighted. <code class="hard-rap">Hard-Rap</code> and <code class="narrative-rap">Narrative-Rap</code> are also close (d = 0.67), sharing rap conventions despite diverging in lyrical tone. This matters because the clustering respects the gradients I actually perceive: rap stays near rap, reflective stays near reflective. <code class="mellow-sadcore">Mellow-Sadcore</code> is even closer to <code class="narrative-rap">Narrative-Rap</code>.

<code class="hard-rap">Hard-Rap</code> and <code class="jazz-fusion">Jazz-Fusion</code> are the most distant pair (d = 1.51). The features driving this are instrumentalness (*Cohen's d* = -6.37), language (3.63), lyric explicitness (3.34), and lyric arousal (2.95). One cluster is vocal-heavy, English-dominant, explicit, and high-energy. The other is instrumental, language-neutral, clean, and calm. They represent opposite ends of the feature space, which is exactly what I'd expect given how differently they function in my listening habits.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/overview/cluster_similarity_matrix/index.html" width="100%" height="600px"></iframe>

*Cluster dissimilarity matrix*

### Audio vs. Lyrics Covariance

When I cluster my library using only audio features, then separately cluster using only lyric features, the two clusterings barely agree. The Adjusted Rand Index between audio-only and lyric-only clusterings is 0.092, nearly indistinguishable from random chance (0.0).

The contingency matrix below shows this. Each cell counts how many songs fall into a given audio cluster (row) and lyric cluster (column). If the two modalities agreed, you'd see high counts along the diagonal. Instead, songs scatter everywhere. A track in Audio Cluster 2 could land in any Lyric Cluster.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/audio_vs_lyrics/contingency_matrix/index.html" width="100%" height="600px"></iframe>

*Audio cluster vs lyric cluster overlap*

This might sound like a problem at first, but it's actually the point. If audio and lyrics produced the same clusters, one of them would be redundant. The low agreement means they capture different information.

#### What each modality is good at

Lyrics produce tighter clusters. The silhouette score for lyric-only clustering is 0.322 (the bigger the more well-separated), compared to 0.096 for audio-only. My guess for why lyrics are better at separating songs into discrete groups is because lyrical content is more categorical: a song is either about heartbreak or it isn't. Audio features are continuous and overlapping: the boundary between "chill" and "sad" is fuzzy.

Audio captures sonic texture that lyrics miss entirely. Two songs can have identical themes (love, loss, flex) but sound completely different. Lyrics can't distinguish lo-fi from trap. Audio can.

#### Genre matters

Hip-hop tracks have 34.4% agreement between audio and lyric clustering. Electronic tracks have 16.4%. In hip-hop, production style and lyrical content are tightly coupled: trap beats go with trap lyrics, conscious production goes with conscious bars. In electronic music, the lyrics (if any) are often textural rather than semantic. A Fred Again track and a Camellia track are both "electronic" sonically but have nothing in common lyrically.

#### Instrumental tracks validate the design

In audio-only clustering, instrumental tracks scatter across multiple clusters based on their sonic properties: jazz ends up separate from EDM ends up separate from ambient. In lyric-only clustering, 88% of instrumentals converge into a single cluster. This is the intended behavior. The neutral lyric values (0.5 for bipolar features, 0 for presence features) collapse instrumental tracks in lyric space while letting audio features differentiate them.

#### Example movements

Some tracks stay put across both clusterings: Lil Baby's "Grace," Tyler's "SMUCKERS," Clipse's "Intro." These are songs where the audio mood matches the lyric mood.

Other tracks shift dramatically. Take Kendrick's "United In Grief" or JID's "Better Days." In audio-only clustering, they land in a cluster I'd call "Introspective Rap": relaxed but aggressive, lower valence, contemplative production. Top artists there are Kanye, Tyler, Kendrick, Drake. In lyric-only clustering, they land in a cluster I'd call "Sad Narratives": high lyric sadness (+170% above library average), storytelling-heavy, low explicitness.

The audio captures how it sounds: chill, introspective production. The lyrics capture what it's about: sad, narrative-driven content. Both clusterings agree these tracks are low-energy and contemplative, but they diverge on the specific emotional flavor. The audio says "relaxed," the lyrics say "sad." That distinction matters.

#### The takeaway

The 33-dimensional space captures complementary information. Songs that sound similar can have wildly different lyrics. Lyrical themes cross audio boundaries. Neither modality alone explains why I saved a track. Both together get closer.

### Genre Analysis

Quick caveat: this "genre" isn't *Spotify metadata*, since access to that metadata has been deprecated. It's from *Essentia's Discogs tagger*, which outputs a 400-way P(genre) distribution per track. So what follows is "what the model thinks this sounds like," not a canonical ground truth.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/genre/genre_family_pie/index.html" width="100%" height="500px"></iframe>

Generally, the distribution confirms the obvious: I'm hip-hop heavy. Trap + Cloud Rap dominate, then Electronic, then Rock. Hip Hop is steadily losing share quarter-over-quarter (still #1, but no longer the entire identity), while Electronic is the big climber, going from "barely present" to competing for dominance by late 2025.

<iframe width="100%" height="600px" src="https://islamtayeb.github.io/harmonia/export/visualizations/temporal/genre_trends_proportion/index.html"></iframe>

*Genre trends by quarter*

### Temporal Analysis

With clusters defined and features validated, I wanted to see how my taste evolved over time. Note: timestamps are only reliable post-July 2024.<sup class="footnote-ref" id="fnref-6"><a href="#fn-6">6</a></sup>

First, the baseline. My library skews heavily toward 2010s and 2020s releases. The older tail (1960s jazz, 1970s Latin folk) is almost entirely from the summer.

<iframe src="https://islamtayeb.github.io/harmonia/export/visualizations/temporal/release_decade_pie/index.html" width="100%" height="500px"></iframe>

*Songs by release decade*

The extremes tell the story. The oldest songs are jazz standards and cowboy ballads; the newest are whatever dropped last week.

<div class="table-pair"><table><thead><tr><th>Oldest</th><th>Artist</th><th>Year</th></tr></thead><tbody><tr><td>Big Iron</td><td>Marty Robbins</td><td>1959</td></tr><tr><td>Take Five</td><td>The Dave Brubeck Quartet</td><td>1959</td></tr><tr><td>Giant Steps</td><td>John Coltrane</td><td>1960</td></tr><tr><td>Saudade Vem Correndo</td><td>Stan Getz, Luiz Bonfá</td><td>1963</td></tr><tr><td>Tall Handsome Stranger</td><td>Marty Robbins</td><td>1963</td></tr></tbody></table><table><thead><tr><th>Newest</th><th>Artist</th><th>Year</th></tr></thead><tbody><tr><td>solo</td><td>Fred again.., Blanco</td><td>2025</td></tr><tr><td>Shock The World</td><td>That Boy Franco</td><td>2025</td></tr><tr><td>Muevelou (Pocoyo Song)</td><td>Vic</td><td>2025</td></tr><tr><td>I Run</td><td>4dawgs</td><td>2025</td></tr><tr><td>California Games</td><td>Armand Hammer, The Alchemist</td><td>2025</td></tr></tbody></table></div>

<iframe width="100%" height="600px" src="https://islamtayeb.github.io/harmonia/export/visualizations/temporal/cluster_trends/index.html"></iframe>

*Cluster share of additions by quarter*

The overall mood profile stays fairly stable over time, but clear changes in my library corresponded to specific people and moments. I could trace two of them immediately.

#### Summer 2024: Internship, California

At my internship, Connor kept putting me on Latin folk and jazz-adjacent stuff. Berni was a big EDM guy back in the day and reminded me of the European EDM heads I used to know from osu!. Christian introduced me to Masayoshi Takanaka on our ride to Yosemite that summer, and I've been hooked on Japanese jazz fusion since. In my head, all of it was just "work music."

In the cluster chart, you can see <code class="jazz-fusion">Jazz-Fusion</code> spawn. It went from 0.83% of additions in Q2 to 8.63% in Q3, then 14.70% in Q4. Instrumental, relaxed, interesting enough to keep me locked in while working. The mood profile shifted too: `mood_relaxed` climbed through July and August as I added more of this stuff. Once that slot exists in your day, it stays.

#### Fall 2024: Blue Lock edits at 2am

Around fall 2024, my brother started sending me Blue Lock anime edits. I *really* liked "l'etoile d'afrique - #18" by VDYCD from one of them, and that sent me down a phonk and opium rabbit hole. I was listening to this stuff super hard. The aggressive, high-energy production fit right into the <code class="rhythm-game-edm">Rhythm-Game-EDM</code> cluster, but the lyrical content (when there was any) was darker, more confrontational. Another person, another slot carved out.

#### Fall 2025: Fall break in the common room

Over fall break, a few friends and I ended up on a Spotify playlist of popular osu! beatmaps. I thought it'd be a one-night nostalgia trip.

<code class="rhythm-game-edm">Rhythm-Game-EDM</code> went from 1.65% in Q2 to 9.100% in Q4. That weekend reminded me of how fire osu! music was. You can see `mood_party` and engagement spike around October because of it in the mood profile. High valence, high energy, very electronic. The cluster is loud in feature space, so it's easy for the model to catch. But the real reason it stuck is that it already had a place in my head. That weekend just reminded me it was there.

<iframe width="100%" height="600px" src="https://islamtayeb.github.io/harmonia/export/visualizations/temporal/mood_trends/index.html"></iframe>

*Cumulative mood profile over time*

Connor gave me Latin folk. Christian gave me Takanaka on the aux. My brother's Blue Lock edits at 2am sent me down the phonk hole. Claire and that night in the Cube reopened a dormant folder. Each person carved out a slot, and the slots stuck.

There are moments I can't timestamp. That March I quit premed. The 2010s Kanye era that built the foundation for my taste. I wish I could trace those too. But what I can say: my taste isn't some coherent aesthetic I curated. It's a messy mosaic of people and moments, and I was happy to reminisce while looking at the data.

The clusters are just statistics. But the people who built them - Connor's Latin folk, Christian's aux on the drive to Yosemite, my brother's Blue Lock edits at 2am - they're the actual structure underneath.

### Future Work

Two extensions would make this practical:

The obvious next step is **auto-sorting**. I could pipe new liked songs through the model and automatically assign them to cluster-based playlists.

The more interesting direction is **interpretable recommendations**. Current systems are black boxes; you don't know why Spotify suggested something, not to mention that it's usually pretty ass in my experience. With named dimensions, you could show: "Recommended because: high energy, similar lyric themes, acoustic production." Given the *[Anna's Archive scrape](https://annas-archive.li/blog/backing-up-spotify.html)*, anyone can now study how Spotify's internal features relate to user behavior. These 33 dimensions are a starting point for building something more transparent.

It'd be worth **tuning the weights of each dimension** to see if I can squeeze out better clusters as well. A labeled validation set of 50 songs would replace shuffle-and-check.

Honestly though, the temporal analysis alone was worth the project. Seeing which clusters grew, which shrank, which appeared from nowhere.

## Part 5: Afterword

### What I Learned About My Taste

*59%* of my library is <code class="hard-rap">Hard-Rap</code>.

But the more interesting findings were the phases I'd forgotten I was having. Remembering my summer days listening to Connor's Latin folk playlist in the office, the lock-in I had that fall break with friends, that March where I quit premed. The genre trends tell the same story at a higher level: trap declining, electronic rising, jazz appearing from nowhere. My taste isn't some coherent aesthetic I curated. It's a messy mosaic of people and moments, and I was happy to reminisce while looking at the data.

### Technical Notes

I have a lot of trouble with silent errors when using LLMs for coding. There were multiple times where Claude would insert a fallback value "for safety," but a simple bug would cause it to *always* default to that fallback. I'd only catch this bug empirically, shuffling through clusters and often sloppy code. I added a note to my `.CLAUDE` file: never put fallback values unless explicitly specified.

From a data science perspective, this whole project was "vibey" in a way that made me uncomfortable at first. I didn't optimize silhouette scores or run formal ablations. Earlier I said vibes-based debugging was insufficient. That's true for *feature selection*, but for *cluster validation*, my intuition is the only ground truth. If a cluster doesn't match my mental model, then it's fair to call it false. At the end of the day, this is merely an exploration at a pipeline that mimics my mental model of music.

The full codebase, including data processing pipelines, clustering implementations, and visualization generation, is available on [GitHub](https://github.com/IslamTayeb/harmonia). You may follow the `README.md` on how to do this for your library, albeit it might take you 6-9 hours if you're on a MacBook.

Some readers informed me that they had to refresh to view the figures/embeds too, so please try to hard refresh (`Ctrl + Shift + R` on Windows, `⌘ + Shift + R` on Mac) if you're unable to see them while I try to understand what's wrong. My guess is the large (~500KB cumulative) sizes.

### The State of Music + Tech

The embedding models were disappointing. MERT, CLAP, and Discogs-EffNet all produced garbage clusters when I used them as-is. They're optimized for their training objectives (masked prediction, genre tagging), not for the distinctions I care about. More broadly: so much AI research focuses on language and video. Music feels neglected. The classification models disagreed with my intuition 30-40% of the time, the embeddings don't transfer well to personal-scale analysis, and there's so much low-hanging fruit for anyone willing to build in the open.

I'm also heavily disappointed in Spotify and other music streaming platforms. As a self-proclaimed time waster [power-user](https://apmoverflow.xyz/on-using-computers), I'm disappointed by the lack of power tools in this space. You have Spotify with a [React Native](https://smallusefultips.com/is-spotify-an-electron-app/) application with a [(near) monopoly](https://www.forbes.com/sites/benjaminlaker/2020/10/28/heres-how-lockdown-has-shown-that-spotify-has-a-sustainability-problem/) over music streaming, but it lacks batch operations, custom sorting, or any programmatic access to your own data. You have Apple Music getting stuck at "Syncing Your Library..." constantly from my experience. TIDAL might've been the closest thing to a power-user (audiophile) experience in music streaming, and it's UX still feels clunkier than iOS 26. I do think [Last.fm](https://last.fm) is very cool, but after using it, it still feels like a metadata junk drawer more than anything.

We've come a long way from glazing 2010s Kanye. Alas, the data was never really the point. The people were.

* * *

<section class="footnotes"><ol><li id="fn-1"><p>No official explanation besides <a href="https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api">this</a> blog post by Spotify, but the timing coincides with increased scrutiny over data access due to wrapper applications. Recently, Anna's Archive released a massive scrape of Spotify's internal data, which makes this project potentially useful beyond self-analysis: you could use these 33 interpretable dimensions to study recommendation biases or build more transparent suggestion systems.<a href="#fnref-1" class="footnote">↩</a></p></li><li id="fn-2"><p>A song can have a low BPM but still feel fast because BPM only measures the underlying pulse, not how many notes happen inside each beat. If the music is written using dense rhythmic subdivisions (like 16th notes, 32nds, or triplets), you hear many note events per beat, which increases event density and makes the surface rhythm feel rapid. Your brain perceives "speed" from how frequently sounds occur, not just from the beat itself. So a 60 BPM track filled with 16th notes can feel faster than a 120 BPM track with sparse quarter notes. This is why some low-BPM songs (and osu! maps) still sound and play fast. And it's why I was initially surprised to see Cochise and LUCKI in here.<a href="#fnref-2" class="footnote">↩</a></p></li><li id="fn-3"><p>For readers unfamiliar with music theory: musical keys are the tonal centers of songs (C, C#, D, D#, E, F, F#, G, G#, A, A#, B). Keys are arranged in a circle because pitch is periodic. After 12 semitones, you return to the same note an octave higher. This means C is one semitone away from B, not eleven steps. Additionally, each key can be in major (bright, happy tonality) or minor (dark, melancholic tonality). A linear encoding would treat C and B as maximally distant, when in reality they're neighbors on the circle.<a href="#fnref-3" class="footnote">↩</a></p></li><li id="fn-4"><p>0.5 is the midpoint of the [0,1] scale, so instrumental tracks sit in the middle rather than at an arbitrary edge. It's not truly equidistant from all categories (that would require one-hot encoding), but it avoids biasing instrumentals toward any particular theme or language. Not clean, but good enough.<a href="#fnref-4" class="footnote">↩</a></p></li><li id="fn-5"><p>My testing here was mostly empirical; this intuition isn't finalized. I wasn't shuffling through 100+ ten-second snippets of each playlist/song, albeit I had to do it for a gut check at some point. I used several diagnostic tools: Cohen's d effect size to identify top distinctive features per cluster, radar charts to compare lyric and audio moods/genres/artists, and UMAP 3D visualizations as a gut check at the start.<a href="#fnref-5" class="footnote">↩</a></p></li><li id="fn-6"><p>Before July 4, 2024, I dumped songs into playlists, then mass-liked everything in one day. So pre-July timestamps are meaningless. Post-July, they're real.<a href="#fnref-6" class="footnote">↩</a></p></li></ol></section>
