package com.backend.app.repository;

import com.backend.app.model.FinanceSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinanceSettingsRepository extends JpaRepository<FinanceSettings, Long> {
}