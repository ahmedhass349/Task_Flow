using System;

namespace taskflow.DTOs.Connectivity
{
    public class ConnectivityStatusDto
    {
        public bool IsOnline { get; set; }
        public bool IsManualOffline { get; set; }
        public bool IsEffectivelyOnline { get; set; }
        public int PendingSyncCount { get; set; }
        public DateTime LastCheckedAt { get; set; }
    }
}
