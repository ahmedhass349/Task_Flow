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

            RuleFor(x => x.Priority)
                .IsInEnum().WithMessage("Priority must be one of: Low, Medium, High.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Status must be one of: Todo, InProgress, Review, Completed.");
        }
    }
}
