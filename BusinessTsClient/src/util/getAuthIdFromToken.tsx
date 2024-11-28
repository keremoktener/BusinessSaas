import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  authId: number;
  iat: number;
  exp: number;
}

/**
 * Given a JWT token, returns the authId in the token payload.
 * Returns 0 if the token is invalid.
 * @param token - The JWT token
 * @returns The authId or 0
 */
function getAuthIdFromToken(token: string): number | 0 {
  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    return decoded.authId;
  } catch (error) {
    console.error("Invalid token", error);
    return 0;
  }
}
export default getAuthIdFromToken