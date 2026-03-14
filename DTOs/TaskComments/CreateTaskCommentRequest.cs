// FILE: DTOs/TaskComments/CreateTaskCommentRequest.cs
// STATUS: NEW
// CHANGES: Created for fully exposing TaskComment entity (#21)

namespace taskflow.DTOs.TaskComments
{
    public class CreateTaskCommentRequest
    {
        public string Body { get; set; } = string.Empty;
    }
}
