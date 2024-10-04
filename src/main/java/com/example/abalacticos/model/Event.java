package com.example.abalacticos.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "availability")
@Getter
@Setter
public class Event
{
    @Id
    private String id;
    private String title;
    private Date start;
    private Date end;
    private String username;
    private String matchDate;
}
