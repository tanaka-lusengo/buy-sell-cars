export interface CountryConfig {
  name: string;
  locations: string[];
  dealerLogos: string[];
  supabaseProjectId: string;
  enablePosthog?: boolean;
}

export const SOUTH_AFRICA_CONFIG: CountryConfig = {
  name: "South Africa",
  locations: [
    "Eastern Cape",
    "Western Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "North West Province",
    "Northern Cape",
  ],
  dealerLogos: ["none"],
  supabaseProjectId: "zimjojrladsbpeowrzgx",
  enablePosthog: false,
};

export const ZIMBABWE_CONFIG: CountryConfig = {
  name: "Zimbabwe",
  locations: [
    "Bulawayo",
    "Gweru",
    "Marondera",
    "Masvingo",
    "Mutare",
    "Msasa",
    "Ruwa",
    "Harare",
  ],
  dealerLogos: [
    "Welly Motors",
    "August Auto Zimbabwe",
    "Willy's Auto Group",
    "JP Motors",
    "Kenmac motors",
  ],
  supabaseProjectId: "kncplsarhhhuhfftpuod",
  enablePosthog: true,
};
