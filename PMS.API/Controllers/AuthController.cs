using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PMS.Application.DTOs.Auth;
using PMS.Domain.Entities;
using PMS.Infrastructure.Persistence;
using PMS.Infrastructure.Services;

namespace PMS.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        AppDbContext db,
        TokenService tokenService,
        ILogger<AuthController> logger)
    {
        _db = db;
        _tokenService = tokenService;
        _logger = logger;
    }

    // -------------------- LOGIN --------------------
    [AllowAnonymous]
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequestDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Login attempt for Email {Email}",
            dto.Email);

        var user = await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Email == dto.Email && x.IsActive,
                cancellationToken);

        if (user == null ||
            !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            _logger.LogWarning(
                "Failed login attempt for Email {Email}",
                dto.Email);

            return Unauthorized("Invalid credentials");
        }

        var token = _tokenService.GenerateToken(user);

        _logger.LogInformation(
            "User {UserId} logged in successfully",
            user.Id);

        return Ok(new AuthResponseDto(token,user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName));
                    }

    // -------------------- SIGNUP / REGISTER --------------------
    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequestDto dto,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Registration attempt for Email {Email}",
            dto.Email);

        var emailExists = await _db.Users
            .AnyAsync(u => u.Email == dto.Email, cancellationToken);

        if (emailExists)
        {
            _logger.LogWarning(
                "Registration failed. Email already exists: {Email}",
                dto.Email);

            return BadRequest("Email already registered");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName=dto.FirstName,
            LastName=dto.LastName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        var token = _tokenService.GenerateToken(user);

        _logger.LogInformation(
            "User {UserId} registered successfully",
            user.Id);

        return CreatedAtAction(
            nameof(Register),
            new AuthResponseDto(token, user.Id,
                user.Email,
                user.FirstName,
                user.LastName));
                }
}