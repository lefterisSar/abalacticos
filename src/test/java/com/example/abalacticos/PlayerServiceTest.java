//package com.example.abalacticos;
//
//import com.example.abalacticos.model.Player;
//import com.example.abalacticos.service.PlayerService;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.core.query.Query;
//import org.springframework.data.mongodb.core.query.Update;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.verify;
//import static org.mockito.Mockito.times;
//
//@ExtendWith(MockitoExtension.class)
//public class PlayerServiceTest {
//
//    @Mock
//    private MongoTemplate mongoTemplate;
//
//    @InjectMocks
//    private PlayerService playerService;
//
//    @Test
//    public void testUpdatePlayerAge() {
//        String playerId = "12345";
//        int newAge = 25;
//
////        playerService.updatePlayerAge(playerId, newAge);
//
//        Query expectedQuery = new Query(Criteria.where("id").is(playerId));
//        Update expectedUpdate = new Update().set("age", newAge);
//
//        verify(mongoTemplate, times(1)).updateFirst(expectedQuery, expectedUpdate, Player.class);
//    }
//}
