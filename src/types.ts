export interface LocalStorageBook {
  id: number;
  cover: string;
  authors: Author[];
  linkTo: string;
  subjects: string[];
  summary: string;
  title: string;
}

export interface GutenbergBook {
  id: number;
  title: string;
  authors: Author[];
  summaries: string[];
  formats: {
    ["text/html"]: string;
    ["image/jpeg"]: string;
    ["application/rdf+xml"]: string;
  };
  subjects: string[];
}

export interface Author {
  birthYear?: number;
  name: string;
  deathYear?: number;
}
