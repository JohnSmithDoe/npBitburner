export enum ENPPrograms {
  BruteSSH  = 'BruteSSH.exe',
  FTPCrack  = 'FTPCrack.exe',
  RelaySMTP = 'relaySMTP.exe',
  HTTPWorm  = 'HTTPWorm.exe',
  SQLInject = 'SQLInject.exe',
}

export const CNPProgramStats: Record<ENPPrograms, { lvl: number, price: number }> = {
  'BruteSSH.exe':  {lvl: 50, price: .5e6},
  'FTPCrack.exe':  {lvl: 100, price: 1.5e6},
  'relaySMTP.exe': {lvl: 250, price: 5e6},
  'HTTPWorm.exe':  {lvl: 500, price: 30e6},
  'SQLInject.exe': {lvl: 750, price: 250e6},
} as const;
export const CNPAllPrograms = Object.values(ENPPrograms);

export const CNPTorRouter = {name: 'Tor Router', cost: 2e5};
export const CNPBuyableStuff = [CNPTorRouter.name, ...CNPAllPrograms];

export enum ENPAugmentations {
  Targeting1                       = 'Augmented Targeting I',
  Targeting2                       = 'Augmented Targeting II',
  Targeting3                       = 'Augmented Targeting III',
  SyntheticHeart                   = 'Synthetic Heart',
  SynfibrilMuscle                  = 'Synfibril Muscle',
  CombatRib1                       = 'Combat Rib I',
  CombatRib2                       = 'Combat Rib II',
  CombatRib3                       = 'Combat Rib III',
  NanofiberWeave                   = 'Nanofiber Weave',
  SubdermalArmor                   = 'NEMEAN Subdermal Weave',
  WiredReflexes                    = 'Wired Reflexes',
  GrapheneBoneLacings              = 'Graphene Bone Lacings',
  BionicSpine                      = 'Bionic Spine',
  GrapheneBionicSpine              = 'Graphene Bionic Spine Upgrade',
  BionicLegs                       = 'Bionic Legs',
  GrapheneBionicLegs               = 'Graphene Bionic Legs Upgrade',
  SpeechProcessor                  = 'Speech Processor Implant',
  TITN41Injection                  = 'TITN-41 Gene-Modification Injection',
  EnhancedSocialInteractionImplant = 'Enhanced Social Interaction Implant',
  BitWire                          = 'BitWire',
  ArtificialBioNeuralNetwork       = 'Artificial Bio-neural Network Implant',
  ArtificialSynapticPotentiation   = 'Artificial Synaptic Potentiation',
  EnhancedMyelinSheathing          = 'Enhanced Myelin Sheathing',
  SynapticEnhancement              = 'Synaptic Enhancement Implant',
  NeuralRetentionEnhancement       = 'Neural-Retention Enhancement',
  DataJack                         = 'DataJack',
  ENM                              = 'Embedded Netburner Module',
  ENMCore                          = 'Embedded Netburner Module Core Implant',
  ENMCoreV2                        = 'Embedded Netburner Module Core V2 Upgrade',
  ENMCoreV3                        = 'Embedded Netburner Module Core V3 Upgrade',
  ENMAnalyzeEngine                 = 'Embedded Netburner Module Analyze Engine',
  ENMDMA                           = 'Embedded Netburner Module Direct Memory Access Upgrade',
  Neuralstimulator                 = 'Neuralstimulator',
  NeuralAccelerator                = 'Neural Accelerator',
  CranialSignalProcessorsG1        = 'Cranial Signal Processors - Gen I',
  CranialSignalProcessorsG2        = 'Cranial Signal Processors - Gen II',
  CranialSignalProcessorsG3        = 'Cranial Signal Processors - Gen III',
  CranialSignalProcessorsG4        = 'Cranial Signal Processors - Gen IV',
  CranialSignalProcessorsG5        = 'Cranial Signal Processors - Gen V',
  NeuronalDensification            = 'Neuronal Densification',
  NeuroreceptorManager             = 'Neuroreceptor Management Implant',
  NuoptimalInjectorImplant         = 'Nuoptimal Nootropic Injector Implant',
  SpeechEnhancement                = 'Speech Enhancement',
  FocusWire                        = 'FocusWire',
  PCDNI                            = 'PC Direct-Neural Interface',
  PCDNIOptimizer                   = 'PC Direct-Neural Interface Optimization Submodule',
  PCDNINeuralNetwork               = 'PC Direct-Neural Interface NeuroNet Injector',
  PCMatrix                         = 'PCMatrix',
  ADRPheromone1                    = 'ADR-V1 Pheromone Gene',
  ADRPheromone2                    = 'ADR-V2 Pheromone Gene',
  ShadowsSimulacrum                = 'The Shadow\'s Simulacrum',
  HacknetNodeCPUUpload             = 'Hacknet Node CPU Architecture Neural-Upload',
  HacknetNodeCacheUpload           = 'Hacknet Node Cache Architecture Neural-Upload',
  HacknetNodeNICUpload             = 'Hacknet Node NIC Architecture Neural-Upload',
  HacknetNodeKernelDNI             = 'Hacknet Node Kernel Direct-Neural Interface',
  HacknetNodeCoreDNI               = 'Hacknet Node Core Direct-Neural Interface',
  NeuroFluxGovernor                = 'NeuroFlux Governor',
  Neurotrainer1                    = 'Neurotrainer I',
  Neurotrainer2                    = 'Neurotrainer II',
  Neurotrainer3                    = 'Neurotrainer III',
  Hypersight                       = 'HyperSight Corneal Implant',
  LuminCloaking1                   = 'LuminCloaking-V1 Skin Implant',
  LuminCloaking2                   = 'LuminCloaking-V2 Skin Implant',
  HemoRecirculator                 = 'HemoRecirculator',
  SmartSonar                       = 'SmartSonar Implant',
  PowerRecirculator                = 'Power Recirculation Core',
  QLink                            = 'QLink',
  TheRedPill                       = 'The Red Pill',
  SPTN97                           = 'SPTN-97 Gene Modification',
  HiveMind                         = 'ECorp HVMind Implant',
  CordiARCReactor                  = 'CordiARC Fusion Reactor',
  SmartJaw                         = 'SmartJaw',
  Neotra                           = 'Neotra',
  Xanipher                         = 'Xanipher',
  nextSENS                         = 'nextSENS Gene Modification',
  OmniTekInfoLoad                  = 'OmniTek InfoLoad',
  PhotosyntheticCells              = 'Photosynthetic Cells',
  Neurolink                        = 'BitRunners Neurolink',
  TheBlackHand                     = 'The Black Hand',
  UnstableCircadianModulator       = 'Unstable Circadian Modulator',
  CRTX42AA                         = 'CRTX42-AA Gene Modification',
  Neuregen                         = 'Neuregen Gene Modification',
  CashRoot                         = 'CashRoot Starter Kit',
  NutriGen                         = 'NutriGen Implant',
  INFRARet                         = 'INFRARET Enhancement',
  DermaForce                       = 'DermaForce Particle Barrier',
  GrapheneBrachiBlades             = 'Graphene BrachiBlades Upgrade',
  GrapheneBionicArms               = 'Graphene Bionic Arms Upgrade',
  BrachiBlades                     = 'BrachiBlades',
  BionicArms                       = 'Bionic Arms',
  SNA                              = 'Social Negotiation Assistant (S.N.A)',
  HydroflameLeftArm                = 'Hydroflame Left Arm',
  EsperEyewear                     = 'EsperTech Bladeburner Eyewear',
  EMS4Recombination                = 'EMS-4 Recombination',
  OrionShoulder                    = 'ORION-MKIV Shoulder',
  HyperionV1                       = 'Hyperion Plasma Cannon V1',
  HyperionV2                       = 'Hyperion Plasma Cannon V2',
  GolemSerum                       = 'GOLEM Serum',
  VangelisVirus                    = 'Vangelis Virus',
  VangelisVirus3                   = 'Vangelis Virus 3.0',
  INTERLINKED                      = 'I.N.T.E.R.L.I.N.K.E.D',
  BladeRunner                      = 'Blade\'s Runners',
  BladeArmor                       = 'BLADE-51b Tesla Armor',
  BladeArmorPowerCells             = 'BLADE-51b Tesla Armor= Power Cells Upgrade',
  BladeArmorEnergyShielding        = 'BLADE-51b Tesla Armor= Energy Shielding Upgrade',
  BladeArmorUnibeam                = 'BLADE-51b Tesla Armor= Unibeam Upgrade',
  BladeArmorOmnibeam               = 'BLADE-51b Tesla Armor= Omnibeam Upgrade',
  BladeArmorIPU                    = 'BLADE-51b Tesla Armor= IPU Upgrade',
  BladesSimulacrum                 = 'The Blade\'s Simulacrum',

  StaneksGift1                     = 'Stanek\'s Gift - Genesis',
  StaneksGift2                     = 'Stanek\'s Gift - Awakening',
  StaneksGift3                     = 'Stanek\'s Gift - Serenity',

  //Wasteland Augs
  //PepBoy=                             "P.E.P-Boy", Plasma Energy Projection System
}

export const SoftwareCompanyPositions: string[] = [
  'Software Engineering Intern',
  'Junior Software Engineer',
  'Senior Software Engineer',
  'Lead Software Developer',
  'Head of Software',
  'Head of Engineering',
  'Vice President of Technology',
  'Chief Technology Officer',
];
export const ITCompanyPositions: string[] = ['IT Intern', 'IT Analyst', 'IT Manager', 'Systems Administrator'];
export const SecurityEngineerCompanyPositions: string[] = ['Security Engineer'];
export const NetworkEngineerCompanyPositions: string[] = ['Network Engineer', 'Network Administrator'];
export const BusinessCompanyPositions: string[] = [
  'Business Intern',
  'Business Analyst',
  'Business Manager',
  'Operations Manager',
  'Chief Financial Officer',
  'Chief Executive Officer',
];
export const SecurityCompanyPositions: string[] = [
  'Police Officer',
  'Police Chief',
  'Security Guard',
  'Security Officer',
  'Security Supervisor',
  'Head of Security',
];
export const AgentCompanyPositions: string[] = ['Field Agent', 'Secret Agent', 'Special Operative'];
export const MiscCompanyPositions: string[] = ['Waiter', 'Employee'];
export const SoftwareConsultantCompanyPositions: string[] = ['Software Consultant', 'Senior Software Consultant'];
export const BusinessConsultantCompanyPositions: string[] = ['Business Consultant', 'Senior Business Consultant'];
export const PartTimeCompanyPositions: string[] = ['Part-time Waiter', 'Part-time Employee'];
export type TNPLocationType = 'npCompany' | 'npGym' | 'npUniversity' | 'npShop' | 'npStockExchange' | 'npHospital';

export enum ENPFactionWorks {
  HackingContracts = 'Hacking Contracts',
  FieldWork        = 'Field Work',
}

export enum ENPLocations {
  // Aevum Locations
  AevumAeroCorp                   = 'AeroCorp',
  AevumBachmanAndAssociates       = 'Bachman & Associates',
  AevumClarkeIncorporated         = 'Clarke Incorporated',
  AevumCrushFitnessGym            = 'Crush Fitness Gym',
  AevumECorp                      = 'ECorp',
  AevumFulcrumTechnologies        = 'Fulcrum Technologies',
  AevumGalacticCybersystems       = 'Galactic Cybersystems',
  AevumNetLinkTechnologies        = 'NetLink Technologies',
  AevumPolice                     = 'Aevum Police Headquarters',
  AevumRhoConstruction            = 'Rho Construction',
  AevumSnapFitnessGym             = 'Snap Fitness Gym',
  AevumSummitUniversity           = 'Summit University',
  AevumWatchdogSecurity           = 'Watchdog Security',
  AevumCasino                     = 'Iker Molina Casino',

  // Chongqing locations
  ChongqingKuaiGongInternational  = 'KuaiGong International',
  ChongqingSolarisSpaceSystems    = 'Solaris Space Systems',
  ChongqingChurchOfTheMachineGod  = 'Church of the Machine God',

  // Sector 12
  Sector12AlphaEnterprises        = 'Alpha Enterprises',
  Sector12BladeIndustries         = 'Blade Industries',
  Sector12CIA                     = 'Central Intelligence Agency',
  Sector12CarmichaelSecurity      = 'Carmichael Security',
  Sector12CityHall                = 'Sector-12 City Hall',
  Sector12DeltaOne                = 'DeltaOne',
  Sector12FoodNStuff              = 'FoodNStuff',
  Sector12FourSigma               = 'Four Sigma',
  Sector12IcarusMicrosystems      = 'Icarus Microsystems',
  Sector12IronGym                 = 'Iron Gym',
  Sector12JoesGuns                = 'Joe\'s Guns',
  Sector12MegaCorp                = 'MegaCorp',
  Sector12NSA                     = 'National Security Agency',
  Sector12PowerhouseGym           = 'Powerhouse Gym',
  Sector12RothmanUniversity       = 'Rothman University',
  Sector12UniversalEnergy         = 'Universal Energy',

  // New Tokyo
  NewTokyoDefComm                 = 'DefComm',
  NewTokyoGlobalPharmaceuticals   = 'Global Pharmaceuticals',
  NewTokyoNoodleBar               = 'Noodle Bar',
  NewTokyoVitaLife                = 'VitaLife',

  // Ishima
  IshimaNovaMedical               = 'Nova Medical',
  IshimaOmegaSoftware             = 'Omega Software',
  IshimaStormTechnologies         = 'Storm Technologies',
  IshimaGlitch                    = '0x6C1',

  // Volhaven
  VolhavenCompuTek                = 'CompuTek',
  VolhavenHeliosLabs              = 'Helios Labs',
  VolhavenLexoCorp                = 'LexoCorp',
  VolhavenMilleniumFitnessGym     = 'Millenium Fitness Gym',
  VolhavenNWO                     = 'NWO',
  VolhavenOmniTekIncorporated     = 'OmniTek Incorporated',
  VolhavenOmniaCybersystems       = 'Omnia Cybersystems',
  VolhavenSysCoreSecurities       = 'SysCore Securities',
  VolhavenZBInstituteOfTechnology = 'ZB Institute of Technology',

  // Generic locations
  Hospital                        = 'Hospital',
  Slums                           = 'The Slums',
  TravelAgency                    = 'Travel Agency',
  WorldStockExchange              = 'World Stock Exchange',

  // Default name for Location objects
  Void                            = 'The Void',
}

export enum ENPCities {
  Sector12  = 'Sector-12',
  Aevum     = 'Aevum',
  Volhaven  = 'Volhaven',
  Chongqing = 'Chongqing',
  NewTokyo  = 'New Tokyo',
  Ishima    = 'Ishima'
}

export const CNPLocations = {
  [ENPCities.Aevum]:     {
    [ENPLocations.AevumAeroCorp]:             {type: 'npCompany'},
    [ENPLocations.AevumBachmanAndAssociates]: {type: 'npCompany'},
    [ENPLocations.AevumClarkeIncorporated]:   {type: 'npCompany'},
    [ENPLocations.AevumCrushFitnessGym]:      {type: 'npCompany'},
    [ENPLocations.AevumECorp]:                {type: 'npCompany'},
    [ENPLocations.AevumFulcrumTechnologies]:  {type: 'npCompany'},
    [ENPLocations.AevumGalacticCybersystems]: {type: 'npCompany'},
    [ENPLocations.AevumNetLinkTechnologies]:  {type: 'npCompany'},
    [ENPLocations.AevumPolice]:               {type: 'npCompany'},
    [ENPLocations.AevumRhoConstruction]:      {type: 'npCompany'},
    [ENPLocations.AevumSnapFitnessGym]:       {type: 'npCompany'},
    [ENPLocations.AevumSummitUniversity]:     {type: 'npCompany'},
    [ENPLocations.AevumWatchdogSecurity]:     {type: 'npCompany'},
    [ENPLocations.AevumCasino]:               {type: 'npCompany'},
    [ENPLocations.Slums]:                     {type: 'npCompany'},
    [ENPLocations.Hospital]:                  {type: 'npCompany'},
    [ENPLocations.TravelAgency]:              {type: 'npCompany'},
    [ENPLocations.WorldStockExchange]:        {type: 'npCompany'},

  },
  [ENPCities.Chongqing]: {
    [ENPLocations.ChongqingKuaiGongInternational]: {type: 'npCompany'},
    [ENPLocations.ChongqingSolarisSpaceSystems]:   {type: 'npCompany'},
    [ENPLocations.ChongqingChurchOfTheMachineGod]: {type: 'npCompany'},
    [ENPLocations.Slums]:                          {type: 'npCompany'},
    [ENPLocations.Hospital]:                       {type: 'npCompany'},
    [ENPLocations.TravelAgency]:                   {type: 'npCompany'},
    [ENPLocations.WorldStockExchange]:             {type: 'npCompany'},

  },
  [ENPCities.Sector12]:  {
    [ENPLocations.Sector12AlphaEnterprises]:   {type: 'npCompany'},
    [ENPLocations.Sector12BladeIndustries]:    {type: 'npCompany'},
    [ENPLocations.Sector12CIA]:                {type: 'npCompany'},
    [ENPLocations.Sector12CarmichaelSecurity]: {type: 'npCompany'},
    [ENPLocations.Sector12CityHall]:           {type: 'npCompany'},
    [ENPLocations.Sector12DeltaOne]:           {type: 'npCompany'},
    [ENPLocations.Sector12FoodNStuff]:         {type: 'npCompany'},
    [ENPLocations.Sector12FourSigma]:          {type: 'npCompany'},
    [ENPLocations.Sector12IcarusMicrosystems]: {type: 'npCompany'},
    [ENPLocations.Sector12IronGym]:            {type: 'npCompany'},
    [ENPLocations.Sector12JoesGuns]:           {type: 'npCompany'},
    [ENPLocations.Sector12MegaCorp]:           {type: 'npCompany'},
    [ENPLocations.Sector12NSA]:                {type: 'npCompany'},
    [ENPLocations.Sector12PowerhouseGym]:      {type: 'npCompany'},
    [ENPLocations.Sector12RothmanUniversity]:  {type: 'npCompany'},
    [ENPLocations.Sector12UniversalEnergy]:    {type: 'npCompany'},
    [ENPLocations.Slums]:                      {type: 'npCompany'},
    [ENPLocations.Hospital]:                   {type: 'npCompany'},
    [ENPLocations.TravelAgency]:               {type: 'npCompany'},
    [ENPLocations.WorldStockExchange]:         {type: 'npCompany'},

  },
  [ENPCities.NewTokyo]:  {
    [ENPLocations.NewTokyoDefComm]:               {type: 'npCompany'},
    [ENPLocations.NewTokyoGlobalPharmaceuticals]: {type: 'npCompany'},
    [ENPLocations.NewTokyoNoodleBar]:             {type: 'npCompany'},
    [ENPLocations.NewTokyoVitaLife]:              {type: 'npCompany'},
    [ENPLocations.Slums]:                         {type: 'npCompany'},
    [ENPLocations.Hospital]:                      {type: 'npCompany'},
    [ENPLocations.TravelAgency]:                  {type: 'npCompany'},
    [ENPLocations.WorldStockExchange]:            {type: 'npCompany'},

  },
  [ENPCities.Ishima]:    {
    [ENPLocations.IshimaNovaMedical]:       {type: 'npCompany'},
    [ENPLocations.IshimaOmegaSoftware]:     {type: 'npCompany'},
    [ENPLocations.IshimaStormTechnologies]: {type: 'npCompany'},
    [ENPLocations.IshimaGlitch]:            {type: 'npCompany'},
    [ENPLocations.Slums]:                   {type: 'npCompany'},
    [ENPLocations.Hospital]:                {type: 'npCompany'},
    [ENPLocations.TravelAgency]:            {type: 'npCompany'},
    [ENPLocations.WorldStockExchange]:      {type: 'npCompany'},
  },
  [ENPCities.Volhaven]:  {
    [ENPLocations.VolhavenCompuTek]:                {type: 'npCompany'},
    [ENPLocations.VolhavenHeliosLabs]:              {type: 'npCompany'},
    [ENPLocations.VolhavenLexoCorp]:                {type: 'npCompany'},
    [ENPLocations.VolhavenMilleniumFitnessGym]:     {type: 'npCompany'},
    [ENPLocations.VolhavenNWO]:                     {type: 'npCompany'},
    [ENPLocations.VolhavenOmniTekIncorporated]:     {type: 'npCompany'},
    [ENPLocations.VolhavenOmniaCybersystems]:       {type: 'npCompany'},
    [ENPLocations.VolhavenSysCoreSecurities]:       {type: 'npCompany'},
    [ENPLocations.VolhavenZBInstituteOfTechnology]: {type: 'npCompany'},
    [ENPLocations.Slums]:                           {type: 'npCompany'},
    [ENPLocations.Hospital]:                        {type: 'npCompany'},
    [ENPLocations.TravelAgency]:                    {type: 'npCompany'},
    [ENPLocations.WorldStockExchange]:              {type: 'npCompany'},
  },
} as const;

export enum ENPFactions {
  Sector12                  = 'Sector-12',
  Aevum                     = 'Aevum',
  Volhaven                  = 'Volhaven',
  Chongqing                 = 'Chongqing',
  NewTokyo                  = 'New Tokyo',
  Ishima                    = 'Ishima',
  NiteSec                   = 'NiteSec',
  Netburners                = 'Netburners',
  TianDiHui                 = 'Tian Di Hui',
  CyberSec                  = 'CyberSec',
  TheBlackHand              = 'The Black Hand',
  BitRunners                = 'BitRunners',
  ECorp                     = 'ECorp',
  MegaCorp                  = 'MegaCorp',
  KuaiGongInternational     = 'KuaiGong International',
  FourSigma                 = 'Four Sigma',
  NWO                       = 'NWO',
  BladeIndustries           = 'Blade Industries',
  OmniTekIncorporated       = 'OmniTek Incorporated',
  BachmanAssociates         = 'Bachman & Associates',
  ClarkeIncorporated        = 'Clarke Incorporated',
  FulcrumSecretTechnologies = 'Fulcrum Secret Technologies',
  SlumSnakes                = 'Slum Snakes',
  Tetrads                   = 'Tetrads',
  Silhouette                = 'Silhouette',
  SpeakersForTheDead        = 'Speakers for the Dead',
  TheDarkArmy               = 'The Dark Army',
  TheSyndicate              = 'The Syndicate',
  TheCovenant               = 'The Covenant',
  Daedalus                  = 'Daedalus',
  Illuminati                = 'Illuminati',
  ChurchOfTheMachineGod     = 'Church of the Machine God'
}

export enum ENPSystems {
  NiteSec       = 'avmnite-02h',
  CyberSec      = 'CSEC',
  BitRunners    = 'I.I.I.I',
  TheBlackHand  = 'run4theh111z',
  TheCave       = 'The-Cave',
  FulcrumAssets = 'fulcrumassets'
}

export enum ENPMegaCorps {
  ECorp             = 'ECorp',
  MegaCorp          = 'MegaCorp',
  KuaiGongInt       = 'KuaiGong International',
  FourSigma         = 'Four Sigma',
  NWO               = 'NWO',
  BladeIndustries   = 'Blade Industries',
  OmniTek           = 'OmniTek Incorporated',
  BachmanAssociates = 'Bachman & Associates',
  ClarkeInc         = 'Clarke Incorporated',
  FulcrumTech       = 'Fulcrum Technologies'
}


export type TCityFaction = { cities: ENPCities[], money: number, prevents: ENPFactions[] }
export type THackingFaction = { backdoor: ENPSystems }
export type TMegaCorpFaction = { megacorp: ENPMegaCorps, reputation: number, backdoor?: ENPSystems }
export type TCrimeFaction = { combatStats: number, karma: number, money?: number, murders?: number, agent?: boolean, cities?: ENPCities[], hackingLevel?: number }
export type TEndGameFaction = { augs: number, money: number, hackingLevel?: number, combatStats?: number, both: boolean }
export type THacknetFaction = { totalLvls: number, totalRam: number, totalCores: number }
export type TSilhouetteFaction = { money: number, boss: true, karma: number }
export type TTianDiHuiFaction = { money: number, cities: ENPCities[] }

export type TFactionRequirement = TCityFaction | THackingFaction | TMegaCorpFaction | TCrimeFaction | TEndGameFaction | THacknetFaction | TSilhouetteFaction | TTianDiHuiFaction;

export const CNPCityFactions: ENPFactions[] = [ENPFactions.Sector12, ENPFactions.Aevum, ENPFactions.Ishima, ENPFactions.NewTokyo, ENPFactions.Chongqing, ENPFactions.Volhaven];
// : Record<ENPFactions, { augs: ENPAugmentations[], req: TFactionRequirement, work?: ENPFactionWorks[] }>
export const CNPFactions = {
  [ENPFactions.Aevum]:                     {
    augs: [],
    req:  {cities: [ENPCities.Aevum], money: 40e6, prevents: [ENPFactions.Chongqing, ENPFactions.NewTokyo, ENPFactions.Ishima, ENPFactions.Volhaven]},
  },
  [ENPFactions.BachmanAssociates]:         {
    augs: [],
    req:  {megacorp: ENPMegaCorps.BachmanAssociates, reputation: 200e3},
  },
  [ENPFactions.BitRunners]:                {
    augs: [],
    req:  {backdoor: ENPSystems.BitRunners},
  },
  [ENPFactions.BladeIndustries]:           {
    augs: [],
    req:  {megacorp: ENPMegaCorps.BladeIndustries, reputation: 200e3},
  },
  [ENPFactions.Chongqing]:                 {
    augs: [],
    req:  {cities: [ENPCities.Chongqing], money: 20e6, prevents: [ENPFactions.Sector12, ENPFactions.Aevum, ENPFactions.Volhaven]},
  },
  [ENPFactions.ChurchOfTheMachineGod]:     {
    augs: [],
    req:  {augs: 1e3, money: 1e12, both: true, hackingLevel: 1e6, combatStats: 1e6}
  },
  [ENPFactions.ClarkeIncorporated]:        {
    augs: [],
    req:  {megacorp: ENPMegaCorps.ClarkeInc, reputation: 200e3},
  },
  [ENPFactions.CyberSec]:                  {
    augs: [ENPAugmentations.BitWire, ENPAugmentations.Neurotrainer1, ENPAugmentations.SynapticEnhancement, ENPAugmentations.CranialSignalProcessorsG1, ENPAugmentations.CranialSignalProcessorsG2],
    work: [ENPFactionWorks.HackingContracts],
    req:  {backdoor: ENPSystems.CyberSec}
  },
  [ENPFactions.Daedalus]:                  {
    augs: [],
    req:  {augs: 30, money: 100e9, hackingLevel: 2500, combatStats: 1500, both: false},
  },
  [ENPFactions.ECorp]:                     {
    augs: [],
    req:  {megacorp: ENPMegaCorps.ECorp, reputation: 200e3},
  },
  [ENPFactions.FourSigma]:                 {
    augs: [],
    req:  {megacorp: ENPMegaCorps.FourSigma, reputation: 200e3},
  },
  [ENPFactions.FulcrumSecretTechnologies]: {
    augs: [],
    req:  {megacorp: ENPMegaCorps.FulcrumTech, reputation: 250e3, backdoor: ENPSystems.FulcrumAssets},
  },
  [ENPFactions.Illuminati]:                {
    augs: [],
    req:  {augs: 30, money: 150e9, hackingLevel: 1500, combatStats: 1200, both: true},
  },
  [ENPFactions.Ishima]:                    {
    augs: [],
    req:  {cities: [ENPCities.Ishima], money: 30e6, prevents: [ENPFactions.Sector12, ENPFactions.Aevum, ENPFactions.Volhaven]},
  },
  [ENPFactions.KuaiGongInternational]:     {
    augs: [],
    req:  {megacorp: ENPMegaCorps.KuaiGongInt, reputation: 200e3},
  },
  [ENPFactions.MegaCorp]:                  {
    augs: [],
    req:  {megacorp: ENPMegaCorps.MegaCorp, reputation: 200e3},
  },
  [ENPFactions.NWO]:                       {
    augs: [],
    req:  {megacorp: ENPMegaCorps.NWO, reputation: 200e3},
  },
  [ENPFactions.Netburners]:                {
    augs: [],
    req:  {totalLvls: 100, totalRam: 8, totalCores: 4},
  },
  [ENPFactions.NewTokyo]:                  {
    augs: [],
    req:  {cities: [ENPCities.NewTokyo], money: 20e6, prevents: [ENPFactions.Sector12, ENPFactions.Aevum, ENPFactions.Volhaven]},
  },
  [ENPFactions.NiteSec]:                   {
    augs: [ENPAugmentations.BitWire, ENPAugmentations.ArtificialSynapticPotentiation, ENPAugmentations.NeuralRetentionEnhancement, ENPAugmentations.ENM, ENPAugmentations.Neurotrainer2, ENPAugmentations.CranialSignalProcessorsG2, ENPAugmentations.CranialSignalProcessorsG3, ENPAugmentations.DataJack, ENPAugmentations.CRTX42AA],
    work: [ENPFactionWorks.HackingContracts],
    req:  {backdoor: ENPSystems.NiteSec},
  },
  [ENPFactions.OmniTekIncorporated]:       {
    augs: [],
    req:  {megacorp: ENPMegaCorps.OmniTek, reputation: 200e3},
  },
  [ENPFactions.Sector12]:                  {
    augs: [],
    req:  {cities: [ENPCities.Sector12], money: 15e6, prevents: [ENPFactions.Chongqing, ENPFactions.NewTokyo, ENPFactions.Ishima, ENPFactions.Volhaven]},
  },
  [ENPFactions.Silhouette]:                {
    augs: [],
    req:  {money: 15e6, karma: -22, boss: true},
  },
  [ENPFactions.SlumSnakes]:                {
    augs: [],
    req:  {combatStats: 30, karma: -9, money: 1e6, agent: true},
  },
  [ENPFactions.SpeakersForTheDead]:        {
    augs: [],
    req:  {combatStats: 300, karma: -45, murders: 30, hackingLevel: 100, agent: false},
  },
  [ENPFactions.Tetrads]:                   {
    augs: [],
    req:  {combatStats: 75, karma: -18, cities: [ENPCities.Chongqing, ENPCities.NewTokyo, ENPCities.Ishima], agent: true},
  },
  [ENPFactions.TheBlackHand]:              {
    augs: [ENPAugmentations.DataJack, ENPAugmentations.CranialSignalProcessorsG3, ENPAugmentations.CranialSignalProcessorsG4, ENPAugmentations.TheBlackHand, ENPAugmentations.EnhancedMyelinSheathing, ENPAugmentations.ENMCore, ENPAugmentations.Neuralstimulator, ENPAugmentations.ENM, ENPAugmentations.ArtificialSynapticPotentiation],
    req:  {backdoor: ENPSystems.TheBlackHand},
  },
  [ENPFactions.TheCovenant]:               {
    augs: [],
    req:  {augs: 20, money: 75e9, hackingLevel: 850, combatStats: 850, both: true},
  },
  [ENPFactions.TheDarkArmy]:               {
    augs: [],
    req:  {combatStats: 300, karma: -45, murders: 5, hackingLevel: 300, cities: [ENPCities.Chongqing], agent: false},
  },
  [ENPFactions.TheSyndicate]:              {
    augs: [],
    req:  {combatStats: 200, karma: -90, money: 10e6, hackingLevel: 200, cities: [ENPCities.Aevum, ENPCities.Sector12], agent: false},
  },
  [ENPFactions.TianDiHui]:                 {
    augs: [],
    req:  {cities: [ENPCities.Chongqing, ENPCities.NewTokyo, ENPCities.Ishima], money: 1e6},
  },
  [ENPFactions.Volhaven]:                  {
    augs: [],
    req:  {cities: [ENPCities.Volhaven], money: 50e6, prevents: [ENPFactions.Sector12, ENPFactions.Aevum, ENPFactions.Chongqing, ENPFactions.NewTokyo, ENPFactions.Ishima]},
  }
};
