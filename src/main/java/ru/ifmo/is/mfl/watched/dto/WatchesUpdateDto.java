package ru.ifmo.is.mfl.watched.dto;

import java.sql.Timestamp;

import org.openapitools.jackson.nullable.JsonNullable;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WatchesUpdateDto{
    @NotNull
    private JsonNullable<Integer> userId;
    @NotNull
    private JsonNullable<Integer> movieId;
    private JsonNullable<Timestamp> watchDate;
}
