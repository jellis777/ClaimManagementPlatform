using ClaimManagementApi.DTOs;
using ClaimManagementApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ClaimManagementApi.Controllers
{
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
            return Ok(_service.GetClaims());
        }

        [HttpPost]
        public IActionResult CreateClaim(CreateClaimDto dto)
        {
            var claim = _service.CreateClaim(dto);
            return Ok(claim);
        }

    }
}