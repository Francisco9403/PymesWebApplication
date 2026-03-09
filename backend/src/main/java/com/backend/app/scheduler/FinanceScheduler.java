package com.backend.app.scheduler;

import com.backend.app.service.FinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class FinanceScheduler {

    @Autowired
    private FinanceService financeService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 3600000) // Una vez por hora
    public void checkMepAndApplyMarkup() {
        try {
            // 1. Consultamos el MEP real de la API
            Map<String, Object>[] response = restTemplate.getForObject("https://dolarapi.com/v1/dolares", Map[].class);

            if (response != null) {
                for (Map<String, Object> casa : response) {
                    if ("mep".equals(casa.get("casa").toString().toLowerCase()) || "bolsa".equals(casa.get("casa").toString().toLowerCase())) {
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