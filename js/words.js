(() => {
const WORDS_RO = [
			// obiecte
			"masă", "scaun", "dulap", "oglindă", "cheie", "telefon", "laptop", "televizor", "lanternă", "ceas",
			"pix", "carte", "stilou", "rucsac", "umbrelă", "pernă", "pătură", "frigider", "aragaz", "cuptor",
			"farfurie", "pahar", "lingură", "furculiță", "cuțit", "tigaie", "oală", "ibric", "cană", "sticlă",

			// natură
			"pădure", "munte", "râu", "mare", "lac", "insulă", "plajă", "deșert", "câmpie", "deal",
			"floare", "copac", "frunză", "rădăcină", "iarbă", "nisip", "piatră", "stâncă", "nor", "ploaie",
			"furtună", "zăpadă", "soare", "lună", "stea", "cer", "curcubeu", "vulcan", "gheață", "val",

			// animale
			"câine", "pisică", "cal", "vacă", "oaie", "capră", "porc", "iepure", "urs", "lup",
			"vulpe", "leu", "tigru", "elefant", "girafă", "zebră", "șarpe", "broască", "pește", "delfin",
			"balenă", "rechin", "vultur", "bufniță", "porumbel", "rândunică", "pinguin", "fluture", "albine", "păianjen",

			// mâncare
			"pâine", "brânză", "lapte", "ou", "unt", "miere", "zahăr", "sare", "piper", "orez",
			"paste", "cartof", "morcov", "ceapă", "usturoi", "roșie", "castravete", "ardei", "varză", "salată",
			"măr", "pară", "banană", "portocală", "lămâie", "căpșună", "pepene", "strugure", "prună", "cireașă",

			// oameni & acțiuni
			"prieten", "familie", "copil", "părinte", "profesor", "medic", "dentist", "inginer", "șofer", "artist",
			"cântăreț", "actor", "scriitor", "pictor", "fotograf", "sportiv", "dansator", "bucătar", "jucător", "lider",

			// locuri
			"oraș", "sat", "casă", "bloc", "apartament", "birou", "școală", "liceu", "universitate", "bibliotecă",
			"spital", "farmacie", "magazin", "piață", "restaurant", "cafenea", "parc", "stadion", "gară", "aeroport",

			// transport
			"mașină", "autobuz", "tramvai", "metrou", "tren", "avion", "elicopter", "bicicletă", "motocicletă", "vapor",
			"barcă", "submarin", "rachetă", "taxi", "trotinetă",

			// abstract / diverse
			"timp", "liniște", "zgomot", "viteză", "căldură", "frig", "lumină", "umbră", "energie", "putere",
			"curaj", "frică", "bucurie", "tristețe", "speranță", "răbdare", "noroc", "pace", "haos", "ordine",

			// românesc specific
			"mămăligă", "sarmale", "cozonac", "ciorbă", "zacuscă", "mititei", "bulz", "tocăniță", "friptură", "papanași",
			"pălincă", "țuică", "vișinată", "afinată", "brânză", "telemea", "cașcaval", "smântână", "iaurt", "jumări",


			"ie", "cătrință", "opincă", "brâu", "măramă", "căciulă", "cojoc", "sumar", "chimire", "itari",

			"doină", "horă", "sârbă", "căluș", "lăutari", "fluier", "cobză", "taragot", "vioară", "tobă",

			"colindă", "plugușor", "sorcovă", "mărțișor", "capră", "ursul", "călușari", "colac", "bucium", "clopot",

			"stână", "cioban", "mioară", "turmă", "transhumanță", "baci", "fluier", "băț", "căciulă", "cojoc",

			"prispă", "casă", "șură", "fânar", "coteț", "fântână", "poartă", "gard", "uliță", "prispă",

			"deal", "codru", "poiană", "padiș", "crâng", "luncă", "șes", "pajiște", "munțișor", "izvor",

			"sobă", "plită", "ceaun", "vatră", "lingurar", "donită", "putină", "polonic", "blid", "străchină",

			"târg", "bâlci", "iarmaroc", "piețe", "han", "cârciumă", "crâșmă", "birt", "tavernă", "popas",

			"vorbă", "grai", "accent", "zicală", "proverb", "poveste", "basm", "legendă", "snoavă", "ghicitoare",

			"moș", "babă", "nepot", "fiu", "fiică", "unchi", "mătușă", "verișor", "cumnat", "socru",

			"noroc", "ghinion", "soartă", "haz", "spirit", "fir", "răbdare", "dor", "jale", "bucurie",

			"drum", "potecă", "răscruce", "hotar", "moșie", "ogor", "țarină", "holdă", "arătură", "semănat",

			"paznic", "jandarm", "primar", "învățător", "preot", "dascăl", "călugăr", "stareț", "egumen", "paroh",

			"biserică", "mănăstire", "schit", "troiță", "icoană", "altar", "clopotniță", "catapeteasmă", "lumânare", "tămâie",

			"cetate", "curte", "boier", "voievod", "domnitor", "haiduc", "pandur", "steag", "sabie", "spadă",


			// funny / playful
			"moft", "bufon", "năzdrăvan", "ghiduș", "zbânghiu", "aiurit", "zăpăcit", "trăznit", "bleg",
			"gogoman", "tâmpit", "zurlu", "cașcaval", "burtos", "pufos", "mototol", "ciufulit", "boscorodit", "harababură",

			"bambus", "gogoașă", "clătită", "gogoși", "plăcintă", "chiflă", "covrig", "foietaj", "pufarină", "pateu",

			"ciorăpel", "papuc", "șlapi", "pijamă", "halat", "chiloți", "șosetă", "bască", "șapcă", "pălăriuță",

			"gargară", "bâlbâială", "bolboroseală", "mormăială", "fâsâit", "pocnitură", "bubuitură", "zdrăngăneală", "hârâit", "zgomotel",

			"pisălog", "bârfitor", "morocănos", "bombănitor", "sucit", "pizmă", "fițos", "figuri", "mofturos", "tăcănit",

			"burtică", "năsuc", "ochișor", "mânuță", "picioruș", "funduleț", "urechiușă", "botic", "mustațioară", "bărbiță",

			"ciuf", "moț", "cocoș", "pui", "găină", "gâscă", "rățoi", "curcan", "porumbel", "cioară",

			"claxon", "trompetă", "sirenă", "fluier", "tobă", "poc", "bang", "zbang", "buf", "trosc",

			"teleleu", "aiurea", "anapoda", "varză", "tălmăș-bălmăș", "harcea-parcea", "bulibășeală", "zăpăceală", "încurcătură", "balamuc",

			"joacă", "ghidușie", "păcăleală", "șmecherie", "prostioară", "năzbâtie", "poznă", "glumă", "farsă", "picanterie",


			// random interesting romanian
			"amnar", "briceag", "căldăruș", "cazane", "talaz", "hamac", "felinar", "zbor", "ecou", "oglindire",
			"pumn", "cot", "genunchi", "umeri", "ceafă", "încheietură", "talpă", "degetar", "unghieră", "pernă",
			"alunecare", "scânteie", "clipă", "puls", "freamăt", "tresărire", "vibrație", "ecart", "spirală", "undă",
			"colind", "taină", "tainic", "vestitor", "pribeag", "rătăcitor", "călător", "popas", "chemare", "hotar",
			"busuioc", "pelin", "lavandă", "mac", "sunătoare", "cimbru", "isop", "mentă", "rozmarin", "salvie",
			"amurg", "zor", "miez", "umbră", "lucire", "sclipire", "tremur", "foșnet", "șoaptă", "susur",
			"atelier", "manuscris", "copertă", "siglă", "emblemă", "insignă", "medalie", "trofeu", "plachetă", "diplomă",
			"plută", "cârmă", "ancoră", "cârlig", "pânză", "catarg", "corabie", "galeră", "vâslă", "sfoară",
			"abur", "fum", "cenușă", "jar", "văpaie", "scorie", "magmă", "lavă", "crater", "tuf",
			"cristal", "reflex", "spectru", "prismă", "lentilă", "filtru", "diafragmă", "focus", "claritate", "distorsiune",
			"radar", "sonar", "semnal", "impuls", "frecvență", "interferență", "latență", "releu", "conductor", "izolator",
			"zodie", "horoscop", "astrolab", "talisman", "amuletă", "vrajă", "descântec", "ritual", "simbol", "semn",
			"busolă", "meridian", "paralelă", "azimut", "altitudine", "latitudine", "orizont", "zenit", "nadir", "echinocțiu",
			"tipar", "gravură", "relief", "textură", "patină", "nuanță", "pigment", "contrast", "ton", "umbrire",
			"pavilion", "arcadă", "colonadă", "fronton", "cupolă", "balustradă", "scară", "pasarelă", "belvedere", "loggie",
			"fragil", "elastic", "dens", "poros", "mat", "lucios", "opac", "transparent", "fluid", "solid",
			"miraj", "iluzie", "paradox", "ecou", "abis", "vertij", "enigmă", "mister", "labirint", "portal",


			"far", "busolă", "catarg", "binoclu", "hartă", "pergament", "sigiliu", "amforă", "clepsidră", "candelabru",
			"bumerang", "harpon", "cătușe", "armură", "coif", "spadă", "pumnal", "scut", "arc", "săgeată",
			"carusel", "labirint", "sirenă", "pirat", "viking", "samurai", "gladiator", "magician", "alchimist", "astronaut",
			"templu", "cetate", "castel", "palat", "catacombă", "ruină", "turn", "pod", "tunel", "cavernă",
			"observator", "far", "planetariu", "bibliotecă", "muzeu", "teatru", "cinema", "atelier", "laborator", "seră",
			"vulcan", "gheizer", "canion", "deltă", "fiord", "junglă", "savană", "taiga", "arhipelag", "recif",
			"tornadă", "furtună", "uragan", "viscol", "ceață", "auroră", "eclipsă", "meteor", "cometă", "constelație",
			"corb", "bufniță", "vultur", "șoim", "liliac", "dihor", "vidră", "căprioară", "mistreț", "arici",
			"delfin", "caracatiță", "meduză", "calamar", "rechin", "balenă", "hipocamp", "piranha", "manta",
			"tramvai", "metrou", "telecabină", "teleferic", "dirijabil", "hidroavion", "submarin", "drezină", "trotinetă", "motocicletă",
			"paletă", "șah", "poker", "zar", "darts", "biliard", "pingpong", "skateboard", "parașută", "scafandru",
			"espressor", "mojar", "tel", "răzătoare", "tavă", "strecurătoare", "polonic", "tocător", "borcan", "termos",
			"cafea", "cacao", "scorțișoară", "vanilie", "ghimbir", "cuișoare", "chimen", "coriandru", "busuioc", "rozmarin",
			"tiramisu", "clătită", "gogoși", "cozonac", "sarmale", "ciorbă", "mămăligă", "tocăniță", "friptură", "salată",
			"tâmplar", "fierar", "ceasornicar", "bijutier", "arhitect", "pilot", "navigator", "detectiv", "paramedic", "pompier",
			"fotograf", "regizor", "sculptor", "pictor", "actor", "dansator", "dirijor", "violonist", "chitarist", "tobar",
			"parolă", "criptare", "server", "router", "firewall", "aplicație", "browser", "cursor", "tastatură", "monitor",
			"oglindă", "lanternă", "lupă", "magnet", "baterie", "siguranță", "comutator", "întrerupător", "priză", "cablu",
			"caligrafie", "origami", "mandală", "graffiti", "colaj", "acuarelă", "pânză", "șevalet", "pensulă", "ceramică",
			"tramvai", "felinar", "bulevard", "piațetă", "pasaj", "esplanadă", "promenadă", "faleză", "chei", "port",
			"legendă", "mit", "enigmă", "blestem", "comoară", "hârtie", "jurnal", "scrisoare", "mesaj", "cod"

		];

		const WORDS_EN = [
			// objects
			"table", "chair", "wardrobe", "mirror", "key", "phone", "laptop", "television", "flashlight", "watch",
			"pen", "book", "fountain pen", "umbrella", "pillow", "blanket", "fridge", "stove", "oven",
			"plate", "glass", "spoon", "fork", "knife", "frying pan", "pot", "kettle", "mug", "bottle",

			// nature
			"forest", "mountain", "river", "sea", "lake", "island", "beach", "desert", "plain", "hill",
			"flower", "tree", "leaf", "root", "grass", "sand", "stone", "rock", "cloud", "rain",
			"storm", "snow", "sun", "moon", "star", "sky", "rainbow", "volcano", "ice", "wave",

			// animals
			"dog", "cat", "horse", "cow", "sheep", "goat", "pig", "rabbit", "bear", "wolf",
			"fox", "lion", "tiger", "elephant", "giraffe", "zebra", "snake", "frog", "fish", "dolphin",
			"whale", "shark", "eagle", "owl", "pigeon", "swallow", "penguin", "butterfly", "bees", "spider",

			// food
			"bread", "cheese", "milk", "egg", "butter", "honey", "sugar", "salt", "pepper", "rice",
			"pasta", "potato", "carrot", "onion", "garlic", "tomato", "cucumber", "pepper", "cabbage", "salad",
			"apple", "pear", "banana", "orange", "lemon", "strawberry", "watermelon", "grape", "plum", "cherry",

			// people & roles
			"friend", "family", "child", "parent", "teacher", "doctor", "dentist", "engineer", "driver", "artist",
			"singer", "actor", "writer", "painter", "photographer", "athlete", "dancer", "cook", "player", "leader",

			// places
			"city", "village", "house", "apartment", "office", "school", "university", "library",
			"hospital", "pharmacy", "shop", "market", "restaurant", "cafe", "park", "stadium", "airport",

			// transport
			"car", "bus", "tram", "subway", "train", "airplane", "helicopter", "bicycle", "motorcycle", "ship",
			"boat", "submarine", "rocket", "taxi", "scooter",

			// abstract / general
			"time", "silence", "noise", "speed", "heat", "cold", "light", "shadow", "energy", "power",
			"courage", "fear", "joy", "sadness", "hope", "patience", "luck", "peace", "chaos", "order",

			// rural life
			"sheepfold", "shepherd", "herd", "transhumance", "flute", "stick",

			// village structures
			"porch", "house", "barn", "hayloft", "well", "gate", "fence", "lane",

			// landscapes
			"hill", "clearing", "grove", "meadow", "plain", "pasture", "spring",

			// kitchen / household
			"stove", "cooktop", "cauldron", "hearth", "barrel", "ladle", "bowl",

			// fairs & inns
			"fair", "festival", "markets", "inn", "tavern", "pub", "bar", "tavern", "rest stop",

			// language
			"word", "speech", "accent", "saying", "proverb", "story", "legend", "riddle",

			// family
			"grandfather", "grandmother", "grandchild", "son", "daughter", "uncle", "aunt", "cousin", "brother-in-law", "father-in-law",

			// fate & emotion
			"luck", "fate", "humor", "spirit", "temper", "patience", "longing", "sorrow", "joy",

			// travel & land
			"road", "path", "crossroads", "border", "estate", "field", "farmland", "plowing", "sowing",

			// professions
			"guard", "gendarme", "mayor", "teacher", "priest", "schoolmaster", "monk", "abbot", "hegumen",

			// religion
			"church", "monastery", "hermitage", "icon", "altar", "iconostasis", "candle", "incense",

			// history
			"fortress", "court", "nobleman", "warlord", "ruler", "outlaw", "flag", "sword", "rapier",

			// playful / funny
			"whim", "jester", "mischievous", "playful", "confused", "dizzy", "crazy", "clumsy",
			"fool", "idiot", "loony", "cheesehead", "chubby", "fluffy", "scrunched", "messy-haired", "grumbling", "chaos",

			// sweets & bakery
			"bamboo", "donut", "pancake", "donuts", "pie", "bread roll", "pretzel", "pastry", "puff pastry", "pâté",

			// clothing
			"sock", "slipper", "flip-flops", "pajamas", "robe", "underwear", "sock", "cap", "baseball cap", "small hat",

			// sounds
			"babble", "stutter", "mumbling", "grumble", "rustle", "crack", "boom", "clang", "rattle", "noise",

			// personality
			"nag", "gossip", "grumpy", "complainer", "twisted", "envy", "snobbish", "airs", "fussy", "crazy",

			// birds & farm
			"tuft", "crest", "rooster", "chick", "hen", "goose", "drake", "turkey", "pigeon", "crow",

			// noises
			"horn", "trumpet", "siren", "whistle", "drum", "pop", "bang", "zap", "thud", "crash",

			// chaos words
			"wandering", "nowhere", "upside down", "mess", "jumble", "shambles", "big mess", "confusion", "tangle", "madness",

			// play
			"play", "mischief", "trickery", "scheming", "silliness", "prank", "antic", "joke", "farce", "spice",

			// random / poetic
			"flint", "pocketknife", "ladle", "boilers", "surge", "hammock", "lantern", "flight", "echo", "reflection",

			// extra everyday objects
			"lamp", "remote", "keyboard", "mouse", "charger", "headphones", "speaker", "camera", "tripod", "microphone",
			"wallet", "coin", "notebook", "calendar", "clock", "alarm", "keychain", "sunglasses", "helmet", "backpack",

			// home & rooms
			"kitchen", "bathroom", "bedroom", "living room", "balcony", "garage", "hallway", "stairs", "elevator", "attic",
			"basement", "window", "curtain", "door", "handle", "lock", "carpet", "shelf", "drawer",

			// nature & outdoors
			"valley", "cliff", "cave", "trail", "summit", "waterfall", "stream", "pond", "shore", "coast",
			"breeze", "fog", "mist", "dawn", "sunset", "twilight", "horizon", "thunder", "lightning", "hail",

			// animals (common & fun)
			"mouse", "rat", "hamster", "hedgehog", "squirrel", "deer", "moose", "boar", "camel", "donkey",
			"parrot", "crow", "seagull", "sparrow", "peacock", "swan", "duck", "goose", "turkey", "crane",

			// food & drinks
			"soup", "sandwich", "burger", "pizza", "pasta", "steak", "sausage", "omelette", "salmon", "tuna",
			"coffee", "espresso", "tea", "lemonade", "juice", "smoothie", "milkshake", "beer", "wine", "cocktail",

			// people & roles
			"neighbor", "stranger", "tourist", "guest", "host", "leader", "follower", "manager", "assistant", "volunteer",
			"student", "coach", "referee", "judge", "lawyer", "detective", "journalist", "editor", "designer", "developer",

			// places & buildings
			"mall", "warehouse", "factory", "office", "courthouse", "city hall", "embassy", "hotel", "hostel", "motel",
			"museum", "gallery", "exhibition", "concert hall", "arena", "playground", "zoo", "aquarium", "park bench", "fountain",

			// transport & travel
			"highway", "intersection", "roundabout", "bridge", "tunnel", "parking lot", "garage", "gas station", "checkpoint", "border",
			"suitcase", "passport", "ticket", "boarding pass", "platform", "terminal", "runway", "cockpit", "engine", "propeller",

			// technology
			"website", "app", "profile", "account", "password", "username", "notification", "message", "email", "attachment",
			"upload", "download", "backup", "cloud", "server", "database", "algorithm", "update", "bug", "feature",

			// abstract concepts
			"choice", "decision", "mistake", "chance", "risk", "reward", "goal", "plan", "strategy", "failure",
			"success", "pressure", "stress", "focus", "attention", "memory", "instinct", "intuition", "logic", "belief",

			// emotions & states
			"calm", "anger", "rage", "surprise", "shock", "relief", "pride", "shame", "guilt", "confidence",
			"doubt", "trust", "suspicion", "curiosity", "boredom", "excitement", "fear", "panic", "hope", "despair",

			// actions & verbs (noun-friendly)
			"escape", "chase", "search", "discovery", "arrival", "departure", "collision", "explosion", "rescue", "capture",
			"training", "practice", "competition", "challenge", "test", "trial", "experiment", "investigation", "mission", "quest",

			// time & rhythm
			"moment", "second", "minute", "hour", "deadline", "schedule", "routine", "break", "pause", "delay",
			"beginning", "ending", "cycle", "phase", "turn", "round", "countdown", "timeout", "interval", "tempo",

			// fun / playful
			"banana peel", "cushion", "prank", "trick", "party", "joke", "nickname", "meme", "gif", "sticker",
			"high five", "facepalm", "wink", "shrug", "smirk", "giggle", "laughter", "tease", "mockery", "sarcasm",

			// cinematic / adventure
			"treasure", "map", "clue", "signal", "beacon", "hideout", "escape", "safe", "checkpoint", "ambush",
			"guardian", "watchtower", "gate", "vault", "corridor", "passage", "chamber", "artifact", "relic", "legend"

		];

        window.IMPOSTOR_WORDS = { ro: WORDS_RO, en: WORDS_EN };

        })();