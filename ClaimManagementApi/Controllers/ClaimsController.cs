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

        [HttpPost]
        public IActionResult CreateClaim(CreateClaimDto dto)
        {
            var claim = _service.CreateClaim(dto);
            return Ok(claim);
        }

    }
}