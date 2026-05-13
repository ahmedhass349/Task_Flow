// FILE: Validators/UpdateTaskRequestValidator.cs
// PHASE: Phase 5
// CHANGES: S-05 — added MaximumLength(4000) on Description to bound optional free-text input.
using FluentValidation;
using taskflow.DTOs.Tasks;
using taskflow.Data.Entities;

namespace taskflow.Validators
{
    public class UpdateTaskRequestValidator : AbstractValidator<UpdateTaskRequest>
    {
        public UpdateTaskRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(4000).WithMessage("Description must not exceed 4000 characters.")
                .When(x => x.Description != null);

            RuleFor(x => x.Priority)
                .IsInEnum().WithMessage("Priority must be one of: Low, Medium, High.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Status must be one of: Todo, InProgress, Review, Completed, Overdue.");
        }
    }
}
