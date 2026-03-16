using ClaimManagementApi.Data;
using ClaimManagementApi.DTOs;
using ClaimManagementApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ClaimManagementApi.Services
{
    public class ClaimService
    {
        private readonly AppDbContext _context;

        public ClaimService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Claim>> GetClaimsAsync()
        {
            return await _context.Claims.ToListAsync();
        }

        public async Task<Claim?> GetClaimByIdAsync(int id)
        {
            return await _context.Claims.FindAsync(id);
        }


        public async Task<Claim> CreateClaimAsync(CreateClaimDto dto)
        {
            var claim = new Claim
            {
                Title = dto.Title,
                Description = dto.Description,
                Amount = dto.Amount
            };

            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();

            return claim;
        }
        public async Task<bool> DeleteClaimAsync(int id)
        {
            var claim = await _context.Claims.FindAsync(id);

            if (claim == null)
            {
                return false;
            }

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Claim?> UpdateClaimAsync(int id, UpdateClaimDto dto)
        {
            var claim = await _context.Claims.FindAsync(id);

            if (claim == null)
            {
                return null;
            }

            claim.Title = dto.Title;
            claim.Description = dto.Description;
            claim.Amount = dto.Amount;
            claim.Status = dto.Status;

            await _context.SaveChangesAsync();

            return claim;
        }
    }
}