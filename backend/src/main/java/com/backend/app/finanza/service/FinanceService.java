package com.backend.app.finanza.service;

import com.backend.app.exception.BusinessException;
import com.backend.app.finanza.model.FinanceSettings;
import com.backend.app.producto.model.Product;
import com.backend.app.finanza.repository.FinanceSettingsRepository;
import com.backend.app.producto.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; // 🚀 Importaciones de SLF4J
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class FinanceService {

    // 🚀 Logger para auditar cambios de precios y variaciones de moneda
    private static final Logger log = LoggerFactory.getLogger(FinanceService.class);

    @Autowired
    private FinanceSettingsRepository settingsRepository;

    @Autowired
    private ProductRepository productRepository;

    public FinanceSettings getSettings() {
        log.debug("Recuperando configuraciones financieras generales.");
        return settingsRepository.findById(1L).orElse(new FinanceSettings());
    }

    public FinanceSettings saveSettings(FinanceSettings newSettings) {
        log.info("Actualizando configuraciones financieras (Markup automático: {}, Umbral: {}%)",
                newSettings.isAutomaticMarkupEnabled(), newSettings.getThresholdPercentage());
        newSettings.setId(1L);
        return settingsRepository.save(newSettings);
    }

    @Transactional
    public void applyAutomaticMarkup(BigDecimal currentMepValue) {
        log.info("🚀 Iniciando proceso de verificación de Markup Automático. Valor MEP recibido: ${}", currentMepValue);

        FinanceSettings settings = getSettings();

        if (settings.getLastMepValue() == null || settings.getLastMepValue().compareTo(BigDecimal.ZERO) <= 0) {
            log.error(" Abortando: El valor anterior del dólar MEP en la base de datos es inválido o nulo.");
            throw new BusinessException("No se puede calcular el aumento: El valor anterior del dólar MEP es inválido.");
        }

        if (!settings.isAutomaticMarkupEnabled()) {
            log.info("El marcado automático está desactivado. No se realizarán cambios.");
            return;
        }

        // Calculamos la variación: ((Actual - Anterior) / Anterior) * 100
        BigDecimal variation = currentMepValue.subtract(settings.getLastMepValue())
                .divide(settings.getLastMepValue(), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        log.info("Análisis de mercado: MEP Anterior: ${} | MEP Actual: ${} | Variación: {}%",
                settings.getLastMepValue(), currentMepValue, variation);

        if (variation.compareTo(settings.getThresholdPercentage()) >= 0) {
            log.info(" Umbral del {}% superado. Procediendo a actualizar precios de productos...", settings.getThresholdPercentage());

            List<Product> products = productRepository.findAll();

            if (products.isEmpty()) {
                log.warn("No se encontraron productos para actualizar en el sistema de Junín.");
                throw new BusinessException("No hay productos cargados en Junín para actualizar precios.");
            }

            BigDecimal multiplier = variation.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP).add(BigDecimal.ONE);
            log.info("Aplicando multiplicador de x{} sobre {} productos.", multiplier, products.size());

            int updatedCount = 0;
            for (Product p : products) {
                if (p.getCurrentSalePrice() != null) {
                    BigDecimal oldPrice = p.getCurrentSalePrice();
                    BigDecimal newPrice = oldPrice.multiply(multiplier);
                    p.setCurrentSalePrice(newPrice);
                    updatedCount++;
                    log.debug("Actualizando '{}': ${} -> ${}", p.getName(), oldPrice, newPrice);
                }
            }

            productRepository.saveAll(products);

            // Actualizamos el último valor procesado para la próxima comparación
            settings.setLastMepValue(currentMepValue);
            settingsRepository.save(settings);

            log.info(" Proceso completado. Se actualizaron los precios de {} productos.", updatedCount);
        } else {
            log.info("La variación ({}%) no alcanza el umbral configurado ({}%). No se requieren ajustes.",
                    variation, settings.getThresholdPercentage());
        }
    }
}