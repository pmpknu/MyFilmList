package ru.ifmo.is.mfl.common.utils.datetime;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.ZonedDateTime;
import java.util.Calendar;
import java.util.TimeZone;

@Converter(autoApply = true)
public class ZonedDateTimeConverter implements AttributeConverter<ZonedDateTime, Calendar> {
  @Override
  public Calendar convertToDatabaseColumn(ZonedDateTime entityAttribute) {
    if (entityAttribute == null) {
      return null;
    }

    Calendar calendar = Calendar.getInstance();
    calendar.setTimeInMillis(entityAttribute.toInstant().toEpochMilli());
    calendar.setTimeZone(TimeZone.getTimeZone(entityAttribute.getZone()));
    return calendar;
  }

  @Override
  public ZonedDateTime convertToEntityAttribute(Calendar databaseColumn) {
    if (databaseColumn == null) {
      return null;
    }

    return ZonedDateTime.ofInstant(databaseColumn.toInstant(),
      databaseColumn
        .getTimeZone()
        .toZoneId());
  }
}
