package com.backend.app.producto.specificacion;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import com.backend.app.producto.model.Product;
import com.backend.app.producto.model.ProductStock;
import com.backend.app.producto.model.dto.ProductSearchCriteria;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {
    public static Specification<Product> search(ProductSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Filtro por Nombre (siempre activo)
            if (criteria.name() != null && !criteria.name().isBlank()) {
                predicates.add(
                        cb.like(cb.lower(root.get("name")), "%" + criteria.name().toLowerCase() + "%")
                );
            }

            // 🚀 Lógica de Sucursal y Stock Mínimo
            // Usamos LEFT JOIN para no ocultar productos que no tienen registro de stock aún.
            if (criteria.branchId() != null || (criteria.belowMinStock() != null && criteria.belowMinStock())) {
                Join<Product, ProductStock> stocks = root.join("stocks", JoinType.LEFT);

                // Evitamos duplicados en el resultado
                query.distinct(true);

                // Si hay sucursal, filtramos por ella
                if (criteria.branchId() != null) {
                    predicates.add(cb.equal(stocks.get("branch").get("id"), criteria.branchId()));
                }

                // Si pide "Bajo Stock", comparamos cantidad vs umbral
                if (criteria.belowMinStock() != null && criteria.belowMinStock()) {
                    predicates.add(cb.lessThan(stocks.get("quantity"), stocks.get("criticalThreshold")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}