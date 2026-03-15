using ClaimManagementApi.DTOs;
using ClaimManagementApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClaimManagementApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClaimsController : ControllerBase
    {
        private readonly ClaimService _service;

        public ClaimsController(ClaimService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetClaims()
        {
            var claims = _service.GetClaims();
            return Ok(claims);
        }

        [HttpGet("{id}")]
        public IActionResult GetClaimById(int id)
        {
            var claim = _service.GetClaimById(id);

            if (claim == null)
            {
                return NotFound();
            }

            return Ok(claim);
        }

        [HttpPost]
        public IActionResult CreateClaim(CreateClaimDto dto)
        {
            var claim = _service.CreateClaim(dto);
            return Ok(claim);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteClaim(int id)
        {
            var deleted = _service.DeleteClaim(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateClaim(int id, UpdateClaimDto dto)
        {
            var updatedClaim = _service.UpdateClaim(id, dto);

            if (updatedClaim == null)
            {
                return NotFound();
            }

            return Ok(updatedClaim);
        }


    }
}