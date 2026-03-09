package com.backend.app.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.backend.app.model.Product;
import com.backend.app.model.ProductStock;
import com.backend.app.model.dto.ProductSearchCriteria;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {
    public static Specification<Product> search(ProductSearchCriteria criteria) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (criteria.name() != null && !criteria.name().isBlank()) {
                predicates.add(
                    cb.like(
                        cb.lower(root.get("name")),
                        "%" + criteria.name().toLowerCase() + "%"
                    )
                );
            }

            if (criteria.belowMinStock() != null && criteria.belowMinStock()) {
                Join<Product, ProductStock> stock = root.join("stocks");

                predicates.add(
                    cb.lessThan(
                        stock.get("quantity"),
                        stock.get("criticalThreshold")
                    )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
