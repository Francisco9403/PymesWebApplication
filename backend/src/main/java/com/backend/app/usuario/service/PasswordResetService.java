package com.backend.app.usuario.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.app.usuario.model.PasswordResetToken;
import com.backend.app.usuario.model.User;
import com.backend.app.usuario.repository.PasswordResetTokenRepository;
import com.backend.app.usuario.repository.UserRepository;

import jakarta.mail.internet.MimeMessage;

@Service
@Transactional
public class PasswordResetService {
    private final PasswordResetTokenRepository repository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${frontend.url}")
    private String resetPasswordUrl;

    public PasswordResetService(PasswordResetTokenRepository repository, UserRepository userRepository,
            PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    public void cleanExpiredTokens() {
        repository.deleteExpiredTokens(LocalDateTime.now());
    }

    public void sendResetEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) return;

        User user = optionalUser.get();
        repository.deleteByUser(user);

        String token = UUID.randomUUID().toString();

        PasswordResetToken entity = new PasswordResetToken();
        entity.setToken(token);
        entity.setUser(user);
        entity.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        entity.setUsed(false);

        repository.save(entity);

        sendEmail(email, token);
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = validateToken(token);

        User user = prt.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        prt.setUsed(true);
        repository.save(prt);
    }

    private void sendEmail(String email, String token) {
        String resetLink = resetPasswordUrl + "/reset-password?token=" + token;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Restablecer contraseña");
            helper.setText(
                "<p>Hacé click en el siguiente enlace para restablecer tu contraseña:</p>" +
                "<a href=\"" + resetLink + "\">" + resetLink + "</a>" +
                "<p>Este enlace expira en 15 minutos.</p>", true
            );
            helper.setFrom("no-reply@pymes.com");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar mail de restablecimiento", e);
        }
    }

    private PasswordResetToken validateToken(String token) {
        PasswordResetToken prt = repository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (prt.isUsed()) {
            throw new RuntimeException("Token ya utilizado");
        }

        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        return prt;
    }
}
