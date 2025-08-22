// com.example.auth.user.ProviderConverter.java
package com.example.auth.user;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProviderConverter implements AttributeConverter<Provider, Integer> {
    @Override public Integer convertToDatabaseColumn(Provider attribute) {
        return attribute == null ? null : attribute.getCode();
    }
    @Override public Provider convertToEntityAttribute(Integer dbData) {
        return dbData == null ? null : Provider.fromCode(dbData);
    }
}
