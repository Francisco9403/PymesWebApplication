package com.backend.app.proveedor.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.backend.app.archivosParaRevisar.CommunicationChannel;

@Service
public class AIService {

    // 🚀 Definición del Logger para monitorear la comunicación con Gemini
    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestClient restClient;

    public AIService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent")
                .build();
    }

    public String generateDescription(String productName, CommunicationChannel channel) {
        log.info("Solicitando generación de descripción IA para: '{}' (Canal: {})", productName, channel);

        // 1. Switch expression con default para cubrir todos los casos posibles
        String prompt = switch (channel) {
            case INSTAGRAM -> "Escribe un caption para Instagram atractivo y con emojis para: " + productName + ". Enfocado en ventas.";
            case WHATSAPP -> "Escribe un mensaje breve y directo para vender el producto " + productName + " por chat.";
            case WEB -> "Escribe una descripción técnica y profesional para ecommerce de: " + productName + ".";
            default -> "Escribe una descripción comercial para el producto: " + productName;
        };

        log.debug("Prompt construido: {}", prompt);

        try {
            // Usamos Map.of para construir el JSON de forma segura
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt)
                            ))
                    )
            );

            log.debug("Enviando petición POST a Gemini API...");

            // 2. Tipamos el Map de respuesta para evitar el warning de 'raw type'
            Map<String, Object> response = restClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});

            if (response == null || !response.containsKey("candidates")) {
                log.warn("La respuesta de Gemini para '{}' vino vacía o sin candidatos.", productName);
                return "Error en la respuesta de la IA";
            }

            // 3. Casteo seguro y tipado de la estructura de Gemini
            List<?> candidates = (List<?>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                log.warn("No se encontraron candidatos de contenido para el producto: {}", productName);
                return "Sin candidatos";
            }

            Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
            Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
            List<?> parts = (List<?>) content.get("parts");
            Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);

            String result = (String) firstPart.get("text");

            log.info("Descripción generada con éxito para '{}'. Longitud: {} caracteres.", productName, result.length());
            return result;

        } catch (Exception e) {
            log.error("Error crítico al conectar con Gemini para el producto '{}'. Mensaje: {}", productName, e.getMessage());
            return "Descripción automática no disponible para " + productName;
        }
    }
}