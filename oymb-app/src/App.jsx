import { useState, useRef, useCallback, useEffect } from "react";

const T = {
  black:"#0E0D0B", dark:"#1A1814", mid:"#2C2820",
  rose:"#F984E5", gold:"#C9A96E", sage:"#8A9E8C",
  cream:"#F0EBE1", muted:"rgba(240,235,225,0.55)", mauve:"#D44DBF",
};

const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0E0D0B;font-family:Jost,sans-serif;color:#F0EBE1}
::-webkit-scrollbar{display:none}
input,textarea{outline:none;font-family:Jost,sans-serif;font-weight:300}
button{font-family:Jost,sans-serif;font-weight:300}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes glowPulse{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.1)}}
@keyframes spark{0%{opacity:1;transform:scale(0.5)}60%{opacity:1;transform:scale(2)}100%{opacity:0;transform:scale(2.5)}}
.fu{animation:fadeUp 0.35s ease both}
`;

const MORNING = [
  {id:"m1",emoji:"🦵",title:"Lichaam wakker maken",desc:"Rekken, gapen, gezicht masseren voordat je opstaat",time:"2 min"},
  {id:"m2",emoji:"🦘",title:"Lymfatische pomp",desc:"Zacht bouncen op je tenen, lymfevocht in beweging brengen",time:"2 min"},
  {id:"m3",emoji:"💧",title:"Mineraalwater",desc:"Groot glas water + citroen + Keltisch zeezout",time:"2 min"},
  {id:"m4",emoji:"🌬",title:"3-6 Ademhaling",desc:"10 ronden, nervus vagus activeren",time:"3 min"},
  {id:"m5",emoji:"🌿",title:"Lichaamsscan",desc:"Waar voel ik spanning vandaag?",time:"3 min"},
  {id:"m6",emoji:"🎵",title:"Hummen",desc:"2 minuten, nervus vagus stimuleren",time:"2 min"},
  {id:"m7",emoji:"🥚",title:"Eiwitrijk ontbijt",desc:"Minimaal 25 gram eiwit",time:"15 min"},
  {id:"m8",emoji:"✨",title:"Intentie",desc:"Wat heeft mijn lichaam vandaag nodig?",time:"2 min"},
];

const MIDDAY = [
  {id:"d1",emoji:"💧",title:"Glas water",desc:"Hydrateer, je bent waarschijnlijk uitgedroogd",time:"1 min"},
  {id:"d2",emoji:"🚶",title:"Beweegpauze",desc:"Sta op, rek jezelf uit, loop even rond",time:"3 min"},
  {id:"d3",emoji:"🌬",title:"5 diepe ademhalingen",desc:"Reset je zenuwstelsel midden op de dag",time:"1 min"},
  {id:"d4",emoji:"☀️",title:"Daglicht",desc:"Even buiten of bij een raam staan",time:"5 min"},
  {id:"d5",emoji:"🍽",title:"Eiwitrijke lunch",desc:"Bloedsuiker stabiel houden",time:"20 min"},
  {id:"d6",emoji:"💬",title:"Check-in",desc:"Hoe voel ik mij nu? Wat heeft mijn lichaam nodig?",time:"1 min"},
];

const EVENING = [
  {id:"e1",emoji:"📵",title:"Telefoon weg",desc:"Meldingen uit, begin te vertragen",time:"0 min"},
  {id:"e2",emoji:"🦋",title:"Vlinderhug",desc:"5 minuten, afwisselend links en rechts tikken",time:"5 min"},
  {id:"e3",emoji:"📓",title:"Journaling",desc:"Wat heeft mijn lichaam vandaag gevoeld?",time:"5 min"},
  {id:"e4",emoji:"🌊",title:"4-7-8 Ademhaling",desc:"4 rondes, voor diepe ontspanning en slaap",time:"4 min"},
  {id:"e5",emoji:"💆",title:"Lichaam bedanken",desc:"Hand op hart: Dankjewel voor vandaag",time:"1 min"},
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
  {id:"b2",name:"Box Breathing",inhale:4,hold:4,exhale:4,hold2:4,rounds:6,color:T.gold,benefit:"Herstelt focus en controle"},
  {id:"b3",name:"4-7-8 Slaap",inhale:4,hold:7,exhale:8,hold2:0,rounds:4,color:T.sage,benefit:"Diepe ontspanning en betere slaap"},
  {id:"b4",name:"Coherent Ademen",inhale:5,hold:0,exhale:5,hold2:0,rounds:12,color:T.mauve,benefit:"Hartcoherentie en zenuwstelsel balans"},
];

const FAQ = [
  {q:"Waarom bestaat deze app eigenlijk?",a:"Lieve jij, omdat ik wil dat je niet alleen begrijpt waarom je je voelt zoals je je voelt, maar dat je lichaam het ook echt gaat ervaren. Inzicht alleen verandert je zenuwstelsel niet. Deze app is jouw dagelijkse metgezel terug naar jezelf, met kleine stapjes die samen het verschil maken."},
  {q:"Wat gaat dit voor mij doen?",a:"Je gaat jezelf opnieuw leren kennen, niet vanuit je hoofd, maar vanuit je lichaam. Je leert herkennen wanneer je in overleving schiet, en nog belangrijker, hoe je daar weer uit komt. Dit is geen quick fix. Dit is een liefdevolle reis terug naar wie je werkelijk bent."},
  {q:"Wat is de Polyvagaal Theorie en waarom is dat belangrijk?",a:"De Polyvagaal Theorie, ontwikkeld door Stephen Porges, laat zien dat jouw zenuwstelsel continu schakelt tussen verschillende staten: veiligheid, fight-or-flight, en freeze. Dat doet het niet bewust, maar als bescherming. Zodra je begrijpt in welke staat jij vaak vastzit, kun je eindelijk stoppen met jezelf veroordelen en beginnen met liefdevol reguleren. Dit is de wetenschappelijke basis achter alles wat je in dit programma leert."},
  {q:"Moet ik dit elke dag doen?",a:"Het liefst wel, ook al is het maar vijf minuutjes. Je zenuwstelsel houdt van herhaling, niet van perfectie. Een ademhaling hier, een check-in daar, dat is al genoeg om iets in beweging te zetten. Klein en trouw wint het altijd van groots en eenmalig."},
  {q:"Ik weet niet waar ik moet beginnen, help?",a:"Start gewoon bij Module 1, lieve jij. Lees rustig, doe de oefeningen, schrijf op wat er in je opkomt. Geen haast. Werk in je eigen tempo door de modules heen, en gebruik ondertussen je Routine en Dagboek elke dag. Stap voor stap kom je vanzelf verder."},
  {q:"En als ik een dag mis, faal ik dan?",a:"Nee. Nooit. Dit programma gaat niet over foutloos zijn. Het gaat over steeds weer terugkomen, hoe vaak je ook wegraakt. Mis je een dag? Morgen begin je gewoon weer, precies waar je gebleven was. Geen schuldgevoel nodig."},
  {q:"Wat als het even te veel wordt?",a:"Dan is daar de rode SOS-knop, rechtsonder in beeld. Een moment van paniek, overweldiging of gewoon te veel? Eén tik en je kiest tussen een rustgevende ademhaling of direct contact met mij. Je hoeft het nooit alleen te dragen."},
  {q:"Blijft alles wat ik invul privé?",a:"Helemaal. Je dagboek, je foto's, je persoonlijke notities, ze blijven op jouw eigen telefoon. Ik zie hier niets van automatisch. Wil je iets delen met mij? Dat doe je zelf, op jouw moment, via de WhatsApp-knop."},
];

function FaqItem({item}){
  const [open,setOpen]=useState(false);
  return(
    <div style={s.card({marginBottom:8,cursor:"pointer"})} onClick={()=>setOpen(o=>!o)}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
        <span style={{fontSize:14,color:T.cream,lineHeight:1.4}}>{item.q}</span>
        <span style={{color:T.rose,fontSize:18,flexShrink:0,transform:open?"rotate(45deg)":"none",transition:"transform 0.2s"}}>+</span>
      </div>
      {open&&<p style={{...s.mu,fontSize:13,marginTop:12,lineHeight:1.75}}>{item.a}</p>}
    </div>
  );
}

const MODULES = [
  {
    id:1, emoji:"🌱", color:T.sage,
    title:"Je bent niet lui, je bent aan het overleven",
    quote:"Misschien dacht je dat er iets mis was met jou. Dat je gewoon meer discipline nodig had. Maar wat als jouw lichaam al die tijd precies deed waarvoor het gemaakt is? Namelijk: jou beschermen.",
    sections:[
      {t:"Welkom",b:"Allereerst wil ik zeggen: wat fijn dat je hier bent. Alleen al het feit dat jij dit programma hebt aangeschaft, zegt iets. Het zegt dat jij voelt dat het anders mag. Dat je niet langer alleen wilt overleven.\n\nMisschien herken je jezelf in een of meerdere van deze dingen:\n- Je bent altijd moe\n- Je wordt al moe wakker\n- Je hoofd staat nooit uit\n- Je voelt weinig\n- Je reageert niet meer op appjes\n- Je stelt alles uit\n- Je blijft maar scrollen\n- Je weet precies wat goed voor je is, maar krijgt jezelf niet in beweging\n\nEn misschien veroordeel je jezelf daar ook nog om. Waarom lukt het mij niet? Waarom ben ik zo moe? Waarom heb ik geen discipline?\n\nIk wil dat je vanaf vandaag een ding onthoudt: er is waarschijnlijk niets mis met jou. Je lichaam probeert je alleen al heel lang veilig te houden. En dat is iets totaal anders."},
      {t:"Mijn verhaal",b:"Jarenlang dacht ik dat ik gewoon harder mijn best moest doen. Ik werkte. Ik zorgde. Ik regelde. Ik stond altijd aan.\n\nVan buiten leek alles prima. Maar van binnen voelde ik me leeg. Ik was moe, snel overprikkeld, mijn lontje werd korter, ik voelde steeds minder.\n\nIk dacht dat ik gewoon moest doorzetten. Nog een cursus, nog beter plannen, nog harder werken, nog gezonder eten. Maar niets veranderde echt.\n\nTotdat ik ontdekte dat mijn lichaam helemaal niet tegen mij werkte. Mijn lichaam werkte vóór mij. Alleen stond mijn zenuwstelsel al jaren in de overlevingsstand.\n\nVanaf dat moment viel alles op zijn plek. En dat is precies waarom ik dit programma heb gemaakt. Omdat ik jou die zoektocht wil besparen."},
      {t:"Wat betekent overleven eigenlijk?",b:"Ons lichaam heeft een belangrijke taak: overleven. Niet gelukkig zijn, niet succesvol zijn, niet ontspannen, maar overleven.\n\nWanneer jouw lichaam gevaar ervaart, maakt het een keuze. Die keuze gebeurt razendsnel, nog voordat jij erover hebt nagedacht. Je zenuwstelsel vraagt eigenlijk maar een vraag: Ben ik veilig?\n\nIs het antwoord nee? Dan schakelt je lichaam automatisch over. Dat is geen keuze. Dat is biologie."},
      {t:"Waarom voel jij je nog steeds zo?",b:"Veel vrouwen denken dat stress alleen ontstaat door een drukke baan, kinderen, geld of deadlines. Maar jouw lichaam kijkt daar anders naar.\n\nVoor jouw zenuwstelsel kan ook dit stress zijn: altijd sterk moeten zijn, nooit emoties mogen tonen, perfectionisme, pleasen, jezelf wegcijferen, jarenlang doorgaan, weinig slapen, voedingstekorten, trauma, een moeilijke jeugd, een scheiding, ziekte, verlies, constant aan staan.\n\nStress stapelt zich op. En zolang die stress nergens heen kan, blijft jouw lichaam hem vasthouden."},
      {t:"Het lichaam vergeet niet",b:"Je hoofd kan denken: dat is toch allang voorbij. Maar jouw lichaam denkt daar anders over. Je zenuwstelsel onthoudt alles.\n\nIedere keer dat jij spanning wegslikt, iedere keer dat jij doorgaat terwijl je eigenlijk rust nodig hebt, iedere keer dat jij je aanpast, iedere keer dat jij je emoties inslikt, iedere keer dat jij jezelf niet op nummer een zet, slaat jouw lichaam iets op. Niet om jou dwars te zitten, maar om jou te beschermen."},
      {t:"Waarom praten soms niet genoeg is",b:"Begrijp me goed: praten kan ontzettend waardevol zijn. Maar inzicht alleen verandert je zenuwstelsel niet. Je kunt precies weten waar jouw gedrag vandaan komt, en toch nog steeds iedere ochtend uitgeput wakker worden.\n\nWaarom? Omdat jouw lichaam iets anders nodig heeft dan alleen inzicht. Je lichaam wil veiligheid voelen, niet alleen begrijpen. Daarom werken we in dit programma niet alleen met kennis, maar vooral met het lichaam."},
    ],
    exercises:[
      {t:"Hoe voelt mijn lichaam vandaag?",inst:"Pak een notitieboek. Schrijf zonder na te denken op.",prompts:["Hoe voel ik mij op dit moment?","Waar voel ik spanning?","Waar voel ik juist niets?","Welke emoties voel ik?","Welke emoties vermijd ik?","Wat heeft mijn lichaam vandaag nodig?"]},
      {t:"De lichaamsscan",inst:"Ga rustig zitten of liggen. Sluit je ogen. Adem rustig in en adem langzaam uit. Breng vervolgens je aandacht naar: je kruin, je gezicht, je kaak, je nek, je schouders, je borst, je buik, je bekken, je benen, je voeten.\n\nProbeer niets te veranderen, alleen waarnemen. Vraag jezelf steeds opnieuw: wat voel ik hier? Misschien voel je warmte, misschien spanning, misschien helemaal niets. Alles is goed.",prompts:[]},
      {t:"Mijn overlevingsgedrag",inst:"Maak twee kolommen. In de eerste kolom: dit doe ik als ik stress ervaar (bijvoorbeeld uitstellen, scrollen, pleasen, eten, controleren, hard werken, stil worden, isoleren, niet reageren, boos worden). In de tweede kolom: wat heeft mijn lichaam eigenlijk nodig (bijvoorbeeld rust, veiligheid, beweging, een knuffel, slaap, voeding, ademruimte, grenzen aangeven). Vaak zit daar precies het verschil.",prompts:[]},
      {t:"Reflectie",prompts:["Wat raakte mij het meest?","Wat heb ik vandaag geleerd?","Wat herken ik bij mezelf?","Waar veroordeel ik mezelf nog op?","Wat wil ik vanaf vandaag anders gaan doen?"]},
    ],
    aff:"Ik hoef mezelf niet langer te forceren. Mijn lichaam probeert mij niet tegen te werken. Mijn lichaam probeert mij veilig te houden. En vanaf vandaag ga ik leren luisteren."
  },
  {
    id:2, emoji:"🧠", color:T.gold,
    title:"Begrijp je zenuwstelsel en stop met vechten tegen jezelf",
    quote:"Je kunt jezelf pas echt helpen als je begrijpt waarom je lichaam doet wat het doet.",
    sections:[
      {t:"Welkom",b:"In de vorige module ontdekte je dat er waarschijnlijk niets mis is met jou. Dat je lichaam je niet tegenwerkt. Dat je zenuwstelsel simpelweg doet waarvoor het ontworpen is: jou beschermen.\n\nIn deze module gaan we een laag dieper. Want hoe beter jij begrijpt hoe jouw zenuwstelsel werkt, hoe minder je jezelf zult veroordelen. Je gaat ontdekken waarom je soms vol energie bent en op andere dagen nergens toe kunt komen. Waarom je ineens uitvalt tegen je partner, waarom je afspraken afzegt, waarom je blijft scrollen, waarom je soms niets meer voelt. En vooral: waarom dit geen gebrek aan discipline is."},
      {t:"Je zenuwstelsel is jouw beveiligingssysteem",b:"Stel je een huis voor. Op dat huis zit een alarmsysteem. Dat alarmsysteem heeft een taak: controleren of alles veilig is. Wanneer er gevaar dreigt, gaat het alarm af. Niet omdat het huis kapot is, maar omdat het systeem zijn werk doet.\n\nJouw zenuwstelsel werkt precies hetzelfde. De hele dag scant jouw lichaam de omgeving, niet bewust maar onbewust. Deze voortdurende scan noemen we neuroceptie.\n\nJe zenuwstelsel vraagt iedere seconde: ben ik veilig? Kan ik ontspannen? Is er gevaar? Moet ik mij beschermen? Nog voordat jij ergens over nadenkt, heeft jouw lichaam al besloten hoe het gaat reageren."},
      {t:"De Polyvagaal Theorie",b:"De Polyvagaal Theorie is ontwikkeld door Stephen Porges. Deze theorie laat zien dat ons zenuwstelsel voortdurend schakelt tussen verschillende staten. Niet omdat we dat kiezen, maar omdat ons lichaam probeert te overleven.\n\nHet doel is dus niet om altijd ontspannen te zijn. Het doel is flexibel kunnen bewegen tussen de verschillende staten. Gezonde regulatie betekent: spanning kunnen opbouwen, spanning weer kunnen loslaten, terugkeren naar rust.\n\nVeel mensen blijven echter vastzitten in een stand. En dat is precies waar klachten ontstaan."},
      {t:"De Groene Stand: Veiligheid",b:"Dit is de staat waarin jouw lichaam zich veilig voelt. In deze stand adem je rustig, voel je verbinding, kun je helder nadenken, ben je creatief, kun je genieten, sta je open voor contact, kun je emoties voelen zonder erin te verdrinken.\n\nJe immuunsysteem werkt optimaal, je hormonen zijn meer in balans, je spijsvertering werkt beter, je lichaam kan herstellen. Dit is de staat waarin genezing plaatsvindt. Niet omdat alles perfect is, maar omdat jouw lichaam zich veilig genoeg voelt."},
      {t:"De Oranje Stand: Fight & Flight",b:"Wanneer jouw lichaam gevaar waarneemt, schakelt het op. Je sympathische zenuwstelsel wordt actief. Je lichaam maakt zich klaar om te vechten of te vluchten. Dat gebeurt automatisch.\n\nFight ziet er lang niet altijd uit als boos worden. Het kan zich ook uiten als: controle houden, perfectionisme, altijd gelijk willen hebben, alles willen regelen, geïrriteerd zijn, snel boos worden, overal bovenop zitten, moeilijk kunnen ontspannen. Sommige vrouwen herkennen zichzelf hierin: altijd sterk, altijd aan, altijd bezig. Maar diep van binnen uitgeput.\n\nFlight lijkt vaak op productiviteit. Je blijft bezig, je agenda staat vol, je werkt hard, je sport veel, je zorgt voor iedereen, je kunt niet stilzitten. Rust voelt ongemakkelijk. Wanneer je eindelijk op de bank zit, pak je alsnog je telefoon. Niet omdat je lui bent, maar omdat stilstand onveilig voelt."},
      {t:"De Rode Stand: Freeze",b:"Freeze wordt vaak verkeerd begrepen. Mensen denken: ik doe niks, ik ben lui, ik heb geen discipline. Maar freeze is een van de slimste overlevingsmechanismen van het lichaam.\n\nWanneer vechten of vluchten niet meer lukt, kiest jouw lichaam voor stilstand. Net zoals dieren dat doen: een hert dat geen kant meer op kan, een konijn dat zich dood houdt, een vogel die verstijft. Dat gebeurt niet bewust, dat gebeurt automatisch."},
    ],
    exercises:[
      {t:"Reflectievraag",prompts:["Wanneer voelde jij je voor het laatst écht veilig? Niet alleen in je hoofd, maar in je lichaam. Beschrijf dat moment zo uitgebreid mogelijk."]},
      {t:"Herken jouw staat",prompts:["Wanneer schiet jij in fight? Wat zijn jouw signalen?","Wanneer schiet jij in flight? Wat zijn jouw signalen?","Wanneer schiet jij in freeze? Wat zijn jouw signalen?"]},
    ],
    aff:"Mijn lichaam is niet mijn vijand. Het is mijn beschermer. Nu ik dit begrijp, kan ik anders reageren."
  },
  {
    id:3, emoji:"💫", color:T.rose,
    title:"Trauma leeft niet alleen in je hoofd, maar ook in je lichaam",
    quote:"Je lichaam onthoudt wat je hoofd soms allang vergeten is.",
    sections:[
      {t:"Welkom",b:"In de vorige module heb je geleerd hoe jouw zenuwstelsel werkt en waarom je lichaam automatisch schakelt tussen veiligheid en overleving. Misschien ben je jezelf al op een andere manier gaan bekijken: niet meer als iemand die lui is, of zwak, of ongemotiveerd, maar als iemand wiens lichaam al heel lang probeert te beschermen.\n\nIn deze module gaan we een stap verder. We gaan kijken naar opgeslagen stress. Want veel mensen denken bij trauma direct aan iets heel heftigs: een ongeluk, misbruik, oorlog. Maar trauma is veel breder dan dat. Trauma gaat niet alleen over wat er is gebeurd. Trauma gaat vooral over wat jouw lichaam niet heeft kunnen verwerken."},
      {t:"Wat is trauma eigenlijk?",b:"Er bestaat een groot verschil tussen een gebeurtenis en trauma. Twee mensen kunnen precies hetzelfde meemaken. De een herstelt relatief snel, de ander blijft er jarenlang last van houden. Waarom? Omdat trauma niet alleen wordt bepaald door de gebeurtenis, maar door de manier waarop jouw zenuwstelsel die gebeurtenis heeft opgeslagen.\n\nTrauma ontstaat wanneer jouw lichaam tijdens een stressvolle situatie niet de mogelijkheid heeft gehad om de opgebouwde spanning volledig af te maken. De energie blijft als het ware in het systeem hangen. En jouw lichaam blijft alert, niet omdat het gevaar er nog is, maar omdat jouw zenuwstelsel denkt dat het gevaar ieder moment terug kan komen."},
      {t:"Grote T en kleine t trauma",b:"Veel mensen zeggen: ik heb geen trauma gehad. Maar dat hoeft ook helemaal niet. Er wordt vaak onderscheid gemaakt tussen grote T trauma (zoals ernstig ongeluk, geweld, seksueel misbruik, oorlog, overlijden, natuurramp) en kleine t trauma.\n\nEn juist daar herkennen veel vrouwen zich in: nooit echt gezien worden, altijd sterk moeten zijn, emoties moeten wegstoppen, gepest worden, afgewezen worden, voortdurend kritiek krijgen, jezelf moeten aanpassen, opgroeien in onveiligheid, emotioneel afwezige ouders, altijd zorgen voor anderen, jarenlang over je eigen grenzen gaan.\n\nMisschien klinkt het klein, maar als dit jarenlang gebeurt, ervaart jouw zenuwstelsel dat als chronische stress. En chronische stress verandert letterlijk je lichaam."},
      {t:"Het lichaam onthoudt alles",b:"Je hoofd kan zeggen: dat is al twintig jaar geleden. Maar jouw lichaam kent geen kalender. Het kent alleen patronen. Als jouw lichaam ooit geleerd heeft dat het niet veilig is om verdriet te voelen, dan zal het dat vandaag nog steeds proberen te voorkomen. Niet omdat je zwak bent, maar omdat jouw systeem ooit heeft geleerd: voelen is gevaarlijk."},
      {t:"Fascia: het bindweefsel dat alles verbindt",b:"Je lichaam bestaat niet alleen uit spieren en botten. Alles is met elkaar verbonden door een netwerk van bindweefsel: de fascia. Je kunt fascia zien als een dun spinnenweb dat door je hele lichaam loopt. Het omhult spieren, organen, zenuwen, bloedvaten en gewrichten.\n\nWanneer jij langdurig stress ervaart, spannen spieren zich aan. Blijft die spanning bestaan, dan verandert ook de fascia. Het bindweefsel wordt minder soepel, het droogt als het ware uit, het verkleeft. Je bewegingsvrijheid neemt af.\n\nVeel mensen ervaren daardoor: stijve nek, schouders vol spanning, pijnlijke heupen, rugklachten, hoofdpijn, een beklemmend gevoel op de borst. Niet omdat er iets kapot is, maar omdat het lichaam zich al lange tijd beschermt."},
      {t:"De psoas: de spier van veiligheid",b:"Diep in je lichaam ligt de psoas, een spier die je wervelkolom verbindt met je benen. De psoas wordt ook wel de spier van de ziel genoemd, omdat deze spier direct reageert op stress.\n\nWanneer jouw zenuwstelsel gevaar ervaart, spant de psoas zich automatisch aan. Dat is handig wanneer je moet rennen. Maar wanneer jouw lichaam jarenlang spanning vasthoudt, kan deze spier voortdurend aangespannen blijven.\n\nVeel mensen ervaren daardoor: lage rugpijn, stijve heupen, pijn in de liezen, moeite met ontspannen, onrust in het lichaam."},
      {t:"Waarom praten alleen niet voldoende is",b:"Misschien heb je al veel therapieën gevolgd. Misschien begrijp je precies waar jouw patronen vandaan komen. En toch merk je dat je lichaam nog steeds hetzelfde reageert. Dat is niet vreemd.\n\nInzicht ontstaat in je neocortex. Maar veiligheid ontstaat in je zenuwstelsel. Je lichaam heeft nieuwe ervaringen nodig, niet alleen nieuwe gedachten. Daarom werken we in dit programma met adem, beweging, lichaamsbewustzijn, ontspanning, regulatie en voelen. Niet om trauma opnieuw te beleven, maar om je lichaam te laten ervaren: het is nu veilig."},
    ],
    exercises:[
      {t:"Waar draag jij spanning?",inst:"Ga rustig staan. Sluit je ogen. Adem drie keer diep in en langzaam uit. Voel vervolgens je lichaam. Waar voel jij als eerste spanning? Voorhoofd, kaak, nek, schouders, borst, buik, onderrug, heupen, bekken of benen?\n\nLeg een hand op die plek. Vraag jezelf: wat probeer jij mij te vertellen? Schrijf alles op zonder te oordelen.",prompts:[]},
      {t:"De veilige zucht",inst:"Soms heeft je lichaam helemaal geen ingewikkelde oefening nodig. Neem een rustige inademing door je neus. En adem vervolgens met een hoorbare zucht uit, alsof je eindelijk iets los mag laten. Doe dit tien keer.\n\nVoel daarna: is mijn kaak zachter? Zijn mijn schouders lager? Voelt mijn adem ruimer?",prompts:[]},
      {t:"Schud de spanning los",inst:"Dieren schudden zichzelf uit nadat het gevaar voorbij is. Wij mensen doen dat bijna nooit, en juist daardoor blijft spanning vaak hangen.\n\nZet een timer op twee minuten. Begin zachtjes te schudden: eerst je handen, dan je armen, daarna je schouders, je benen, je heupen, je hele lichaam. Niet mooi, niet netjes, gewoon los. Adem ondertussen rustig door. Stop na twee minuten, blijf nog een minuut stil staan, voel na.",prompts:[]},
      {t:"Reflectievragen",prompts:["Wat heb ik vandaag geleerd over mijn lichaam?","Welke spanning herken ik al langer?","Welke emoties houd ik vaak vast?","Wanneer voel ik dat mijn lichaam zich beschermt?","Wat verraste mij het meest?","Waar mag ik zachter voor mezelf worden?"]},
    ],
    aff:"Mijn lichaam is niet tegen mij. Mijn lichaam probeert mij al die jaren te beschermen. Vanaf vandaag leer ik luisteren in plaats van vechten. Ik hoef niets te forceren. Veiligheid ontstaat stap voor stap."
  },
  {
    id:4, emoji:"🌊", color:"#6B9FC4",
    title:"Reguleer je zenuwstelsel: veiligheid begint in je lichaam",
    quote:"Je kunt jezelf niet uit een overlevingsstand denken. Je lichaam heeft eerst veiligheid nodig.",
    sections:[
      {t:"Welkom",b:"In de vorige modules heb je geleerd hoe jouw zenuwstelsel werkt en waarom stress zich kan vastzetten in je lichaam. Misschien herken je inmiddels veel signalen. Je begrijpt beter waarom je soms vastloopt, waarom je jezelf afsluit, waarom je blijft doorgaan, of waarom je niets meer voelt.\n\nMaar misschien denk je nu ook: mooi, maar hoe kom ik hier dan uit? Dat is precies waar deze module over gaat. Niet over trucjes, niet over positief denken, niet over jezelf forceren. Maar over het opnieuw leren voelen van veiligheid. Want een zenuwstelsel kun je niet dwingen, je kunt het alleen uitnodigen."},
      {t:"Je zenuwstelsel leert door ervaring",b:"Veel mensen proberen zichzelf te veranderen door harder hun best te doen. Ze maken lijstjes, ze plannen, ze zetten doelen. En als het niet lukt, geven ze zichzelf de schuld.\n\nMaar jouw zenuwstelsel leert niet door woorden, het leert door ervaringen. Iedere keer dat jouw lichaam ervaart: ik ben veilig, wordt er een nieuw paadje aangelegd. Iedere keer dat jij spanning opmerkt zonder ervoor weg te lopen, vertel je jouw lichaam: we hoeven niet meer te vechten. Dat is neuroplasticiteit. Je brein en zenuwstelsel kunnen veranderen, niet in een dag, maar wel iedere dag een klein beetje."},
      {t:"Reguleren is iets anders dan ontspannen",b:"Veel mensen denken dat reguleren hetzelfde is als ontspannen. Dat is niet zo. Reguleren betekent: voelen wat er gebeurt, aanwezig blijven, spanning leren dragen, spanning weer kunnen loslaten, terugkeren naar veiligheid.\n\nSoms voel je je na een oefening juist onrustiger. Dat betekent niet dat je iets fout doet. Vaak betekent het dat jouw lichaam eindelijk durft te voelen wat het al die tijd heeft onderdrukt. Wees daarin mild, je hoeft niets te fixen."},
      {t:"Waarom de uitademing zo belangrijk is",b:"Wanneer we stress ervaren, gaan we automatisch sneller ademen, vaak hoog in de borst. Daardoor blijft ons lichaam denken dat er gevaar is. De uitademing vertelt jouw zenuwstelsel iets anders.\n\nEen lange rustige uitademing activeert de nervus vagus. De nervus vagus is de belangrijkste zenuw van jouw parasympathische zenuwstelsel. Hij helpt jouw lichaam om terug te keren naar rust. Daarom besteden we in deze module veel aandacht aan de uitademing. Niet omdat ademwerk magisch is, maar omdat jouw lichaam via de adem een directe ingang heeft naar veiligheid."},
      {t:"De nervus vagus: jouw rempedaal",b:"Je kunt de nervus vagus zien als de rem van jouw zenuwstelsel. Wanneer deze zenuw goed functioneert: herstel je sneller na stress, slaap je beter, verteer je voeding beter, voel je meer verbinding, kun je emoties beter reguleren, herstel je sneller van spanning.\n\nWanneer jouw zenuwstelsel jarenlang overbelast is, kan deze zenuw minder goed functioneren. Het mooie is: je kunt hem trainen, net zoals een spier. Niet door hard te werken, maar door herhaling."},
      {t:"Kleine momenten maken het verschil",b:"Veel mensen denken dat ze iedere dag een uur moeten mediteren. Dat hoeft niet. Jouw zenuwstelsel leert juist van kleine veilige momenten. Dertig seconden, een minuut, drie minuten, meerdere keren per dag. Dat heeft vaak veel meer effect dan een lange oefening per week.\n\nVraag jezelf daarom regelmatig af: voelt mijn lichaam zich op dit moment veilig? Alleen al die vraag brengt bewustzijn."},
    ],
    exercises:[
      {t:"De 3-6 ademhaling",inst:"Ga comfortabel zitten. Leg een hand op je borst en een hand op je buik. Adem rustig in door je neus gedurende 3 tellen. Adem vervolgens langzaam uit gedurende 6 tellen. Herhaal dit minimaal 10 keer. Voel tijdens iedere uitademing hoe je schouders iets mogen zakken.\n\nNa afloop vraag je jezelf: voel ik verschil? Is mijn adem rustiger? Waar voel ik ontspanning?",prompts:[]},
      {t:"Oriëntatie",inst:"Deze oefening helpt jouw zenuwstelsel te ontdekken dat het nu veilig is. Kijk langzaam de ruimte rond. Haast je niet, laat je ogen overal rustig op rusten. Zoek: iets groens, iets ronds, iets zachts, iets dat je mooi vindt.\n\nVoel ondertussen je voeten op de grond. Adem rustig. Laat je lichaam registreren: ik ben hier, ik ben veilig.",prompts:[]},
      {t:"De vlinderhug",inst:"Kruis je armen voor je borst. Leg je handen op je bovenarmen. Tik afwisselend links en rechts, rustig, niet te snel. Adem ondertussen langzaam door. Doe dit twee tot vijf minuten. Voel hoe jouw lichaam reageert: misschien ontstaat rust, misschien emotie, misschien helemaal niets. Alles is goed.",prompts:[]},
      {t:"Hummen",inst:"De nervus vagus loopt langs je stembanden. Door te hummen ontstaat er een trilling die deze zenuw stimuleert. Adem rustig in, hum tijdens de uitademing. Voel de trilling in je keel, je borst, je gezicht. Doe dit vijf minuten. Misschien merk je dat je automatisch dieper gaat ademen.",prompts:[]},
      {t:"Veiligheid aanraken",inst:"Leg een hand op je hart, een hand op je buik. Sluit je ogen. Vraag jezelf: waar voel ik vandaag een klein beetje veiligheid? Misschien is dat de stoel waarop je zit, de warmte van je handen, je adem, het zonlicht, een deken, een herinnering, een geur. Veiligheid hoeft niet groot te zijn, je zenuwstelsel leert juist van kleine momenten.",prompts:[]},
      {t:"Van hoofd naar lichaam",inst:"Wanneer je merkt dat je blijft piekeren: stop, kijk om je heen, voel je voeten, ontspan je kaak, adem rustig uit. Vraag jezelf niet: waarom voel ik dit? Maar: wat heeft mijn lichaam nu nodig?",prompts:[]},
      {t:"Dagelijkse Nervus Vagus Reset",inst:"Gebruik deze routine iedere ochtend of avond: 10 rustige ademhalingen, 2 minuten hummen, 2 minuten vlinderhug, 1 minuut oriënteren, 30 seconden voelen. Totaal nog geen 10 minuten, maar wel een dagelijkse herinnering aan jouw lichaam dat het veilig mag worden.",prompts:["Welke oefening voelde prettig?","Welke oefening vond ik lastig?","Waar voelde ik ontspanning?","Waar voelde ik weerstand?","Welke oefening ga ik dagelijks doen?"]},
    ],
    aff:"Ik hoef mezelf niet te forceren. Ik mag vertragen. Ik mag voelen. Mijn lichaam leert iedere dag opnieuw dat het veilig is. En dat is genoeg."
  },
  {
    id:5, emoji:"🌸", color:T.rose,
    title:"Van overleven naar leven",
    quote:"Het doel is niet om nooit meer stress te ervaren. Het doel is dat je lichaam weet hoe het weer terug mag keren naar veiligheid.",
    sections:[
      {t:"Welkom",b:"Je bent aangekomen bij de laatste module. Misschien voelt dat als een mijlpaal, misschien denk je juist: ik ben er nog lang niet. En weet je, dat hoeft ook niet.\n\nDit programma ging nooit over het fixen van jezelf, want jij bent niet kapot. Het ging over iets veel belangrijkers: je leren begrijpen, je lichaam leren begrijpen, en ontdekken dat er een andere manier van leven mogelijk is. Niet vanuit controle, niet vanuit overleven, maar vanuit verbinding met jezelf, met je lichaam, met het leven."},
      {t:"Genezing is geen rechte lijn",b:"Een van de grootste valkuilen is denken dat je vanaf nu nooit meer terugvalt. Dat je nooit meer moe bent, nooit meer gespannen, nooit meer in freeze schiet. Dat is niet hoe een zenuwstelsel werkt.\n\nJe zult momenten blijven hebben waarop je systeem opschakelt. Dat is normaal. Het verschil is dat je het nu eerder gaat herkennen. En daardoor hoef je er niet meer weken of maanden in vast te blijven zitten. Je merkt sneller: hé, mijn lichaam voelt zich weer onveilig. En in plaats van jezelf af te wijzen, kun je jezelf gaan ondersteunen. Dat is echte groei."},
      {t:"Je lichaam is niet je vijand",b:"Misschien heb je jarenlang tegen je lichaam gevochten. Omdat het moe was, omdat het pijn deed, omdat het niet deed wat jij wilde. Maar kijk eens terug naar alles wat je hebt geleerd.\n\nJe lichaam probeerde je niet klein te houden, het probeerde je veilig te houden. Iedere klacht, iedere spanning, iedere emotie, iedere vermoeidheid, iedere freeze, was eigenlijk een boodschap. Een uitnodiging om te luisteren."},
      {t:"Het verschil tussen discipline en veiligheid",b:"Veel vrouwen zeggen: ik heb gewoon meer discipline nodig. Maar discipline zonder veiligheid werkt vaak maar heel even. Je kunt jezelf best een tijdje pushen, nog harder sporten, nog gezonder eten, nog productiever zijn. Maar als jouw zenuwstelsel zich onveilig voelt, zal het je uiteindelijk weer afremmen. Niet om je dwars te zitten, maar om je te beschermen.\n\nVeiligheid is de basis. Van daaruit ontstaat vanzelf meer energie, meer motivatie, meer creativiteit, meer levenslust."},
      {t:"Je hoeft niet meer te vechten",b:"Misschien heb je jarenlang geprobeerd iemand anders te worden: rustiger, sterker, succesvoller, minder gevoelig. Maar misschien ligt de oplossing niet in veranderen. Misschien ligt de oplossing in thuiskomen. Thuiskomen in jouw lichaam, thuiskomen bij jezelf. Niet door nóg harder te werken, maar door jezelf eindelijk toestemming te geven om te voelen."},
      {t:"Zelfzorg is geen luxe",b:"Veel vrouwen zetten zichzelf als laatste op de lijst: eerst de kinderen, dan het werk, dan het huishouden, dan de partner. En als er nog tijd over is, misschien zichzelf. Maar jouw zenuwstelsel kan alleen herstellen wanneer jij jezelf ook belangrijk maakt. Zelfzorg is niet egoïstisch. Zelfzorg is verantwoordelijkheid nemen voor jouw gezondheid."},
      {t:"Terugval hoort erbij",b:"Er zullen dagen zijn waarop je weer terugschiet in oude patronen. Je gaat misschien weer scrollen, uitstellen, pleasen, alles alleen willen doen. Dat betekent niet dat je hebt gefaald, het betekent alleen dat jouw lichaam iets probeert te vertellen.\n\nVraag jezelf op zo'n moment niet: wat is er mis met mij? Vraag jezelf: wat heeft mijn lichaam nu nodig? Dat is een totaal andere vraag, en vaak ook een totaal ander antwoord."},
    ],
    exercises:[
      {t:"Mijn signalen herkennen",prompts:["Dit zijn mijn eerste signalen van stress","Dit zijn mijn eerste signalen van freeze","Dit zijn mijn eerste signalen van herstel"]},
      {t:"Mijn persoonlijke herstelplan",inst:"Maak jouw eigen lijst: wanneer ik merk dat ik uit verbinding raak, ga ik... (bijvoorbeeld 10 keer rustig ademhalen, naar buiten, muziek opzetten, mijn telefoon wegleggen, water drinken, eiwitrijk eten, mijn voeten op de grond voelen, schrijven, iemand bellen, rust nemen, bewegen, een ademhalingsoefening doen)",prompts:["Mijn persoonlijke herstelplan:"]},
      {t:"Een brief aan jezelf",inst:"Schrijf een brief aan de versie van jezelf die nog midden in de overlevingsstand zit. Wat zou je haar willen vertellen? Welke woorden had jij toen nodig? Welke hoop wil je haar meegeven? Lees deze brief hardop voor, niet vandaag misschien, maar op een moment waarop je het nodig hebt.",prompts:["Lieve mij..."]},
      {t:"Reflectie",prompts:["Wat heeft mij het meest geraakt?","Welke inzichten neem ik mee?","Welke oefening ga ik blijven doen?","Hoe voel ik mij nu ten opzichte van de start?","Waar ben ik trots op?","Wat gun ik mezelf voor de komende zes maanden?"]},
      {t:"Een belofte aan mezelf",inst:"Maak deze zin af en onderteken hem met je naam en de datum van vandaag, niet als contract maar als herinnering.",prompts:["Vanaf vandaag kies ik ervoor om..."]},
    ],
    aff:"Ik ben niet mijn verleden. Ik ben niet mijn overlevingsmechanismen. Ik ben niet mijn angst. Ik ben niet mijn stress. Ik ben veilig. Ik mag voelen. Ik mag leven. Stap voor stap keer ik terug naar mezelf. En dat is het mooiste cadeau dat ik mezelf kan geven."
  },
  {
    id:6, emoji:"🥗", color:T.gold,
    title:"Bonus: Voeding als basis voor een veilig zenuwstelsel",
    quote:"Je kunt nog zoveel ademhalingsoefeningen doen, maar als je lichaam de juiste bouwstoffen mist, blijft herstellen veel moeilijker.",
    sections:[
      {t:"Je lichaam wil herstellen",b:"Ons lichaam is iedere seconde bezig met herstellen. Cellen worden vernieuwd, hormonen worden aangemaakt, zenuwen communiceren met elkaar, spieren herstellen, je immuunsysteem is continu aan het werk.\n\nMaar je lichaam kan alleen herstellen met de bouwstoffen die jij het geeft. Zie het als een huis bouwen: je kunt de beste aannemer hebben, maar zonder stenen komt er geen huis. Zo werkt jouw lichaam ook."},
      {t:"Waarom zoveel vrouwen zich leeg voelen",b:"Veel vrouwen eten te weinig, of eten vooral snelle koolhydraten, of slaan maaltijden over, of drinken de hele ochtend alleen koffie. Daardoor schommelt de bloedsuiker voortdurend, en dat merkt jouw zenuwstelsel direct.\n\nEen dalende bloedsuiker wordt door je lichaam gezien als stress. Je maakt meer cortisol aan, je lichaam gaat in de overlevingsstand, je krijgt trek, je energie zakt weg, en je verlangt naar snelle suikers. Niet omdat je geen discipline hebt, maar omdat je lichaam brandstof nodig heeft."},
      {t:"Eiwitten: de bouwstenen van herstel",b:"Van alle voedingsstoffen verdienen eiwitten misschien wel de meeste aandacht. Eiwitten bestaan uit aminozuren, de bouwstenen voor spieren, hormonen, enzymen, bindweefsel, huid, haar, nagels en neurotransmitters. En juist die neurotransmitters zijn belangrijk voor jouw stemming en zenuwstelsel: denk aan stoffen zoals serotonine, dopamine en GABA.\n\nWanneer je onvoldoende eiwitten eet, heeft jouw lichaam minder bouwstoffen beschikbaar om deze aan te maken. Als algemene richtlijn kun je uitgaan van 1,2 tot 1,8 gram eiwit per kilogram lichaamsgewicht per dag. Wanneer je actief bent, wilt afvallen of spiermassa wilt behouden, ligt de behoefte vaak hoger. Verdeel je eiwitten over de dag, zo geef je je lichaam voortdurend nieuwe bouwstoffen.\n\nGoede bronnen dierlijk: eieren, kip, kalkoen, rundvlees, vis, Griekse yoghurt, kwark, cottage cheese.\nGoede bronnen plantaardig: linzen, kikkererwten, tempeh, tofu, bonen, edamame, hennepzaad, pompoenpitten. Kies zoveel mogelijk voor onbewerkte voeding, je lichaam herkent échte voeding."},
      {t:"Wanneer je lichaam om eiwitten vraagt",b:"Merk je haaruitval, brokkelige nagels, een doffe huid, langzaam herstellende blessures of spierverlies, terwijl je verder gezond eet? Dit zijn vaak signalen die wijzen op een tekort aan eiwitten.\n\nJe lichaam bouwt namelijk eerst de belangrijkste functies op, zoals organen en spieren. Haar, huid en nagels staan onderaan de prioriteitenlijst, en zijn dus vaak de eerste plek waar een tekort zichtbaar wordt.\n\nDaarom is het juist bij deze ongemakken belangrijk om eerst te kijken naar je eiwitinname, voordat je naar dure supplementen of behandelingen grijpt. Soms is de oplossing simpelweg: meer en regelmatiger eiwitten eten."},
      {t:"Bloedsuiker en stress",b:"Je bloedsuiker heeft veel invloed op je zenuwstelsel. Wanneer je bloedsuiker voortdurend piekt en daalt, voel je meer onrust, krijg je sneller trek, ben je sneller geïrriteerd, ervaar je meer vermoeidheid, en maak je meer stresshormonen aan.\n\nEen stabiele bloedsuiker helpt je zenuwstelsel om stabieler te blijven. Dat betekent niet dat je nooit meer iets lekkers mag eten, maar probeer maaltijden zoveel mogelijk op te bouwen uit eiwitten, gezonde vetten, vezels en langzame koolhydraten."},
      {t:"Gezonde vetten zijn essentieel",b:"Je hersenen bestaan voor een groot deel uit vet. Ook zenuwcellen hebben gezonde vetten nodig. Goede bronnen zijn: avocado, extra vierge olijfolie, noten, zaden, wilde vette vis, lijnzaad, chiazaad, walnoten. Wees niet bang voor gezonde vetten, ze helpen juist bij verzadiging en hormonale balans."},
      {t:"Drink voldoende water",b:"Uitdroging is ook stress. Zelfs een klein vochttekort kan invloed hebben op concentratie, energie, stemming, hoofdpijn en vermoeidheid. Drink verspreid over de dag voldoende water. Voeg eventueel een snufje Keltisch zeezout en een beetje citroen toe voor extra mineralen."},
    ],
    exercises:[
      {t:"Kijk eens eerlijk naar je dag",inst:"Schrijf op wat je gisteren hebt gegeten: ontbijt, lunch, avondeten, tussendoor en drinken. Beantwoord daarna: heb ik voldoende eiwitten gegeten? Heb ik voldoende gedronken? Heb ik regelmatig gegeten? Wanneer voelde ik energiedips? Wanneer had ik veel trek? Niet om jezelf te veroordelen, maar om bewust te worden.",prompts:["Wat at ik gisteren: ontbijt, lunch, avondeten, tussendoor?","Heb ik voldoende eiwitten gegeten?","Wanneer voelde ik energiedips?"]},
      {t:"Kijk eens eerlijk naar je lichaam",prompts:["Merk ik haaruitval, brokkelige nagels of een doffe huid?","Herstel ik langzaam van blessures of spierpijn?","Eet ik bij elke maaltijd een duidelijke eiwitbron?"]},
      {t:"Kleine stappen maken het verschil",inst:"Je hoeft niet morgen alles anders te doen. Begin klein, bijvoorbeeld met: iedere maaltijd een eiwitbron, elke ochtend een groot glas water, minder ultra-bewerkte voeding, meer groenten, rustig eten, goed kauwen, luisteren naar je lichaam. Kleine veranderingen, grote impact.",prompts:["Wat is mijn kleinste haalbare stap deze week?"]},
    ],
    aff:"Mijn lichaam verdient echte voeding. Ik hoef niet perfect te eten. Ik mag mijn lichaam stap voor stap geven wat het nodig heeft. Elke maaltijd is een nieuwe kans om mijn lichaam te ondersteunen. Want herstellen begint niet alleen in mijn hoofd, het begint op mijn bord."
  },
  {
    id:7, emoji:"💎", color:T.mauve,
    title:"Bonus: Mineralen: de vergeten sleutel voor een rustig zenuwstelsel",
    quote:"Je kunt nog zo gezond eten, maar zonder voldoende mineralen kan jouw lichaam stress veel moeilijker verwerken.",
    sections:[
      {t:"Waarom mineralen zo belangrijk zijn",b:"Wanneer we het hebben over gezondheid, denken de meeste mensen aan vitamines. Maar wist je dat jouw lichaam mineralen nodig heeft om die vitamines überhaupt goed te kunnen gebruiken?\n\nMineralen zijn betrokken bij duizenden processen in je lichaam. Ze zorgen ervoor dat zenuwen met elkaar kunnen communiceren, dat spieren kunnen ontspannen, dat je hart klopt, dat je hormonen worden aangemaakt, dat je energie kunt produceren, en dat jouw zenuwstelsel na een stressvolle situatie weer kan herstellen.\n\nWanneer je langdurig stress ervaart, verbruik je meer mineralen. En juist daardoor ontstaat er vaak een vicieuze cirkel: stress zorgt voor een hoger verbruik, een tekort zorgt ervoor dat je gevoeliger wordt voor stress."},
      {t:"Stress rooft mineralen",b:"Iedere keer dat jij stress ervaart, gebeurt er van alles in je lichaam: je hartslag stijgt, je ademhaling verandert, je spieren spannen zich aan, je lichaam maakt stresshormonen aan. Al deze processen kosten voedingsstoffen.\n\nHoe langer jouw lichaam in de overlevingsstand staat, hoe groter de kans dat jouw reserves langzaam uitgeput raken. Daarom voelen veel mensen zich na een lange periode van stress niet alleen mentaal moe, maar ook lichamelijk leeg."},
      {t:"Magnesium: de ontspanningsmineraal",b:"Magnesium is misschien wel het bekendste mineraal als het gaat om ontspanning. Het speelt een rol bij meer dan 300 processen in het lichaam, onder andere bij: spierontspanning, zenuwgeleiding, energieproductie, slaap, herstel, stressregulatie.\n\nVeel mensen krijgen ongemerkt te weinig magnesium binnen. Tekenen die daarbij kunnen passen zijn onder andere: gespannen spieren, trillingen, ooglidtrekkingen, slecht slapen, onrust, vermoeidheid, hoofdpijn. Een tekort is niet altijd de enige oorzaak van deze klachten, maar het kan wel bijdragen."},
      {t:"Natrium: niet alleen iets om te vermijden",b:"Jarenlang hebben we geleerd dat zout slecht is, maar dat verhaal is genuanceerder. Je lichaam heeft natrium nodig voor de vochtbalans, zenuwgeleiding, spierfunctie en bloeddrukregulatie.\n\nHet gaat vooral om het verschil tussen sterk bewerkt keukenzout en natuurlijke bronnen. Sommige mensen kiezen daarom bewust voor een kleine hoeveelheid ongeraffineerd zeezout, zoals Keltisch zeezout, als onderdeel van een verder gezond voedingspatroon."},
      {t:"Kalium en calcium",b:"Kalium werkt nauw samen met natrium en ondersteunt spierfunctie, zenuwprikkels, vochtbalans en hartfunctie. Het zit van nature in voedingsmiddelen zoals avocado, banaan, aardappelen, zoete aardappel, spinazie, tomaten en bonen.\n\nVeel mensen kennen calcium alleen van botten, maar calcium is ook belangrijk voor spiercontracties, zenuwgeleiding, hartfunctie en hormoonafgifte. Ook hierbij draait het om balans: mineralen werken namelijk samen, meer van een betekent niet automatisch beter."},
      {t:"Mijn ochtendritueel",b:"Een eenvoudig ritueel waarmee ik mijn dag graag begin: een groot glas water, een klein snufje Keltisch zeezout, vers citroensap, rustig opdrinken, daarna een eiwitrijk ontbijt.\n\nNiet omdat dit alles oplost, maar omdat ik mijn lichaam direct wil geven wat het nodig heeft. Zie het als een liefdevolle manier om tegen je lichaam te zeggen: ik zorg vandaag voor je."},
    ],
    exercises:[
      {t:"Voedingscheck",prompts:["Drink ik voldoende water?","Eet ik dagelijks groenten?","Eet ik voldoende eiwitten?","Hoeveel ultra-bewerkte producten eet ik?","Voel ik mij vaak leeg of uitgeput?","Heb ik regelmatig spierkrampen of gespannen spieren?","Hoe is mijn energieniveau gedurende de dag?"]},
      {t:"Kleine gewoontes, groot verschil",inst:"Kies een gewoonte voor de komende week: iedere ochtend een groot glas water, meer groenten bij de lunch, een extra eiwitbron toevoegen, minder frisdrank, minder ultra-bewerkte snacks, of rustig eten zonder telefoon. Kleine veranderingen zijn makkelijker vol te houden, en juist die zorgen op de lange termijn voor de grootste resultaten.",prompts:["Welke gewoonte ga ik deze week veranderen?"]},
    ],
    aff:"Mijn lichaam heeft geen perfectie nodig. Mijn lichaam heeft voeding nodig. Ik mag mezelf voeden met liefde, aandacht en echte bouwstoffen. Iedere kleine keuze helpt mijn lichaam herstellen. En iedere dag geef ik mijn zenuwstelsel een nieuwe kans om sterker te worden."
  },
  {
    id:8, emoji:"🌿", color:T.sage,
    title:"Bonus: De kracht van beweging: uit de freeze, terug in je lichaam",
    quote:"Juist op de dagen dat je nergens zin in hebt, heeft je lichaam vaak beweging nodig. Niet om calorieën te verbranden. Maar om spanning los te laten.",
    sections:[
      {t:"Welkom",b:"Als ik vroeger op de bank lag en nergens energie voor had, dacht ik altijd hetzelfde: ik moet gewoon even uitrusten. Dus bleef ik liggen, ik scrolde, keek een serie, pakte mijn telefoon. En voelde me daarna nog leger.\n\nMisschien herken je dat. Je weet dat een wandeling je goed zou doen, dat frisse lucht fijn is, dat bewegen helpt. Maar je krijgt jezelf gewoon niet in beweging. En daarna veroordeel je jezelf: waarom lukt het mij niet?\n\nMaar wat als je lichaam niet lui is? Wat als je lichaam vastzit? Dat is precies waar deze bonusmodule over gaat."},
      {t:"Echte vermoeidheid versus freeze",b:"Laten we beginnen met een belangrijk verschil. Niet alle vermoeidheid is hetzelfde.\n\nEchte lichamelijke vermoeidheid: na een drukke dag, na intensief sporten, na een slechte nacht. Je lichaam vraagt om rust. Wanneer je rust neemt, voel je je daarna meestal beter.\n\nBij freeze werkt het anders. Je rust, maar knapt niet op. Je blijft liggen, je scrolt, je voelt schuldgevoel, je hebt nergens zin in. Je weet wat goed voor je is, maar krijgt jezelf niet in beweging. Dat komt omdat jouw zenuwstelsel energie vasthoudt, niet omdat je geen discipline hebt."},
      {t:"Waarom beweging helpt",b:"Wanneer jouw lichaam langdurig stress ervaart, spannen spieren zich aan. Dat is normaal. Maar wanneer die spanning nooit wordt ontladen, blijft het lichaam als het ware aan staan.\n\nBeweging helpt om die opgeslagen spanning los te laten. Niet omdat je hard moet sporten, maar omdat jouw lichaam gemaakt is om te bewegen. Kijk maar naar dieren: na een stressvolle situatie schudden ze hun lichaam uit, ze rennen, ze bewegen, en daarna ontspannen ze weer. Wij slaan dat deel vaak over, wij gaan weer achter een scherm zitten en nemen de spanning mee."},
      {t:"Je hoeft niet naar de sportschool",b:"Wanneer mensen het woord bewegen horen, denken ze vaak aan hardlopen, fitness, bootcamp of sportschool. Maar regulerende beweging ziet er heel anders uit. Denk aan: wandelen, rekken, dansen, schudden, yoga, rustig fietsen, op blote voeten lopen, bewust ademen tijdens het bewegen. Het gaat niet om prestaties, het gaat om ontladen."},
      {t:"Muziek verandert je staat",b:"Heb je ooit gemerkt dat een nummer je hele stemming kan veranderen? Dat is geen toeval. Muziek heeft direct invloed op je zenuwstelsel. Een nummer waar jij blij van wordt, kan je helpen om uit de freeze te komen. Niet omdat alle problemen verdwijnen, maar omdat jouw lichaam weer iets begint te voelen."},
      {t:"Begin klein",b:"Een veelgemaakte fout is denken dat je direct een uur moet wandelen, of drie keer per week moet sporten. Daardoor wordt de drempel alleen maar hoger.\n\nVraag jezelf liever af: wat is de kleinste beweging die vandaag mogelijk is? Misschien is dat een minuut lopen, vijf squats, even rekken, een rondje door de tuin, een liedje dansen. En weet je? Dat is genoeg.\n\nNa beweging maken je hersenen stoffen aan zoals dopamine en endorfines. Deze stoffen kunnen bijdragen aan meer energie, een betere stemming, meer motivatie en minder spanning."},
    ],
    exercises:[
      {t:"De één-liedje-regel",inst:"Kies een nummer waar jij blij van wordt, niet omdat het moet, maar omdat je lichaam ervan aangaat. Zet het nummer aan en beweeg, niet mooi, niet perfect, gewoon zoals jouw lichaam wil bewegen.\n\nNa afloop vraag je jezelf: hoe voelde ik mij vóór het nummer? Hoe voel ik mij nu? Wat is er veranderd?",prompts:["Hoe voelde ik mij voor het nummer?","Hoe voel ik mij nu?"]},
      {t:"Schud spanning los",inst:"Ga stevig staan. Begin met je handen los te schudden, daarna je armen, je schouders, je benen, je heupen. Laat je hele lichaam meedoen. Schud twee minuten. Blijf daarna een minuut stil staan, voel na.",prompts:[]},
      {t:"Wandelen zonder doel",inst:"Maak deze week een wandeling, niet om stappen te halen, niet om calorieën te verbranden, maar om aanwezig te zijn. Laat je telefoon in je zak. Voel de wind, de zon, de temperatuur, de grond onder je voeten. Loop rustig, adem, en kijk om je heen. Je hoeft nergens heen, je bent er al.",prompts:[]},
      {t:"Rek jezelf wakker",inst:"Wanneer je merkt dat je vastzit: rek jezelf langzaam uit, alsof je net wakker wordt. Maak jezelf lang, rol je schouders, draai je nek voorzichtig los, open je borst, adem diep in en zucht uit. Soms is dat al genoeg om je systeem uit de bevriezing te halen.",prompts:[]},
      {t:"Reflectie",prompts:["Wanneer merk ik dat ik in freeze zit?","Welke vorm van beweging past bij mij?","Welke muziek geeft mij energie?","Hoe voelde ik mij na de oefeningen?","Wat wil ik vaker gaan doen?"]},
    ],
    aff:"Ik hoef mezelf niet te pushen. Ik mag mijn lichaam zacht uitnodigen tot beweging. Iedere stap helpt, iedere ademhaling helpt, iedere beweging brengt mij een stukje dichter bij mezelf. Mijn lichaam weet de weg naar herstel."
  },
  {
    id:9, emoji:"🦁", color:"#E8A44A",
    title:"Hoe dieren ons de weg wijzen: uit de freeze",
    quote:"Dieren schudden stress letterlijk van zich af. Wij mensen zijn dat verleerd. Maar we kunnen het opnieuw leren.",
    sections:[
      {t:"Wat dieren ons leren",b:"Kijk eens naar een zebra die net is ontsnapt aan een leeuw. Wat doet die zebra? Hij stopt, hij trilt, hij schudt zijn hele lichaam uit. En dan graast hij gewoon weer verder.\n\nDat is geen zwakte. Dat is biologische intelligentie. Dieren ontladen spanning automatisch na een bedreiging. Hun zenuwstelsel weet precies wat het moet doen: de opgebouwde vecht-of-vlucht energie afvoeren via beweging en trillen.\n\nWij mensen doen dat niet meer. We houden ons groot, we gaan weer aan het werk, we nemen de spanning mee. En dat is precies waarom zo veel vrouwen vastzitten in een chronische overlevingsstand."},
      {t:"Freeze: het meest misbegrepen overlevingsmechanisme",b:"Wanneer een dier wordt aangevallen en niet kan vluchten of vechten, speelt het dood. Het lichaam bevriest volledig, de hartslag daalt, de pijn wordt gedempt, het bewustzijn vervaagt. Dat is freeze.\n\nBij mensen ziet freeze er zo uit: je wilt iets doen maar kunt jezelf niet in beweging krijgen, je ligt op de bank terwijl je weet dat je moet opstaan, je kijkt naar je telefoon maar registreert niets, je bent aanwezig maar ook niet echt er, je voelt je leeg, vlak, verdoofd, je reageert niet op berichten, alles voelt zwaar en traag.\n\nDit is geen luiheid. Dit is een zenuwstelsel dat heeft besloten: stilstand is de veiligste optie."},
      {t:"Waarom uit freeze komen anders werkt",b:"Het grote misverstand is dat je uit freeze komt door harder je best te doen: door jezelf te motiveren, door een to-do lijst te maken, door gewoon te beginnen. Maar freeze is een lichamelijke staat, geen mentale keuze. Je kunt jezelf niet denken uit freeze.\n\nWat wel helpt: kleine zachte bewegingen, niet groot of krachtig; warmte zoals een warme douche, een deken, warme thee; zintuiglijke prikkels zoals een geur, een textuur, een geluid; rustige aanwezigheid van een ander mens of dier; heel langzaam ademen; de grond onder je voeten voelen.\n\nHet gaat erom je zenuwstelsel zacht te laten weten: het gevaar is voorbij, je kunt nu voorzichtig uit de stilstand komen."},
      {t:"Het trillingsreflex: de sleutel",b:"TRE, Tension and Trauma Releasing Exercises, is gebaseerd op precies dit principe. Het activeert de natuurlijke trillingsreflex die dieren automatisch gebruiken.\n\nWanneer je lichaam begint te trillen tijdens TRE, is dat geen zwakte. Dat is je zenuwstelsel dat doet wat het altijd al heeft willen doen: ontladen. Niet denken, niet begrijpen, niet verwerken, gewoon ontladen.\n\nEn na die ontlading? Voelen veel vrouwen een diepe rust die ze al jaren niet meer hebben gevoeld."},
    ],
    exercises:[
      {t:"Uit freeze stappen: de 4-stappen methode",inst:"Wanneer je merkt dat je in freeze zit, doe dit:\n\nStap 1, erken het zonder oordeel. Zeg tegen jezelf: mijn lichaam is nu in freeze, dat is oké, dat is veilig.\n\nStap 2, voel de grond. Zet beide voeten plat op de vloer, druk ze bewust naar beneden, voel het contact. Dit vertelt je zenuwstelsel: ik sta op vaste grond.\n\nStap 3, een kleine beweging. Niet opstaan, niet presteren, alleen: beweeg een vinger, dan je hand, dan je pols, heel langzaam.\n\nStap 4, adem verlengd uit. Adem in door je neus, 4 tellen. Adem langzaam uit door je mond, 8 tellen. Dit activeert je parasympathisch zenuwstelsel.",prompts:["Hoe voelde ik mij voor de oefening?","Welke stap hielp het meest?","Wat merkte ik in mijn lichaam?"]},
      {t:"Het dierenschud",inst:"Dit is de meest directe manier om je zenuwstelsel te ontladen, precies zoals dieren dat doen. Ga stevig staan, voeten op schouderbreedte.\n\nBegin bij je voeten, maak kleine trilbewegingen, alsof je de koude van je af schudt. Laat het langzaam opstijgen: enkels, knieën, heupen, laat ze los bewegen, buik, schouders, armen, schud ze los, handen, laat ze bengelen, hoofd, heel voorzichtig.\n\nDoe dit drie minuten. Niet mooi, niet gecontroleerd, gewoon schudden. Stop dan, sta stil, adem, voel na. Wat heeft je lichaam losgelaten?",prompts:["Hoe voelde het schudden?","Wat veranderde er in mijn lichaam?","Welke emotie of sensatie kwam op?"]},
      {t:"Warmte als veiligheid",inst:"Wanneer je in diepe freeze zit en beweging te veel voelt: maak een kop warme thee of cacao, wikkel een deken om je heen, neem een warme douche of bad, leg een warmwaterkruik op je buik.\n\nWarmte stuurt direct een signaal van veiligheid naar je zenuwstelsel. Het is een van de meest onderschatte regulatietools.\n\nZeg innerlijk: ik ben veilig, ik mag warm zijn, mijn lichaam mag ontdooien.",prompts:["Welke warmtebron hielp mij vandaag?","Hoe voelde mijn lichaam voor en na?"]},
    ],
    aff:"Mijn lichaam weet hoe het spanning los moet laten. Ik hoef het alleen maar de ruimte te geven. Zoals dieren dat doen, van nature, zonder oordeel."
  },
  {
    id:10, emoji:"🌅", color:"#E8A44A",
    title:"Wakker worden: lichaam activeren voor de dag",
    quote:"Je lichaam heeft geen pomp voor je lymfestelsel, zoals je hart dat heeft voor je bloed. Beweging is de enige manier om het te laten stromen.",
    sections:[
      {t:"Waarom je lichaam beweging nodig heeft voordat je hoofd aan zet",b:"Je lymfestelsel voert afvalstoffen, gifstoffen en ontstekingsstoffen af uit je lichaam. Maar in tegenstelling tot je bloedsomloop heeft het geen eigen pomp. Het is afhankelijk van spierbeweging, ademhaling en zwaartekrachtveranderingen om te stromen.\n\nEen nacht stilliggen betekent: je lymfestelsel staat ook stil. Vandaar dat veel mensen 's ochtends stijf, traag of opgeblazen wakker worden, niet omdat er iets mis is, maar omdat alles letterlijk is blijven liggen."},
      {t:"De lymfatische pomp",b:"Een simpele, krachtige techniek: lichtjes op- en neerveren op je tenen, alsof je heel zachtjes aan het springen bent zonder van de grond te komen. Dit creëert een pompbeweging die je lymfevocht in beweging zet, vooral effectief in de benen, waar vocht door de zwaartekracht het makkelijkst blijft hangen."},
      {t:"Lichaam wakker maken",b:"Voordat je gedachten op gang komen, mag je lichaam eerst weten dat de dag begint. Dit is geen training, het is een seintje aan je zenuwstelsel: we zijn wakker, we zijn veilig, we mogen bewegen."},
    ],
    exercises:[
      {t:"De lymfatische pomp (bouncen)",inst:"Ga stevig staan, voeten op heupbreedte. Veer zachtjes op je tenen op en neer, alsof je heel licht stuitert, zonder echt van de grond te komen. Laat je armen ontspannen meebewegen.\n\nDoe dit een tot twee minuten. Voel hoe je benen en voeten warmer en lichter worden.",prompts:["Hoe voelden mijn benen voor en na het bouncen?"]},
      {t:"Lichaam wakker maken",inst:"Voordat je opstaat: rek je hele lichaam uit, gaap bewust een paar keer, masseer kort je gezicht en je oren, wrijf je handen warm en leg ze op je ogen, rol je schouders een paar keer.\n\nLaat je lichaam merken: de dag begint, en ik mag er rustig in komen.",prompts:["Hoe voelde mijn lichaam na het wakker maken?"]},
    ],
    aff:"Mijn lichaam mag wakker worden voordat mijn hoofd aan het werk gaat. Beweging is mijn ochtendgroet aan mezelf."
  },
];

const s = {
  wrap:{maxWidth:680,margin:"0 auto",padding:"44px 18px 110px"},
  ey:{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:T.rose,marginBottom:10,display:"block"},
  h1:{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(2.5rem,8vw,4.5rem)",fontWeight:300,lineHeight:1.05,marginBottom:18},
  h2:{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(1.5rem,4vw,2.3rem)",fontWeight:300,lineHeight:1.2,marginBottom:14},
  h3:{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(1.1rem,3vw,1.5rem)",fontWeight:300,lineHeight:1.3,marginBottom:10},
  em:{fontStyle:"italic",color:T.rose},
  mu:{color:T.muted,fontSize:14,lineHeight:1.85},
  card:(e={})=>({background:T.dark,border:"1px solid rgba(249,132,229,0.1)",borderRadius:14,padding:"20px 16px",marginBottom:10,...e}),
  btn:(bg=T.rose,fg=T.black)=>({display:"inline-flex",alignItems:"center",gap:8,background:bg,color:fg,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",padding:"13px 24px",borderRadius:50,transition:"all 0.2s",textDecoration:"none",whiteSpace:"nowrap"}),
  sm:{display:"inline-flex",alignItems:"center",gap:6,background:"none",color:T.rose,border:"1px solid rgba(249,132,229,0.3)",cursor:"pointer",fontSize:11,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",padding:"8px 16px",borderRadius:50,transition:"all 0.2s"},
  inp:{width:"100%",background:"rgba(249,132,229,0.05)",border:"1px solid rgba(249,132,229,0.15)",borderRadius:9,padding:"11px 14px",color:T.cream,fontSize:14,marginBottom:10},
  ta:{width:"100%",background:"rgba(249,132,229,0.05)",border:"1px solid rgba(249,132,229,0.15)",borderRadius:9,padding:"11px 14px",color:T.cream,fontSize:14,minHeight:85,resize:"vertical"},
  row:(a)=>({display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:11,border:`1px solid ${a?"rgba(249,132,229,0.4)":"rgba(249,132,229,0.08)"}`,background:a?"rgba(249,132,229,0.1)":"transparent",cursor:"pointer",marginBottom:7,transition:"all 0.15s"}),
  dot:(a)=>({width:20,height:20,borderRadius:"50%",border:`1.5px solid ${a?T.rose:"rgba(249,132,229,0.3)"}`,background:a?T.rose:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}),
};

function ProgBar({value,color=T.rose}){
  return(
    <div style={{height:3,background:"rgba(249,132,229,0.12)",borderRadius:50,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${value}%`,background:color,borderRadius:50,transition:"width 0.4s ease"}}/>
    </div>
  );
}

function CheckRow({item,checked,onToggle}){
  const [sp,setSp]=useState(false);
  return(
    <div onClick={()=>{if(!checked){setSp(true);setTimeout(()=>setSp(false),700);}onToggle();}} style={{...s.row(checked),position:"relative"}}>
      <div style={s.dot(checked)}>{checked&&<span style={{color:T.black,fontSize:10,fontWeight:700}}>✓</span>}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,color:checked?T.rose:T.cream}}>{item.emoji} {item.title}</div>
        <div style={{fontSize:11,color:T.muted,marginTop:2}}>{item.desc} · {item.time}</div>
      </div>
      {sp&&<span style={{position:"absolute",right:10,fontSize:16,color:T.rose,animation:"spark 0.7s ease-out forwards"}}>✦</span>}
    </div>
  );
}

function BreathTimer({ex}){
  const phases=[
    {key:"inhale",label:"Adem in",dur:ex.inhale},
    {key:"hold",label:"Houd vast",dur:ex.hold},
    {key:"exhale",label:"Adem uit",dur:ex.exhale},
    {key:"hold2",label:"Rust",dur:ex.hold2},
  ].filter(p=>p.dur>0);

  const [running,setRunning]=useState(false);
  const [done,setDone]=useState(false);
  const [pi,setPi]=useState(0);
  const [count,setCount]=useState(0);
  const [round,setRound]=useState(0);
  const [scale,setScale]=useState(1);
  const piRef=useRef(0),roundRef=useRef(0),tmr=useRef(null);

  const tick=useCallback(()=>{
    setCount(c=>{
      const cur=phases[piRef.current];
      if(c+1>=cur.dur){
        const next=(piRef.current+1)%phases.length;
        piRef.current=next;
        if(next===0){
          roundRef.current+=1;
          setRound(roundRef.current);
          if(roundRef.current>=ex.rounds){setRunning(false);setDone(true);return 0;}
        }
        setPi(next);
        setScale(phases[next].key==="inhale"?1.38:phases[next].key==="exhale"?0.78:1.05);
        return 0;
      }
      return c+1;
    });
  },[phases,ex.rounds]);

  useEffect(()=>{
    if(running){tmr.current=setInterval(tick,1000);}
    else{clearInterval(tmr.current);}
    return()=>clearInterval(tmr.current);
  },[running,tick]);

  const start=()=>{
    if(done){setDone(false);setRound(0);roundRef.current=0;piRef.current=0;setPi(0);}
    setScale(1.38);setCount(0);setRunning(true);
  };
  const reset=()=>{
    clearInterval(tmr.current);
    setRunning(false);setDone(false);setRound(0);roundRef.current=0;
    piRef.current=0;setPi(0);setCount(0);setScale(1);
  };

  const cur=phases[pi]||phases[0];
  const circ=2*Math.PI*72;
  const prog=cur?(count/cur.dur)*100:0;

  return(
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{position:"relative",width:220,height:220,margin:"0 auto 24px"}}>
        <div style={{position:"absolute",inset:-10,borderRadius:"50%",border:`1px solid ${ex.color}15`}}/>
        <svg width="220" height="220" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
          <circle cx="110" cy="110" r="72" fill="none" stroke={`${ex.color}18`} strokeWidth="4"/>
          <circle cx="110" cy="110" r="72" fill="none" stroke={ex.color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ-(prog/100)*circ}
            style={{transition:"stroke-dashoffset 0.95s linear"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{
            width:116,height:116,borderRadius:"50%",
            background:`radial-gradient(circle at 38% 38%, ${ex.color}40, ${ex.color}14)`,
            border:`2px solid ${ex.color}50`,
            transform:`scale(${scale})`,
            transition:"transform 1s ease-in-out",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            boxShadow:running?`0 0 32px ${ex.color}30`:"none",
          }}>
            <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:34,color:T.cream,fontWeight:300,lineHeight:1}}>
              {running?cur.dur-count:done?"✓":"·"}
            </span>
            {running&&<span style={{fontSize:9,color:`${T.cream}70`,letterSpacing:"0.15em",textTransform:"uppercase",marginTop:3}}>{cur.label}</span>}
          </div>
        </div>
      </div>
      <div style={{minHeight:28,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>
        {done
          ?<p style={{fontSize:16,color:T.sage}}>Voltooid! Goed gedaan.</p>
          :running
            ?<p style={{fontFamily:"Cormorant Garamond,serif",fontSize:20,fontStyle:"italic",color:ex.color}}>{cur.label}</p>
            :<p style={{fontSize:12,color:T.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Klaar om te beginnen?</p>
        }
      </div>
      <div style={{display:"flex",gap:5,justifyContent:"center",marginBottom:22}}>
        {Array.from({length:Math.min(ex.rounds,12)}).map((_,i)=>(
          <div key={i} style={{width:7,height:7,borderRadius:"50%",background:i<round?ex.color:`${ex.color}28`,transition:"background 0.3s"}}/>
        ))}
      </div>
      {!running&&!done&&<p style={{fontSize:12,color:T.muted,marginBottom:18}}>{ex.inhale}s in {ex.hold?`· ${ex.hold}s vast `:""}{ex.exhale}s uit{ex.hold2?` · ${ex.hold2}s rust`:""} · {ex.rounds} rondes</p>}
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button style={s.btn(ex.color)} onClick={running?()=>setRunning(false):start}>{running?"Pauzeer":done?"Opnieuw":"Start"}</button>
        <button style={s.sm} onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default function App(){
  const [screen,setScreen]=useState("hero");
  const [tab,setTab]=useState("home");
  const [openMod,setOpenMod]=useState(null);
  const [journal,setJournal]=useState({});
  const [mDone,setMDone]=useState({});
  const [dDone,setDDone]=useState({});
  const [eDone,setEDone]=useState({});
  const [pLog,setPLog]=useState([]);
  const [weight,setWeight]=useState(65);
  const [ciData,setCiData]=useState({});
  const [ciResult,setCiResult]=useState(null);
  const [selBreath,setSelBreath]=useState(null);
  const [streak,setStreak]=useState(4);
  const [sos,setSos]=useState(false);
  const [modDone,setModDone]=useState({});
  const [selfies,setSelfies]=useState({});
  const [logList,setLogList]=useState([]);
  const [logForm,setLogForm]=useState({mood:"",energy:"",body:[],win:"",note:"",gratitude:""});
  const [logSaved,setLogSaved]=useState(false);
  const [water,setWater]=useState(0);
  const [accessCode,setAccessCode]=useState("");
  const [accessError,setAccessError]=useState("");

  const topRef=useRef(null);
  const scrollTop=()=>topRef.current?.scrollIntoView({behavior:"smooth"});

  const mPct=Math.round(Object.values(mDone).filter(Boolean).length/MORNING.length*100);
  const dPct=Math.round(Object.values(dDone).filter(Boolean).length/MIDDAY.length*100);
  const ePct=Math.round(Object.values(eDone).filter(Boolean).length/EVENING.length*100);
  const totalP=pLog.reduce((a,n)=>{const f=PROTEINS.find(p=>p.name===n);return a+(f?f.p:0);},0);
  const pGoal=Math.round(weight*1.5);

  const nav=(t)=>{setTab(t);setOpenMod(null);setSelBreath(null);scrollTop();};

  const CODES=["OYMB2026","OVERLEVEN","WENDY2026","OYMB"];
  const checkAccess=()=>{
    if(CODES.includes(accessCode.trim().toUpperCase())){setScreen("app");scrollTop();}
    else{setAccessError("Deze code is niet geldig. Controleer je code of neem contact op met Wendy.");}
  };

  if(screen==="hero") return(
    <div style={{minHeight:"100svh",background:T.black,color:T.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"80px 24px",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>
      <div style={{position:"absolute",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(249,132,229,0.13) 0%,transparent 65%)",top:"50%",left:"50%",animation:"glowPulse 6s ease-in-out infinite",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2}}>
        <span style={s.ey}>Open Your Mind Bewustzijn · Wendy van der Vecht</span>
        <h1 style={s.h1}>Van Overleven<br/><em style={s.em}>naar Leven</em></h1>
        <p style={{...s.mu,maxWidth:420,margin:"0 auto 36px"}}>Het programma dat jou helpt terug te keren naar jezelf via je lichaam, niet via je hoofd.</p>
        <button style={s.btn()} onClick={()=>{setScreen("access");scrollTop();}}>Start het programma</button>
      </div>
    </div>
  );

  if(screen==="access") return(
    <div style={{minHeight:"100svh",background:T.black,color:T.cream,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>
      <div style={{position:"absolute",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(249,132,229,0.12) 0%,transparent 65%)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:2,maxWidth:380,width:"100%"}}>
        <div style={{fontSize:48,marginBottom:20}}>🌸</div>
        <span style={s.ey}>Open Your Mind Bewustzijn</span>
        <h2 style={{...s.h2,marginBottom:8}}>Welkom bij<br/><em style={s.em}>Van Overleven naar Leven</em></h2>
        <p style={{...s.mu,marginBottom:32,fontSize:14}}>Vul je toegangscode in om de app te openen.</p>
        <div style={{background:T.dark,border:"1px solid rgba(249,132,229,0.2)",borderRadius:16,padding:"28px 24px",marginBottom:20}}>
          <div style={{fontSize:12,color:T.muted,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:12}}>Toegangscode</div>
          <input type="text" placeholder="Bijv. OYMB2026" value={accessCode}
            onChange={e=>{setAccessCode(e.target.value.toUpperCase());setAccessError("");}}
            onKeyDown={e=>e.key==="Enter"&&checkAccess()}
            style={{...s.inp,textAlign:"center",fontSize:18,letterSpacing:"0.2em",fontWeight:500,marginBottom:16,color:T.rose}}/>
          {accessError&&<p style={{fontSize:13,color:T.rose,marginBottom:12}}>{accessError}</p>}
          <button style={{...s.btn(),width:"100%",justifyContent:"center"}} onClick={checkAccess}>Open de app</button>
        </div>
        <div style={{fontSize:13,color:T.muted,marginBottom:12}}>Nog geen toegang?</div>
        <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20toegang%20tot%20de%20app" target="_blank" rel="noopener noreferrer"
          style={{...s.btn(T.dark,T.rose),border:"1px solid rgba(249,132,229,0.3)",width:"100%",justifyContent:"center",display:"flex"}}>
          Koop toegang via WhatsApp
        </a>
      </div>
    </div>
  );

  const TABS=[
    {id:"home",e:"🏠",l:"Home"},
    {id:"modules",e:"📚",l:"Modules"},
    {id:"routine",e:"🌅",l:"Routine"},
    {id:"breath",e:"🌬",l:"Adem"},
    {id:"selfie",e:"📸",l:"Selfie"},
    {id:"voeding",e:"🥗",l:"Voeding"},
    {id:"logboek",e:"📓",l:"Dagboek"},
    {id:"meer",e:"✨",l:"Meer"},
  ];

  return(
    <div style={{minHeight:"100svh",background:T.black,color:T.cream,fontFamily:"Jost,sans-serif",fontWeight:300}}>
      <style>{G}</style>
      <div ref={topRef}/>
      <div style={{position:"sticky",top:0,zIndex:50,background:"rgba(14,13,11,0.96)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(249,132,229,0.1)",display:"flex",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>nav(t.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 6px",background:"none",border:"none",cursor:"pointer",color:tab===t.id?T.rose:T.muted,borderBottom:`2px solid ${tab===t.id?T.rose:"transparent"}`,transition:"all 0.2s",flex:1,minWidth:44,flexShrink:0}}>
            <span style={{fontSize:15}}>{t.e}</span>
            <span style={{fontSize:8,letterSpacing:"0.05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{t.l}</span>
          </button>
        ))}
      </div>
      <div style={{position:"fixed",bottom:22,right:16,zIndex:100}}>
        <button onClick={()=>setSos(true)} style={{width:52,height:52,borderRadius:"50%",background:"rgba(160,82,122,0.9)",border:"2px solid rgba(249,132,229,0.4)",color:T.cream,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>🆘</button>
      </div>
      {sos&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setSos(false)}>
          <div style={{background:T.dark,borderRadius:18,padding:28,maxWidth:340,width:"100%",border:"1px solid rgba(249,132,229,0.2)"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{...s.h3,textAlign:"center",marginBottom:8}}>Even stoppen</h3>
            <p style={{...s.mu,textAlign:"center",fontSize:13,marginBottom:22}}>Wat heeft je lichaam op dit moment nodig?</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20heb%20nu%20ondersteuning%20nodig" target="_blank" rel="noopener noreferrer" style={s.btn(T.rose)}>Bel of app Wendy nu</a>
              <button style={s.btn(T.mid,T.cream)} onClick={()=>{nav("breath");setSelBreath(BREATHS[0]);setSos(false);}}>Ademhalingsoefening</button>
              <button style={{...s.sm,justifyContent:"center"}} onClick={()=>setSos(false)}>Sluiten</button>
            </div>
          </div>
        </div>
      )}

      {tab==="home"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Welkom terug</span>
          <h2 style={s.h2}>Hoe is het met<br/><em style={s.em}>jouw lichaam vandaag?</em></h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24}}>
            <div style={s.card({textAlign:"center",border:"1px solid rgba(201,169,110,0.25)"})}>
              <div style={{fontSize:26,marginBottom:4}}>🔥</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"2rem",color:T.gold}}>{streak}</div>
              <div style={{fontSize:11,color:T.muted}}>dagen streak</div>
            </div>
            <div style={s.card({textAlign:"center",border:"1px solid rgba(249,132,229,0.25)"})}>
              <div style={{fontSize:26,marginBottom:4}}>💪</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"2rem",color:T.rose}}>{totalP}g</div>
              <div style={{fontSize:11,color:T.muted}}>eiwitten vandaag</div>
            </div>
          </div>
          <div style={s.card({marginBottom:10})}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13}}>🌅 Ochtendroutine</span>
              <span style={{fontSize:13,color:T.gold,fontWeight:500}}>{mPct}%</span>
            </div>
            <ProgBar value={mPct} color={T.gold}/>
          </div>
          <div style={s.card({marginBottom:10})}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13}}>☀️ Overdag routine</span>
              <span style={{fontSize:13,color:"#E8A44A",fontWeight:500}}>{dPct}%</span>
            </div>
            <ProgBar value={dPct} color="#E8A44A"/>
          </div>
          <div style={s.card({marginBottom:28})}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13}}>🌙 Avondroutine</span>
              <span style={{fontSize:13,color:T.mauve,fontWeight:500}}>{ePct}%</span>
            </div>
            <ProgBar value={ePct} color={T.mauve}/>
          </div>
          <div style={{borderLeft:`2px solid ${T.rose}`,paddingLeft:18,marginBottom:28}}>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.2rem",fontStyle:"italic",color:T.muted,lineHeight:1.65}}>Je lichaam liegt niet. Het vertelt de waarheid die je hoofd probeert te overleven.</p>
            <p style={{fontSize:11,color:T.rose,marginTop:10}}>Liefs Wendy</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:36}}>
            {[["📚","Modules","modules"],["🌬","Adem","breath"],["🥗","Voeding","voeding"],["📓","Dagboek","logboek"]].map(([e,l,id])=>(
              <button key={id} onClick={()=>nav(id)} style={s.card({cursor:"pointer",textAlign:"center",border:"1px solid rgba(249,132,229,0.1)"})}>
                <div style={{fontSize:22,marginBottom:6}}>{e}</div>
                <div style={{fontSize:11,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase"}}>{l}</div>
              </button>
            ))}
          </div>

          <div style={{width:36,height:1,background:"rgba(249,132,229,0.15)",margin:"0 auto 32px"}}/>

          <span style={s.ey}>Veelgestelde vragen</span>
          <h2 style={{...s.h2,fontSize:"1.6rem",marginBottom:10}}>Hoe gebruik je<br/><em style={s.em}>deze app?</em></h2>
          <p style={{...s.mu,marginBottom:24}}>Alles wat je moet weten om hier het meeste uit te halen.</p>
          {FAQ.map((item,i)=><FaqItem key={i} item={item}/>)}
        </div>
      )}

      {tab==="modules"&&!openMod&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Van Overleven naar Leven</span>
          <h2 style={s.h2}>Jouw <em style={s.em}>programma</em></h2>
          <p style={{...s.mu,marginBottom:28}}>9 modules om je lichaam te leren begrijpen en terug te keren naar veiligheid.</p>
          {MODULES.map(mod=>(
            <div key={mod.id} onClick={()=>{setOpenMod(mod);scrollTop();}} style={s.card({cursor:"pointer",border:`1px solid ${mod.color}20`,position:"relative",overflow:"hidden"})}>
              {modDone[mod.id]&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:mod.color}}/>}
              <div style={{display:"flex",alignItems:"center",gap:13}}>
                <div style={{width:44,height:44,borderRadius:11,background:`${mod.color}18`,border:`1px solid ${mod.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{mod.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:mod.color,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>Module {mod.id}{modDone[mod.id]?" · Voltooid":""}</div>
                  <div style={{fontSize:14,color:T.cream,lineHeight:1.4}}>{mod.title}</div>
                </div>
                <div style={{color:T.muted}}>›</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="modules"&&openMod&&(
        <div style={s.wrap} className="fu">
          <button style={{...s.sm,marginBottom:22}} onClick={()=>{setOpenMod(null);scrollTop();}}>← Terug</button>
          <div style={{width:44,height:44,borderRadius:11,background:`${openMod.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12}}>{openMod.emoji}</div>
          <span style={{...s.ey,color:openMod.color}}>Module {openMod.id}</span>
          <h2 style={s.h2}>{openMod.title}</h2>
          <div style={{padding:"14px 16px",background:`${openMod.color}10`,borderRadius:11,borderLeft:`3px solid ${openMod.color}`,marginBottom:24}}>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1rem",fontStyle:"italic",color:T.muted,lineHeight:1.65}}>{openMod.quote}</p>
          </div>
          {openMod.sections.map((sec,i)=>(
            <div key={i} style={s.card({marginBottom:10})}>
              <h3 style={s.h3}>{sec.t}</h3>
              <p style={{...s.mu,fontSize:14,whiteSpace:"pre-line"}}>{sec.b}</p>
            </div>
          ))}
          {openMod.exercises.length>0&&(
            <>
              <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:openMod.color,margin:"24px 0 12px"}}>Oefeningen</div>
              {openMod.exercises.map((ex,i)=>(
                <div key={i} style={s.card({border:`1px solid ${openMod.color}18`,marginBottom:10})}>
                  <h3 style={{...s.h3,color:openMod.color}}>{ex.t}</h3>
                  {ex.inst&&<p style={{...s.mu,fontSize:14,whiteSpace:"pre-line",marginBottom:ex.prompts?14:0}}>{ex.inst}</p>}
                  {ex.prompts&&ex.prompts.map((p,pi)=>(
                    <div key={pi} style={{marginBottom:12}}>
                      <div style={{fontSize:12,color:T.muted,marginBottom:6}}>{p}</div>
                      <textarea style={s.ta} placeholder="Schrijf hier vrij..."
                        value={journal[`${openMod.id}-${i}-${pi}`]||""}
                        onChange={e=>setJournal(prev=>({...prev,[`${openMod.id}-${i}-${pi}`]:e.target.value}))}/>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}
          <div style={{textAlign:"center",padding:"26px 18px",background:`${openMod.color}08`,borderRadius:13,border:`1px solid ${openMod.color}12`,marginTop:24,marginBottom:22}}>
            <div style={{fontSize:18,marginBottom:10}}>✨</div>
            <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.05rem",fontStyle:"italic",color:T.cream,lineHeight:1.65}}>{openMod.aff}</p>
          </div>
          <div style={{textAlign:"center"}}>
            <button style={s.btn(openMod.color)} onClick={()=>{setModDone(p=>({...p,[openMod.id]:true}));setOpenMod(null);scrollTop();}}>Module voltooid</button>
          </div>
        </div>
      )}

      {tab==="routine"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Dagelijkse rituelen</span>
          <h2 style={s.h2}>Jouw <em style={s.em}>routines</em></h2>
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:T.gold,marginBottom:10}}>🌅 Ochtendroutine — {mPct}%</div>
          <ProgBar value={mPct} color={T.gold}/>
          <div style={{marginTop:16,marginBottom:28}}>
            {MORNING.map(item=><CheckRow key={item.id} item={item} checked={!!mDone[item.id]} onToggle={()=>setMDone(p=>({...p,[item.id]:!p[item.id]}))}/>)}
          </div>
          {mPct===100&&<div style={s.card({textAlign:"center",border:`1px solid ${T.gold}30`,marginBottom:24})}><div style={{fontSize:28,marginBottom:6}}>🌟</div><p style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.1rem",color:T.gold}}>Ochtendroutine voltooid!</p></div>}
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#E8A44A",marginBottom:10}}>☀️ Overdag routine — {dPct}%</div>
          <ProgBar value={dPct} color="#E8A44A"/>
          <div style={{marginTop:16,marginBottom:28}}>
            {MIDDAY.map(item=><CheckRow key={item.id} item={item} checked={!!dDone[item.id]} onToggle={()=>setDDone(p=>({...p,[item.id]:!p[item.id]}))}/>)}
          </div>
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:T.mauve,marginBottom:10}}>🌙 Avondroutine — {ePct}%</div>
          <ProgBar value={ePct} color={T.mauve}/>
          <div style={{marginTop:16}}>
            {EVENING.map(item=><CheckRow key={item.id} item={item} checked={!!eDone[item.id]} onToggle={()=>setEDone(p=>({...p,[item.id]:!p[item.id]}))}/>)}
          </div>
          {ePct===100&&<div style={s.card({textAlign:"center",border:`1px solid ${T.mauve}30`,marginTop:16})}><div style={{fontSize:28,marginBottom:6}}>🌙</div><p style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.1rem",color:T.mauve}}>Avondroutine voltooid!</p></div>}
        </div>
      )}

      {tab==="breath"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Ademhalingsoefeningen</span>
          <h2 style={s.h2}>Adem je<br/><em style={s.em}>zenuwstelsel rustig</em></h2>
          {!selBreath?(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {BREATHS.map(ex=>(
                <button key={ex.id} style={s.card({cursor:"pointer",textAlign:"left",border:`1px solid ${ex.color}22`,display:"flex",alignItems:"center",gap:14})} onClick={()=>setSelBreath(ex)}>
                  <div style={{width:50,height:50,borderRadius:"50%",background:`${ex.color}18`,border:`2px solid ${ex.color}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:"0.9rem",color:ex.color}}>{ex.inhale}-{ex.exhale}</span>
                  </div>
                  <div>
                    <div style={{fontSize:14,color:T.cream,marginBottom:3}}>{ex.name}</div>
                    <div style={{fontSize:12,color:T.muted}}>{ex.benefit}</div>
                  </div>
                </button>
              ))}
            </div>
          ):(
            <div className="fu">
              <button style={{...s.sm,marginBottom:22}} onClick={()=>setSelBreath(null)}>← Terug</button>
              <div style={s.card({textAlign:"center",border:`1px solid ${selBreath.color}22`})}>
                <h3 style={{...s.h3,color:selBreath.color,marginBottom:4}}>{selBreath.name}</h3>
                <p style={{...s.mu,fontSize:13,marginBottom:22}}>{selBreath.benefit}</p>
                <BreathTimer ex={selBreath}/>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="selfie"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Foto progressie</span>
          <h2 style={s.h2}>Zie jouw<br/><em style={s.em}>transformatie</em></h2>
          <p style={{...s.mu,marginBottom:24}}>Maak dagelijks een selfie op hetzelfde tijdstip. Na een paar weken zie je het verschil.</p>
          <div style={s.card({textAlign:"center",border:"1px solid rgba(249,132,229,0.2)",marginBottom:20,padding:"28px 18px"})}>
            <div style={{fontSize:44,marginBottom:12}}>📸</div>
            <h3 style={{...s.h3,marginBottom:8}}>Selfie van vandaag</h3>
            <p style={{...s.mu,fontSize:13,marginBottom:20}}>Zelfde licht, zelfde hoek, zelfde uitdrukking.</p>
            <label style={{...s.btn(),cursor:"pointer"}}>
              Maak of upload selfie
              <input type="file" accept="image/*" capture="user" style={{display:"none"}}
                onChange={e=>{
                  const file=e.target.files[0];
                  if(!file)return;
                  const reader=new FileReader();
                  reader.onload=ev=>{
                    const today=new Date().toISOString().split("T")[0];
                    setSelfies(prev=>({...prev,[today]:{src:ev.target.result,date:today}}));
                  };
                  reader.readAsDataURL(file);
                }}/>
            </label>
          </div>
          {Object.keys(selfies).length>0&&(
            <>
              <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:T.rose,marginBottom:14}}>Jouw progressie ({Object.keys(selfies).length} fotos)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {Object.values(selfies).sort((a,b)=>b.date>a.date?1:-1).map((sf,i)=>(
                  <div key={i} style={{position:"relative",aspectRatio:"3/4",borderRadius:11,overflow:"hidden",border:"1px solid rgba(249,132,229,0.15)"}}>
                    <img src={sf.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(14,13,11,0.8))",padding:"8px 8px 6px"}}>
                      <div style={{fontSize:10,color:T.cream}}>{sf.date}</div>
                    </div>
                    {i===0&&<div style={{position:"absolute",top:6,right:6,background:T.rose,borderRadius:50,padding:"2px 8px",fontSize:9,color:T.black,fontWeight:500}}>Nieuwste</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab==="voeding"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Voeding en herstel</span>
          <h2 style={s.h2}>Voed je<br/><em style={s.em}>zenuwstelsel</em></h2>

          <div style={{fontSize:12,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Hydratatie vandaag</div>
          <div style={s.card({border:"1px solid rgba(107,159,196,0.3)",marginBottom:16})}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"2.5rem",color:"#6B9FC4",lineHeight:1}}>{water}</div>
                <div style={{fontSize:11,color:T.muted}}>van 8 glazen</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={s.btn("#6B9FC4")} onClick={()=>setWater(w=>Math.min(w+1,8))}>+ Glas</button>
                {water>0&&<button style={s.sm} onClick={()=>setWater(w=>Math.max(w-1,0))}>-</button>}
              </div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} style={{flex:1,height:32,borderRadius:6,background:i<water?"#6B9FC4":"rgba(107,159,196,0.1)",border:"1px solid rgba(107,159,196,0.2)",transition:"background 0.3s",cursor:"pointer"}} onClick={()=>setWater(i+1)}/>
              ))}
            </div>
            {water>=8&&<p style={{fontSize:13,color:"#6B9FC4",marginTop:12,textAlign:"center"}}>Dagdoel gehaald!</p>}
          </div>
          <div style={s.card({border:"1px solid rgba(107,159,196,0.15)",marginBottom:24})}>
            <p style={{...s.mu,fontSize:13,lineHeight:1.7}}>Een eenvoudig ochtendritueel: een groot glas water, een klein snufje Keltisch zeezout en vers citroensap, rustig opgedronken. Niet omdat dit alles oplost, maar omdat je je lichaam direct geeft wat het nodig heeft. Een liefdevolle manier om te zeggen: ik zorg vandaag voor je.</p>
          </div>

          <div style={s.card({marginBottom:24,border:"1px solid rgba(201,169,110,0.2)"})}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
              <span style={{fontSize:13}}>Eiwitten vandaag</span>
              <span style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.8rem",color:T.gold}}>{totalP}g <span style={{fontSize:"1rem",color:T.muted}}>/ {pGoal}g</span></span>

            </div>
            <ProgBar value={Math.min(totalP/pGoal*100,100)} color={T.gold}/>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12}}>
              <span style={{fontSize:12,color:T.muted}}>Gewicht (kg):</span>
              <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} style={{...s.inp,width:68,marginBottom:0,padding:"8px 10px",textAlign:"center"}}/>
              <span style={{fontSize:12,color:T.muted}}>doel {pGoal}g/dag</span>
            </div>
          </div>
          <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:T.gold,marginBottom:12}}>Voeg toe wat je hebt gegeten</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {PROTEINS.map(food=>{
              const n=pLog.filter(x=>x===food.name).length;
              return(
                <button key={food.name} onClick={()=>setPLog(p=>[...p,food.name])}
                  style={s.card({cursor:"pointer",textAlign:"left",padding:"12px 12px",border:`1px solid ${n>0?"rgba(201,169,110,0.35)":"rgba(249,132,229,0.08)"}`,background:n>0?"rgba(201,169,110,0.06)":T.dark})}>
                  <div style={{fontSize:18,marginBottom:3}}>{food.emoji}</div>
                  <div style={{fontSize:12,color:T.cream,lineHeight:1.3,marginBottom:2}}>{food.name}</div>
                  <div style={{fontSize:11,color:T.gold}}>{food.p}g eiwit {n>0?`· x${n}`:""}</div>
                </button>
              );
            })}
          </div>
          {pLog.length>0&&<button style={{...s.sm,marginBottom:20}} onClick={()=>setPLog([])}>Log wissen</button>}
        </div>
      )}

      {tab==="logboek"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Dagelijks dagboek</span>
          <h2 style={s.h2}>Hoe is het met<br/><em style={s.em}>jouw lichaam vandaag?</em></h2>
          <p style={{...s.mu,marginBottom:28}}>Vul dit dagelijks in. Vanuit gevoel, niet vanuit je hoofd.</p>

          <div style={{fontSize:12,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:16,paddingBottom:10,borderBottom:"1px solid rgba(249,132,229,0.12)"}}>Daily Check-in</div>

          {[
            {id:"gevoel",label:"Hoe voel je je vandaag?",opts:["Ik voel mij uitgeput en leeg","Ik voel mij overprikkeld en gespannen","Ik voel me onrustig en opgejaagd","Ik voel mij redelijk in balans","Ik voel me rustig, veilig en verbonden"],sc:[4,3,3,1,0]},
            {id:"lichaam",label:"Hoe aanwezig ben ik in mijn lichaam vandaag?",opts:["Ik voel bijna geen verbinding","Ik zit vooral in mijn hoofd","Ik voel redelijke verbinding","Ik ben volledig aanwezig in mijn lichaam","Ik voel mij energiek"],sc:[4,3,1,0,0]},
          ].map(q=>(
            <div key={q.id} style={{marginBottom:20}}>
              <div style={{fontSize:11,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>{q.label}</div>
              {q.opts.map((opt,i)=>{
                const sel=ciData[q.id]===i;
                return(
                  <div key={i} onClick={()=>setCiData(p=>({...p,[q.id]:i}))} style={s.row(sel)}>
                    <div style={s.dot(sel)}>{sel&&<div style={{width:6,height:6,borderRadius:"50%",background:T.black}}/>}</div>
                    <span style={{fontSize:14,color:sel?T.rose:T.cream}}>{opt}</span>
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Waar voel ik vandaag spanning? <span style={{fontSize:10,color:T.muted,textTransform:"none",letterSpacing:0}}>(meerdere mogelijk)</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {["Hoofd","Buik","Kaken","Benen","Nek","Rug","Schouders","Overal","Borst","Nergens"].map(loc=>{
                const sel=(ciData.spanning||[]).includes(loc);
                return(
                  <div key={loc} onClick={()=>setCiData(p=>{const cur=p.spanning||[];return {...p,spanning:sel?cur.filter(x=>x!==loc):[...cur,loc]};})} style={s.row(sel)}>
                    <div style={s.dot(sel)}>{sel&&<span style={{color:T.black,fontSize:9,fontWeight:700}}>✓</span>}</div>
                    <span style={{fontSize:13,color:sel?T.rose:T.cream}}>{loc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Vanuit welke energie leef ik vandaag?</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[["Overleven",4],["Controleren",3],["Aanpassen",3],["Pleasen",3],["Doorzetten",2],["Vertragen",1],["Ontvangen",0],["Vertrouwen",0],["Verbinden",0],["Vanuit flow",0]].map(([opt,sc],i)=>{
                const sel=ciData.energie===i;
                return(
                  <div key={i} onClick={()=>setCiData(p=>({...p,energie:i,energieScore:sc}))} style={s.row(sel)}>
                    <div style={s.dot(sel)}>{sel&&<div style={{width:6,height:6,borderRadius:"50%",background:T.black}}/>}</div>
                    <span style={{fontSize:13,color:sel?T.rose:T.cream}}>{opt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {[
            {id:"q1",label:"Wat probeert mijn lichaam mij te vertellen?",ph:"Schrijf hier wat in je opkomt..."},
            {id:"q2",label:"Als mijn lichaam vandaag 1 zin tegen mij mocht zeggen...",ph:"Laat het antwoord komen zonder na te denken..."},
            {id:"q3",label:"Waar ben ik over mijn grens heen gegaan?",ph:"Eerlijk en zonder oordeel..."},
          ].map(q=>(
            <div key={q.id} style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.rose,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{q.label}</div>
              <textarea style={s.ta} placeholder={q.ph} value={ciData[q.id]||""} onChange={e=>setCiData(p=>({...p,[q.id]:e.target.value}))}/>
            </div>
          ))}

          <div style={{marginBottom:20}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Wat heb ik vandaag nodig? <span style={{fontSize:10,color:T.muted,textTransform:"none",letterSpacing:0}}>(meerdere mogelijk)</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {["Rust","Me time","Grenzen aangeven","Vrienden","Betere voeding","Verzachting","Meer beweging","Liefde / knuffel","Verdriet loslaten","Veiligheid"].map(need=>{
                const sel=(ciData.needs||[]).includes(need);
                return(
                  <div key={need} onClick={()=>setCiData(p=>{const cur=p.needs||[];return {...p,needs:sel?cur.filter(x=>x!==need):[...cur,need]};})} style={s.row(sel)}>
                    <div style={s.dot(sel)}>{sel&&<span style={{color:T.black,fontSize:9,fontWeight:700}}>✓</span>}</div>
                    <span style={{fontSize:13,color:sel?T.rose:T.cream}}>{need}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {[
            {id:"q4",label:"Waar ben ik mijzelf vandaag kwijt geraakt?",ph:"Schrijf hier vrij op..."},
            {id:"q5",label:"Wat probeer ik al heel lang vol te houden?",ph:"Wees eerlijk naar jezelf..."},
            {id:"q6",label:"Waar ben ik moe van?",ph:"..."},
            {id:"q7",label:"Waar verlang ik werkelijk naar?",ph:"Vanuit je hart, niet je hoofd..."},
            {id:"q8",label:"Welke stap kan ik nu zetten?",ph:"Klein mag ook..."},
          ].map(q=>(
            <div key={q.id} style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.rose,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{q.label}</div>
              <textarea style={s.ta} placeholder={q.ph} value={ciData[q.id]||""} onChange={e=>setCiData(p=>({...p,[q.id]:e.target.value}))}/>
            </div>
          ))}

          <p style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.2rem",fontStyle:"italic",color:T.rose,textAlign:"center",margin:"32px 0",lineHeight:1.6}}>Je lichaam liegt niet.<br/>Het vertelt vaak de waarheid<br/>die je hoofd probeert te overleven.</p>

          <div style={{fontSize:12,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",margin:"28px 0 16px",paddingBottom:10,borderBottom:"1px solid rgba(249,132,229,0.12)"}}>Logboek</div>

          <div style={{marginBottom:18}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Stemming</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[["😔","Zwaar"],["😟","Gespannen"],["😐","Neutraal"],["🙂","Oké"],["😊","Goed"],["✨","Stralend"]].map(([e,l])=>(
                <button key={l} onClick={()=>setLogForm(p=>({...p,mood:`${e} ${l}`}))}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 10px",borderRadius:10,border:`1px solid ${logForm.mood===`${e} ${l}`?"rgba(249,132,229,0.5)":"rgba(249,132,229,0.1)"}`,background:logForm.mood===`${e} ${l}`?"rgba(249,132,229,0.12)":"transparent",cursor:"pointer"}}>
                  <span style={{fontSize:22}}>{e}</span>
                  <span style={{fontSize:10,color:T.muted}}>{l}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Kleine overwinning van vandaag</div>
            <input style={s.inp} placeholder="Ook klein is groot..." value={logForm.win||""} onChange={e=>setLogForm(p=>({...p,win:e.target.value}))}/>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Vrije notitie</div>
            <textarea style={{...s.ta,minHeight:95}} placeholder="Geen regels, gewoon schrijven..." value={logForm.note||""} onChange={e=>setLogForm(p=>({...p,note:e.target.value}))}/>
          </div>
          <div style={{marginBottom:22}}>
            <div style={{fontSize:11,color:T.rose,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Dankbaarheid</div>
            <input style={s.inp} placeholder="1 ding waar ik dankbaar voor ben..." value={logForm.gratitude||""} onChange={e=>setLogForm(p=>({...p,gratitude:e.target.value}))}/>
          </div>

          <button style={{...s.btn(logSaved?T.sage:T.rose),width:"100%",justifyContent:"center"}} onClick={()=>{
            const sc={gevoel:[4,3,3,1,0],lichaam:[4,3,1,0,0]};
            let total=0;
            ["gevoel","lichaam"].forEach(k=>{if(ciData[k]!==undefined)total+=sc[k][ciData[k]]||0;});
            total+=ciData.energieScore||0;
            const spanScores={Hoofd:1,Buik:1,Kaken:1,Benen:1,Nek:1,Rug:1,Schouders:1,Overal:2,Borst:1,Nergens:0};
            (ciData.spanning||[]).forEach(loc=>{total+=spanScores[loc]||0;});
            const states=[
              {max:2,label:"Rustig en verbonden",color:T.sage,title:"Jouw systeem voelt vandaag veilig",body:"Dit is hoe leven voelt als je niet in overleving staat. Onthoud dit gevoel.",adem:"Coherent ademen: 5 seconden in, 5 seconden uit.",scan:"Beweeg je aandacht van hoofd naar voeten. Zeg: Ik ben veilig.",move:"Doe iets wat je blij maakt, dansen, wandelen."},
              {max:6,label:"Lichte druk",color:T.gold,title:"Je systeem staat licht onder druk",body:"Je voelt wat spanning maar kunt er nog mee omgaan. Jouw lichaam fluistert. Luister nu.",adem:"3-6 ademhaling: 3 seconden in, 6 seconden uit. Herhaal 10 keer.",scan:"Sluit je ogen. Hand op spanning. Adem er naartoe.",move:"Sta op. Rol je schouders. Schud je handen los."},
              {max:12,label:"Verhoogde spanning",color:T.rose,title:"Jouw systeem staat flink onder druk",body:"De spanning zit in je lichaam. Je hoofd staat aan. Dit is niet jouw schuld.",adem:"Box breathing: 4 in, 4 vasthouden, 4 uit, 4 vasthouden. Herhaal 6 keer.",scan:"Voeten op de vloer. Noem 5 dingen die je ziet, 4 hoort, 3 voelt.",move:"Schud zacht je benen. Laat het opstijgen. 2 tot 3 minuten."},
              {max:99,label:"In overleving",color:T.mauve,title:"Jouw systeem staat vandaag in overleving",body:"Je draagt vandaag heel veel. Stop met doorgaan. Kies nu voor jezelf.",adem:"Hand op borst, hand op buik. Adem in. Adem dubbel zo lang uit.",scan:"Ga zitten of liggen. Voel de ondergrond. Zeg: Ik hoef nu niets.",move:"Ga ergens alleen. Schud actief je hele lichaam. Laat de spanning eruit."},
            ];
            const result=states.find(st=>total<=st.max)||states[3];
            setCiResult(result);
            const today=new Date().toISOString().split("T")[0];
            const entry={
              date:today,
              dateLabel:new Date().toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"}),
              mood:logForm.mood,win:logForm.win,note:logForm.note,gratitude:logForm.gratitude,
              ciLabel:result.label,ciColor:result.color,mPct,ePct,protein:totalP,
            };
            setLogList(prev=>[entry,...prev.filter(e=>e.date!==today)]);
            setLogSaved(true);setStreak(s=>s+1);
            setCiData({});setLogForm({mood:"",energy:"",body:[],win:"",note:"",gratitude:""});
            setTimeout(()=>{setLogSaved(false);document.getElementById("dagres")?.scrollIntoView({behavior:"smooth"});},200);
          }}>
            {logSaved?"Opgeslagen! Uitslag klaar":"Sla op en bekijk mijn uitslag"}
          </button>

          {ciResult&&(
            <div id="dagres" style={{marginTop:40}} className="fu">
              <div style={{width:36,height:1,background:"rgba(249,132,229,0.2)",margin:"0 auto 28px"}}/>
              <div style={{display:"inline-block",background:`${ciResult.color}18`,border:`1px solid ${ciResult.color}33`,borderRadius:50,padding:"5px 16px",fontSize:11,letterSpacing:"0.15em",textTransform:"uppercase",color:ciResult.color,marginBottom:14}}>{ciResult.label}</div>
              <h3 style={s.h3}>{ciResult.title}</h3>
              <p style={{...s.mu,marginBottom:22}}>{ciResult.body}</p>
              <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:T.rose,marginBottom:12}}>Jouw oefeningen voor nu</div>
              {[["Ademhaling",ciResult.adem],["Lichaamsscan",ciResult.scan],["Beweging",ciResult.move]].map(([t2,b],i)=>(
                <div key={i} style={s.card({marginBottom:8,border:`1px solid ${ciResult.color}18`})}>
                  <div style={{fontSize:11,color:ciResult.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7}}>{t2}</div>
                  <p style={{...s.mu,fontSize:14}}>{b}</p>
                </div>
              ))}
              <div style={s.card({textAlign:"center",border:"1px solid rgba(249,132,229,0.18)",marginTop:8})}>
                <p style={{...s.mu,fontSize:14,marginBottom:16}}>Op dagen zoals vandaag hoef je het niet alleen te dragen.</p>
                <a href={`https://wa.me/31649396207?text=${encodeURIComponent("Hoi Wendy, ik heb mijn dagboek ingevuld en heb ondersteuning nodig")}`} target="_blank" rel="noopener noreferrer" style={s.btn()}>Stuur Wendy een berichtje</a>
              </div>
            </div>
          )}

          {logList.length>0&&(
            <div style={{marginTop:48}}>
              <div style={{width:36,height:1,background:"rgba(249,132,229,0.2)",margin:"0 auto 32px"}}/>
              <div style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:T.rose,marginBottom:14}}>Eerdere dagen ({logList.length})</div>
              {logList.map((entry,i)=>(
                <div key={i} style={s.card({marginBottom:10})}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontSize:12,color:T.rose}}>{entry.dateLabel}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {entry.mood&&<span style={{fontSize:16}}>{entry.mood.split(" ")[0]}</span>}
                      {entry.ciLabel&&<span style={{fontSize:10,background:`${entry.ciColor}20`,color:entry.ciColor,padding:"2px 8px",borderRadius:50}}>{entry.ciLabel}</span>}
                    </div>
                  </div>
                  {entry.win&&<div style={{marginBottom:7}}><span style={{fontSize:11,color:T.gold}}>Overwinning: </span><span style={{fontSize:13,color:T.cream}}>{entry.win}</span></div>}
                  {entry.note&&<p style={{fontSize:13,color:T.muted,lineHeight:1.65,marginBottom:7}}>{entry.note}</p>}
                  {entry.gratitude&&<div><span style={{fontSize:11,color:T.rose}}>Dankbaar voor: </span><span style={{fontSize:13,color:T.muted,fontStyle:"italic"}}>{entry.gratitude}</span></div>}
                  <div style={{display:"flex",gap:12,marginTop:10,paddingTop:10,borderTop:"1px solid rgba(249,132,229,0.08)",fontSize:11,color:T.muted}}>
                    <span>Ochtend {entry.mPct}%</span>
                    <span>Avond {entry.ePct}%</span>
                    <span>Eiwit {entry.protein}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="meer"&&(
        <div style={s.wrap} className="fu">
          <span style={s.ey}>Extra tools en support</span>
          <h2 style={s.h2}>Alles wat je<br/><em style={s.em}>ondersteunt</em></h2>

          <div style={{fontSize:12,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Sessie inplannen bij Wendy</div>

          <div style={s.card({border:`1px solid ${T.rose}20`,marginBottom:28})}>
            <p style={{...s.mu,fontSize:14,marginBottom:20}}>Klaar voor persoonlijke begeleiding? Plan een TRE of BRTT sessie in.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20een%20sessie%20inplannen" target="_blank" rel="noopener noreferrer" style={s.btn()}>Plan via WhatsApp</a>
              <a href="https://www.oymb.nl" target="_blank" rel="noopener noreferrer" style={{...s.btn(T.dark,T.rose),border:`1px solid ${T.rose}30`,justifyContent:"center",display:"flex"}}>Bekijk oymb.nl</a>
            </div>
          </div>

          <div style={{fontSize:12,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Voortgangsbadges</div>
          <div style={s.card({marginBottom:28})}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {emoji:"🌱",label:"Gestart",earned:true},
                {emoji:"🔥",label:`${streak} dagen`,earned:streak>=1},
                {emoji:"💪",label:"Eiwitten",earned:totalP>=50},
                {emoji:"💧",label:"Hydratatie",earned:water>=8},
                {emoji:"🌅",label:"Ochtend",earned:mPct===100},
                {emoji:"🌙",label:"Avond",earned:ePct===100},
                {emoji:"📸",label:"Selfie",earned:Object.keys(selfies).length>=1},
                {emoji:"📚",label:"Module 1",earned:!!modDone[1]},
              ].map((badge,i)=>(
                <div key={i} style={{textAlign:"center",opacity:badge.earned?1:0.25}}>
                  <div style={{fontSize:28,marginBottom:4,filter:badge.earned?"none":"grayscale(100%)"}}>{badge.emoji}</div>
                  <div style={{fontSize:9,color:badge.earned?T.rose:T.muted}}>{badge.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{fontSize:12,color:T.rose,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:14}}>Community</div>
          <div style={s.card({border:`1px solid ${T.rose}20`})}>
            <p style={{...s.mu,fontSize:14,marginBottom:16}}>Doe mee met de community van vrouwen die hetzelfde doorlopen.</p>
            <a href="https://wa.me/31649396207?text=Hoi%20Wendy%2C%20ik%20wil%20graag%20lid%20worden%20van%20de%20community" target="_blank" rel="noopener noreferrer" style={s.btn()}>Word lid van de community</a>
          </div>
        </div>
      )}
    </div>
  );
}
