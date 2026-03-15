package com.backend.app.finanza.scheduler;

import com.backend.app.finanza.service.FinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class FinanceScheduler {

    @Autowired
    private FinanceService financeService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 3600000) // Una vez por hora
    public void checkMepAndApplyMarkup() {
        try {
            ResponseEntity<List<Map<String, Object>>> response =
                    restTemplate.exchange(
                            "https://dolarapi.com/v1/dolares",
                            HttpMethod.GET,
                            null,
                            new ParameterizedTypeReference<List<Map<String, Object>>>() {}
                    );

            List<Map<String, Object>> casas = response.getBody();

            if (casas != null) {
                for (Map<String, Object> casa : casas) {
                    String nombre = casa.get("casa").toString().toLowerCase();

                    if ("mep".equals(nombre) || "bolsa".equals(nombre)) {
                        BigDecimal currentMep = new BigDecimal(casa.get("venta").toString());

                        System.out.println("🤖 Bot Financiero: Cotización real MEP detectada: $" + currentMep);
                        financeService.applyAutomaticMarkup(currentMep);
                        break;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error al consultar la API de dólares: " + e.getMessage());
        }
    }
}