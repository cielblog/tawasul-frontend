export type DecodedToken = {
  iss: string;
  iat: number;
  exp: number;
  aud: string;
  sub: string;
};
