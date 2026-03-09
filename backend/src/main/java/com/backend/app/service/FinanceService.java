package com.backend.app.service;

import com.backend.app.model.FinanceSettings;
import com.backend.app.model.Product;
import com.backend.app.repository.FinanceSettingsRepository;
import com.backend.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class FinanceService {

    @Autowired
    private FinanceSettingsRepository settingsRepository;

    @Autowired
    private ProductRepository productRepository;

    public FinanceSettings getSettings() {
        return settingsRepository.findById(1L).orElse(new FinanceSettings());
    }

    public FinanceSettings saveSettings(FinanceSettings newSettings) {
        newSettings.setId(1L);
        return settingsRepository.save(newSettings);
    }

    @Transactional
    public void applyAutomaticMarkup(BigDecimal currentMepValue) {
        FinanceSettings settings = getSettings();

        if (!settings.isAutomaticMarkupEnabled() || settings.getLastMepValue() == null || settings.getLastMepValue().compareTo(BigDecimal.ZERO) == 0) {
            return;
        }

        // Calculamos la variación: ((Actual - Anterior) / Anterior) * 100
        // Usamos RoundingMode.HALF_UP para que el IDE no proteste
        BigDecimal variation = currentMepValue.subtract(settings.getLastMepValue())
                .divide(settings.getLastMepValue(), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        if (variation.compareTo(settings.getThresholdPercentage()) >= 0) {
            List<Product> products = productRepository.findAll();
            BigDecimal multiplier = variation.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP).add(BigDecimal.ONE);

            for (Product p : products) {
                if (p.getCurrentSalePrice() != null) {
                    BigDecimal newPrice = p.getCurrentSalePrice().multiply(multiplier);
                    p.setCurrentSalePrice(newPrice);
                }
            }
            productRepository.saveAll(products);

            settings.setLastMepValue(currentMepValue);
            settingsRepository.save(settings);
        }
    }
}