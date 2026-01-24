// Taxonomy API Services for ESCO and VSIC

const ESCO_API_BASE = "https://ec.europa.eu/esco/api";
const VSIC_API_BASE = "/api/industries"; // Self-hosted endpoint

// ESCO Occupation Search
export interface ESCOOccupation {
  uri: string;
  code: string;
  preferredLabel: {
    en: string;
  };
  altLabels?: {
    en: string[];
  };
  iscoGroup?: string;
  description?: {
    en: {
      literal: string;
    };
  };
}

export interface ESCOSearchResponse {
  _embedded?: {
    results?: ESCOOccupation[];
  };
  _links?: any;
}

let escoAbortController: AbortController | null = null;

export async function searchESCOOccupations(query: string): Promise<ESCOOccupation[]> {
  if (!query || query.length < 2) return [];

  // Cancel previous request
  if (escoAbortController) {
    escoAbortController.abort();
  }

  escoAbortController = new AbortController();

  try {
    const params = new URLSearchParams({
      text: query,
      language: "en",
      type: "occupation",
      limit: "10",
    });

    const response = await fetch(
      `${ESCO_API_BASE}/search?${params.toString()}`,
      {
        signal: escoAbortController.signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ESCO API error: ${response.status}`);
    }

    const data: ESCOSearchResponse = await response.json();
    return data._embedded?.results || [];
  } catch (error: any) {
    if (error.name === "AbortError") {
      return [];
    }
    console.error("ESCO API error:", error);
    throw error;
  }
}

// VSIC Industry Search
export interface VSICIndustry {
  code: string;
  label: string;
  version: string;
  level?: number;
  parentCode?: string;
  description?: string;
}

export interface VSICSearchResponse {
  results: VSICIndustry[];
  total: number;
}

let vsicAbortController: AbortController | null = null;

export async function searchVSICIndustries(
  query: string,
  version: string = "2018"
): Promise<VSICIndustry[]> {
  if (!query || query.length < 2) return [];

  // Cancel previous request
  if (vsicAbortController) {
    vsicAbortController.abort();
  }

  vsicAbortController = new AbortController();

  try {
    const params = new URLSearchParams({
      q: query,
      version: version,
      limit: "15",
    });

    const response = await fetch(
      `${VSIC_API_BASE}/search?${params.toString()}`,
      {
        signal: vsicAbortController.signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`VSIC API error: ${response.status}`);
    }

    const data: VSICSearchResponse = await response.json();
    return data.results || [];
  } catch (error: any) {
    if (error.name === "AbortError") {
      return [];
    }
    console.error("VSIC API error:", error);
    throw error;
  }
}

export async function getVSICChildren(
  code: string,
  version: string = "2018"
): Promise<VSICIndustry[]> {
  try {
    const params = new URLSearchParams({
      code: code,
      version: version,
    });

    const response = await fetch(
      `${VSIC_API_BASE}/children?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`VSIC API error: ${response.status}`);
    }

    const data: VSICSearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("VSIC API error:", error);
    return [];
  }
}

// Mock fallback data for development/testing
export const MOCK_ESCO_OCCUPATIONS: ESCOOccupation[] = [
  {
    uri: "http://data.europa.eu/esco/occupation/1",
    code: "2512.1",
    preferredLabel: { en: "Software Developer" },
    iscoGroup: "2512",
  },
  {
    uri: "http://data.europa.eu/esco/occupation/2",
    code: "2513.1",
    preferredLabel: { en: "Web Developer" },
    iscoGroup: "2513",
  },
  {
    uri: "http://data.europa.eu/esco/occupation/3",
    code: "2514.1",
    preferredLabel: { en: "Mobile Application Developer" },
    iscoGroup: "2514",
  },
  {
    uri: "http://data.europa.eu/esco/occupation/4",
    code: "2511.1",
    preferredLabel: { en: "Data Engineer" },
    iscoGroup: "2511",
  },
  {
    uri: "http://data.europa.eu/esco/occupation/5",
    code: "2512.2",
    preferredLabel: { en: "Backend Developer" },
    iscoGroup: "2512",
  },
];

export const MOCK_VSIC_INDUSTRIES: VSICIndustry[] = [
  {
    code: "62",
    label: "Computer programming, consultancy and related activities",
    version: "2018",
    level: 2,
  },
  {
    code: "62.01",
    label: "Computer programming activities",
    version: "2018",
    level: 3,
    parentCode: "62",
  },
  {
    code: "62.02",
    label: "Computer consultancy activities",
    version: "2018",
    level: 3,
    parentCode: "62",
  },
  {
    code: "63",
    label: "Information service activities",
    version: "2018",
    level: 2,
  },
  {
    code: "64",
    label: "Financial service activities",
    version: "2018",
    level: 2,
  },
  {
    code: "72",
    label: "Scientific research and development",
    version: "2018",
    level: 2,
  },
];
