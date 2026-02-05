namespace PMS.Application.DTOs.Auth;

public record AuthResponseDto(
    string Token,
    Guid UserId,
    string Email,
    string FirstName,
    string LastName
);
