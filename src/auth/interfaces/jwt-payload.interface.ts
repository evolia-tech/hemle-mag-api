export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string; // UserRole
  firstName: string; // <<< NOUVEAU
  lastName: string;  // <<< NOUVEAU
}