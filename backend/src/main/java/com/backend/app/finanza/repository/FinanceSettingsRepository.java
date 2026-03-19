package com.backend.app.finanza.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.app.finanza.model.FinanceSettings;

public interface FinanceSettingsRepository extends JpaRepository<FinanceSettings, Long> {
}