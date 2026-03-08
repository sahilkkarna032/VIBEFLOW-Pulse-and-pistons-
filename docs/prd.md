# VibeFlow Music Streaming App Requirements Document

## 1. Application Overview

### 1.1 Application Name
VibeFlow

### 1.2 Application Description
A comprehensive, multi-page music streaming application featuring an adaptive focus engine that dynamically adjusts music recommendations based on user focus levels. The app provides personalized music experiences across multiple focus zones while offering advanced features comparable to Spotify, including social sharing, collaborative playlists, podcast support, and enhanced discovery tools.

## 2. Application Features

### 2.1 Navigation Structure
Implement a 5-Tab Bottom Navigation Bar with the following sections:

**Home Tab**
- Display Adaptive Engine slider (Relaxation Level Bar) at the top for focus score adjustment (0-100) with granular control supporting increments of 1
- The Adaptive Engine slider must be fully functional with instant response and zero delay
- The app dynamically changes playlists and songs being played based on the relaxation level set by the user on this bar with instant response and zero delay
- When user adjusts the relaxation level bar, immediately and automatically switch to appropriate playlist and begin playback based on the current focus zone without any buffering or delay
- Show Recently Played section with horizontal scrolling
- Display Current Focus Mode status indicator
- Show personalized recommendations based on listening history
- Display Jump Back In section for resuming playback
- Show Made For You playlists
- Display an expanded set of relaxation music playlists for the user to choose from
- Each song displayed on the home page includes a like button (heart icon) for users to like individual songs
- Each song displayed on the home page includes a download button for offline listening
- Each playlist displayed on the home page includes a like button (heart icon) for users to like playlists
- Each playlist displayed on the home page includes a download button for offline listening
- Quick Start Sessions section with View All button that must work properly without any delay, expanding to show additional sessions featuring a variety of relaxation music

**Discover Tab**
- Search bar at the top with voice search capability, allowing users to search from the available relaxation music in the app
- Grid-based genre explorer with expanded categories:
  - Language-based genres: English Pop, K-Pop, J-Pop, Latin Music, French Chanson, Spanish Flamenco, Italian Opera, German Schlager, Mandarin Pop, Hindi Bollywood, Arabic Music, Portuguese Fado, Russian Folk
  - Mood-based genres: Happy & Upbeat, Sad & Melancholic, Energetic & Pumped, Calm & Peaceful, Romantic & Intimate, Angry & Intense, Nostalgic & Reflective, Motivational & Inspiring, Dreamy & Ethereal, Dark & Mysterious
  - Activity-based genres: Workout, Study, Party, Sleep, Meditation, Cooking, Driving, Gaming, Reading, Yoga
  - Traditional genre categories: Rock, Pop, Hip-Hop, Electronic, Jazz, Classical, Country, R&B, Indie, Metal
- Curated mood-playlists (e.g., Deep Work, Chill Synth, Morning Motivation)
- Trending tracks section
- New Releases section
- Charts and Top 50 section
- Horizontal scrolling sections for Categories
- Podcast recommendations
- Artist spotlight section

**My Library Tab**
- Vertical list displaying:
  - Liked Songs
  - Liked Playlists
  - Downloaded Albums
  - Custom Focus Profiles
  - Your Playlists (user-created playlists with full playback functionality)
  - Your Podcasts
  - Your Artists (followed artists)
  - Your Albums
- Filter and sort options (Recently Added, Alphabetical, Artist)
- Create Your Own Playlist button at the top of the playlist section with functional playlist creation capability
- Each user-created playlist contains a list of songs that can be played
- Users can click on any playlist to view its songs and play them

**Focus Lab Tab**
- Statistics page with interactive graph visualization
- Display user focus levels over the last 7 days, 30 days, and all time
- Show total listening time
- Display top genres and artists
- Show focus streak tracking
- Listening insights and patterns

**Social Tab**
- Friend Activity feed showing what friends are listening to
- Share track/playlist functionality
- Collaborative playlist creation
- User profile pages
- Follow/Unfollow functionality

### 2.2 Adaptive Engine Core Logic
Manage global state FocusScore (Integer, 0-100) with enhanced granular focus zones:

**Ultra Deep Work Mode (91-100)**
- Filter tracks: is_instrumental = true AND BPM > 130
- Apply black and purple color theme
- Hide social features
- Auto-queue similar high-focus tracks
- Instantly switch to Ultra Deep Work playlists and begin playback with zero delay when relaxation level is set in this range
- Deep Work button must be fully functional with instant response

**Deep Work Mode (76-90)**
- Filter tracks: is_instrumental = true AND BPM 120-130
- Apply black and purple color theme
- Hide social features
- Auto-queue similar high-focus tracks
- Instantly switch to Deep Work playlists and begin playback with zero delay when relaxation level is set in this range
- Deep Work button must be fully functional with instant response

**High Flow State Mode (61-75)**
- Filter tracks: BPM 110-120
- Include genres: Ambient, Lo-Fi, Minimal Techno
- Apply black and purple color theme
- Blend instrumental and vocal tracks
- Instantly switch to High Flow State playlists and begin playback with zero delay when relaxation level is set in this range

**Flow State Mode (41-60)**
- Filter tracks: BPM 90-110
- Include genres: Ambient, Lo-Fi, Minimal Techno
- Apply black and purple color theme
- Blend instrumental and vocal tracks
- Instantly switch to Flow State playlists and begin playback with zero delay when relaxation level is set in this range

**Light Relaxation Mode (21-40)**
- Filter tracks: BPM 70-90
- Include genres: Acoustic, Jazz, Vocal-heavy tracks
- Apply black and purple color theme
- Include podcast recommendations
- Instantly switch to Light Relaxation playlists and begin playback with zero delay when relaxation level is set in this range

**Deep Relaxation Mode (0-20)**
- Filter tracks: BPM < 70
- Include genres: Acoustic, Classical, Ambient, Vocal-heavy tracks
- Apply black and purple color theme
- Include podcast recommendations
- Instantly switch to Deep Relaxation playlists and begin playback with zero delay when relaxation level is set in this range

### 2.3 Smart Player
- Persistent Now Playing bar at bottom of screen
- Expandable full-screen player view with pulsing waveform visualizer
- Waveform speed adjusts based on current track BPM
- Play/Pause/Skip/Previous controls with Neumorphic button styling
- Previous button to play the previous song in the queue
- Shuffle and Repeat controls
- Volume slider
- Lyrics display (scrolling with playback)
- Queue management (view and reorder upcoming tracks)
- Crossfade settings
- Sleep timer
- Share currently playing track
- Add to playlist quick action
- Download button for currently playing track
- Artist and album quick navigation
- Support playback of audio files in various formats
- Instant playlist switching capability with zero buffering when relaxation level changes

### 2.4 Library Management
- Heart icon on every track for liking
- Download button on every track for offline listening
- Heart icon on every playlist for liking
- Download button on every playlist for offline listening
- Real-time addition of track_id to user Liked Songs list upon clicking
- Real-time addition of playlist_id to user Liked Playlists list upon clicking
- Create, edit, and delete custom playlists
- Add tracks to multiple playlists
- User-created playlists support adding songs from the app library
- User-created playlists are fully functional and can play all added songs
- Playlist cover customization
- Playlist description editing
- Download tracks/albums/playlists for offline listening
- Remove downloaded content

### 2.5 Search Functionality
- Real-time search with autocomplete
- Search filters: Tracks, Albums, Artists, Playlists, Podcasts, Profiles
- Recent searches history
- Voice search capability
- Search suggestions based on listening history
- Allow users to search from the available relaxation music in the app

### 2.6 Social Features
- Follow/Unfollow artists and friends
- Share tracks, albums, and playlists via link or social media
- Collaborative playlist creation and editing
- Friend Activity feed
- Public/Private playlist settings
- User profile customization
- Listening statistics sharing

### 2.7 Podcast Support
- Browse podcast categories
- Subscribe to podcasts
- Episode playback with chapter markers
- Playback speed control (0.5x to 2x)
- Sleep timer for podcast episodes
- Download episodes for offline listening

### 2.8 Customizable Focus
- Profile page toggle for Instrumental Only in Deep Work mode
- Custom Focus Profile creation with personalized filters
- Save multiple Focus Profiles
- Schedule Focus Modes for specific times

### 2.9 Queue Management
- View current queue
- Reorder tracks in queue
- Clear queue
- Add tracks to queue
- Save queue as playlist

### 2.10 Recommendations Engine
- Daily Mix playlists based on listening habits
- Discover Weekly personalized playlist
- Release Radar for new music from followed artists
- Radio feature (create station from any track/artist)

### 2.11 UI/UX Styling
- Use black and purple color scheme throughout the app
- Glassmorphism (frosted glass effects) for player background and overlays
- Neumorphic buttons (soft shadows) for player controls
- Bold, sans-serif headers with wide letter spacing
- Instant cross-fade transitions (0ms delay) when switching between Focus Zones
- Skeleton loading states for content
- Pull-to-refresh functionality
- Infinite scroll for content lists
- Responsive grid layouts
- Use realistic, non-AI-generated style album covers for all playlists and tracks
- Relaxation Level Bar supports granular adjustment with increments of 1 (0-100 scale)

## 3. Data Structure

### 3.1 Users Collection
- uid: User unique identifier
- username: User display name
- email: User email address
- profile_picture_url: Profile image URL
- focus_preferences: JSON object storing user preferences
- total_focus_minutes: Integer tracking total focus time
- following_artists: Array of artist IDs
- following_users: Array of user IDs
- followers: Array of user IDs
- created_playlists: Array of playlist IDs
- liked_songs: Array of track IDs
- liked_playlists: Array of playlist IDs
- downloaded_content: Array of content IDs
- listening_history: Array of track play records

### 3.2 Tracks Collection
- id: Track unique identifier
- title: Track title
- artist: Artist name
- artist_id: Artist unique identifier
- album: Album name
- album_id: Album unique identifier
- audio_url: Audio file URL
- cover_url: Cover image URL (realistic, non-AI-generated style)
- bpm: Beats per minute (Integer)
- energy_level: Energy level indicator
- is_instrumental: Boolean flag
- genre: Music genre
- duration: Track duration in seconds
- release_date: Release date
- lyrics: Track lyrics text
- play_count: Total play count

### 3.3 Playlists Collection
- id: Playlist unique identifier
- title: Playlist title
- description: Playlist description
- created_by: Creator user ID
- track_ids: Array of track IDs
- is_curated: Boolean flag indicating curated status
- is_collaborative: Boolean flag for collaborative playlists
- is_public: Boolean flag for public/private status
- cover_url: Playlist cover image URL (realistic, non-AI-generated style)
- followers: Array of user IDs following the playlist
- created_at: Creation timestamp
- updated_at: Last update timestamp
- focus_zone: String indicating which focus zone the playlist belongs to (Ultra Deep Work, Deep Work, High Flow State, Flow State, Light Relaxation, Deep Relaxation)

### 3.4 Artists Collection
- id: Artist unique identifier
- name: Artist name
- bio: Artist biography
- profile_picture_url: Artist profile image URL (realistic, non-AI-generated style)
- genres: Array of genre tags
- followers: Array of user IDs following the artist
- monthly_listeners: Integer count

### 3.5 Albums Collection
- id: Album unique identifier
- title: Album title
- artist_id: Artist unique identifier
- cover_url: Album cover image URL (realistic, non-AI-generated style)
- release_date: Release date
- track_ids: Array of track IDs
- genre: Album genre

### 3.6 Podcasts Collection
- id: Podcast unique identifier
- title: Podcast title
- description: Podcast description
- cover_url: Podcast cover image URL (realistic, non-AI-generated style)
- publisher: Publisher name
- episodes: Array of episode IDs
- subscribers: Array of user IDs

### 3.7 Episodes Collection
- id: Episode unique identifier
- podcast_id: Podcast unique identifier
- title: Episode title
- description: Episode description
- audio_url: Audio file URL
- duration: Episode duration in seconds
- release_date: Release date
- chapter_markers: Array of chapter timestamps

### 3.8 Pre-populated Relaxation Playlists

**Playlist 1: Peaceful Evening (Deep Relaxation Mode: 0-20)**
- Track 1: Moonlight Sonata - Ludwig van Beethoven
- Track 2: Clair de Lune - Claude Debussy
- Track 3: Gymnopédie No.1 - Erik Satie
- Track 4: The Blue Danube - Johann Strauss II
- Track 5: Nocturne in E-flat Major - Frédéric Chopin
- Track 6: Air on the G String - Johann Sebastian Bach
- Track 7: Pavane - Gabriel Fauré
- Track 8: Adagio for Strings - Samuel Barber
- Track 9: Spiegel im Spiegel - Arvo Pärt
- Track 10: Comptine d'un autre été - Yann Tiersen

**Playlist 2: Ocean Waves (Deep Relaxation Mode: 0-20)**
- Track 1: Weightless - Marconi Union
- Track 2: Electra - Airstream
- Track 3: Mellomaniac - DJ Shah
- Track 4: Watermark - Enya
- Track 5: Strawberry Swing - Coldplay
- Track 6: Please Don't Go - Barcelona
- Track 7: Pure Shores - All Saints
- Track 8: Someone Like You - Adele
- Track 9: Canzonetta Sull'aria - Mozart
- Track 10: We Can Fly - Rue du Soleil

**Playlist 3: Zen Garden (Light Relaxation Mode: 21-40)**
- Track 1: Sakura - Traditional Japanese
- Track 2: River Flows in You - Yiruma
- Track 3: A Thousand Years - Christina Perri
- Track 4: Hallelujah - Jeff Buckley
- Track 5: The Scientist - Coldplay
- Track 6: Mad World - Gary Jules
- Track 7: Skinny Love - Bon Iver
- Track 8: Holocene - Bon Iver
- Track 9: To Build a Home - The Cinematic Orchestra
- Track 10: Experience - Ludovico Einaudi

**Playlist 4: Starry Night (Light Relaxation Mode: 21-40)**
- Track 1: Nuvole Bianche - Ludovico Einaudi
- Track 2: Una Mattina - Ludovico Einaudi
- Track 3: Divenire - Ludovico Einaudi
- Track 4: Primavera - Ludovico Einaudi
- Track 5: Fly - Ludovico Einaudi
- Track 6: Nightbook - Ludovico Einaudi
- Track 7: In a Time Lapse - Ludovico Einaudi
- Track 8: Walk - Ludovico Einaudi
- Track 9: Discovery at Night - Ludovico Einaudi
- Track 10: Oltremare - Ludovico Einaudi

**Playlist 5: Rainy Day Comfort (Light Relaxation Mode: 21-40)**
- Track 1: Kiss the Rain - Yiruma
- Track 2: May Be - Yiruma
- Track 3: Love Me - Yiruma
- Track 4: When the Love Falls - Yiruma
- Track 5: Passing By - Yiruma
- Track 6: Spring Time - Yiruma
- Track 7: Do You - Yiruma
- Track 8: Loanna - Yiruma
- Track 9: Wait There - Yiruma
- Track 10: On the Way - Yiruma

**Playlist 16: Tranquil Waters (Deep Relaxation Mode: 0-20)**
- Track 1: Aquarium - Camille Saint-Saëns
- Track 2: The Swan - Camille Saint-Saëns
- Track 3: Morning Mood - Edvard Grieg
- Track 4: Prelude in C Major - Johann Sebastian Bach
- Track 5: Sicilienne - Gabriel Fauré
- Track 6: Meditation from Thaïs - Jules Massenet
- Track 7: Salut d'Amour - Edward Elgar
- Track 8: Liebestraum No. 3 - Franz Liszt
- Track 9: Reverie - Claude Debussy
- Track 10: Arabesque No. 1 - Claude Debussy

**Playlist 17: Sunset Serenity (Light Relaxation Mode: 21-40)**
- Track 1: Somewhere Over the Rainbow - Israel Kamakawiwoʻole
- Track 2: What a Wonderful World - Louis Armstrong
- Track 3: Moon River - Audrey Hepburn
- Track 4: Unchained Melody - The Righteous Brothers
- Track 5: At Last - Etta James
- Track 6: La Vie en Rose - Édith Piaf
- Track 7: Unforgettable - Nat King Cole
- Track 8: The Way You Look Tonight - Frank Sinatra
- Track 9: Dream a Little Dream of Me - Ella Fitzgerald
- Track 10: Cheek to Cheek - Ella Fitzgerald & Louis Armstrong

**Playlist 18: Gentle Breeze (Light Relaxation Mode: 21-40)**
- Track 1: Comptine d'un autre été: L'après-midi - Yann Tiersen
- Track 2: La Valse d'Amélie - Yann Tiersen
- Track 3: Sur le fil - Yann Tiersen
- Track 4: La Dispute - Yann Tiersen
- Track 5: Le Moulin - Yann Tiersen
- Track 6: L'Autre Valse d'Amélie - Yann Tiersen
- Track 7: La Noyée - Yann Tiersen
- Track 8: Les Jours Tristes - Yann Tiersen
- Track 9: Rue des Cascades - Yann Tiersen
- Track 10: Le Banquet - Yann Tiersen

**Playlist 19: Meditation Garden (Deep Relaxation Mode: 0-20)**
- Track 1: Weightless Part 2 - Marconi Union
- Track 2: Watermark - Enya
- Track 3: Only Time - Enya
- Track 4: Caribbean Blue - Enya
- Track 5: Orinoco Flow - Enya
- Track 6: May It Be - Enya
- Track 7: Anywhere Is - Enya
- Track 8: The Memory of Trees - Enya
- Track 9: Shepherd Moons - Enya
- Track 10: Book of Days - Enya

**Playlist 20: Soft Piano Dreams (Light Relaxation Mode: 21-40)**
- Track 1: Comptine d'un autre été - Yann Tiersen
- Track 2: River Flows in You - Yiruma
- Track 3: Nuvole Bianche - Ludovico Einaudi
- Track 4: Kiss the Rain - Yiruma
- Track 5: Una Mattina - Ludovico Einaudi
- Track 6: May Be - Yiruma
- Track 7: Divenire - Ludovico Einaudi
- Track 8: Love Me - Yiruma
- Track 9: Primavera - Ludovico Einaudi
- Track 10: When the Love Falls - Yiruma

### 3.9 Pre-populated Deep Work Playlists

**Playlist 6: Focus Flow (Deep Work Mode: 76-90)**
- Track 1: Strobe - Deadmau5
- Track 2: Opus - Eric Prydz
- Track 3: Midnight City - M83
- Track 4: Intro - The xx
- Track 5: Teardrop - Massive Attack
- Track 6: Windowlicker - Aphex Twin
- Track 7: Breathe - The Prodigy
- Track 8: Born Slippy - Underworld
- Track 9: Porcelain - Moby
- Track 10: Right Here Right Now - Fatboy Slim

**Playlist 7: Deep Concentration (Ultra Deep Work Mode: 91-100)**
- Track 1: Resonance - HOME
- Track 2: A Real Hero - College & Electric Youth
- Track 3: Nightcall - Kavinsky
- Track 4: Odd Look - Kavinsky
- Track 5: Turbo Killer - Carpenter Brut
- Track 6: Roller Mobster - Carpenter Brut
- Track 7: Tech Noir - Gunship
- Track 8: Fly for Your Life - Gunship
- Track 9: Miami Nights - Timecop1983
- Track 10: On the Run - Timecop1983

**Playlist 8: Productivity Boost (Deep Work Mode: 76-90)**
- Track 1: Sandstorm - Darude
- Track 2: Levels - Avicii
- Track 3: Animals - Martin Garrix
- Track 4: Titanium - David Guetta ft. Sia
- Track 5: Wake Me Up - Avicii
- Track 6: Don't You Worry Child - Swedish House Mafia
- Track 7: Clarity - Zedd ft. Foxes
- Track 8: Spectrum - Zedd
- Track 9: Reload - Sebastian Ingrosso & Tommy Trash
- Track 10: Greyhound - Swedish House Mafia

### 3.10 Pre-populated Flow State Playlists

**Playlist 9: Ambient Dreams (Flow State Mode: 41-60)**
- Track 1: An Ending (Ascent) - Brian Eno
- Track 2: Music for Airports - Brian Eno
- Track 3: Avril 14th - Aphex Twin
- Track 4: Rhubarb - Aphex Twin
- Track 5: Flim - Aphex Twin
- Track 6: Xtal - Aphex Twin
- Track 7: Tha - Aphex Twin
- Track 8: Pulsewidth - Aphex Twin
- Track 9: Green Calx - Aphex Twin
- Track 10: Blue Calx - Aphex Twin

**Playlist 10: Lo-Fi Study (High Flow State Mode: 61-75)**
- Track 1: Shiloh - Shiloh Dynasty
- Track 2: I Know You So Well - Shiloh Dynasty
- Track 3: Losing Interest - Shiloh Dynasty
- Track 4: Novocaine - Shiloh Dynasty
- Track 5: 6am Study Session - Lofi Girl
- Track 6: Coffee Shop - Lofi Girl
- Track 7: Rainy Day - Lofi Girl
- Track 8: Late Night Vibes - Lofi Girl
- Track 9: Chill Beats - Lofi Girl
- Track 10: Study Mode - Lofi Girl

### 3.11 Pre-populated Mixed Genre Playlists

**Playlist 11: Global Hits (High Flow State Mode: 61-75)**
- Track 1: Despacito - Luis Fonsi ft. Daddy Yankee
- Track 2: Gangnam Style - PSY
- Track 3: Shape of You - Ed Sheeran
- Track 4: Blinding Lights - The Weeknd
- Track 5: Dance Monkey - Tones and I
- Track 6: Uptown Funk - Mark Ronson ft. Bruno Mars
- Track 7: Havana - Camila Cabello
- Track 8: Old Town Road - Lil Nas X
- Track 9: Bad Guy - Billie Eilish
- Track 10: Señorita - Shawn Mendes & Camila Cabello

**Playlist 12: Rock Classics (Deep Work Mode: 76-90)**
- Track 1: Bohemian Rhapsody - Queen
- Track 2: Stairway to Heaven - Led Zeppelin
- Track 3: Hotel California - Eagles
- Track 4: Sweet Child O' Mine - Guns N' Roses
- Track 5: Smells Like Teen Spirit - Nirvana
- Track 6: Wonderwall - Oasis
- Track 7: Under the Bridge - Red Hot Chili Peppers
- Track 8: Creep - Radiohead
- Track 9: Black Hole Sun - Soundgarden
- Track 10: Come As You Are - Nirvana

**Playlist 13: Hip-Hop Essentials (High Flow State Mode: 61-75)**
- Track 1: Lose Yourself - Eminem
- Track 2: In Da Club - 50 Cent
- Track 3: Juicy - The Notorious B.I.G.
- Track 4: California Love - 2Pac ft. Dr. Dre
- Track 5: Gin and Juice - Snoop Dogg
- Track 6: Nuthin' but a 'G' Thang - Dr. Dre ft. Snoop Dogg
- Track 7: Hypnotize - The Notorious B.I.G.
- Track 8: Still D.R.E. - Dr. Dre ft. Snoop Dogg
- Track 9: Changes - 2Pac
- Track 10: The Real Slim Shady - Eminem

**Playlist 14: Jazz Lounge (Flow State Mode: 41-60)**
- Track 1: Take Five - Dave Brubeck
- Track 2: So What - Miles Davis
- Track 3: My Favorite Things - John Coltrane
- Track 4: Autumn Leaves - Bill Evans
- Track 5: Round Midnight - Thelonious Monk
- Track 6: Blue in Green - Miles Davis
- Track 7: All Blues - Miles Davis
- Track 8: Summertime - Ella Fitzgerald
- Track 9: Fly Me to the Moon - Frank Sinatra
- Track 10: The Girl from Ipanema - Stan Getz & João Gilberto

**Playlist 15: Country Roads (Flow State Mode: 41-60)**
- Track 1: Take Me Home, Country Roads - John Denver
- Track 2: Jolene - Dolly Parton
- Track 3: Ring of Fire - Johnny Cash
- Track 4: Friends in Low Places - Garth Brooks
- Track 5: The Gambler - Kenny Rogers
- Track 6: I Walk the Line - Johnny Cash
- Track 7: 9 to 5 - Dolly Parton
- Track 8: Wagon Wheel - Darius Rucker
- Track 9: Cruise - Florida Georgia Line
- Track 10: Body Like a Back Road - Sam Hunt