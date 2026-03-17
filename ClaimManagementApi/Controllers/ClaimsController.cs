using ClaimManagementApi.DTOs;
using ClaimManagementApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClaimManagementApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClaimsController : ControllerBase
    {
        private readonly ClaimService _service;

        public ClaimsController(ClaimService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetClaims()
        {
            var claims = await _service.GetClaimsAsync();
            return Ok(claims);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetClaimById(int id)
        {
            var claim = await _service.GetClaimByIdAsync(id);

            if (claim == null)
            {
                return NotFound();
            }

            return Ok(claim);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Adjuster")]
        public async Task<IActionResult> CreateClaim(CreateClaimDto dto)
        {
            var claim = await _service.CreateClaimAsync(dto);
            return CreatedAtAction(
                nameof(GetClaimById),
                new { id = claim.Id },
                claim
            );
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Adjuster")]
        public async Task<IActionResult> UpdateClaim(int id, UpdateClaimDto dto)
        {
            var updatedClaim = await _service.UpdateClaimAsync(id, dto);

            if (updatedClaim == null)
            {
                return NotFound();
            }

            return Ok(updatedClaim);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClaim(int id)
        {
            var deleted = await _service.DeleteClaimAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

    }
}