// Match.java
package com.example.abalacticos.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Document(collection = "matches")
@Getter
@Setter
public class Match {
    @Id
    private String id;
    private LocalDate datePlayed;
    private List<Map<String,String>> teamA;
    private List<Map<String,String>> teamB;
    private String day;
    private String result;
    private boolean confirmed;
}
