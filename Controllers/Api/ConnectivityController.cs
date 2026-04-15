using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using taskflow.DTOs.Connectivity;
using taskflow.Helpers;
using taskflow.Services.Interfaces;

namespace taskflow.Controllers.Api
{
    [ApiController]
    [Route("api/connectivity")]
    [Authorize]
    public class ConnectivityController : ControllerBase
    {
        private readonly IConnectivityService _connectivity;

        public ConnectivityController(IConnectivityService connectivity)
        {
            _connectivity = connectivity;
        }

        // FILE: Controllers/Api/ConnectivityController.cs  PHASE: 1  CHANGE: [AllowAnonymous] on health endpoint
        /// <summary>Returns the current connectivity state.</summary>
        [HttpGet("status")]
        [AllowAnonymous]
        public IActionResult GetStatus()
        {
            var dto = new ConnectivityStatusDto
            {
                IsOnline = _connectivity.IsOnline,
                IsManualOffline = _connectivity.IsManualOffline,
                IsEffectivelyOnline = _connectivity.IsEffectivelyOnline,
                PendingSyncCount = _connectivity.PendingSyncCount,
                LastCheckedAt = _connectivity.LastCheckedAt,
            };

            return Ok(ApiResponse<ConnectivityStatusDto>.Ok(dto));
        }

        /// <summary>Manually force or unforce offline mode.</summary>
        [HttpPost("mode")]
        public IActionResult SetMode([FromBody] SetModeRequestDto request)
        {
            _connectivity.SetManualOffline(request.ForceOffline);

            var dto = new ConnectivityStatusDto
            {
                IsOnline = _connectivity.IsOnline,
                IsManualOffline = _connectivity.IsManualOffline,
                IsEffectivelyOnline = _connectivity.IsEffectivelyOnline,
                PendingSyncCount = _connectivity.PendingSyncCount,
                LastCheckedAt = _connectivity.LastCheckedAt,
            };

            return Ok(ApiResponse<ConnectivityStatusDto>.Ok(dto));
        }
    }

    public class SetModeRequestDto
    {
        public bool ForceOffline { get; set; }
    }
}
