const studentList = `9054  aabbott@nextcharterschool.org	Aiden Abbott
1105	lbarrett@nextcharterschool.org	Lily Barrett
9061	abartley@nextcharterschool.org	Abigayle Bartley
9056	kbartley@nextcharterschool.org	Kaeden Bartley
1133	ebaughman@nextcharterschool.org	Emma Baughman
1125	abemiller@nextcharterschool.org	Amanda Bemiller
1151	jbreault@nextcharterschool.org	Jayden Breault
9052	obride@nextcharterschool.org	Hailey Bride
1140	jcampbell@nextcharterschool.org	Jessie Campbell
9071	rcarrasquillo@nextcharterschool.org	Rachel Carrasquillo
9086	iceleste@nextcharterschool.org	Isabel Celeste
1115	ecerci@nextcharterschool.org	Eric Cerci
7081	jdavis@nextcharterschool.org	Julia Davis
7087	ndeaton@nextcharterschool.org	Nathan Deaton
8067	adeletoile@nextcharterschool.org	Ayden del'Etoile
9050	ddevoid@nextcharterschool.org	Dylan Devoid
7083	sdonovan@nextcharterschool.org	Samantha Donovan
9060	mdow@nextcharterschool.org	Makaleigh Dow
1106	sdubey@nextcharterschool.org	Seth DuBey
9059	teaton@nextcharterschool.org	Timothy Eaton
8052	seldib@nextcharterschool.org	Sami Eldib
8063	tferreira@nextcharterschool.org	Tallyta Ferreira
9077	efitzgerald@nextcharterschool.org	Estella Fitzgerald
7099	sfoote@nextcharterschool.org	Shaelagh Foote
8082	afuentes@nextcharterschool.org	Angelina Fuentes
7096	jgallo@nextcharterschool.org	Joy Gallo
1155	kgiuffre@nextcharterschool.org	Kaydence Giuffre
9084	aglaser@nextcharterschool.org	Ashley Glaser
1153	egraves@nextcharterschool.org	Elijah Graves
1150	mgraves@nextcharterschool.org	Moshe Graves
7102	hgrenier@nextcharterschool.org	Hailey Grenier
5018	mhatch@nextcharterschool.org	Mikayla Hatch
7072	jjohnson@nextcharterschool.org	Jaylin Johnson
8053	akermelewicz@nextcharterschool.org	Allesandra Kermelewicz
1148	ckowalczyk@nextcharterschool.org	Clover Kowalczyk
1154	ekyle@nextchartershool.org	Elsie Kyle
1156	slachance@nextcharterschool.org	Samantha Lachance
1136	elee@nextcharterschool.org	Ella Lee
9088	nleggett@nextcharterschool.org	Nathan Leggett
1135	slevesque@nextcharterschool.org	Sydney Levesque
7076	ali@nextcharterschool.org	Aidan Li
1157	rlynch@nextcharterschool.org	Travis Lynch
7071	dmartineau@nextcharterschool.org	Dana Martineau
7073	jmckenna@nextcharterschool.org	Jaylee McKenna
8071	kmcmullin@nextcharterschool.org	Kaylee McMullin
8064	rmedina@nextcharterschool.org	Caidence Medina
1123	gmedina@nextcharterschool.org	Gavin Medina
7089	vmorris@nextcharterschool.org	Jacob Morris
9087	knewcomb@nextcharterschool.org	Keirsten Newcomb
1158	inieves@nextcharterschool.org	Izabella Nieves
9067	aolson@nextcharterschool.org	Addison Olson
9066	mours@nextcharterschool.org	Madalynn Ours
1152	apalmer@nextcharterschool.org	Allison Palmer
8079	jparolise@nextcharterschool.org	Jessica Parolise
1104	spatnaude@nextcharterschool.org	Sean Patnaude
1146	nperez@nextcharterschool.org	Nicholas Perez
9065	mpfeifer@nextcharterschool.org	Matthew Pfeifer
8058	vpincince@nextcharterschool.org	Victoria Pincince
1109	apineo@nextcharterschool.org	Aidan Pineo
8083	lpoirier@nextcharterschool.org	Laurent Poirier
1142	fprakop@nextcharterschool.org	Fiona Prakop
1145	nprakop@nextcharterschool.org	Neala Prakop
1139	ereed@nextcharterschool.org	Elyssia Reed
1159	lregal@nextcharterschool.org	Liaden Regal
1149	arichman@nextcharterschool.org	Arianna Richman
8085	bross@nextcharterschool.org	Brandon Ross
9083	vsantiago@nextcharterschool.org	Viviana Santiago
1137	gscarsilloni@nextcharterschool.org	Gianna Scarsilloni
1122	ssmith@nextcharterschool.org	Sophia Smith
7093	dtardif@nextcharterschool.org	Dylan Tardif
9055	ataylor@nextcharterschool.org	Ava Taylor
7080	btremain@nextcharterschool.org	Braeden Tremain
8054	gvallario@nextcharterschool.org	Giselle Vallario
9051	jvillaman@nextcharterschool.org	Javen Villaman
7068	dwatson@nextcharterschool.org	Dani Watson
1147	aweymouth@nextcharterschool.org	Amber Weymouth
8051	bprunierwhitby@nextcharterschool.org	Braydan Lawrence Whitby`

const domainList = `1	Capstone	1	3
2	English	1	4
3	Math 	1	3
4	Physical Science	1	1
5	American Studies	1	1
6	Global Studies	1	5
7	Civics	1	5
8	Economics	2	5
9	Unified Arts	2	5
10	Physical Education	2	1
11	Health	2	5
12	Technology	2	5
13	Social Engagement	2	1`

const courseList = `1	American Studies	2
2	American Studies (second half only)	2
3	Art 1	2
4	Art 2	2
5	Capstone	4
6	Chemistry	4
7	Civics	1
8	Creative Writing	7
9	Data and Statistics 1	6
10	Data and Statistics 2	6
11	Economics	1
12	English 1	5
13	English 1 (second half only)	5
14	English 2	5
15	English 2 (second half only)	5
16	Academic Skills 1(transfer)	9`

const competencyList = `1	AS1	1	1
2	AS2	1	1
3	AS3	1	1
4	AS4	1	1
5	AS5	1	1
6	AS6	1	1
7	A1.1	3	0.5
8	A1.2	3	0.5
9	A1.3	3	0.5
10	A1.4	3	0.5
11	A2.1	4	0.5
12	A2.2	4	0.5
13	A2.3	4	0.5
14	A2.4	4	0.5
15	CS1	5	1
16	CS2	5	1
17	CS3	5	1
18	CS4	5	1
19	CS5	5	1
20	Chem1	6	1
21	CV1	7	
22	CV2	7	
23	CV3	7	
24	CW1	8	
25	CW2	8	
26	CW3	8	
27	CW4	8	
28	DS1.1	9	
29	DS1.2	9	
30	DS1.3	9	
31	DS2.1	10	
32	DS2.2	10	
33	DS2.3	10	
34	EC1	11	
35	EC2	11	
36	EC3	11	
37	EC4	11	
38	Eng1.1	12	
39	Eng1.2	12	
40	Eng1.3	12	
41	Eng1.4	12	
42	Eng1.5	12	
43	Eng1.6	12	
44	Eng1.7	12	
45	Eng1.8	12	
46	Eng2.1	14	
47	Eng2.2	14	
48	Eng2.3	14	
49	Eng2.4	14	
50	Eng2.5	14	
51	Eng2.6	14	
52	Eng2.7	14	
53	Eng2.8	14	
54	AcademicSkills1	16	0.25`

export const students = studentList.split('\n').map(line => {
  let [id, email, firstName] = line.split('\t');
  return { id, email, name: firstName };
});

export const domains = domainList.split('\n').map(line => {
  let [id, name, institutionId, creditRequired] = line.split('\t');
  return { id, name, institutionId, creditRequired };
});

export const courses = courseList.split('\n').map(line => {
  let [id, name, domainId] = line.split('\t');
  return { id, name, domainId };
});

export const competencies = competencyList.split('\n').map(line => {
  let [id, name, courseId, creditValue] = line.split('\t');
  return { id, name, courseId, creditValue };
});