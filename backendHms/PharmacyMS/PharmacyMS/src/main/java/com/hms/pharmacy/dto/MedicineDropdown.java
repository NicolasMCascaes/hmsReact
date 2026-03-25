package com.hms.pharmacy.dto;

import java.math.BigDecimal;

public interface MedicineDropdown {
    Long getId();

    String getName();

    String getManufacturer();

    BigDecimal getPrice();
}