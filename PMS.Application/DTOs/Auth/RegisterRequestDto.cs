namespace PMS.Application.DTOs.Auth;

public record RegisterRequestDto(
    string FirstName,
    string LastName,
    string Email,
    string Password
);