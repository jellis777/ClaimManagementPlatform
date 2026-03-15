using ClaimManagementApi.Data;
using ClaimManagementApi.DTOs;
using ClaimManagementApi.Models;

namespace ClaimManagementApi.Services
{
    public class ClaimService
    {
        private readonly AppDbContext _context;

        public ClaimService(AppDbContext context)
        {
            _context = context;
        }

        public List<Claim> GetClaims()
        {
            return _context.Claims.ToList();
        }

        public Claim? GetClaimById(int id)
        {
            return _context.Claims.Find(id);
        }


        public Claim CreateClaim(CreateClaimDto dto)
        {
            var claim = new Claim
            {
                Title = dto.Title,
                Description = dto.Description,
                Amount = dto.Amount
            };

            _context.Claims.Add(claim);
            _context.SaveChanges();

            return claim;
        }
        public bool DeleteClaim(int id)
        {
            var claim = _context.Claims.Find(id);

            if (claim == null)
            {
                return false;
            }

            _context.Claims.Remove(claim);
            _context.SaveChanges();

            return true;
        }
    }
}