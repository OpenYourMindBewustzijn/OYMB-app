import { useState, useRef, useCallback, useEffect } from "react";

// ─── KLEUREN ─────────────────────────────────────────────────────────────────
const T = {
  black:"#0E0D0B", dark:"#1A1814", mid:"#2C2820",
  rose:"#F984E5", gold:"#C9A96E", sage:"#8A9E8C",
  cream:"#F0EBE1", muted:"rgba(240,235,225,0.55)", mauve:"#D44DBF",
};

const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0E0D0B;font-family:'Jost',sans-serif;color:#F0EBE1}
::-webkit-scrollbar{display:none}
input,textarea{outline:none;font-family:'Jost',sans-serif;font-weight:300}
button{font-family:'Jost',sans-serif;font-weight:300}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes glowPulse{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.1)}}
@keyframes spark{0%{opacity:1;transform:scale(0.5)}60%{opacity:1;transform:scale(2)}100%{opacity:0;transform:scale(2.5)}}
.fu{animation:fadeUp 0.35s ease both}
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MORNING = [
  {id:"m1",emoji:"💧",title:"Mineraalwater",desc:"Groot glas water + citroen + Keltisch zeezout",time:"2 min"},
  {id:"m2",emoji:"🌬",title:"3-6 Ademhaling",desc:"10 ronden — nervus vagus activeren",time:"3 min"},
  {id:"m3",emoji:"🌿",title:"Lichaamsscan",desc:"Waar voel ik spanning? Wat heeft mijn lichaam nodig?",time:"3 min"},
  {id:"m4",emoji:"🎵",title:"Hummen",desc:"2 minuten — nervus vagus stimuleren via stembanden",time:"2 min"},
  {id:"m5",emoji:"🥚",title:"Eiwitrijk ontbijt",desc:"Minimaal 25-30 gram eiwit als basis voor de dag",time:"15 min"},
  {id:"m6",emoji:"✨",title:"Intentie",desc:"Wat heeft mijn lichaam vandaag nodig?",time:"2 min"},
];

const MIDDAY = [
  {id:"d1",emoji:"💧",title:"Glas water drinken",desc:"Hydrateer — je bent waarschijnlijk uitgedroogd",time:"1 min"},
  {id:"d2",emoji:"🚶",title:"Korte beweegpauze",desc:"Sta op, rek jezelf uit, loop even rond",time:"3 min"},
  {id:"d3",emoji:"🌬",title:"5 diepe ademhalingen",desc:"Reset je zenuwstelsel midden op de dag",time:"1 min"},
  {id:"d4",emoji:"☀️",title:"Buiten of bij een raam",desc:"Daglicht reguleert je cortisol en slaap",time:"5 min"},
  {id:"d5",emoji:"🍽",title:"Eiwitrijke lunch",desc:"Bloedsuiker stabiel houden voor de middag",time:"20 min"},
  {id:"d6",emoji:"💬",title:"Check-in met jezelf",desc:"Hoe voel ik mij nu? Wat heeft mijn lichaam nodig?",time:"1 min"},
];

const EVENING = [
  {id:"e1",emoji:"📵",title:"Telefoon weg",desc:"Meldingen uit — begin te vertragen",time:"0 min"},
  {id:"e2",emoji:"🦋",title:"Vlinderhug",desc:"5 minuten — afwisselend links/rechts tikken",time:"5 min"},
  {id:"e3",emoji:"📓",title:"Journaling",desc:"Wat heeft mijn lichaam vandaag gevoeld?",time:"5 min"},
  {id:"e4",emoji:"🌊",title:"4-7-8 Ademhaling",desc:"4 rondes — voor diepe ontspanning en slaap",time:"4 min"},
  {id:"e5",emoji:"💆",title:"Lichaam bedanken",desc:"Hand op hart: 'Dankjewel voor vandaag.'",time:"1 min"},
  {id:"e6",emoji:"🌸",title:"Dankbaarheid",desc:"1 ding waarvan mijn lichaam vandaag heeft genoten",time:"2 min"},
];

const PROTEINS = [
  {name:"Eieren (2 stuks)",p:12,emoji:"🥚"},
  {name:"Griekse yoghurt (150g)",p:15,emoji:"🥛"},
  {name:"Kipfilet (100g)",p:31,emoji:"🍗"},
  {name:"Kwark (200g)",p:22,emoji:"🥣"},
  {name:"Zalm (100g)",p:25,emoji:"🐟"},
  {name:"Tempeh (100g)",p:19,emoji:"🌿"},
  {name:"Linzen (100g)",p:9,emoji:"🫘"},
  {name:"Edamame (100g)",p:11,emoji:"🫛"},
  {name:"Cottage cheese (100g)",p:11,emoji:"🧀"},
  {name:"Tonijn blik (85g)",p:22,emoji:"🐠"},
  {name:"Hennepzaad (30g)",p:10,emoji:"🌱"},
  {name:"Tofu (100g)",p:8,emoji:"⬜"},
];

const BREATHS = [
  {id:"b1",name:"3-6 Ontspanning",inhale:3,hold:0,exhale:6,hold2:0,rounds:10,color:T.rose,benefit:"Kalmeert stress, activeert nervus vagus"},
  {id:"b2",name:"Box Breathing",inhale:4,hold:4,exhale:4,hold2:4,rounds:6,color:T.gold,benefit:"Herstelt focus & controle"},
  {id:"b3",name:"4-7-8 Slaap",inhale:4,hold:7,exhale:8,hold2:0,rounds:4,color:T.sage,benefit:"Diepe ontspanning en betere slaap"},
  {id:"b4",name:"Coherent Ademen",inhale:5,hold:0,exhale:5,hold2:0,rounds:12,color:T.mauve,benefit:"Hartcoherentie en zenuwstelsel balans"},
];

const MODULES = [
  {id:1,emoji:"🌱",color:T.sage,title:"Je bent niet lui, je bent aan het overleven",
   quote:"Misschien dacht je dat er iets mis was met jou. Maar wat als jouw lichaam al die tijd precies deed waarvoor het gemaakt is?",
   sections:[
     {t:"Welkom",b:"Alleen al het feit dat jij dit programma hebt aangeschaft, zegt iets. Het zegt dat jij voelt dat het anders mag.\n\nMisschien herken je jezelf hierin:\n• Je bent altijd moe\n• Je hoofd staat nooit uit\n• Je voelt weinig\n• Je stelt alles uit\n• Je weet wat goed voor je is... maar krijgt jezelf niet in beweging\n\nEr is waarschijnlijk niets mis met jou. Je lichaam probeert je al heel lang veilig te houden."},
     {t:"Mijn verhaal",b:"Jarenlang dacht ik dat ik gewoon harder mijn best moest doen. Ik werkte. Ik zorgde. Ik regelde. Ik stond altijd aan.\n\nVan buiten leek alles prima. Maar van binnen voelde ik me leeg.\n\nTotdat ik ontdekte dat mijn lichaam helemaal niet tegen mij werkte. Mijn lichaam werkte vóór mij. Alleen stond mijn zenuwstelsel al jaren in de overlevingsstand.\n\nDat is precies waarom ik dit programma heb gemaakt."},
     {t:"Wat betekent overleven?",b:"Ons lichaam heeft één taak: overleven. Niet gelukkig zijn. Niet ontspannen. Maar overleven.\n\nWanneer jouw lichaam gevaar ervaart, stelt je zenuwstelsel één vraag:\n\n'Ben ik veilig?'\n\nIs het antwoord nee? Dan schakelt je lichaam automatisch over. Dat is geen keuze. Dat is biologie."},
     {t:"Het lichaam vergeet niet",b:"Je hoofd kan denken: 'Dat is toch allang voorbij.' Maar jouw lichaam denkt daar anders over.\n\nJe zenuwstelsel onthoudt alles. Iedere keer dat jij spanning wegslikt. Iedere keer dat jij doorgaat terwijl je rust nodig hebt.\n\nSlaat jouw lichaam iets op. Niet om jou dwars te zitten. Maar om jou te beschermen."},
   ],
   exercises:[
     {t:"Hoe voelt mijn lichaam vandaag?",prompts:["Hoe voel ik mij op dit moment?","Waar voel ik spanning?","Waar voel ik juist niets?","Welke emoties voel ik?","Wat heeft mijn lichaam vandaag nodig?"]},
     {t:"De lichaamsscan",inst:"Ga rustig zitten of liggen. Sluit je ogen. Adem rustig in en langzaam uit.\n\nBreng je aandacht naar: je kruin → gezicht → kaak → nek → schouders → borst → buik → bekken → benen → voeten.\n\nProbeer niets te veranderen. Alleen waarnemen. Vraag jezelf steeds: 'Wat voel ik hier?'"},
     {t:"Mijn overlevingsgedrag",prompts:["Dit doe ik als ik stress ervaar...","Wat heeft mijn lichaam eigenlijk nodig?"]},
   ],
   aff:"Ik hoef mezelf niet langer te forceren. Mijn lichaam probeert mij veilig te houden. En vanaf vandaag ga ik leren luisteren."},

  {id:2,emoji:"🧠",color:T.gold,title:"Begrijp je zenuwstelsel",
   quote:"Je kunt jezelf pas echt helpen als je begrijpt waarom je lichaam doet wat het doet.",
   sections:[
     {t:"Het beveiligingssysteem",b:"Jouw zenuwstelsel scant de hele dag je omgeving — onbewust. We noemen dit neuroceptie.\n\nJe zenuwstelsel vraagt iedere seconde:\n• Ben ik veilig?\n• Kan ik ontspannen?\n• Is er gevaar?\n\nNog voordat jij erover nadenkt... heeft jouw lichaam al besloten."},
     {t:"De Groene Stand – Veiligheid",b:"Je ademt rustig, voelt verbinding, kunt helder nadenken en geniet.\n\nJe immuunsysteem werkt optimaal. Je hormonen zijn meer in balans. Je lichaam kan herstellen.\n\nDit is de staat waarin genezing plaatsvindt."},
     {t:"De Oranje Stand – Fight & Flight",b:"Fight: controle houden, perfectionisme, alles regelen, moeilijk ontspannen.\n\nFlight: agenda staat vol, je werkt hard, rust voelt ongemakkelijk. Wanneer je eindelijk op de bank zit... pak je alsnog je telefoon.\n\nNiet omdat je lui bent. Maar omdat stilstand onveilig voelt."},
     {t:"De Rode Stand – Freeze",b:"Freeze wordt vaak verkeerd begrepen: 'Ik doe niks. Ik ben lui.'\n\nMaar freeze is één van de slimste overlevingsmechanismen. Wanneer vechten of vluchten niet meer lukt, kiest jouw lichaam voor stilstand.\n\nDat gebeurt niet bewust. Dat gebeurt automatisch."},
   ],
   exercises:[
     {t:"Herken jouw staat",prompts:["Wanneer schiet jij in fight? Wat zijn jouw signalen?","Wanneer schiet jij in flight? Wat zijn jouw signalen?","Wanneer schiet jij in freeze? Wat zijn jouw signalen?"]},
   ],
   aff:"Mijn lichaam is niet mijn vijand. Het is mijn beschermer. Nu ik dit begrijp, kan ik anders reageren."},

  {id:3,emoji:"💫",color:T.rose,title:"Trauma leeft in je lichaam",
   quote:"Je lichaam onthoudt wat je hoofd soms allang vergeten is.",
   sections:[
     {t:"Wat is trauma?",b:"Trauma ontstaat wanneer jouw lichaam tijdens een stressvolle situatie niet de mogelijkheid heeft gehad om de opgebouwde spanning volledig af te maken. De energie blijft hangen.\n\nJouw lichaam blijft alert. Niet omdat het gevaar er nog is. Maar omdat jouw zenuwstelsel denkt dat het gevaar ieder moment terug kan komen."},
     {t:"Grote T en kleine t",b:"Grote T trauma: ernstig ongeluk, geweld, misbruik, oorlog.\n\nKleine t trauma — hier herkennen veel vrouwen zich:\n• Nooit echt gezien worden\n• Altijd sterk moeten zijn\n• Emoties moeten wegstoppen\n• Jarenlang over je eigen grenzen gaan\n\nAls dit jarenlang gebeurt, ervaart jouw zenuwstelsel dat als chronische stress."},
     {t:"Fascia: het bindweefsel",b:"Je lichaam is verbonden door een netwerk van bindweefsel — de fascia. Wanneer jij langdurig stress ervaart, spannen spieren zich aan.\n\nVeel mensen ervaren daardoor: stijve nek, schouders vol spanning, pijnlijke heupen, rugklachten.\n\nNiet omdat er iets kapot is. Maar omdat het lichaam zich al lange tijd beschermt."},
   ],
   exercises:[
     {t:"Waar draag jij spanning?",inst:"Ga rustig staan. Sluit je ogen. Adem drie keer diep in. Voel je lichaam. Leg één hand op de plek van spanning.\n\nVraag jezelf: 'Wat probeer jij mij te vertellen?'",prompts:["Waar voel ik spanning?","Wat probeert mijn lichaam te zeggen?"]},
     {t:"Schud de spanning los",inst:"Zet een timer op 2 minuten. Begin zachtjes te schudden — handen, armen, schouders, benen, heupen, je hele lichaam. Niet mooi. Gewoon los. Adem rustig door.\n\nStop. Blijf 1 minuut stil staan. Voel na."},
   ],
   aff:"Mijn lichaam heeft geleerd zichzelf te beschermen. Vanaf vandaag leer ik luisteren in plaats van vechten."},

  {id:4,emoji:"🌊",color:"#6B9FC4",title:"Reguleer je zenuwstelsel",
   quote:"Je kunt jezelf niet uit een overlevingsstand denken. Je lichaam heeft eerst veiligheid nodig.",
   sections:[
     {t:"Neuroplasticiteit",b:"Jouw zenuwstelsel leert niet door woorden. Het leert door ervaringen. Iedere keer dat jouw lichaam ervaart: 'Ik ben veilig' — wordt er een nieuw paadje aangelegd.\n\nDat is neuroplasticiteit. Je brein en zenuwstelsel kunnen veranderen. Niet in één dag. Maar iedere dag een klein beetje."},
     {t:"De nervus vagus",b:"De nervus vagus is de rem van jouw zenuwstelsel. Wanneer deze zenuw goed functioneert: herstel je sneller na stress, slaap je beter, voel je meer verbinding.\n\nHet mooie is: je kunt hem trainen. Niet door hard te werken, maar door herhaling. Kleine veilige momenten, meerdere keren per dag."},
   ],
   exercises:[
     {t:"3-6 Ademhaling",inst:"Leg één hand op je borst, één hand op je buik.\n\nAdem in door je neus: 3 tellen.\nAdem uit: 6 tellen.\n\nHerhaal minimaal 10 keer.",prompts:["Voel ik verschil?","Waar voel ik ontspanning?"]},
     {t:"Vlinderhug",inst:"Kruis je armen voor je borst. Leg je handen op je bovenarmen. Tik afwisselend links en rechts — rustig. Adem langzaam door. Doe dit 2-5 minuten."},
     {t:"Hummen",inst:"Adem rustig in. Hum tijdens de uitademing. Voel de trilling in je keel, je borst, je gezicht. De nervus vagus loopt langs je stembanden. Doe dit 5 minuten."},
   ],
   aff:"Ik hoef mezelf niet te forceren. Ik mag vertragen. Ik mag voelen. Mijn lichaam leert iedere dag opnieuw dat het veilig is."},

  {id:5,emoji:"🌸",color:T.rose,title:"Van overleven naar leven",
   quote:"Het doel is niet om nooit meer stress te ervaren. Het doel is dat je lichaam weet hoe het terug mag keren naar veiligheid.",
   sections:[
     {t:"Genezing is geen rechte lijn",b:"Je zult momenten blijven hebben waarop je systeem opschakelt. Dat is normaal.\n\nHet verschil is dat je het nu eerder gaat herkennen. En in plaats van jezelf af te wijzen — kun je jezelf ondersteunen.\n\nDat is echte groei."},
     {t:"Thuiskomen",b:"Misschien heb je jarenlang geprobeerd iemand anders te worden. Rustiger. Sterker. Minder gevoelig.\n\nMaar misschien ligt de oplossing niet in veranderen. Misschien ligt de oplossing in thuiskomen. Thuiskomen in jouw lichaam. Door jezelf eindelijk toestemming te geven om te voelen."},
   ],
   exercises:[
     {t:"Mijn signalen",prompts:["Dit zijn mijn eerste signalen van stress...","Dit zijn mijn eerste signalen van freeze...","Dit zijn mijn eerste signalen van herstel..."]},
     {t:"Een brief aan mezelf",inst:"Schrijf een brief aan de versie van jezelf die nog midden in de overlevingsstand zit. Wat zou je haar willen vertellen?",prompts:["Lieve ik..."]},
     {t:"Mijn belofte",prompts:["Vanaf vandaag kies ik ervoor om...","Dit gun ik mezelf..."]},
   ],
   aff:"Ik ben veilig. Ik mag voelen. Ik mag leven. Stap voor stap keer ik terug naar mezelf."},

  {id:6,emoji:"🥗",color:T.gold,title:"Bonus: Voeding voor je zenuwstelsel",
   quote:"Als je lichaam de juiste bouwstoffen mist, blijft herstellen veel moeilijker.",
   sections:[
     {t:"Eiwitten: bouwstenen van herstel",b:"Eiwitten bestaan uit aminozuren — de bouwstenen voor spieren, hormonen, enzymen én neurotransmitters zoals serotonine, dopamine en GABA.\n\nRichtlijn: 1,2 tot 1,8 gram eiwit per kilogram lichaamsgewicht per dag.\n\nGoede bronnen: eieren, kip, vis, Griekse yoghurt, kwark, linzen, tempeh, edamame."},
     {t:"Bloedsuiker en stress",b:"Een dalende bloedsuiker wordt door je lichaam gezien als stress. Je maakt meer cortisol aan.\n\nBouw maaltijden op uit: eiwitten + gezonde vetten + vezels + langzame koolhydraten.\n\nBegin je dag met een groot glas water + citroen + Keltisch zeezout voor mineralen."},
   ],
   exercises:[
     {t:"Voedingsdagboek",prompts:["Ontbijt van gisteren?","Lunch van gisteren?","Avondeten van gisteren?","Hoeveel water gedronken?","Wanneer voelde ik energiedips?"]},
   ],
   aff:"Mijn lichaam verdient echte voeding. Elke maaltijd is een nieuwe kans."},

  {id:7,emoji:"💎",color:T.mauve,title:"Bonus: Mineralen",
   quote:"Zonder voldoende mineralen kan jouw lichaam stress veel moeilijker verwerken.",
   sections:[
     {t:"Waarom mineralen?",b:"Mineralen zijn betrokken bij duizenden processen. Ze zorgen ervoor dat zenuwen communiceren, spieren ontspannen en energie wordt geproduceerd.\n\nWanneer je langdurig stress ervaart, verbruik je meer mineralen. Een tekort maakt je gevoeliger voor stress — een vicieuze cirkel."},
     {t:"Magnesium",b:"Magnesium speelt een rol bij meer dan 300 processen: spierontspanning, zenuwgeleiding, energieproductie, slaap.\n\nMogelijke signalen van een tekort: gespannen spieren, ooglidtrekkingen, slecht slapen, onrust, vermoeidheid, hoofdpijn."},
     {t:"Mijn ochtendritueel",b:"Iedere ochtend:\n• Groot glas water\n• Klein snufje Keltisch zeezout\n• Vers citroensap\n• Rustig opdrinken\n• Dan een eiwitrijk ontbijt\n\nEen liefdevolle manier om te zeggen: 'Ik zorg vandaag voor je.'"},
   ],
   exercises:[
     {t:"Voedingscheck",prompts:["Drink ik voldoende water?","Eet ik dagelijks groenten?","Heb ik regelmatig spierkrampen?","Hoe is mijn energieniveau?","Welke kleine gewoonte ga ik veranderen?"]},
   ],
   aff:"Iedere kleine keuze helpt mijn lichaam herstellen."},

  {id:9,emoji:"🦁",color:"#E8A44A",title:"Hoe dieren ons de weg wijzen: uit de freeze",
   quote:"Dieren schudden stress letterlijk van zich af. Wij mensen zijn dat verleerd. Maar we kunnen het opnieuw leren.",
   sections:[
     {t:"Wat dieren ons leren",b:"Kijk eens naar een zebra die net is ontsnapt aan een leeuw. Wat doet die zebra?

Hij stopt. Hij trilt. Hij schudt zijn hele lichaam uit. En dan... graast hij gewoon weer verder.

Dat is geen zwakte. Dat is biologische intelligentie.

Dieren ontladen spanning automatisch na een bedreiging. Hun zenuwstelsel weet precies wat het moet doen: de opgebouwde vecht-of-vlucht energie afvoeren via beweging en trillen.

Wij mensen doen dat niet meer. We houden ons groot. We gaan weer aan het werk. We nemen de spanning mee.

En dat is precies waarom zo veel vrouwen vastzitten in een chronische overlevingsstand."},
     {t:"Freeze: het meest misbegrepen overlevingsmechanisme",b:"Wanneer een dier wordt aangevallen en niet kan vluchten of vechten... speelt het dood.

Het lichaam bevriest volledig. De hartslag daalt. De pijn wordt gedempt. Het bewustzijn vervaagt.

Dat is freeze.

Bij mensen ziet freeze er zo uit:
• Je wilt iets doen maar kunt jezelf niet in beweging krijgen
• Je ligt op de bank terwijl je weet dat je moet opstaan
• Je kijkt naar je telefoon maar registreert niets
• Je bent aanwezig maar ook niet echt er
• Je voelt je leeg, vlak, verdoofd
• Je reageert niet op berichten
• Alles voelt zwaar en traag

Dit is geen luiheid. Dit is een zenuwstelsel dat heeft besloten: stilstand is de veiligste optie."},
     {t:"Waarom uit freeze komen anders werkt",b:"Het grote misverstand is dat je uit freeze komt door harder je best te doen.

Door jezelf te motiveren.
Door een to-do lijst te maken.
Door 'gewoon te beginnen'.

Maar freeze is een lichamelijke staat — geen mentale keuze.

Je kunt jezelf niet denken uit freeze.

Wat wel helpt:
• Kleine, zachte bewegingen — niet groot of krachtig
• Warmte — een warme douche, een deken, warme thee
• Zintuiglijke prikkels — een geur, een textuur, een geluid
• Rustige aanwezigheid van een ander mens of dier
• Heel langzaam ademen
• De grond onder je voeten voelen

Het gaat erom je zenuwstelsel zacht te laten weten: het gevaar is voorbij. Je kunt nu voorzichtig uit de stilstand komen."},
     {t:"Het trillingsreflex: de sleutel",b:"TRE — Tension & Trauma Releasing Exercises — is gebaseerd op precies dit principe.

Het activeert de natuurlijke trillingsreflex die dieren automatisch gebruiken.

Wanneer je lichaam begint te trillen tijdens TRE, is dat geen zwakte. Dat is je zenuwstelsel dat doet wat het altijd al heeft willen doen:

Ontladen.

Niet denken. Niet begrijpen. Niet verwerken.

Gewoon ontladen.

En na die ontlading? Voelen veel vrouwen een diepe rust die ze al jaren niet meer hebben gevoeld."},
   ],
   exercises:[
     {t:"Uit freeze stappen: de 4-stappen methode",inst:"Wanneer je merkt dat je in freeze zit, doe dit:

Stap 1 — Erken het zonder oordeel
Zeg tegen jezelf: 'Mijn lichaam is nu in freeze. Dat is oké. Dat is veilig.'

Stap 2 — Voel de grond
Zet beide voeten plat op de vloer. Druk ze bewust naar beneden. Voel het contact. Dit vertelt je zenuwstelsel: ik sta op vaste grond.

Stap 3 — Één kleine beweging
Niet opstaan. Niet presteren. Alleen: beweeg één vinger. Dan je hand. Dan je pols. Heel langzaam.

Stap 4 — Adem verlengd uit
Adem in door je neus — 4 tellen. Adem langzaam uit door je mond — 8 tellen. Dit activeert je parasympathisch zenuwstelsel.",prompts:["Hoe voelde ik mij voor de oefening?","Welke stap hielp het meest?","Wat merkte ik in mijn lichaam?"]},
     {t:"Het dierenschud",inst:"Dit is de meest directe manier om je zenuwstelsel te ontladen — precies zoals dieren dat doen.

Ga stevig staan. Voeten op schouderbreedte.

Begin bij je voeten. Maak kleine trilbewegingen — alsof je de koude van je af schudt.

Laat het langzaam opstijgen:
→ Enkels
→ Knieën
→ Heupen — laat ze los bewegen
→ Buik
→ Schouders
→ Armen — schud ze los
→ Handen — laat ze bengelen
→ Hoofd — heel voorzichtig

Doe dit 3 minuten. Niet mooi. Niet gecontroleerd. Gewoon schudden.

Stop dan. Sta stil. Adem. Voel na.

Wat heeft je lichaam losgelaten?",prompts:["Hoe voelde het schudden?","Wat veranderde er in mijn lichaam?","Welke emotie of sensatie kwam op?"]},
     {t:"Warmte als veiligheid",inst:"Wanneer je in diepe freeze zit en beweging te veel voelt:

• Maak een kop warme thee of cacao
• Wikkel een deken om je heen
• Neem een warme douche of bad
• Leg een warmwaterkruik op je buik

Warmte stuurt direct een signaal van veiligheid naar je zenuwstelsel. Het is een van de meest onderschatte regulatietools.

Zeg innerlijk: 'Ik ben veilig. Ik mag warm zijn. Mijn lichaam mag ontdooien.'",prompts:["Welke warmtebron hielp mij vandaag?","Hoe voelde mijn lichaam voor en na?"]},
   ],
   aff:"Mijn lichaam weet hoe het spanning los moet laten. Ik hoef het alleen maar de ruimte te geven. Zoals dieren dat doen — van nature, zonder oordeel."},

  {id:8,emoji:"🌿",color:T.sage,title:"Bonus: De kracht van beweging",
   quote:"Juist op de dagen dat je nergens zin in hebt, heeft je lichaam vaak beweging nodig.",
   sections:[
     {t:"Freeze vs. vermoeidheid",b:"Echte vermoeidheid: je rust en voelt je beter.\n\nFreeze: je rust maar knapt niet op. Je weet wat goed voor je is maar krijgt jezelf niet in beweging.\n\nDat komt omdat jouw zenuwstelsel energie vasthoudt. Niet omdat je geen discipline hebt."},
     {t:"Begin klein",b:"Vraag jezelf: wat is de kleinste beweging die vandaag mogelijk is?\n\nMisschien: één minuut lopen, vijf squats, even rekken, één liedje dansen.\n\nDat is genoeg. Je zenuwstelsel beloont iedere beweging."},
   ],
   exercises:[
     {t:"De één-liedje-regel",inst:"Kies een nummer waar jij blij van wordt. Zet het aan en beweeg — niet mooi, gewoon zoals jouw lichaam wil.",prompts:["Hoe voelde ik mij ervoor?","Hoe voel ik mij nu?"]},
     {t:"Schud spanning los",inst:"Sta stevig. Schud handen, armen, schouders, benen, heupen — je hele lichaam. 2 minuten. Dan 1 minuut stil staan. Voel na."},
   ],
   aff:"Mijn lichaam weet de weg naar herstel. Iedere beweging brengt mij dichter bij mezelf."},
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  wrap: { maxWidth:680, margin:"0 auto", padding:"44px 18px 110px" },
  ey: { fontSize:11, letterSpacing:"0.25em", textTransform:"uppercase", color:T.rose, marginBottom:10, display:"block" },
  h1: { fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,8vw,4.5rem)", fontWeight:300, lineHeight:1.05, marginBottom:18 },
  h2: { fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.5rem,4vw,2.3rem)", fontWeight:300, lineHeight:1.2, marginBottom:14 },
  h3: { fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,3vw,1.5rem)", fontWeight:300, lineHeight:1.3, marginBottom:10 },
  em: { fontStyle:"italic", color:T.rose },
  mu: { color:T.muted, fontSize:14, lineHeight:1.85 },
  card: (extra={}) => ({ background:T.dark, border:"1px solid rgba(249,132,229,0.1)", borderRadius:14, padding:"20px 16px", marginBottom:10, ...extra }),
  btn: (bg=T.rose, fg=T.black) => ({ display:"inline-flex", alignItems:"center", gap:8, background:bg, color:fg, border:"none", cursor:"pointer", fontSize:13, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"13px 24px", borderRadius:50, transition:"all 0.2s", textDecoration:"none", whiteSpace:"nowrap" }),
  sm: { display:"inline-flex", alignItems:"center", gap:6, background:"none", color:T.rose, border:"1px solid rgba(249,132,229,0.3)", cursor:"pointer", fontSize:11, fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"8px 16px", borderRadius:50, transition:"all 0.2s" },
  inp: { width:"100%", background:"rgba(249,132,229,0.05)", border:"1px solid rgba(249,132,229,0.15)", borderRadius:9, padding:"11px 14px", color:T.cream, fontSize:14, marginBottom:10 },
  ta: { width:"100%", background:"rgba(249,132,229,0.05)", border:"1px solid rgba(249,132,229,0.15)", borderRadius:9, padding:"11px 14px", color:T.cream, fontSize:14, minHeight:85, resize:"vertical" },
  row: (active) => ({ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:11, border:`1px solid ${active?"rgba(249,132,229,0.4)":"rgba(249,132,229,0.08)"}`, background:active?"rgba(249,132,229,0.1)":"transparent", cursor:"pointer", marginBottom:7, transition:"all 0.15s" }),
  dot: (active) => ({ width:20, height:20, borderRadius:"50%", border:`1.5px solid ${active?T.rose:"rgba(249,132,229,0.3)"}`, background:active?T.rose:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }),
};

// ─── KLEINE COMPONENTEN ───────────────────────────────────────────────────────
function CheckRow({ item, checked, onToggle }) {
  const [sp, setSp] = useState(false);
  return (
    <div onClick={() => { if (!checked) { setSp(true); setTimeout(() => setSp(false), 700); } onToggle(); }}
      style={{ ...s.row(checked), position:"relative" }}>
      <div style={s.dot(checked)}>
        {checked && <span style={{ color:T.black, fontSize:10, fontWeight:700 }}>✓</span>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, color:checked?T.rose:T.cream }}>{item.emoji} {item.title}</div>
        <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{item.desc} · {item.time}</div>
      </div>
      {sp && <span style={{ position:"absolute", right:10, fontSize:16, color:T.rose, animation:"spark 0.7s ease-out forwards" }}>✦</span>}
      {/* ═══ MEER ═══ */}
      {tab === "meer" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Extra tools & support</span>
          <h2 style={s.h2}>Alles wat je<br/><em style={s.em}>ondersteunt</em></h2>

          {/* Hydratatie tracker */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>💧 Hydratatie vandaag</div>
          <div style={s.card({ border:"1px solid rgba(107,159,196,0.3)", marginBottom:28 })}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", color:"#6B9FC4", lineHeight:1 }}>{water}</div>
                <div style={{ fontSize:11, color:T.muted }}>van 8 glazen</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={s.btn("#6B9FC4")} onClick={() => setWater(w => Math.min(w+1, 8))}>+ Glas</button>
                {water > 0 && <button style={s.sm} onClick={() => setWater(w => Math.max(w-1, 0))}>−</button>}
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({length:8}).map((_,i) => (
                <div key={i} style={{ flex:1, height:32, borderRadius:6, background: i < water ? "#6B9FC4" : "rgba(107,159,196,0.1)", border:"1px solid rgba(107,159,196,0.2)", transition:"background 0.3s", cursor:"pointer" }} onClick={() => setWater(i+1)}/>
              ))}
            </div>
            {water >= 8 && <p style={{ fontSize:13, color:"#6B9FC4", marginTop:12, textAlign:"center" }}>🎉 Dagdoel gehaald! Jouw lichaam dankt je.</p>}
            {water < 3 && water > 0 && <p style={{ fontSize:12, color:T.muted, marginTop:10 }}>Tip: drink een glas water voor je volgende maaltijd.</p>}
          </div>

          {/* Wendy's tip van de week */}
          {wendyTip && (
            <>
              <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🌸 Wendy's tip van de week</div>
              <div style={s.card({ border:`1px solid ${T.rose}25`, marginBottom:28, position:"relative" })}>
                <button onClick={() => setWendyTip(false)} style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>×</button>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:`${T.rose}20`, border:`2px solid ${T.rose}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌸</div>
                  <div>
                    <div style={{ fontSize:13, color:T.rose, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Deze week van Wendy</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontStyle:"italic", color:T.cream, lineHeight:1.65, marginBottom:10 }}>"Jouw lichaam heeft geen perfecte routine nodig. Het heeft consistentie nodig. Eén kleine oefening, elke dag opnieuw — dat verandert meer dan je denkt."</p>
                    <p style={{ fontSize:12, color:T.muted }}>Probeer deze week: elke ochtend 5 diepe ademhalingen voordat je je telefoon pakt.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sessie inplannen */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>📅 Sessie inplannen bij Wendy</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:28 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:20 }}>Klaar voor een persoonlijke begeleiding? Plan een TRE of BRTT sessie in met Wendy.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20een%20sessie%20inplannen" target="_blank" rel="noopener noreferrer" style={s.btn()}>
                📱 Plan via WhatsApp
              </a>
              <a href="https://www.oymb.nl" target="_blank" rel="noopener noreferrer" style={{ ...s.btn(T.dark, T.rose), border:`1px solid ${T.rose}30`, justifyContent:"center" }}>
                🌐 Bekijk oymb.nl
              </a>
            </div>
          </div>

          {/* Voortgangsbadges */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🏆 Jouw badges</div>
          <div style={s.card({ marginBottom:28 })}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { emoji:"🌱", label:"Gestart", earned: true },
                { emoji:"🔥", label:`${streak} dagen`, earned: streak >= 1 },
                { emoji:"💪", label:"Eiwitten", earned: totalP >= 50 },
                { emoji:"💧", label:"Hydratatie", earned: water >= 8 },
                { emoji:"🌅", label:"Ochtend ✓", earned: mPct === 100 },
                { emoji:"🌙", label:"Avond ✓", earned: ePct === 100 },
                { emoji:"📸", label:"Selfie", earned: Object.keys(selfies).length >= 1 },
                { emoji:"📚", label:"Module 1", earned: !!modDone[1] },
              ].map((badge, i) => (
                <div key={i} style={{ textAlign:"center", opacity: badge.earned ? 1 : 0.25 }}>
                  <div style={{ fontSize:28, marginBottom:4, filter: badge.earned ? "none" : "grayscale(100%)" }}>{badge.emoji}</div>
                  <div style={{ fontSize:9, color: badge.earned ? T.rose : T.muted, letterSpacing:"0.05em" }}>{badge.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:16 }}>Verdien badges door de app dagelijks te gebruiken 🌸</p>
          </div>

          {/* Community */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>👥 Community</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:16 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:16 }}>Doe mee met de community van vrouwen die hetzelfde doorlopen. Deel je ervaringen, stel vragen en inspireer elkaar.</p>
            <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20lid%20worden%20van%20de%20community" target="_blank" rel="noopener noreferrer" style={s.btn()}>
              🌸 Word lid van de community
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

function ProgBar({ value, color=T.rose }) {
  return (
    <div style={{ height:3, background:"rgba(249,132,229,0.12)", borderRadius:50, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${value}%`, background:color, borderRadius:50, transition:"width 0.4s ease" }}/>
      {/* ═══ MEER ═══ */}
      {tab === "meer" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Extra tools & support</span>
          <h2 style={s.h2}>Alles wat je<br/><em style={s.em}>ondersteunt</em></h2>

          {/* Hydratatie tracker */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>💧 Hydratatie vandaag</div>
          <div style={s.card({ border:"1px solid rgba(107,159,196,0.3)", marginBottom:28 })}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", color:"#6B9FC4", lineHeight:1 }}>{water}</div>
                <div style={{ fontSize:11, color:T.muted }}>van 8 glazen</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={s.btn("#6B9FC4")} onClick={() => setWater(w => Math.min(w+1, 8))}>+ Glas</button>
                {water > 0 && <button style={s.sm} onClick={() => setWater(w => Math.max(w-1, 0))}>−</button>}
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({length:8}).map((_,i) => (
                <div key={i} style={{ flex:1, height:32, borderRadius:6, background: i < water ? "#6B9FC4" : "rgba(107,159,196,0.1)", border:"1px solid rgba(107,159,196,0.2)", transition:"background 0.3s", cursor:"pointer" }} onClick={() => setWater(i+1)}/>
              ))}
            </div>
            {water >= 8 && <p style={{ fontSize:13, color:"#6B9FC4", marginTop:12, textAlign:"center" }}>🎉 Dagdoel gehaald! Jouw lichaam dankt je.</p>}
            {water < 3 && water > 0 && <p style={{ fontSize:12, color:T.muted, marginTop:10 }}>Tip: drink een glas water voor je volgende maaltijd.</p>}
          </div>

          {/* Wendy's tip van de week */}
          {wendyTip && (
            <>
              <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🌸 Wendy's tip van de week</div>
              <div style={s.card({ border:`1px solid ${T.rose}25`, marginBottom:28, position:"relative" })}>
                <button onClick={() => setWendyTip(false)} style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>×</button>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:`${T.rose}20`, border:`2px solid ${T.rose}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌸</div>
                  <div>
                    <div style={{ fontSize:13, color:T.rose, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Deze week van Wendy</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontStyle:"italic", color:T.cream, lineHeight:1.65, marginBottom:10 }}>"Jouw lichaam heeft geen perfecte routine nodig. Het heeft consistentie nodig. Eén kleine oefening, elke dag opnieuw — dat verandert meer dan je denkt."</p>
                    <p style={{ fontSize:12, color:T.muted }}>Probeer deze week: elke ochtend 5 diepe ademhalingen voordat je je telefoon pakt.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sessie inplannen */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>📅 Sessie inplannen bij Wendy</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:28 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:20 }}>Klaar voor een persoonlijke begeleiding? Plan een TRE of BRTT sessie in met Wendy.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20een%20sessie%20inplannen" target="_blank" rel="noopener noreferrer" style={s.btn()}>
                📱 Plan via WhatsApp
              </a>
              <a href="https://www.oymb.nl" target="_blank" rel="noopener noreferrer" style={{ ...s.btn(T.dark, T.rose), border:`1px solid ${T.rose}30`, justifyContent:"center" }}>
                🌐 Bekijk oymb.nl
              </a>
            </div>
          </div>

          {/* Voortgangsbadges */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🏆 Jouw badges</div>
          <div style={s.card({ marginBottom:28 })}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { emoji:"🌱", label:"Gestart", earned: true },
                { emoji:"🔥", label:`${streak} dagen`, earned: streak >= 1 },
                { emoji:"💪", label:"Eiwitten", earned: totalP >= 50 },
                { emoji:"💧", label:"Hydratatie", earned: water >= 8 },
                { emoji:"🌅", label:"Ochtend ✓", earned: mPct === 100 },
                { emoji:"🌙", label:"Avond ✓", earned: ePct === 100 },
                { emoji:"📸", label:"Selfie", earned: Object.keys(selfies).length >= 1 },
                { emoji:"📚", label:"Module 1", earned: !!modDone[1] },
              ].map((badge, i) => (
                <div key={i} style={{ textAlign:"center", opacity: badge.earned ? 1 : 0.25 }}>
                  <div style={{ fontSize:28, marginBottom:4, filter: badge.earned ? "none" : "grayscale(100%)" }}>{badge.emoji}</div>
                  <div style={{ fontSize:9, color: badge.earned ? T.rose : T.muted, letterSpacing:"0.05em" }}>{badge.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:16 }}>Verdien badges door de app dagelijks te gebruiken 🌸</p>
          </div>

          {/* Community */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>👥 Community</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:16 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:16 }}>Doe mee met de community van vrouwen die hetzelfde doorlopen. Deel je ervaringen, stel vragen en inspireer elkaar.</p>
            <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20lid%20worden%20van%20de%20community" target="_blank" rel="noopener noreferrer" style={s.btn()}>
              🌸 Word lid van de community
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── ADEM TIMER ───────────────────────────────────────────────────────────────
function BreathTimer({ ex }) {
  const phases = [
    { key:"inhale", label:"Adem in", dur:ex.inhale },
    { key:"hold",   label:"Houd vast", dur:ex.hold },
    { key:"exhale", label:"Adem uit", dur:ex.exhale },
    { key:"hold2",  label:"Rust",    dur:ex.hold2 },
  ].filter(p => p.dur > 0);

  const [running, setRunning] = useState(false);
  const [done,    setDone]    = useState(false);
  const [pi,      setPi]      = useState(0);
  const [count,   setCount]   = useState(0);
  const [round,   setRound]   = useState(0);
  const [scale,   setScale]   = useState(1);

  const piRef    = useRef(0);
  const roundRef = useRef(0);
  const tmr      = useRef(null);

  const tick = useCallback(() => {
    setCount(c => {
      const cur = phases[piRef.current];
      if (c + 1 >= cur.dur) {
        const next = (piRef.current + 1) % phases.length;
        piRef.current = next;
        if (next === 0) {
          roundRef.current += 1;
          setRound(roundRef.current);
          if (roundRef.current >= ex.rounds) {
            setRunning(false);
            setDone(true);
            return 0;
          }
        }
        setPi(next);
        setScale(phases[next].key === "inhale" ? 1.38 : phases[next].key === "exhale" ? 0.78 : 1.05);
        return 0;
      }
      return c + 1;
    });
  }, [phases, ex.rounds]);

  useEffect(() => {
    if (running) { tmr.current = setInterval(tick, 1000); }
    else { clearInterval(tmr.current); }
    return () => clearInterval(tmr.current);
  }, [running, tick]);

  const start = () => {
    if (done) { setDone(false); setRound(0); roundRef.current = 0; piRef.current = 0; setPi(0); }
    setScale(1.38); setCount(0); setRunning(true);
  };
  const reset = () => {
    clearInterval(tmr.current);
    setRunning(false); setDone(false); setRound(0); roundRef.current = 0;
    piRef.current = 0; setPi(0); setCount(0); setScale(1);
  };

  const cur = phases[pi] || phases[0];
  const circ = 2 * Math.PI * 72;
  const prog = cur ? (count / cur.dur) * 100 : 0;
  const phaseColor = { inhale:ex.color, hold:`${ex.color}bb`, exhale:"rgba(249,132,229,0.45)", hold2:"rgba(249,132,229,0.25)" };

  return (
    <div style={{ textAlign:"center", padding:"20px 0" }}>
      {/* Circle */}
      <div style={{ position:"relative", width:220, height:220, margin:"0 auto 24px" }}>
        {/* Ambient rings */}
        <div style={{ position:"absolute", inset:-10, borderRadius:"50%", border:`1px solid ${ex.color}15` }}/>
        <div style={{ position:"absolute", inset:-22, borderRadius:"50%", border:`1px solid ${ex.color}08` }}/>
        <svg width="220" height="220" style={{ position:"absolute", inset:0, transform:"rotate(-90deg)" }}>
          <circle cx="110" cy="110" r="72" fill="none" stroke={`${ex.color}18`} strokeWidth="4"/>
          <circle cx="110" cy="110" r="72" fill="none" stroke={ex.color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ - (prog / 100) * circ}
            style={{ transition:"stroke-dashoffset 0.95s linear" }}/>
        </svg>
        {/* Breathing blob */}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{
            width:116, height:116, borderRadius:"50%",
            background:`radial-gradient(circle at 38% 38%, ${ex.color}40, ${ex.color}14)`,
            border:`2px solid ${ex.color}50`,
            transform:`scale(${scale})`,
            transition:"transform 1s ease-in-out",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            boxShadow: running ? `0 0 32px ${ex.color}30` : "none",
          }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:34, color:T.cream, fontWeight:300, lineHeight:1 }}>
              {running ? cur.dur - count : done ? "✓" : "·"}
            </span>
            {running && (
              <span style={{ fontSize:9, color:`${T.cream}70`, letterSpacing:"0.15em", textTransform:"uppercase", marginTop:3 }}>
                {cur.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Phase label */}
      <div style={{ minHeight:28, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:6 }}>
        {done
          ? <p style={{ fontSize:16, color:T.sage }}>Voltooid 🌿 Goed gedaan!</p>
          : running
            ? <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontStyle:"italic", color:phaseColor[cur.key]||T.muted }}>{cur.label}</p>
            : <p style={{ fontSize:12, color:T.muted, letterSpacing:"0.12em", textTransform:"uppercase" }}>Klaar om te beginnen?</p>
        }
      </div>

      {/* Round dots */}
      <div style={{ display:"flex", gap:5, justifyContent:"center", marginBottom:22 }}>
        {Array.from({ length: Math.min(ex.rounds, 12) }).map((_, i) => (
          <div key={i} style={{ width:7, height:7, borderRadius:"50%", background: i < round ? ex.color : `${ex.color}28`, transition:"background 0.3s" }}/>
        ))}
        {ex.rounds > 12 && <span style={{ fontSize:10, color:T.muted }}>+{ex.rounds - 12}</span>}
      </div>

      {!running && !done && (
        <p style={{ fontSize:12, color:T.muted, marginBottom:18 }}>
          {ex.inhale}s in {ex.hold ? `· ${ex.hold}s vast ` : ""}{ex.exhale}s uit{ex.hold2 ? ` · ${ex.hold2}s rust` : ""} · {ex.rounds} rondes
        </p>
      )}

      <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
        <button style={s.btn(ex.color)} onClick={running ? () => setRunning(false) : start}>
          {running ? "Pauzeer" : done ? "Opnieuw" : "Start"}
        </button>
        <button style={s.sm} onClick={reset}>Reset</button>
      </div>
      {/* ═══ MEER ═══ */}
      {tab === "meer" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Extra tools & support</span>
          <h2 style={s.h2}>Alles wat je<br/><em style={s.em}>ondersteunt</em></h2>

          {/* Hydratatie tracker */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>💧 Hydratatie vandaag</div>
          <div style={s.card({ border:"1px solid rgba(107,159,196,0.3)", marginBottom:28 })}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", color:"#6B9FC4", lineHeight:1 }}>{water}</div>
                <div style={{ fontSize:11, color:T.muted }}>van 8 glazen</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={s.btn("#6B9FC4")} onClick={() => setWater(w => Math.min(w+1, 8))}>+ Glas</button>
                {water > 0 && <button style={s.sm} onClick={() => setWater(w => Math.max(w-1, 0))}>−</button>}
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({length:8}).map((_,i) => (
                <div key={i} style={{ flex:1, height:32, borderRadius:6, background: i < water ? "#6B9FC4" : "rgba(107,159,196,0.1)", border:"1px solid rgba(107,159,196,0.2)", transition:"background 0.3s", cursor:"pointer" }} onClick={() => setWater(i+1)}/>
              ))}
            </div>
            {water >= 8 && <p style={{ fontSize:13, color:"#6B9FC4", marginTop:12, textAlign:"center" }}>🎉 Dagdoel gehaald! Jouw lichaam dankt je.</p>}
            {water < 3 && water > 0 && <p style={{ fontSize:12, color:T.muted, marginTop:10 }}>Tip: drink een glas water voor je volgende maaltijd.</p>}
          </div>

          {/* Wendy's tip van de week */}
          {wendyTip && (
            <>
              <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🌸 Wendy's tip van de week</div>
              <div style={s.card({ border:`1px solid ${T.rose}25`, marginBottom:28, position:"relative" })}>
                <button onClick={() => setWendyTip(false)} style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>×</button>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:`${T.rose}20`, border:`2px solid ${T.rose}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌸</div>
                  <div>
                    <div style={{ fontSize:13, color:T.rose, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Deze week van Wendy</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontStyle:"italic", color:T.cream, lineHeight:1.65, marginBottom:10 }}>"Jouw lichaam heeft geen perfecte routine nodig. Het heeft consistentie nodig. Eén kleine oefening, elke dag opnieuw — dat verandert meer dan je denkt."</p>
                    <p style={{ fontSize:12, color:T.muted }}>Probeer deze week: elke ochtend 5 diepe ademhalingen voordat je je telefoon pakt.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sessie inplannen */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>📅 Sessie inplannen bij Wendy</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:28 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:20 }}>Klaar voor een persoonlijke begeleiding? Plan een TRE of BRTT sessie in met Wendy.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20een%20sessie%20inplannen" target="_blank" rel="noopener noreferrer" style={s.btn()}>
                📱 Plan via WhatsApp
              </a>
              <a href="https://www.oymb.nl" target="_blank" rel="noopener noreferrer" style={{ ...s.btn(T.dark, T.rose), border:`1px solid ${T.rose}30`, justifyContent:"center" }}>
                🌐 Bekijk oymb.nl
              </a>
            </div>
          </div>

          {/* Voortgangsbadges */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🏆 Jouw badges</div>
          <div style={s.card({ marginBottom:28 })}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { emoji:"🌱", label:"Gestart", earned: true },
                { emoji:"🔥", label:`${streak} dagen`, earned: streak >= 1 },
                { emoji:"💪", label:"Eiwitten", earned: totalP >= 50 },
                { emoji:"💧", label:"Hydratatie", earned: water >= 8 },
                { emoji:"🌅", label:"Ochtend ✓", earned: mPct === 100 },
                { emoji:"🌙", label:"Avond ✓", earned: ePct === 100 },
                { emoji:"📸", label:"Selfie", earned: Object.keys(selfies).length >= 1 },
                { emoji:"📚", label:"Module 1", earned: !!modDone[1] },
              ].map((badge, i) => (
                <div key={i} style={{ textAlign:"center", opacity: badge.earned ? 1 : 0.25 }}>
                  <div style={{ fontSize:28, marginBottom:4, filter: badge.earned ? "none" : "grayscale(100%)" }}>{badge.emoji}</div>
                  <div style={{ fontSize:9, color: badge.earned ? T.rose : T.muted, letterSpacing:"0.05em" }}>{badge.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:16 }}>Verdien badges door de app dagelijks te gebruiken 🌸</p>
          </div>

          {/* Community */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>👥 Community</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:16 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:16 }}>Doe mee met de community van vrouwen die hetzelfde doorlopen. Deel je ervaringen, stel vragen en inspireer elkaar.</p>
            <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20lid%20worden%20van%20de%20community" target="_blank" rel="noopener noreferrer" style={s.btn()}>
              🌸 Word lid van de community
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── HOOFDAPP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,   setScreen]   = useState("hero");
  const [accessCode,  setAccessCode]  = useState("");
  const [accessError, setAccessError] = useState("");
  const [tab,      setTab]      = useState("home");
  const [openMod,  setOpenMod]  = useState(null);
  const [journal,  setJournal]  = useState({});
  const [mDone,    setMDone]    = useState({});
  const [eDone,    setEDone]    = useState({});
  const [pLog,     setPLog]     = useState([]);
  const [weight,   setWeight]   = useState(65);
  const [ciData,   setCiData]   = useState({});
  const [ciResult, setCiResult] = useState(null);
  const [selBreath,setSelBreath]= useState(null);
  const [streak,   setStreak]   = useState(4);
  const [sos,      setSos]      = useState(false);
  const [modDone,  setModDone]  = useState({});
  const [selfies,  setSelfies]  = useState({});
  const [logList,  setLogList]  = useState([]);
  const [logForm,  setLogForm]  = useState({ mood:"", energy:"", body:[], win:"", note:"", gratitude:"" });
  const [logSaved, setLogSaved] = useState(false);
  const [water,    setWater]    = useState(0);
  const [dDone,    setDDone]    = useState({});
  const [badges,   setBadges]   = useState([]);
  const [wendyTip, setWendyTip] = useState(true);

  const topRef = useRef(null);
  const scrollTop = () => topRef.current?.scrollIntoView({ behavior:"smooth" });

  const CODES = ["OYMB2026", "OVERLEVEN", "WENDY2026", "VANOVERLEVING", "OYMB"];
  const checkAccess = () => {
    if (CODES.includes(accessCode.trim().toUpperCase())) {
      setScreen("app");
      scrollTop();
    } else {
      setAccessError("Deze code is niet geldig. Controleer je code of neem contact op met Wendy.");
    }
  };

  const mPct = Math.round(Object.values(mDone).filter(Boolean).length / MORNING.length * 100);
  const dPct = Math.round(Object.values(dDone).filter(Boolean).length / MIDDAY.length * 100);
  const ePct = Math.round(Object.values(eDone).filter(Boolean).length / EVENING.length * 100);
  const totalP = pLog.reduce((a, n) => { const f = PROTEINS.find(p => p.name === n); return a + (f ? f.p : 0); }, 0);
  const pGoal = Math.round(weight * 1.5);

  const nav = (t) => { setTab(t); setOpenMod(null); setSelBreath(null); scrollTop(); };

  // ── TOEGANG ──
  if (screen === "access") return (
    <div style={{ minHeight:"100svh", background:T.black, color:T.cream, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 24px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(249,132,229,0.12) 0%,transparent 65%)", top:"50%", left:"50%", transform:"translate(-50%,-50%)", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:2, maxWidth:380, width:"100%" }}>
        <div style={{ fontSize:48, marginBottom:20 }}>🌸</div>
        <span style={s.ey}>Open Your Mind Bewustzijn</span>
        <h2 style={{ ...s.h2, marginBottom:8 }}>Welkom bij<br/><em style={s.em}>Van Overleven naar Leven</em></h2>
        <p style={{ ...s.mu, marginBottom:32, fontSize:14 }}>Vul je toegangscode in om de app te openen. Heb je nog geen code? Koop dan toegang via de link hieronder.</p>

        <div style={{ background:T.dark, border:"1px solid rgba(249,132,229,0.2)", borderRadius:16, padding:"28px 24px", marginBottom:20 }}>
          <div style={{ fontSize:12, color:T.muted, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:12 }}>Jouw toegangscode</div>
          <input
            type="text"
            placeholder="Bijv. OYMB2026"
            value={accessCode}
            onChange={e => { setAccessCode(e.target.value.toUpperCase()); setAccessError(""); }}
            onKeyDown={e => e.key === "Enter" && checkAccess()}
            style={{ ...s.inp, textAlign:"center", fontSize:18, letterSpacing:"0.2em", fontWeight:500, marginBottom:16, color:T.rose }}
          />
          {accessError && <p style={{ fontSize:13, color:"#F984E5", marginBottom:12 }}>{accessError}</p>}
          <button style={{ ...s.btn(), width:"100%", justifyContent:"center" }} onClick={checkAccess}>
            Open de app →
          </button>
        </div>

        <div style={{ fontSize:13, color:T.muted, marginBottom:16 }}>Nog geen toegang?</div>
        <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20toegang%20tot%20de%20app%20Van%20Overleven%20naar%20Leven" target="_blank" rel="noopener noreferrer"
          style={{ ...s.btn(T.dark, T.rose), border:"1px solid rgba(249,132,229,0.3)", width:"100%", justifyContent:"center", marginBottom:12 }}>
          📱 Koop toegang via WhatsApp
        </a>
        <p style={{ fontSize:11, color:T.muted, marginTop:16, lineHeight:1.6 }}>Na betaling ontvang je direct je persoonlijke toegangscode.</p>
      </div>
    </div>
  );

  // ── HERO ──
  if (screen === "hero") return (
    <div style={{ minHeight:"100svh", background:T.black, color:T.cream, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"80px 24px", position:"relative", overflow:"hidden" }}>
      <style>{G}</style>
      <div style={{ position:"absolute", width:480, height:480, borderRadius:"50%", background:"radial-gradient(circle,rgba(249,132,229,0.13) 0%,transparent 65%)", top:"50%", left:"50%", animation:"glowPulse 6s ease-in-out infinite", pointerEvents:"none" }}/>
      <div style={{ position:"relative", zIndex:2 }}>
        <span style={s.ey}>Open Your Mind Bewustzijn · Wendy van der Vecht</span>
        <h1 style={s.h1}>Van Overleven<br/><em style={s.em}>naar Leven</em></h1>
        <p style={{ ...s.mu, maxWidth:420, margin:"0 auto 36px" }}>Het programma dat jou helpt terug te keren naar jezelf — via je lichaam, niet via je hoofd.</p>
        <button style={s.btn()} onClick={() => { setScreen("access"); scrollTop(); }}>Start het programma</button>
      </div>
    </div>
  );

  const TABS = [
    { id:"home",    e:"🏠", l:"Home" },
    { id:"modules", e:"📚", l:"Modules" },
    { id:"routine", e:"🌅", l:"Routine" },
    { id:"breath",  e:"🌬", l:"Adem" },
    { id:"selfie",  e:"📸", l:"Selfie" },
    { id:"voeding", e:"🥗", l:"Voeding" },
    { id:"logboek", e:"📓", l:"Dagboek" },
    { id:"meer",    e:"✨", l:"Meer" },
  ];

  return (
    <div style={{ minHeight:"100svh", background:T.black, color:T.cream, fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
      <style>{G}</style>
      <div ref={topRef}/>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(14,13,11,0.96)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(249,132,229,0.1)", display:"flex", overflowX:"auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => nav(t.id)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"10px 6px", background:"none", border:"none", cursor:"pointer", color: tab===t.id ? T.rose : T.muted, borderBottom:`2px solid ${tab===t.id ? T.rose : "transparent"}`, transition:"all 0.2s", flex:1, minWidth:44, flexShrink:0 }}>
            <span style={{ fontSize:15 }}>{t.e}</span>
            <span style={{ fontSize:8, letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{t.l}</span>
          </button>
        ))}
      </div>

      {/* SOS */}
      <div style={{ position:"fixed", bottom:22, right:16, zIndex:100 }}>
        <button onClick={() => setSos(true)} style={{ width:52, height:52, borderRadius:"50%", background:"rgba(160,82,122,0.9)", border:"2px solid rgba(249,132,229,0.4)", color:T.cream, fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(249,132,229,0.2)" }}>🆘</button>
      </div>

      {/* SOS MODAL */}
      {sos && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={() => setSos(false)}>
          <div style={{ background:T.dark, borderRadius:18, padding:28, maxWidth:340, width:"100%", border:"1px solid rgba(249,132,229,0.2)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ ...s.h3, textAlign:"center", marginBottom:8 }}>Even stoppen 🌿</h3>
            <p style={{ ...s.mu, textAlign:"center", fontSize:13, marginBottom:22 }}>Wat heeft je lichaam op dit moment nodig?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20heb%20nu%20ondersteuning%20nodig" target="_blank" rel="noopener noreferrer" style={s.btn(T.rose)}>📱 Bel of app Wendy nu</a>
              <button style={s.btn(T.mid, T.cream)} onClick={() => { nav("breath"); setSelBreath(BREATHS[0]); setSos(false); }}>🌬 Ademhalingsoefening</button>
              <button style={{ ...s.sm, justifyContent:"center" }} onClick={() => setSos(false)}>Sluiten</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HOME ═══ */}
      {tab === "home" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Welkom terug</span>
          <h2 style={s.h2}>Hoe is het met<br/><em style={s.em}>jouw lichaam vandaag?</em></h2>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
            <div style={s.card({ textAlign:"center", border:"1px solid rgba(201,169,110,0.25)" })}>
              <div style={{ fontSize:26, marginBottom:4 }}>🔥</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:T.gold }}>{streak}</div>
              <div style={{ fontSize:11, color:T.muted }}>dagen streak</div>
            </div>
            <div style={s.card({ textAlign:"center", border:"1px solid rgba(249,132,229,0.25)" })}>
              <div style={{ fontSize:26, marginBottom:4 }}>💪</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:T.rose }}>{totalP}g</div>
              <div style={{ fontSize:11, color:T.muted }}>eiwitten vandaag</div>
            </div>
          </div>

          <div style={s.card({ marginBottom:10 })}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13 }}>🌅 Ochtendroutine</span>
              <span style={{ fontSize:13, color:T.gold, fontWeight:500 }}>{mPct}%</span>
            </div>
            <ProgBar value={mPct} color={T.gold}/>
          </div>
          <div style={s.card({ marginBottom:28 })}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13 }}>🌙 Avondroutine</span>
              <span style={{ fontSize:13, color:T.mauve, fontWeight:500 }}>{ePct}%</span>
            </div>
            <ProgBar value={ePct} color={T.mauve}/>
          </div>

          <div style={{ borderLeft:`2px solid ${T.rose}`, paddingLeft:18, marginBottom:28 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", fontStyle:"italic", color:T.muted, lineHeight:1.65 }}>Je lichaam liegt niet. Het vertelt de waarheid die je hoofd probeert te overleven.</p>
            <p style={{ fontSize:11, color:T.rose, marginTop:10 }}>— Liefs Wendy</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {[["📚","Modules","modules"],["🌬","Adem","breath"],["🥗","Voeding","voeding"],["☀️","Check-in","checkin"]].map(([e,l,id]) => (
              <button key={id} onClick={() => nav(id)} style={{ ...s.card({ cursor:"pointer", textAlign:"center", border:"1px solid rgba(249,132,229,0.1)" }) }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{e}</div>
                <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>{l}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ MODULES ═══ */}
      {tab === "modules" && !openMod && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Van Overleven naar Leven</span>
          <h2 style={s.h2}>Jouw <em style={s.em}>programma</em></h2>
          <p style={{ ...s.mu, marginBottom:28 }}>8 modules om je lichaam te leren begrijpen en terug te keren naar veiligheid.</p>
          {MODULES.map(mod => (
            <div key={mod.id} onClick={() => { setOpenMod(mod); scrollTop(); }} style={s.card({ cursor:"pointer", border:`1px solid ${mod.color}20`, position:"relative", overflow:"hidden" })}>
              {modDone[mod.id] && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:mod.color }}/>}
              <div style={{ display:"flex", alignItems:"center", gap:13 }}>
                <div style={{ width:44, height:44, borderRadius:11, background:`${mod.color}18`, border:`1px solid ${mod.color}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{mod.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:mod.color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>Module {mod.id}{modDone[mod.id] ? " · ✓" : ""}</div>
                  <div style={{ fontSize:14, color:T.cream, lineHeight:1.4 }}>{mod.title}</div>
                </div>
                <div style={{ color:T.muted }}>›</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "modules" && openMod && (
        <div style={s.wrap} className="fu">
          <button style={{ ...s.sm, marginBottom:22 }} onClick={() => { setOpenMod(null); scrollTop(); }}>← Terug</button>
          <div style={{ width:44, height:44, borderRadius:11, background:`${openMod.color}20`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:12 }}>{openMod.emoji}</div>
          <span style={{ ...s.ey, color:openMod.color }}>Module {openMod.id}</span>
          <h2 style={s.h2}>{openMod.title}</h2>
          <div style={{ padding:"14px 16px", background:`${openMod.color}10`, borderRadius:11, borderLeft:`3px solid ${openMod.color}`, marginBottom:24 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", fontStyle:"italic", color:T.muted, lineHeight:1.65 }}>{openMod.quote}</p>
          </div>
          {openMod.sections.map((sec, i) => (
            <div key={i} style={s.card({ marginBottom:10 })}>
              <h3 style={s.h3}>{sec.t}</h3>
              <p style={{ ...s.mu, fontSize:14, whiteSpace:"pre-line" }}>{sec.b}</p>
            </div>
          ))}
          {openMod.exercises.length > 0 && (
            <>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:openMod.color, margin:"24px 0 12px" }}>Oefeningen</div>
              {openMod.exercises.map((ex, i) => (
                <div key={i} style={s.card({ border:`1px solid ${openMod.color}18`, marginBottom:10 })}>
                  <h3 style={{ ...s.h3, color:openMod.color }}>{ex.t}</h3>
                  {ex.inst && <p style={{ ...s.mu, fontSize:14, whiteSpace:"pre-line", marginBottom: ex.prompts ? 14 : 0 }}>{ex.inst}</p>}
                  {ex.prompts && ex.prompts.map((p, pi) => (
                    <div key={pi} style={{ marginBottom:12 }}>
                      <div style={{ fontSize:12, color:T.muted, marginBottom:6 }}>{p}</div>
                      <textarea style={s.ta} placeholder="Schrijf hier vrij..."
                        value={journal[`${openMod.id}-${i}-${pi}`] || ""}
                        onChange={e => setJournal(prev => ({ ...prev, [`${openMod.id}-${i}-${pi}`]: e.target.value }))}/>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          <div style={{ textAlign:"center", padding:"26px 18px", background:`${openMod.color}08`, borderRadius:13, border:`1px solid ${openMod.color}12`, marginTop:24, marginBottom:22 }}>
            <div style={{ fontSize:18, marginBottom:10 }}>✨</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", fontStyle:"italic", color:T.cream, lineHeight:1.65 }}>{openMod.aff}</p>
          </div>
          <div style={{ textAlign:"center" }}>
            <button style={s.btn(openMod.color)} onClick={() => { setModDone(p => ({ ...p, [openMod.id]:true })); setOpenMod(null); scrollTop(); }}>✓ Module voltooid</button>
          </div>
        </div>
      )}

      {/* ═══ ROUTINE ═══ */}
      {tab === "routine" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Dagelijkse rituelen</span>
          <h2 style={s.h2}>Jouw <em style={s.em}>routines</em></h2>

          <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.gold, marginBottom:10 }}>🌅 Ochtendroutine — {mPct}%</div>
          <ProgBar value={mPct} color={T.gold}/>
          <div style={{ marginTop:16, marginBottom:32 }}>
            {MORNING.map(item => (
              <CheckRow key={item.id} item={item} checked={!!mDone[item.id]} onToggle={() => setMDone(p => ({ ...p, [item.id]: !p[item.id] }))}/>
            ))}
          </div>

          {mPct === 100 && (
            <div style={s.card({ textAlign:"center", border:`1px solid ${T.gold}30`, marginBottom:24 })}>
              <div style={{ fontSize:28, marginBottom:6 }}>🌟</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:T.gold }}>Ochtendroutine voltooid!</p>
              <p style={{ ...s.mu, fontSize:13, marginTop:6 }}>Jouw lichaam heeft het beste gekregen om goed te beginnen.</p>
            </div>
          )}

          <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.mauve, marginBottom:10 }}>🌙 Avondroutine — {ePct}%</div>
          <ProgBar value={ePct} color={T.mauve}/>
          <div style={{ marginTop:16 }}>
            {EVENING.map(item => (
              <CheckRow key={item.id} item={item} checked={!!eDone[item.id]} onToggle={() => setEDone(p => ({ ...p, [item.id]: !p[item.id] }))}/>
            ))}
          </div>

          {ePct === 100 && (
            <div style={s.card({ textAlign:"center", border:`1px solid ${T.mauve}30`, marginTop:16 })}>
              <div style={{ fontSize:28, marginBottom:6 }}>🌙</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:T.mauve }}>Avondroutine voltooid!</p>
              <p style={{ ...s.mu, fontSize:13, marginTop:6 }}>Welverdiende rust. Jouw lichaam mag nu echt loslaten.</p>
            </div>
          )}

          {/* OVERDAG ROUTINE */}
          <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E8A44A", margin:"36px 0 10px" }}>☀️ Overdag routine — {dPct}%</div>
          <ProgBar value={dPct} color="#E8A44A"/>
          <div style={{ marginTop:16 }}>
            {MIDDAY.map(item => (
              <CheckRow key={item.id} item={item} checked={!!dDone[item.id]} onToggle={() => setDDone(p => ({ ...p, [item.id]: !p[item.id] }))}/>
            ))}
          </div>
          {dPct === 100 && (
            <div style={s.card({ textAlign:"center", border:"1px solid rgba(232,164,74,0.3)", marginTop:16 })}>
              <div style={{ fontSize:28, marginBottom:6 }}>☀️</div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:"#E8A44A" }}>Overdag routine voltooid!</p>
              <p style={{ ...s.mu, fontSize:13, marginTop:6 }}>Jouw lichaam heeft midden op de dag de aandacht gekregen die het verdient.</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ ADEM ═══ */}
      {tab === "breath" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Ademhalingsoefeningen</span>
          <h2 style={s.h2}>Adem je<br/><em style={s.em}>zenuwstelsel rustig</em></h2>
          {!selBreath ? (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {BREATHS.map(ex => (
                <button key={ex.id} style={{ ...s.card({ cursor:"pointer", textAlign:"left", border:`1px solid ${ex.color}22`, display:"flex", alignItems:"center", gap:14 }) }} onClick={() => setSelBreath(ex)}>
                  <div style={{ width:50, height:50, borderRadius:"50%", background:`${ex.color}18`, border:`2px solid ${ex.color}28`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", color:ex.color }}>{ex.inhale}-{ex.exhale}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:14, color:T.cream, marginBottom:3 }}>{ex.name}</div>
                    <div style={{ fontSize:12, color:T.muted }}>{ex.benefit}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="fu">
              <button style={{ ...s.sm, marginBottom:22 }} onClick={() => setSelBreath(null)}>← Terug</button>
              <div style={s.card({ textAlign:"center", border:`1px solid ${selBreath.color}22` })}>
                <h3 style={{ ...s.h3, color:selBreath.color, marginBottom:4 }}>{selBreath.name}</h3>
                <p style={{ ...s.mu, fontSize:13, marginBottom:22 }}>{selBreath.benefit}</p>
                <BreathTimer ex={selBreath}/>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SELFIE ═══ */}
      {tab === "selfie" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Foto progressie</span>
          <h2 style={s.h2}>Zie jouw<br/><em style={s.em}>transformatie</em></h2>
          <p style={{ ...s.mu, marginBottom:24 }}>Maak dagelijks een selfie op hetzelfde tijdstip. Na een paar weken zie je het verschil — meer rust, minder spanning in je gezicht.</p>

          {/* Upload */}
          <div style={s.card({ textAlign:"center", border:"1px solid rgba(249,132,229,0.2)", marginBottom:20, padding:"28px 18px" })}>
            <div style={{ fontSize:44, marginBottom:12 }}>📸</div>
            <h3 style={{ ...s.h3, marginBottom:8 }}>Selfie van vandaag</h3>
            <p style={{ ...s.mu, fontSize:13, marginBottom:20 }}>Zelfde licht, zelfde hoek, zelfde uitdrukking. Laat je schouders zakken voor de foto.</p>
            <label style={{ ...s.btn(), cursor:"pointer" }}>
              📷 Maak of upload selfie
              <input type="file" accept="image/*" capture="user" style={{ display:"none" }}
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    const today = new Date().toISOString().split("T")[0];
                    setSelfies(prev => ({ ...prev, [today]: { src:ev.target.result, date:today } }));
                  };
                  reader.readAsDataURL(file);
                }}/>
            </label>
          </div>

          {/* Tips */}
          <div style={s.card({ marginBottom:20 })}>
            <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>Tips voor consistente foto's</div>
            {["Altijd hetzelfde tijdstip (bijv. elke ochtend na douche)","Zelfde lichtbron — bij voorkeur daglicht bij een raam","Zelfde hoek — frontaal of driekwart","Neutrale uitdrukking — laat je kaak zakken","Let op spanning in je kaak, schouders en ogen"].map((tip, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:7 }}>
                <span style={{ color:T.rose, flexShrink:0 }}>✦</span>
                <span style={{ fontSize:13, color:T.muted }}>{tip}</span>
              </div>
            ))}
          </div>

          {/* Foto grid */}
          {Object.keys(selfies).length > 0 && (
            <>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.rose, marginBottom:14 }}>
                Jouw progressie ({Object.keys(selfies).length} foto's)
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:20 }}>
                {Object.values(selfies).sort((a,b) => b.date > a.date ? 1 : -1).map((sf, i) => (
                  <div key={i} style={{ position:"relative", aspectRatio:"3/4", borderRadius:11, overflow:"hidden", border:"1px solid rgba(249,132,229,0.15)" }}>
                    <img src={sf.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(14,13,11,0.8))", padding:"8px 8px 6px" }}>
                      <div style={{ fontSize:10, color:T.cream }}>{sf.date}</div>
                    </div>
                    {i === 0 && <div style={{ position:"absolute", top:6, right:6, background:T.rose, borderRadius:50, padding:"2px 8px", fontSize:9, color:T.black, fontWeight:500 }}>Nieuwste</div>}
                  </div>
                ))}
              </div>
              {Object.keys(selfies).length >= 2 && (
                <div style={s.card({ textAlign:"center", border:"1px solid rgba(138,158,140,0.25)" })}>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", fontStyle:"italic", color:T.sage }}>Je bent al {Object.keys(selfies).length} dagen bezig. Kijk eens naar het verschil in je ogen, je kaak, je schouders.</p>
                </div>
              )}
            </>
          )}

          {/* Wat te zien */}
          <div style={s.card({ marginTop:16 })}>
            <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12 }}>Waar let je op in je foto's?</div>
            {["Ontspanning in je kaak en wangen","Schouders die lager hangen","Ogen die zachter en rustiger kijken","Een gezicht dat minder gespannen staat","Meer kleur en levendigheid in je huid","Meer aanwezigheid in je blik"].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:7 }}>
                <span style={{ color:T.rose, fontSize:11 }}>✓</span>
                <span style={{ fontSize:13, color:T.muted }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ VOEDING ═══ */}
      {tab === "voeding" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Voeding & herstel</span>
          <h2 style={s.h2}>Voed je<br/><em style={s.em}>zenuwstelsel</em></h2>

          {/* Protein tracker */}
          <div style={s.card({ marginBottom:24, border:"1px solid rgba(201,169,110,0.2)" })}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
              <span style={{ fontSize:13 }}>Eiwitten vandaag</span>
              <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:T.gold }}>{totalP}g <span style={{ fontSize:"1rem", color:T.muted }}>/ {pGoal}g</span></span>
            </div>
            <ProgBar value={Math.min(totalP / pGoal * 100, 100)} color={T.gold}/>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:12 }}>
              <span style={{ fontSize:12, color:T.muted }}>Gewicht (kg):</span>
              <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))}
                style={{ ...s.inp, width:68, marginBottom:0, padding:"8px 10px", textAlign:"center" }}/>
              <span style={{ fontSize:12, color:T.muted }}>→ doel {pGoal}g/dag</span>
            </div>
          </div>

          <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.gold, marginBottom:12 }}>Voeg toe wat je hebt gegeten</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
            {PROTEINS.map(food => {
              const n = pLog.filter(x => x === food.name).length;
              return (
                <button key={food.name} onClick={() => setPLog(p => [...p, food.name])}
                  style={{ ...s.card({ cursor:"pointer", textAlign:"left", padding:"12px 12px", border:`1px solid ${n>0?"rgba(201,169,110,0.35)":"rgba(249,132,229,0.08)"}`, background:n>0?"rgba(201,169,110,0.06)":T.dark }) }}>
                  <div style={{ fontSize:18, marginBottom:3 }}>{food.emoji}</div>
                  <div style={{ fontSize:12, color:T.cream, lineHeight:1.3, marginBottom:2 }}>{food.name}</div>
                  <div style={{ fontSize:11, color:T.gold }}>{food.p}g eiwit {n > 0 ? `· ×${n}` : ""}</div>
                </button>
              );
            })}
          </div>
          {pLog.length > 0 && <button style={{ ...s.sm, marginBottom:20 }} onClick={() => setPLog([])}>Log wissen</button>}

          <div style={s.card({ border:"1px solid rgba(249,132,229,0.15)" })}>
            <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>🌅 Ochtend mineraaldrankje</div>
            <p style={{ ...s.mu, fontSize:14 }}>Groot glas water + snufje Keltisch zeezout + vers citroensap. Rustig opdrinken. Dan 60 minuten wachten met koffie. Je lichaam krijgt meteen wat het nodig heeft.</p>
          </div>
        </div>
      )}

      {/* ═══ DAGBOEK (Check-in + Logboek) ═══ */}
      {tab === "logboek" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Dagelijks dagboek</span>
          <h2 style={s.h2}>Hoe is het met<br/><em style={s.em}>jouw lichaam vandaag?</em></h2>
          <p style={{ ...s.mu, marginBottom:28 }}>Vul dit dagelijks in. Vanuit gevoel, niet vanuit je hoofd. Aan het einde krijg je een persoonlijke uitslag én sla je alles op in je logboek.</p>

          {/* ── CHECK-IN VRAGEN ── */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:16, paddingBottom:10, borderBottom:"1px solid rgba(249,132,229,0.12)" }}>☀️ Daily Check-in</div>

          {[
            { id:"gevoel", label:"Hoe voel je je vandaag?", opts:["Uitgeput en leeg","Overprikkeld en gespannen","Onrustig en opgejaagd","Redelijk in balans","Rustig, veilig en verbonden"], sc:[4,3,3,1,0] },
            { id:"lichaam", label:"Hoe aanwezig ben ik in mijn lichaam?", opts:["Bijna geen verbinding","Vooral in mijn hoofd","Redelijke verbinding","Volledig aanwezig","Energiek"], sc:[4,3,1,0,0] },
            { id:"energie", label:"Vanuit welke energie leef ik vandaag?", opts:["Overleven","Controleren","Aanpassen","Pleasen","Doorzetten","Vertragen","Vertrouwen","Ontvangen","Vanuit flow"], sc:[4,3,3,3,2,1,0,0,0] },
          ].map(q => (
            <div key={q.id} style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:500, letterSpacing:"0.15em", textTransform:"uppercase", color:T.rose, marginBottom:10 }}>{q.label}</div>
              {q.opts.map((opt, i) => {
                const sel = ciData[q.id] === i;
                return (
                  <div key={i} onClick={() => setCiData(p => ({ ...p, [q.id]:i }))} style={s.row(sel)}>
                    <div style={s.dot(sel)}>{sel && <div style={{ width:6, height:6, borderRadius:"50%", background:T.black }}/>}</div>
                    <span style={{ fontSize:14, color:sel ? T.rose : T.cream }}>{opt}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Spanning locatie */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:10 }}>Waar voel ik vandaag spanning?</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["Hoofd","Kaak","Nek","Schouders","Borst","Buik","Rug","Benen","Overal","Nergens"].map(tag => {
                const sel = (logForm.body || []).includes(tag);
                return (
                  <button key={tag} onClick={() => setLogForm(p => ({ ...p, body: sel ? p.body.filter(x=>x!==tag) : [...(p.body||[]),tag] }))}
                    style={{ padding:"7px 13px", borderRadius:50, fontSize:12, cursor:"pointer", border:`1px solid ${sel?"rgba(249,132,229,0.45)":"rgba(249,132,229,0.1)"}`, background:sel?"rgba(249,132,229,0.12)":"transparent", color:sel?T.rose:T.muted }}>
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schrijfvragen check-in */}
          {[
            { id:"q1", label:"Wat probeert mijn lichaam mij te vertellen?" },
            { id:"q2", label:"Waar verlang ik werkelijk naar?" },
            { id:"q3", label:"Welke kleine stap kan ik nu zetten?" },
          ].map(q => (
            <div key={q.id} style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:T.rose, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:7 }}>{q.label}</div>
              <textarea style={s.ta} placeholder="..." value={ciData[q.id] || ""}
                onChange={e => setCiData(p => ({ ...p, [q.id]:e.target.value }))}/>
            </div>
          ))}

          {/* ── LOGBOEK VELDEN ── */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", margin:"28px 0 16px", paddingBottom:10, borderBottom:"1px solid rgba(249,132,229,0.12)" }}>📓 Logboek</div>

          {/* Stemming */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:T.rose, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Algemene stemming</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[["😔","Zwaar"],["😟","Gespannen"],["😐","Neutraal"],["🙂","Oké"],["😊","Goed"],["✨","Stralend"]].map(([e,l]) => (
                <button key={l} onClick={() => setLogForm(p => ({ ...p, mood:`${e} ${l}` }))}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 10px", borderRadius:10, border:`1px solid ${logForm.mood===`${e} ${l}`?"rgba(249,132,229,0.5)":"rgba(249,132,229,0.1)"}`, background:logForm.mood===`${e} ${l}`?"rgba(249,132,229,0.12)":"transparent", cursor:"pointer" }}>
                  <span style={{ fontSize:22 }}>{e}</span>
                  <span style={{ fontSize:10, color:T.muted }}>{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energie */}
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:T.rose, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>Energieniveau</div>
            <div style={{ display:"flex", gap:6 }}>
              {[["⚡⚡⚡","Hoog"],["⚡⚡","Midden"],["⚡","Laag"],["💤","Uitgeput"]].map(([e,l]) => (
                <button key={l} onClick={() => setLogForm(p => ({ ...p, energy:`${e} ${l}` }))}
                  style={{ flex:1, padding:"10px 4px", borderRadius:10, textAlign:"center", border:`1px solid ${logForm.energy===`${e} ${l}`?"rgba(201,169,110,0.5)":"rgba(249,132,229,0.1)"}`, background:logForm.energy===`${e} ${l}`?"rgba(201,169,110,0.1)":"transparent", cursor:"pointer" }}>
                  <div style={{ fontSize:14 }}>{e}</div>
                  <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>{l}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Win */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>🏆 Kleine overwinning van vandaag</div>
            <input style={s.inp} placeholder="Ook klein is groot..." value={logForm.win||""} onChange={e => setLogForm(p => ({ ...p, win:e.target.value }))}/>
          </div>

          {/* Notitie */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>📝 Vrije notitie</div>
            <textarea style={{ ...s.ta, minHeight:95 }} placeholder="Geen regels, gewoon schrijven..." value={logForm.note||""} onChange={e => setLogForm(p => ({ ...p, note:e.target.value }))}/>
          </div>

          {/* Dankbaarheid */}
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:11, color:T.muted, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>🌸 Dankbaarheid</div>
            <input style={s.inp} placeholder="1 ding waar ik dankbaar voor ben..." value={logForm.gratitude||""} onChange={e => setLogForm(p => ({ ...p, gratitude:e.target.value }))}/>
          </div>

          {/* Routine samenvatting */}
          <div style={{ display:"flex", gap:12, marginBottom:22, padding:"12px 14px", background:"rgba(249,132,229,0.05)", borderRadius:10 }}>
            <div style={{ fontSize:12, color:T.muted }}>🌅 Ochtend: <span style={{ color:T.gold }}>{mPct}%</span></div>
            <div style={{ fontSize:12, color:T.muted }}>🌙 Avond: <span style={{ color:T.mauve }}>{ePct}%</span></div>
            <div style={{ fontSize:12, color:T.muted }}>💪 Eiwit: <span style={{ color:T.gold }}>{totalP}g</span></div>
          </div>

          {/* OPSLAAN + UITSLAG */}
          <button style={{ ...s.btn(logSaved ? T.sage : T.rose), width:"100%", justifyContent:"center" }} onClick={() => {
            // Bereken check-in score
            const sc = { gevoel:[4,3,3,1,0], lichaam:[4,3,1,0,0], energie:[4,3,3,3,2,1,0,0,0] };
            let total = 0;
            ["gevoel","lichaam","energie"].forEach(k => { if (ciData[k] !== undefined) total += sc[k][ciData[k]] || 0; });
            const states = [
              { max:2, label:"Rustig & verbonden", color:T.sage, title:"Jouw systeem voelt vandaag veilig", body:"Dit is hoe leven voelt als je niet in overleving staat. Onthoud dit gevoel.", adem:"Coherent ademen: 5 seconden in, 5 seconden uit.", scan:"Beweeg je aandacht van hoofd naar voeten. Zeg: 'Ik ben veilig.'", move:"Doe iets wat je blij maakt — dansen, wandelen." },
              { max:6, label:"Lichte druk", color:T.gold, title:"Je systeem staat licht onder druk", body:"Je voelt wat spanning maar kunt er nog mee omgaan. Jouw lichaam fluistert. Luister nu.", adem:"3-6 ademhaling: 3 seconden in, 6 seconden uit. Herhaal 10 keer.", scan:"Sluit je ogen. Hand op spanning. Adem er naartoe. 'Ik zie je. Je mag er zijn.'", move:"Sta op. Rol je schouders. Schud je handen los." },
              { max:12, label:"Verhoogde spanning", color:T.rose, title:"Jouw systeem staat flink onder druk", body:"De spanning zit in je lichaam. Je hoofd staat aan. Dit is niet jouw schuld.", adem:"Box breathing: 4 in, 4 vasthouden, 4 uit, 4 vasthouden. Herhaal 6 keer.", scan:"Voeten op de vloer. Noem 5 dingen die je ziet, 4 hoort, 3 voelt.", move:"Schud zacht je benen. Laat het opstijgen. 2-3 minuten." },
              { max:99, label:"In overleving", color:T.mauve, title:"Jouw systeem staat vandaag in overleving", body:"Je draagt vandaag heel veel. Stop met doorgaan. Kies nu voor jezelf.", adem:"Hand op borst, hand op buik. Adem in — buikhand omhoog. Adem dubbel zo lang uit.", scan:"Ga zitten of liggen. Voel de ondergrond. Zeg: 'Ik hoef nu niets.'", move:"Schud actief je hele lichaam. Of stamp zacht. Laat de spanning eruit." },
            ];
            const result = states.find(st => total <= st.max) || states[3];
            setCiResult(result);

            // Sla op in logboek
            const today = new Date().toISOString().split("T")[0];
            const entry = {
              date: today,
              dateLabel: new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"}),
              mood: logForm.mood,
              energy: logForm.energy,
              body: logForm.body || [],
              win: logForm.win,
              note: logForm.note,
              gratitude: logForm.gratitude,
              ciLabel: result.label,
              ciColor: result.color,
              gevoel: ciData.gevoel !== undefined ? ["Uitgeput","Overprikkeld","Onrustig","In balans","Veilig"][ciData.gevoel] : "",
              mPct, ePct, protein: totalP,
              q1: ciData.q1, q2: ciData.q2, q3: ciData.q3,
            };
            setLogList(prev => [entry, ...prev.filter(e => e.date !== today)]);
            setLogSaved(true);
            setStreak(s => s + 1);
            setCiData({});
            setLogForm({ mood:"", energy:"", body:[], win:"", note:"", gratitude:"" });
            setTimeout(() => { setLogSaved(false); document.getElementById("dagres")?.scrollIntoView({ behavior:"smooth" }); }, 200);
          }}>
            {logSaved ? "✓ Opgeslagen & uitslag klaar!" : "Sla op & bekijk mijn uitslag →"}
          </button>

          {/* UITSLAG */}
          {ciResult && (
            <div id="dagres" style={{ marginTop:40 }} className="fu">
              <div style={{ width:36, height:1, background:"rgba(249,132,229,0.2)", margin:"0 auto 28px" }}/>
              <div style={{ display:"inline-block", background:`${ciResult.color}18`, border:`1px solid ${ciResult.color}33`, borderRadius:50, padding:"5px 16px", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:ciResult.color, marginBottom:14 }}>{ciResult.label}</div>
              <h3 style={s.h3}>{ciResult.title}</h3>
              <p style={{ ...s.mu, marginBottom:22 }}>{ciResult.body}</p>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.rose, marginBottom:12 }}>Jouw oefeningen voor nu</div>
              {[["🌬 Ademhaling", ciResult.adem], ["🌿 Lichaamsscan", ciResult.scan], ["🌊 Beweging", ciResult.move]].map(([t2, b], i) => (
                <div key={i} style={s.card({ marginBottom:8, border:`1px solid ${ciResult.color}18` })}>
                  <div style={{ fontSize:11, color:ciResult.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>{t2}</div>
                  <p style={{ ...s.mu, fontSize:14 }}>{b}</p>
                </div>
              ))}
              <div style={s.card({ textAlign:"center", border:"1px solid rgba(249,132,229,0.18)", marginTop:8 })}>
                <p style={{ ...s.mu, fontSize:14, marginBottom:16 }}>Op dagen zoals vandaag hoef je het niet alleen te dragen.</p>
                <a href={`https://wa.me/31649396207?text=${encodeURIComponent("Hoi Wendy, ik heb mijn dagboek ingevuld en heb ondersteuning nodig")}`} target="_blank" rel="noopener noreferrer" style={s.btn()}>📱 Stuur Wendy een berichtje</a>
              </div>
            </div>
          )}

          {/* LOGBOEK GESCHIEDENIS */}
          {logList.length > 0 && (
            <div style={{ marginTop:48 }}>
              <div style={{ width:36, height:1, background:"rgba(249,132,229,0.2)", margin:"0 auto 32px" }}/>

              {/* Stemmingsgrafiek */}
              {logList.length >= 3 && (
                <div style={s.card({ marginBottom:20, border:"1px solid rgba(249,132,229,0.15)" })}>
                  <div style={{ fontSize:11, color:T.rose, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>Stemming de laatste dagen</div>
                  <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:52 }}>
                    {logList.slice(0,7).reverse().map((entry, i) => {
                      const moodH = {"😔 Zwaar":1,"😟 Gespannen":2,"😐 Neutraal":3,"🙂 Oké":4,"😊 Goed":5,"✨ Stralend":6};
                      const h = moodH[entry.mood] || 3;
                      return (
                        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                          <div style={{ width:"100%", background:T.rose, borderRadius:"4px 4px 0 0", height:`${(h/6)*44}px`, opacity:0.25+(h/6)*0.75 }}/>
                          <div style={{ fontSize:8, color:T.muted }}>{entry.date.slice(8)}/{entry.date.slice(5,7)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.rose, marginBottom:14 }}>Eerdere dagen ({logList.length})</div>
              {logList.map((entry, i) => (
                <div key={i} style={s.card({ marginBottom:10 })}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <div style={{ fontSize:12, color:T.rose }}>{entry.dateLabel}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      {entry.mood && <span style={{ fontSize:16 }}>{entry.mood.split(" ")[0]}</span>}
                      {entry.ciLabel && <span style={{ fontSize:10, background:`${entry.ciColor}20`, color:entry.ciColor, padding:"2px 8px", borderRadius:50, letterSpacing:"0.08em" }}>{entry.ciLabel}</span>}
                    </div>
                  </div>
                  {entry.body?.length > 0 && (
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
                      {entry.body.map(b => <span key={b} style={{ fontSize:10, background:"rgba(249,132,229,0.1)", color:T.rose, padding:"2px 9px", borderRadius:50 }}>{b}</span>)}
                    </div>
                  )}
                  {entry.gevoel && <div style={{ fontSize:12, color:T.muted, marginBottom:6 }}>Gevoel: {entry.gevoel}</div>}
                  {entry.win && <div style={{ marginBottom:7 }}><span style={{ fontSize:11, color:T.gold }}>🏆 </span><span style={{ fontSize:13, color:T.cream }}>{entry.win}</span></div>}
                  {entry.note && <p style={{ fontSize:13, color:T.muted, lineHeight:1.65, marginBottom:7 }}>{entry.note}</p>}
                  {entry.q1 && <p style={{ fontSize:12, color:T.muted, fontStyle:"italic", marginBottom:5 }}>"{entry.q1}"</p>}
                  {entry.gratitude && <div style={{ marginTop:4 }}><span style={{ fontSize:11, color:T.rose }}>🌸 </span><span style={{ fontSize:13, color:T.muted, fontStyle:"italic" }}>{entry.gratitude}</span></div>}
                  <div style={{ display:"flex", gap:12, marginTop:10, paddingTop:10, borderTop:"1px solid rgba(249,132,229,0.08)", fontSize:11, color:T.muted }}>
                    <span>🌅 {entry.mPct}%</span>
                    <span>🌙 {entry.ePct}%</span>
                    <span>💪 {entry.protein}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ MEER ═══ */}
      {tab === "meer" && (
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Extra tools & support</span>
          <h2 style={s.h2}>Alles wat je<br/><em style={s.em}>ondersteunt</em></h2>

          {/* Hydratatie tracker */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>💧 Hydratatie vandaag</div>
          <div style={s.card({ border:"1px solid rgba(107,159,196,0.3)", marginBottom:28 })}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.5rem", color:"#6B9FC4", lineHeight:1 }}>{water}</div>
                <div style={{ fontSize:11, color:T.muted }}>van 8 glazen</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={s.btn("#6B9FC4")} onClick={() => setWater(w => Math.min(w+1, 8))}>+ Glas</button>
                {water > 0 && <button style={s.sm} onClick={() => setWater(w => Math.max(w-1, 0))}>−</button>}
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({length:8}).map((_,i) => (
                <div key={i} style={{ flex:1, height:32, borderRadius:6, background: i < water ? "#6B9FC4" : "rgba(107,159,196,0.1)", border:"1px solid rgba(107,159,196,0.2)", transition:"background 0.3s", cursor:"pointer" }} onClick={() => setWater(i+1)}/>
              ))}
            </div>
            {water >= 8 && <p style={{ fontSize:13, color:"#6B9FC4", marginTop:12, textAlign:"center" }}>🎉 Dagdoel gehaald! Jouw lichaam dankt je.</p>}
            {water < 3 && water > 0 && <p style={{ fontSize:12, color:T.muted, marginTop:10 }}>Tip: drink een glas water voor je volgende maaltijd.</p>}
          </div>

          {/* Wendy's tip van de week */}
          {wendyTip && (
            <>
              <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🌸 Wendy's tip van de week</div>
              <div style={s.card({ border:`1px solid ${T.rose}25`, marginBottom:28, position:"relative" })}>
                <button onClick={() => setWendyTip(false)} style={{ position:"absolute", top:12, right:12, background:"none", border:"none", color:T.muted, cursor:"pointer", fontSize:16 }}>×</button>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:`${T.rose}20`, border:`2px solid ${T.rose}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🌸</div>
                  <div>
                    <div style={{ fontSize:13, color:T.rose, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Deze week van Wendy</div>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontStyle:"italic", color:T.cream, lineHeight:1.65, marginBottom:10 }}>"Jouw lichaam heeft geen perfecte routine nodig. Het heeft consistentie nodig. Eén kleine oefening, elke dag opnieuw — dat verandert meer dan je denkt."</p>
                    <p style={{ fontSize:12, color:T.muted }}>Probeer deze week: elke ochtend 5 diepe ademhalingen voordat je je telefoon pakt.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Sessie inplannen */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>📅 Sessie inplannen bij Wendy</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:28 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:20 }}>Klaar voor een persoonlijke begeleiding? Plan een TRE of BRTT sessie in met Wendy.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20een%20sessie%20inplannen" target="_blank" rel="noopener noreferrer" style={s.btn()}>
                📱 Plan via WhatsApp
              </a>
              <a href="https://www.oymb.nl" target="_blank" rel="noopener noreferrer" style={{ ...s.btn(T.dark, T.rose), border:`1px solid ${T.rose}30`, justifyContent:"center" }}>
                🌐 Bekijk oymb.nl
              </a>
            </div>
          </div>

          {/* Voortgangsbadges */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>🏆 Jouw badges</div>
          <div style={s.card({ marginBottom:28 })}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[
                { emoji:"🌱", label:"Gestart", earned: true },
                { emoji:"🔥", label:`${streak} dagen`, earned: streak >= 1 },
                { emoji:"💪", label:"Eiwitten", earned: totalP >= 50 },
                { emoji:"💧", label:"Hydratatie", earned: water >= 8 },
                { emoji:"🌅", label:"Ochtend ✓", earned: mPct === 100 },
                { emoji:"🌙", label:"Avond ✓", earned: ePct === 100 },
                { emoji:"📸", label:"Selfie", earned: Object.keys(selfies).length >= 1 },
                { emoji:"📚", label:"Module 1", earned: !!modDone[1] },
              ].map((badge, i) => (
                <div key={i} style={{ textAlign:"center", opacity: badge.earned ? 1 : 0.25 }}>
                  <div style={{ fontSize:28, marginBottom:4, filter: badge.earned ? "none" : "grayscale(100%)" }}>{badge.emoji}</div>
                  <div style={{ fontSize:9, color: badge.earned ? T.rose : T.muted, letterSpacing:"0.05em" }}>{badge.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:11, color:T.muted, textAlign:"center", marginTop:16 }}>Verdien badges door de app dagelijks te gebruiken 🌸</p>
          </div>

          {/* Community */}
          <div style={{ fontSize:12, color:T.rose, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:14 }}>👥 Community</div>
          <div style={s.card({ border:`1px solid ${T.rose}20`, marginBottom:16 })}>
            <p style={{ ...s.mu, fontSize:14, marginBottom:16 }}>Doe mee met de community van vrouwen die hetzelfde doorlopen. Deel je ervaringen, stel vragen en inspireer elkaar.</p>
            <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20lid%20worden%20van%20de%20community" target="_blank" rel="noopener noreferrer" style={s.btn()}>
              🌸 Word lid van de community
            </a>
          </div>
        </div>
      )}

    </div>
  );
}
