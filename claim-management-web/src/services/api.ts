export async function getClaims() {
  const response = await fetch('http://localhost:5266/api/claims');
  return response.json();
}
