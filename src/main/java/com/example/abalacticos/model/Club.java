package com.example.abalacticos.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "clubs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Club {

    @Id
    private String id;
    private String clubName;
    private String iconUrl;
}
