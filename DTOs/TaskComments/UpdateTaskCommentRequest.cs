// FILE: DTOs/TaskComments/UpdateTaskCommentRequest.cs
// STATUS: NEW
// CHANGES: Created for fully exposing TaskComment entity (#21)

namespace taskflow.DTOs.TaskComments
{
    public class UpdateTaskCommentRequest
    {
        public string Body { get; set; } = string.Empty;
    }
}
